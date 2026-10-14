#!/usr/bin/env python3
"""Build a deterministic, PUBLIC-only search catalog from curated Markdown."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SECTIONS = {"docs": "standard", "projects": "project", "prompts": "prompt"}
ROOT_FILES = {"README.md": "guide", "BRAND.md": "guide", "AGENTS.md": "guide"}
MAX_SEARCH_CHARS = 16000
SECRET_PATTERN = re.compile(
    r"-----BEGIN [A-Z ]*PRIVATE KEY-----|"
    r"\b(?:ghp_|gho_|github_pat_|sk-proj-)[A-Za-z0-9_-]{20,}\b|"
    r"\bAKIA[0-9A-Z]{16}\b"
)


def title_from(path: Path, body: str) -> str:
    for line in body.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return path.stem.replace("-", " ").replace("_", " ").strip()


def summary_from(body: str, title: str) -> str:
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith(("#", "-", "* ", ">", "|", "~~~", "\x60", "<", "![", "===")):
            continue
        return line[:240]
    return title


def sources(root: Path):
    for name, section in ROOT_FILES.items():
        path = root / name
        if path.is_file() and not path.is_symlink():
            yield path, section
    for directory, section in SECTIONS.items():
        folder = root / directory
        if not folder.is_dir() or folder.is_symlink():
            continue
        for path in folder.rglob("*.md"):
            relative = path.relative_to(root)
            if path.is_file() and not any(
                root.joinpath(*relative.parts[:i]).is_symlink()
                for i in range(1, len(relative.parts) + 1)
            ):
                yield path, section


def build_catalog(root: Path) -> dict:
    items = []
    for path, section in sources(root):
        body = path.read_text(encoding="utf-8")
        if SECRET_PATTERN.search(body):
            raise ValueError(f"Possible credential in {path.relative_to(root)}; refusing public index.")
        relative = path.relative_to(root).as_posix()
        title = title_from(path, body)
        items.append({
            "path": relative,
            "title": title,
            "section": section,
            "summary": summary_from(body, title),
            "search_text": " ".join(body.split())[:MAX_SEARCH_CHARS],
        })
    items.sort(key=lambda item: item["path"].casefold())
    return {"version": 1, "repository": "takatakca/knowledgeAI", "items": items}


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--output", type=Path, default=Path("knowledge-catalog.json"))
    parser.add_argument("--check", action="store_true", help="Fail if the committed catalog is missing or stale")
    args = parser.parse_args(argv)
    root = args.root.resolve()
    output = args.output if args.output.is_absolute() else root / args.output
    try:
        result = build_catalog(root)
        if args.check:
            if not output.exists() or json.loads(output.read_text(encoding="utf-8")) != result:
                print("Catalog is missing/stale. Run: python3 ingest/build_catalog.py", file=sys.stderr)
                return 1
            print(f"Catalog OK: {len(result['items'])} public curated Markdown files")
            return 0
        output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Indexed {len(result['items'])} public Markdown files into {output}")
        return 0
    except (OSError, UnicodeError, ValueError, json.JSONDecodeError) as exc:
        print(f"Catalog error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
