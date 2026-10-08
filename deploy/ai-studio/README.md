# TAKATAK AI Studio (knowledge.takatak.ca)

One VPS, two websites, all the AI brands on **API keys**:

| Address | For | What it does |
|---|---|---|
| `https://knowledge.takatak.ca` | team and clients | Claude, ChatGPT, Gemini, Grok, DeepSeek in one chat app ([LibreChat](https://www.librechat.ai)). Each person has their own login, history and **credit balance**. Two models side by side. No public sign-up. |
| `https://lab.takatak.ca` | admins | [Open WebUI](https://openwebui.com): pick several models in one chat and send **one prompt to all of them**. |

## Install tonight (about 20 minutes)

1. **Get a server:** Ubuntu 24.04, at least 4 CPU, 8 GB RAM and 80 GB of disk. Use a **fresh** server, not the one running Coolify, because this kit needs ports 80 and 443.
   - **Oracle Cloud (free):** follow [the Oracle steps](#oracle-cloud-free-server) below.
   - **Paid option:** any VPS, for example a Contabo Cloud VPS.
2. **Get API keys.** At least one is required; skip any brand you don't use. Put a monthly spending limit on each account.
   - Claude: https://console.anthropic.com/settings/keys
   - ChatGPT: https://platform.openai.com/api-keys
   - Gemini: https://aistudio.google.com/apikey
   - Grok: https://console.x.ai
   - DeepSeek: https://platform.deepseek.com/api_keys
3. **On the VPS**, as root, run the commands below. The installer asks for the two addresses, the admin email and the keys. Keys are typed hidden and stay only in `/opt/knowledgeAI/deploy/ai-studio/.env` on that server.
   ```bash
   apt-get update && apt-get install -y git
   git clone https://github.com/takatakca/knowledgeAI.git /opt/knowledgeAI
   bash /opt/knowledgeAI/deploy/ai-studio/install.sh
   ```
4. **DNS** (where takatak.ca is managed): add two **A** records, `knowledge` and `lab`, pointing to the VPS IP. The installer prints the IP. HTTPS turns on by itself a few minutes after DNS points there.
5. **First login:** `cat /opt/knowledgeAI/deploy/ai-studio/.admin-first-login`. Save it in your password manager, then delete the file.

## Oracle Cloud free server

Oracle's Always Free tier includes an ARM server with **4 CPU and 24 GB of RAM** at no cost. Every part of this kit has an ARM build, checked on 2026-10-08.

1. Sign up at https://cloud.oracle.com. A card is asked for identity but not charged. Pick the home region closest to you; it can't be changed later.
2. Go to **Compute → Instances → Create instance**.
   - **Image:** Canonical Ubuntu 24.04.
   - **Shape:** Ampere `VM.Standard.A1.Flex`, 4 OCPU, 24 GB memory.
   - **Networking:** create a new virtual cloud network with a public subnet, and keep "Assign a public IPv4 address" on.
   - **SSH keys:** click "Save private key" and keep the file safe.
   - **Boot volume:** 100 GB.
3. **Open the web ports in Oracle's network:** open the instance's subnet, then **Security List → Add Ingress Rules**. Set source `0.0.0.0/0`, protocol TCP and destination port `80,443`. The installer opens the same ports in the server's own firewall.
4. **Connect:** `ssh -i <your-key-file> ubuntu@<public-IP>`, then `sudo -i`. Then run step 3 of the install above.

If Oracle says **"Out of capacity"**, try another availability domain in the same form, or try again later. Upgrading the account to Pay As You Go usually fixes it, and Always Free resources stay free. On a free account, Oracle may stop a server that stays almost idle for 7 days; daily use avoids this.

## Daily use (from `/opt/knowledgeAI/deploy/ai-studio`)

```bash
./admin.sh user dev@takatak.ca "Dev Name" 20    # new login with 20 USD of credits; prints the password
./admin.sh credits client@example.com 10         # top up 10 USD
./admin.sh balances                              # who has how much
./admin.sh ban someone@example.com 30            # block for 30 days
./admin.sh backup                                # save the database
./admin.sh update                                # get the latest kit and restart
./admin.sh help                                  # all commands
```

Lab users: the admin adds them in the Lab under **Admin Panel → Users**.

## Credits and prices

- **1 USD of credits = 1,000,000 credits = 1 USD of AI usage** at the provider's list price. Each message deducts the tokens it used. When the balance is 0, the person cannot send messages until topped up.
- **List prices** per 1 million tokens (input / output), checked on 2026-10-08:

  | Brand | Model | Input | Output |
  |---|---|---|---|
  | Claude | claude-sonnet-5-5 | $2 | $10 |
  | Claude | claude-opus-5-5 | $4 | $20 |
  | Claude | claude-fable-5-1 | $10 | $50 |
  | ChatGPT | gpt-6-luna | $0.10 | $0.50 |
  | ChatGPT | gpt-6-sol | $2 | $10 |
  | ChatGPT | gpt-6-astra | $10 | $50 |
  | Gemini | gemini-3.8-flash | $0.75 | $3.75 |
  | Gemini | gemini-3.1-pro-preview | $2 | $12 |
  | Grok | grok-4.7 | $2 | $6 |
  | DeepSeek | deepseek-v4-pro | $0.435 | $0.87 |

- A typical chat message (about 2,000 tokens in and 700 out) costs about **1 cent on Sonnet or gpt-6-sol** and about **2 cents on Opus**. Long conversations cost more, because the whole history is sent again with each message.
- **Suggested client plans.** These are a starting point; you set the prices. Payment is taken through Facturations, then credits are added with `./admin.sh credits`.

  | Plan | Price | Credits / month | About |
  |---|---|---|---|
  | Starter | 29 CAD | 8 USD | 700 Sonnet messages |
  | Pro | 59 CAD | 18 USD | 1,600 Sonnet messages |
  | Team seat | 99 CAD | 32 USD | 2,900 Sonnet messages |

## Rules (read once)

- **Only API keys go in this server.** Do not log ChatGPT, Claude.ai or other personal subscriptions into it, and do not use client passwords. Consumer terms forbid sharing an account or making it available to others (Anthropic: "You may not share your Account login information … or make your Account available to anyone else"; OpenAI's terms say the same), and the accounts can be banned. The API/commercial terms do allow building a product for your own customers, which is what this is.
- Each person who keeps a personal ChatGPT Pro or Claude Max uses it on their own computer, under their own name.
- Never paste keys or passwords in chat or commit them to GitHub. `.env`, `.admin-first-login` and `data/` are ignored by git.

## What was tested (2026-10-08, local Docker, placeholder keys)

- The installer ran end to end: services started, the admin login worked (role admin), and it received 20 USD of credits.
- `./admin.sh user` created a login with 5 USD, and `credits 2.5` brought it to 7.5 USD (balance API: 7,500,000).
- Public sign-up is refused on both sites (403).
- Only brands with a key are offered (Claude and Grok in the test).
- Rerunning the installer kept `.env` and all balances.
- HTTPS through Caddy works, and the login and chat pages render.
- **Not tested:** real AI answers and their credit deduction, because no real keys were used. Check them with one message per brand after install.

## Known limits

- The team app shows **2** models side by side. For more at once, use the Lab.
- Uploading documents for search (RAG) is off in both apps. Images and files can still be attached to a message where the model supports it.
- The Lab has no credit system; it is for admins only.
- Brand logo: the app logo stays the default until the official files are in `knowledgeAI/brand/`.
- Turning a paid Facturations invoice into credits automatically is a later step (backlog TK-071).
