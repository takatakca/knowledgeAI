"""Tests for deterministic, public-only Knowledge AI catalog generation."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from build_catalog import MAX_SEARCH_CHARS, build_catalog, main


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        for name in ("docs", "projects", "prompts"):
            (self.root / name).mkdir()
        (self.root / "docs" / "test.md").write_text(
            "# Infrastructure standard\n\nThis explains the deployment workflow.\n\n## Details\nCI and Coolify.\n", encoding="utf-8")
        (self.root / "projects" / "alpha.md").write_text(
            "# Alpha product\n\nAn independent customer product.\n", encoding="utf-8")
        (self.root / "prompts" / "agent.md").write_text(
            "# Agent prompt\n\nReusable agent instructions.\n", encoding="utf-8")
        (self.root / "README.md").write_text("# Root guide\n\nPublic introduction.\n", encoding="utf-8")
        (self.root / ".env").write_text("SECRET_KEY=do-not-index\n", encoding="utf-8")
        (self.root / "projects" / "ignore.txt").write_text("not indexed", encoding="utf-8")

    def tearDown(self):
        self.temp.cleanup()

    def test_public_allowlist_and_deterministic_order(self):
        result = build_catalog(self.root)
        self.assertEqual(result["version"], 1)
        self.assertEqual([item["path"] for item in result["items"]],
                         ["README.md", "docs/test.md", "projects/alpha.md", "prompts/agent.md"])
        self.assertEqual(result, build_catalog(self.root))
        self.assertFalse(any(".env" in item["path"] for item in result["items"]))
        self.assertEqual(result["items"][2]["section"], "project")
        self.assertIn("independent", result["items"][2]["summary"])

    def test_symlink_cannot_import_private_source(self):
        with tempfile.TemporaryDirectory() as outside:
            private = Path(outside) / "secret.md"
            private.write_text("# Do not ingest\n\nSensitive material\n", encoding="utf-8")
            (self.root / "projects" / "leaked.md").symlink_to(private)
            self.assertNotIn("projects/leaked.md", [i["path"] for i in build_catalog(self.root)["items"]])

    def test_credential_protection(self):
        (self.root / "docs" / "bad.md").write_text(
            "# Secret\n\n-----BEGIN PRIVATE KEY-----\n", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Possible credential"):
            build_catalog(self.root)

    def test_truncates_search_content(self):
        (self.root / "projects" / "alpha.md").write_text("# Alpha\n\n" + ("longterm " * 3000), encoding="utf-8")
        record = next(i for i in build_catalog(self.root)["items"] if i["path"] == "projects/alpha.md")
        self.assertLessEqual(len(record["search_text"]), MAX_SEARCH_CHARS)

    def test_write_and_check_detects_drift(self):
        destination = self.root / "knowledge-catalog.json"
        self.assertEqual(main(["--root", str(self.root)]), 0)
        self.assertEqual(main(["--root", str(self.root), "--check"]), 0)
        result = json.loads(destination.read_text(encoding="utf-8"))
        self.assertEqual(len(result["items"]), 4)
        (self.root / "docs" / "test.md").write_text("# Changed\n", encoding="utf-8")
        self.assertEqual(main(["--root", str(self.root), "--check"]), 1)


if __name__ == "__main__":
    unittest.main()
