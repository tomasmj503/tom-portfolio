# Portfolio site — build spec (tomasmj503)

A single-page personal portfolio for **Tomás "Millo" Muñoz — AI Automation Engineer**.
Goal: clean, fast, recruiter-facing. Content is final (below). Images go in `public/img/`.

## Tech
- Vite + React + TypeScript + Tailwind (same stack as jutilabs.com — already familiar).
- New repo `tom-portfolio` (public), deploy on Vercel, custom domain **tom.jutilabs.com**.
- One page, sections scroll; responsive; dark theme.

## Design direction
- Dark, modern, lots of whitespace. One accent color (amber `#FFBF00` or similar to tie to JUTILABS, your call).
- Headings: Space Grotesk; body: Inter.
- Project images in a clean grid: rounded corners (`rounded-xl`), subtle border (`border-white/10`), consistent sizing, lazy-loaded. No clutter — 2–3 images per project max.
- Fast (Lighthouse-friendly), accessible, mobile-first.
- Apply a polished, hand-crafted dark design to a high standard (if a design skill isn't available, design it by hand). Avoid the generic AI-template look.

---

## SECTION 1 — Header (sticky, minimal)
- Left: `Tomás Muñoz` (wordmark).
- Right links: `Work` · `GitHub` · `LinkedIn` · `Contact`.

## SECTION 2 — Hero
- Eyebrow: `AI Automation Engineer · forward-deployed`
- H1: **I build AI systems that run real businesses.**
- Sub: I design, build and ship production AI — WhatsApp & Telegram bots, agentic workflows, and the dashboards that turn them into decisions. End to end, on my own.
- Buttons:
  - `▶ Live demo` → https://jutilabs.com/demos/panel.html
  - `GitHub` → https://github.com/tomasmj503
  - `LinkedIn` → https://www.linkedin.com/in/tomasemiliomunozdigital/
  - `Email` → tomas-mj@hotmail.com
- Stack chips row: `n8n · WhatsApp Cloud API · Claude & Claude Code · Gemini · Supabase · Vercel · TypeScript`

## SECTION 3 — About (short)
Before AI, I spent 6+ years in hospitality and F&B across the US and Colombia, then worked as a business data analyst (Python, BigQuery, Looker Studio). That mix — real operations + data + AI automation — lets me understand a business problem and build the solution myself, forward-deployed and end to end. Today I build agentic workflows in production; I'm heading toward autonomous multi-agent systems.

## SECTION 4 — Work (3 case studies)

### La Braza — restaurant · Peru
- **Problem:** they were losing orders during rush hours, handling WhatsApp by hand on two phones.
- **What I built:** a WhatsApp ordering bot (130+ nodes) that takes the full order on its own — menu, address, distance-based delivery fee with Google Maps, and payment — plus a real-time dashboard that alerts the kitchen the moment an order lands. A 4-layer image-classification router (Gemini Vision) reliably tells payment screenshots from expense photos.
- **Stack:** n8n · WhatsApp Cloud API · Gemini Vision · Google Maps · Supabase
- **Result:** they stopped losing orders during rush hours — handling 100+ orders a day.
- **Images:** `img/labraza/dashboard.png`, `img/labraza/workflow.png`

### Tío Toro — restaurant · Bogotá  *(feature the live demo here)*
- **Problem:** the owner tracked sales, expenses and cash by hand on loose sheets — no time, no expensive POS.
- **What I built:** a single WhatsApp assistant (83-node workflow) that runs the whole back office — logs expenses by text, audio or photo (Gemini Vision reads the receipts), tracks dine-in and delivery sales, and runs the full cash register (open, withdrawals, end-of-day reconciliation), all synced to Google Sheets. On top of the data, a live analytics dashboard.
- **Stack:** n8n · WhatsApp Cloud API · Gemini (text, vision, audio) · Google Sheets · Chart.js
- **Result:** for the first time the owner has clear numbers — daily income, expenses and cash — with no notebooks and no manual data entry.
- **CTA button:** `▶ Explore the live dashboard` → https://jutilabs.com/demos/panel.html
- **Images:** `img/tio-toro/dashboard.png`, `img/tio-toro/whatsapp.png`, `img/tio-toro/workflow.png`

### Duendes Perú — e-commerce
- **Problem:** a handmade-goods brand needed an online store and a way to manage a growing catalog without touching code.
- **What I built:** a custom Shopify storefront with WhatsApp checkout, plus a Telegram bot that uploads, activates and manages the whole catalog through the Shopify Admin API. I used GPT-4o mini to read each product photo and auto-write its description, and Claude Code to push storefront changes straight to the live store.
- **Stack:** Shopify Admin API · Telegram · GPT-4o mini · Claude Code
- **Result:** they publish and manage their catalog in minutes, without touching code.
- **Images:** `img/duendes/store.png`, `img/duendes/telegram.png`

## SECTION 5 — Tools
Single strip of chips: `Claude / Claude Code · n8n · WhatsApp Cloud API · Telegram · Gemini Vision · GPT-4o mini · Google Maps · Supabase · Google Sheets · TypeScript · Vercel`

## SECTION 6 — Contact / footer
- Line: **Open to roles in AI automation — remote or hybrid.**
- Links: Email `tomas-mj@hotmail.com` · LinkedIn `linkedin.com/in/tomasemiliomunozdigital` · GitHub `github.com/tomasmj503`

---

## Image handling
- All images live under `public/img/{labraza,tio-toro,duendes}/` with the exact names referenced above.
- If a referenced image is missing, render a neutral placeholder box (don't break the layout) so the site builds clean and images slot in later.
- Optimize: lazy-load, reasonable max-width, keep page fast.

## Notes
- English throughout (consistent with LinkedIn/GitHub, international reach).
- Naming real clients (La Braza, Tío Toro, Duendes) in the case-study narrative is fine — this is your own portfolio.
- Do NOT embed any private client code; screenshots only.
