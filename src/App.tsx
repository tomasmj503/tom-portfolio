import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
//  Reveal — fade/slide in on scroll
// ─────────────────────────────────────────────────────────────
function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as React.RefObject<any>}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

// ─────────────────────────────────────────────────────────────
//  Shot — lazy image, object-contain (never upscaled), click to zoom
// ─────────────────────────────────────────────────────────────
function Shot({
  src,
  alt,
  onZoom,
  maxH = 'max-h-[460px]',
}: {
  src: string;
  alt: string;
  onZoom: (src: string, alt: string) => void;
  maxH?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-panel text-white/30">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="text-xs">{alt}</span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onZoom(src, alt)}
      aria-label={`Enlarge: ${alt}`}
      className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-panel p-2 transition hover:border-white/25"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`mx-auto h-auto w-full ${maxH} rounded-md object-contain transition duration-500 group-hover:opacity-95`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
//  BrowserFrame — window chrome wrapper (iframe or content)
// ─────────────────────────────────────────────────────────────
function BrowserFrame({
  url,
  fullscreenHref,
  children,
}: {
  url: string;
  fullscreenHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080a] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 truncate text-[11px] text-white/40">{url}</span>
        {fullscreenHref && (
          <a
            href={fullscreenHref}
            target="_blank"
            rel="noreferrer"
            className="ml-auto whitespace-nowrap text-[11px] font-semibold text-amber hover:underline"
          >
            ⤢ Pantalla completa
          </a>
        )}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Lightbox
// ─────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
      >
        ✕ Esc
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[92vw] rounded-lg border border-white/10 object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Atoms
// ─────────────────────────────────────────────────────────────
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/60">
      {children}
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber">
      <span className="h-px w-6 bg-amber/60" />
      {children}
    </div>
  );
}

const ArrowOut = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────────────────────
const HERO_STACK = [
  'n8n', 'WhatsApp Cloud API', 'Claude & Claude Code', 'Gemini', 'Supabase', 'Vercel', 'TypeScript',
];
const TOOLS = [
  'Claude / Claude Code', 'n8n', 'WhatsApp Cloud API', 'Telegram', 'Gemini Vision',
  'GPT-4o mini', 'Google Maps', 'Supabase', 'Google Sheets', 'TypeScript', 'Vercel',
];

const EMAIL = 'tomas-mj@hotmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/tomasemiliomunozdigital/';
const GITHUB = 'https://github.com/tomasmj503';
const DEMO = 'https://jutilabs.com/demos/panel.html';

// ─────────────────────────────────────────────────────────────
//  App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const zoom = (src: string, alt: string) => setLightbox({ src, alt });

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
              I design, build and ship production AI — WhatsApp &amp; Telegram bots, agentic workflows,
              and the dashboards that turn them into decisions. End to end, on my own.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={DEMO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-3 text-sm font-bold text-ink shadow-[0_8px_30px_-8px_rgba(255,191,0,0.5)] transition hover:bg-amber/90">▶ Live demo</a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">GitHub <ArrowOut /></a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">LinkedIn <ArrowOut /></a>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40">Email</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {HERO_STACK.map((s) => <Chip key={s}>{s}</Chip>)}
            </div>
          </Reveal>
        </section>

        {/* ABOUT */}
        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-16">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/40">About</h2>
            <p className="max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
              Before AI, I spent 6+ years in hospitality and F&amp;B across the US and Colombia, then
              worked as a business data analyst (Python, BigQuery, Data Studio (antes Looker Studio)).
              That mix — real operations + data + AI automation — lets me understand a business problem
              and build the solution myself, forward-deployed and end to end. Today I build agentic
              workflows in production; I&apos;m heading toward autonomous multi-agent systems.
            </p>
          </Reveal>
        </section>

        {/* WORK */}
        <section id="work" className="border-t border-white/10 py-16 md:py-24">
          <Reveal className="mb-12 md:mb-16">
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Three systems, shipped to production.
            </h2>
          </Reveal>

          <div className="space-y-20 md:space-y-28">
            {/* ── LA BRAZA ── */}
            <Reveal as="article">
              <ProjectHead name="La Braza" tag="restaurant · Peru" />
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
                <Narrative
                  problem="they were losing orders during rush hours, handling WhatsApp by hand on two phones."
                  built="a WhatsApp ordering bot (130+ nodes) that takes the full order on its own — menu, address, distance-based delivery fee with Google Maps, and payment — plus a real-time dashboard that alerts the kitchen the moment an order lands. A 4-layer image-classification router (Gemini Vision) reliably tells payment screenshots from expense photos."
                  stack="n8n · WhatsApp Cloud API · Gemini Vision · Google Maps · Supabase"
                  result="they stopped losing orders during rush hours — handling 100+ orders a day."
                />
                <div className="space-y-4">
                  <Shot src="/img/labraza/dashboard.png" alt="La Braza — live orders dashboard" onZoom={zoom} />
                  <Shot src="/img/labraza/workflow.png" alt="La Braza — n8n ordering workflow" onZoom={zoom} />
                </div>
              </div>
            </Reveal>

            {/* ── TÍO TORO (live demo) ── */}
            <Reveal as="article">
              <ProjectHead name="Tío Toro" tag="restaurant · Bogotá" featured />
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
                <Narrative
                  problem="the owner tracked sales, expenses and cash by hand on loose sheets — no time, no expensive POS."
                  built="a single WhatsApp assistant (83-node workflow) that runs the whole back office — logs expenses by text, audio or photo (Gemini Vision reads the receipts), tracks dine-in and delivery sales, and runs the full cash register (open, withdrawals, end-of-day reconciliation), all synced to Google Sheets. On top of the data, a live analytics dashboard."
                  stack="n8n · WhatsApp Cloud API · Gemini (text, vision, audio) · Google Sheets · Chart.js"
                  result="for the first time the owner has clear numbers — daily income, expenses and cash — with no notebooks and no manual data entry."
                  cta={{ label: '▶ Explore the live dashboard', href: DEMO }}
                />
                <div className="space-y-4">
                  {/* Live embedded dashboard */}
                  <BrowserFrame url="panel.jutilabs.com" fullscreenHref={DEMO}>
                    <iframe
                      src={DEMO}
                      title="Tío Toro — live analytics dashboard"
                      loading="lazy"
                      className="block h-[420px] w-full md:h-[600px]"
                      style={{ border: 0 }}
                    />
                  </BrowserFrame>
                  <div className="grid grid-cols-2 gap-4">
                    <Shot src="/img/tio-toro/whatsapp.png" alt="Tío Toro — WhatsApp assistant" onZoom={zoom} maxH="max-h-[520px]" />
                    <Shot src="/img/tio-toro/workflow.png" alt="Tío Toro — 83-node workflow" onZoom={zoom} maxH="max-h-[520px]" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ── DUENDES ── */}
            <Reveal as="article">
              <ProjectHead name="Duendes Perú" tag="e-commerce" />
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
                <Narrative
                  problem="a handmade-goods brand needed an online store and a way to manage a growing catalog without touching code."
                  built="a custom Shopify storefront with WhatsApp checkout, plus a Telegram bot that uploads, activates and manages the whole catalog through the Shopify Admin API. I used GPT-4o mini to read each product photo and auto-write its description, and Claude Code to push storefront changes straight to the live store."
                  stack="Shopify Admin API · Telegram · GPT-4o mini · Claude Code"
                  result="they publish and manage their catalog in minutes, without touching code."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Shot src="/img/duendes/store.png" alt="Duendes Perú — Shopify storefront" onZoom={zoom} />
                  <Shot src="/img/duendes/telegram.png" alt="Duendes Perú — Telegram catalog bot" onZoom={zoom} maxH="max-h-[520px]" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* TOOLS */}
        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <Eyebrow>Tools</Eyebrow>
            <div className="flex flex-wrap gap-2.5">
              {TOOLS.map((t) => <Chip key={t}>{t}</Chip>)}
            </div>
          </Reveal>
        </section>
      </main>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Open to roles in AI automation — <span className="text-amber">remote or hybrid.</span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
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

// ─────────────────────────────────────────────────────────────
//  Project sub-components
// ─────────────────────────────────────────────────────────────
function ProjectHead({ name, tag, featured }: { name: string; tag: string; featured?: boolean }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{name}</h3>
      <span className="text-sm font-medium text-white/40">{tag}</span>
      {featured && (
        <span className="rounded-full border border-amber/30 bg-amber/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber">
          Live demo
        </span>
      )}
    </div>
  );
}

function Narrative({
  problem,
  built,
  stack,
  result,
  cta,
}: {
  problem: string;
  built: string;
  stack: string;
  result: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="space-y-5">
      <Field label="Problem" muted>{problem}</Field>
      <Field label="What I built" muted>{built}</Field>
      <Field label="Result">{result}</Field>
      <div className="pt-1 text-sm text-white/50">{stack}</div>
      {cta && (
        <a href={cta.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-amber/90">
          {cta.label}
        </a>
      )}
    </div>
  );
}

function Field({ label, children, muted }: { label: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/35">{label}</div>
      <p className={`leading-relaxed ${muted ? 'text-white/70' : 'text-white/90'}`}>{children}</p>
    </div>
  );
}
