import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
//  Reveal — fade/slide in on scroll
// ─────────────────────────────────────────────────────────────
function Reveal({
  children, className = '', delay = 0, as: Tag = 'div',
}: {
  children: React.ReactNode; className?: string; delay?: number;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref as React.RefObject<any>} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}

type Zoom = (src: string, alt: string) => void;

const Caption = ({ children }: { children: React.ReactNode }) =>
  <p className="mt-2 text-center text-xs text-white/40">{children}</p>;

// ── Wide — horizontal media (workflows, store), object-contain, zoomable ──
function Wide({ src, alt, onZoom, caption }: { src: string; alt: string; onZoom: Zoom; caption?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure>
      {failed ? (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-white/10 bg-panel text-sm text-white/30">{alt}</div>
      ) : (
        <button type="button" onClick={() => onZoom(src, alt)} aria-label={`Enlarge: ${alt}`}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-panel p-2 transition hover:border-white/25">
          <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)}
            className="mx-auto h-auto w-full rounded-md object-contain" />
        </button>
      )}
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

// ── Phone — tall screenshot in a device frame, zoomable ──
function Phone({ src, alt, onZoom, caption, maxW = 'max-w-[330px]' }: { src: string; alt: string; onZoom: Zoom; caption?: string; maxW?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`mx-auto w-full ${maxW}`}>
      {failed ? (
        <div className="flex aspect-[9/19] w-full items-center justify-center rounded-[2rem] border border-white/10 bg-panel text-sm text-white/30">{alt}</div>
      ) : (
        <button type="button" onClick={() => onZoom(src, alt)} aria-label={`Enlarge: ${alt}`}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-[2rem] border-[6px] border-[#16181d] bg-[#16181d] shadow-2xl ring-1 ring-white/10 transition hover:ring-white/25">
          <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)}
            className="block w-full rounded-[1.4rem]" />
        </button>
      )}
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

// ── BrowserFrame — window chrome wrapper (live iframe) ──
function BrowserFrame({ url, fullscreenHref, children }: { url: string; fullscreenHref: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080a] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 truncate text-[11px] text-white/40">{url}</span>
        <a href={fullscreenHref} target="_blank" rel="noreferrer"
          className="ml-auto whitespace-nowrap text-[11px] font-semibold text-amber hover:underline">⤢ Pantalla completa</a>
      </div>
      {children}
    </div>
  );
}

// ── Lightbox ──
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <button type="button" onClick={onClose} aria-label="Close"
        className="absolute right-5 top-5 rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">✕ Esc</button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] max-w-[94vw] rounded-lg border border-white/10 object-contain shadow-2xl" />
    </div>
  );
}

// ── Atoms ──
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/60">{children}</span>
);
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber">
    <span className="h-px w-6 bg-amber/60" />{children}
  </div>
);
const ArrowOut = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

// ── Bullet list ──
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((b) => (
        <li key={b} className="flex gap-3 leading-relaxed text-white/70">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber/70" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

type Group = { label: string; bullets: string[] };

// ── ProjectCard — problem + "What I built" bullet list (or grouped) + result + stack + media ──
function ProjectCard({
  name, tag, featured, problem, lead, bullets, groups, note, result, stack, children,
}: {
  name: string; tag: string; featured?: boolean;
  problem?: string; lead: string; bullets?: string[]; groups?: Group[]; note?: string; result: string; stack: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="article">
      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{name}</h3>
        <span className="text-sm font-medium text-white/40">{tag}</span>
        {featured && <span className="rounded-full border border-amber/30 bg-amber/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber">Live demo</span>}
      </div>

      <div className="max-w-3xl space-y-5">
        {problem && (
          <p className="leading-relaxed text-white/70"><span className="font-semibold text-white/90">The problem: </span>{problem}</p>
        )}
        <div className="space-y-4">
          <p className="leading-relaxed text-white/80"><span className="font-semibold text-white">What I built — </span>{lead}</p>
          {bullets && <Bullets items={bullets} />}
          {groups && groups.map((g) => (
            <div key={g.label} className="space-y-2.5">
              <p className="text-sm font-semibold italic text-amber/90">{g.label}</p>
              <Bullets items={g.bullets} />
            </div>
          ))}
        </div>
        {note && <p className="text-sm text-white/45">{note}</p>}
        <p className="leading-relaxed"><span className="font-semibold text-white/90">Result — </span><span className="text-white/90">{result}</span></p>
        <p className="text-sm text-white/50">{stack}</p>
      </div>

      <div className="mt-12">{children}</div>
    </Reveal>
  );
}

// ── Data ──
const HERO_STACK = ['n8n', 'WhatsApp Cloud API', 'Claude & Claude Code', 'Gemini', 'Supabase', 'Vercel', 'TypeScript'];
const TOOLS = ['Claude / Claude Code', 'n8n', 'WhatsApp Cloud API', 'Telegram', 'Gemini Vision', 'GPT-4o mini', 'Google Maps', 'Supabase', 'Google Sheets', 'TypeScript', 'Vercel'];
const EMAIL = 'tomas-mj@hotmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/tomasemiliomunozdigital/';
const GITHUB = 'https://github.com/tomasmj503';
const DEMO_TIOTORO = 'https://jutilabs.com/demos/panel.html';
const DEMO_LABRAZA = '/demos/labraza.html';

// ─────────────────────────────────────────────────────────────
//  App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const zoom: Zoom = (src, alt) => setLightbox({ src, alt });

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight text-white">Tomás Muñoz</a>
          <nav className="flex items-center gap-5 text-sm text-white/60">
            <a href="#work" className="transition-colors hover:text-white">Work</a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="hidden transition-colors hover:text-white sm:inline">GitHub</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="hidden transition-colors hover:text-white sm:inline">LinkedIn</a>
            <a href="#contact" className="rounded-lg border border-white/15 px-3 py-1.5 font-medium text-white transition-colors hover:border-amber hover:text-amber">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-content px-5 md:px-8">
        {/* HERO */}
        <section className="pt-20 pb-16 md:pt-32 md:pb-24">
          <Reveal>
            <Eyebrow>AI Automation Engineer · forward-deployed</Eyebrow>
            <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
              I build AI systems that <span className="text-amber">run real businesses.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              I design, build and ship production AI — WhatsApp &amp; Telegram bots, agentic workflows, and the dashboards that turn them into decisions. End to end, on my own.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={DEMO_TIOTORO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-3 text-sm font-bold text-ink shadow-[0_8px_30px_-8px_rgba(255,191,0,0.5)] transition hover:bg-amber/90">▶ Live demo</a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">GitHub <ArrowOut /></a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">LinkedIn <ArrowOut /></a>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">Email</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">{HERO_STACK.map((s) => <Chip key={s}>{s}</Chip>)}</div>
          </Reveal>
        </section>

        {/* ABOUT */}
        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-16">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/40">About</h2>
            <p className="max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
              Before AI, I spent 6+ years in hospitality and F&amp;B across the US and Colombia, then worked as a business data analyst — Python, BigQuery, and Data Studio (formerly Looker Studio). That mix — real operations + data + AI automation — lets me understand a business problem and build the solution myself, forward-deployed and end to end. Today I build agentic workflows in production; I&apos;m heading toward autonomous multi-agent systems.
            </p>
          </Reveal>
        </section>

        {/* WORK */}
        <section id="work" className="border-t border-white/10 py-16 md:py-24">
          <Reveal className="mb-14 md:mb-20">
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Systems shipped to production.</h2>
          </Reveal>

          <div className="space-y-24 md:space-y-36">
            {/* ── LA BRAZA ── */}
            <ProjectCard
              name="La Braza" tag="restaurant · Peru" featured
              problem="at peak hours they were losing orders, taking WhatsApp by hand on two phones."
              lead="a complete WhatsApp ordering system that runs the order flow on its own, plus a live dashboard for the kitchen. In plain terms, it does everything a person used to do by hand:"
              bullets={[
                'Takes the full order over WhatsApp on its own: shows the menu, builds the order, asks delivery or pickup, captures the address, calculates the delivery fee based on the real distance (Google Maps), takes the payment method, and confirms.',
                'Reads the payment screenshot (Yape) and supplier invoices automatically (Gemini Vision) — and a smart image router tells a payment proof apart from an expense photo, so nothing gets misfiled.',
                'Live kitchen dashboard: every new order appears instantly, with its status (new → preparing → ready → on the way → delivered).',
                'Keeps the customer informed automatically ("being prepared", "on its way").',
                'Cleans up abandoned or incomplete orders on its own, so the board stays accurate.',
                'Notifies dispatch and logs every order to a shared sheet.',
                'Two hours after delivery, automatically asks the customer for a Google review.',
                'Sends the owner an automatic daily summary of the day.',
              ]}
              note="Built as a 5-part system (130+ steps), handling 100+ orders a day."
              result="they stopped losing orders during rush hours."
              stack="n8n · WhatsApp Cloud API · Gemini Vision · Google Maps · Supabase"
            >
              <div className="space-y-10">
                <div>
                  <BrowserFrame url="panel.labraza.com · demo" fullscreenHref={DEMO_LABRAZA}>
                    <iframe src={DEMO_LABRAZA} title="La Braza — live orders dashboard (demo)" loading="lazy"
                      className="block h-[440px] w-full md:h-[620px]" style={{ border: 0 }} />
                  </BrowserFrame>
                  <Caption>Live orders dashboard — interactive demo (access key: 1111)</Caption>
                </div>
                <Wide src="/img/labraza/workflow.png" alt="La Braza — n8n ordering workflow" onZoom={zoom}
                  caption="Ordering bot in n8n — natural-language order, geocoding & distance-based delivery fee" />
                <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
                  <Phone src="/img/labraza/whatsapp-1.png" alt="La Braza — natural-language ordering chat" onZoom={zoom} caption="Natural-language ordering on WhatsApp" />
                  <Phone src="/img/labraza/whatsapp-2.png" alt="La Braza — dispatch & post-sale chat" onZoom={zoom} caption="Dispatch, review request & promos — automated" />
                </div>
              </div>
            </ProjectCard>

            {/* ── TÍO TORO ── */}
            <ProjectCard
              name="Tío Toro" tag="restaurant · Bogotá" featured
              problem="the owner tracked sales, expenses and cash by hand on loose sheets — no time, no expensive POS."
              lead="a single WhatsApp assistant that runs the whole back office. The team just chats with it, and it keeps the books:"
              bullets={[
                'Logs expenses three ways: by text, by voice note, or by photo of the invoice (Gemini Vision reads the invoice and pulls the amounts).',
                "Records dine-in table sales — each table's order and total.",
                'Records delivery sales.',
                'Handles split payments (a bill paid in parts or by different methods).',
                'Runs the full cash register: opening the till, cash withdrawals during the day, and end-of-day reconciliation (squaring the cash).',
                'Syncs everything automatically to Google Sheets.',
                'A live dashboard turns it all into clear numbers: daily income, expenses, and cash on hand.',
              ]}
              note="Built as a single 83-step workflow."
              result="for the first time the owner knows exactly what the business makes each day — no notebooks, no manual data entry."
              stack="n8n · WhatsApp Cloud API · Gemini (text, vision, audio) · Google Sheets"
            >
              <div className="space-y-10">
                <div>
                  <BrowserFrame url="panel.jutilabs.com" fullscreenHref={DEMO_TIOTORO}>
                    <iframe src={DEMO_TIOTORO} title="Tío Toro — live analytics dashboard" loading="lazy"
                      className="block h-[440px] w-full md:h-[620px]" style={{ border: 0 }} />
                  </BrowserFrame>
                  <Caption>Live analytics dashboard — interactive demo</Caption>
                </div>
                <Wide src="/img/tio-toro/workflow.png" alt="Tío Toro — full 83-node back-office workflow" onZoom={zoom}
                  caption="One n8n workflow, 83 nodes — sales, expenses, cash register & multimodal input" />
                <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
                  <Phone src="/img/tio-toro/whatsapp-venta.png" alt="Tío Toro — sale logged in natural language" onZoom={zoom} caption="Logging a sale in natural language" maxW="max-w-[300px]" />
                  <Phone src="/img/tio-toro/whatsapp-gasto.png" alt="Tío Toro — expense from a receipt photo" onZoom={zoom} caption="Expense from a receipt photo — Gemini Vision" maxW="max-w-[300px]" />
                </div>
              </div>
            </ProjectCard>

            {/* ── DUENDES PERÚ (store + catalog bot + daily content) ── */}
            <ProjectCard
              name="Duendes Perú" tag="e-commerce + content automation"
              problem="a handmade-goods brand needed an online store and a way to manage a growing catalog without touching code."
              lead="I ran this client's whole digital operation: a custom store, a catalog bot, and a daily content automation."
              groups={[
                {
                  label: 'Store + catalog bot:',
                  bullets: [
                    'Custom Shopify storefront, with checkout through WhatsApp.',
                    'A Telegram bot that manages the catalog end to end: add a product, edit its price or stock, activate or deactivate it, and list or search what\'s in the store.',
                    'Mark an item as "sold outside the store" so stock stays accurate.',
                    'Automatic sale notifications — the bot tells the owner the moment something sells (via webhook).',
                    'Turns a product photo into a finished listing: GPT-4o mini reads each photo and auto-writes its description.',
                    'I also used Claude Code to push changes straight to the live store.',
                  ],
                },
                {
                  label: 'Daily content automation (Oráculo):',
                  bullets: [
                    'An automated daily message the brand sends its community every morning on Telegram — generated and delivered with no one lifting a finger.',
                    'Two scheduled automations: one prepares the content at 3am, another sends it at 9am.',
                    'Generates a personalized daily reading with AI (Gemini) on top of a structured data table.',
                  ],
                },
              ]}
              result="they manage their whole catalog in minutes from their phone — and the community gets a daily message automatically, every day."
              stack="Shopify Admin API · Telegram · GPT-4o mini · Gemini · n8n · Claude Code"
            >
              <div className="space-y-10">
                <Wide src="/img/duendes/store.png" alt="Duendes Perú — custom Shopify storefront" onZoom={zoom} caption="Custom Shopify storefront, built with Claude Code" />
                <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
                  <figure className="mx-auto w-full max-w-[330px]">
                    <div className="overflow-hidden rounded-[2rem] border-[6px] border-[#16181d] bg-[#16181d] shadow-2xl ring-1 ring-white/10">
                      <video controls playsInline preload="metadata" className="block w-full rounded-[1.4rem]">
                        <source src="/media/duendesperu.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <Caption>Catalog bot in action — a product live in under a minute (Telegram → Shopify)</Caption>
                  </figure>
                  <Phone src="/img/duendes/telegram.png" alt="Duendes Perú — daily Telegram message (Oráculo)" onZoom={zoom} caption="Daily content automation — the message delivered every morning" />
                </div>
              </div>
            </ProjectCard>
          </div>
        </section>

        {/* TOOLS */}
        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <Eyebrow>Tools</Eyebrow>
            <div className="flex flex-wrap gap-2.5">{TOOLS.map((t) => <Chip key={t}>{t}</Chip>)}</div>
          </Reveal>
        </section>
      </main>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <p className="max-w-2xl text-xl font-medium leading-snug text-white sm:text-2xl">
              The fastest way to reach me is email or LinkedIn. I usually reply the same day.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-3 text-sm font-bold text-ink transition hover:bg-amber/90">{EMAIL}</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">LinkedIn <ArrowOut /></a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">GitHub <ArrowOut /></a>
            </div>
          </Reveal>
          <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Tomás Muñoz</span>
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white/70">{EMAIL}</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="transition-colors hover:text-white/70">linkedin.com/in/tomasemiliomunozdigital</a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="transition-colors hover:text-white/70">github.com/tomasmj503</a>
            </span>
          </div>
        </div>
      </footer>

      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </div>
  );
}
