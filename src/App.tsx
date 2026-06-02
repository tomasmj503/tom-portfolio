import { useEffect, useRef, useState } from 'react';

type Lang = 'en' | 'es';
type Zoom = (src: string, alt: string) => void;
type Group = { label: string; bullets: string[] };
type Project = {
  name: string; tag: string; featured?: boolean;
  problem?: string; lead: string; bullets?: string[]; groups?: Group[]; note?: string; result: string; stack: string;
};

// ─────────────────────────────────────────────────────────────
//  Content (EN | ES)
// ─────────────────────────────────────────────────────────────
const C: Record<Lang, any> = {
  en: {
    nav: { work: 'Work', contact: 'Contact' },
    fullscreen: '⤢ Full screen',
    hero: {
      eyebrow: 'AI Automation Engineer · forward-deployed',
      h1a: 'I build AI systems that ', h1b: 'run real businesses.',
      sub: 'I design, build and ship production AI — WhatsApp & Telegram bots, agentic workflows, and the dashboards that turn them into decisions. End to end, on my own.',
      demo: '▶ Live demo',
    },
    about: {
      eyebrow: 'About',
      text: 'Before AI, I spent 6+ years in hospitality and F&B across the US and Colombia, then worked as a business data analyst — Python, BigQuery, and Data Studio (formerly Looker Studio). That mix — real operations + data + AI automation — lets me understand a business problem and build the solution myself, forward-deployed and end to end. Today I build agentic workflows in production; I’m heading toward autonomous multi-agent systems.',
    },
    work: { eyebrow: 'Selected work', heading: 'Systems shipped to production.' },
    lbl: { problem: 'The problem: ', built: 'What I built — ', result: 'Result — ', featured: 'Live demo' },
    tools: 'Tools',
    contact: { eyebrow: 'Contact', line: 'The fastest way to reach me is email or LinkedIn. I usually reply the same day.' },
    caps: {
      lbDash: 'Live orders dashboard — interactive demo (access key: 1111)',
      lbWf: 'Ordering bot in n8n — natural-language order, geocoding & distance-based delivery fee',
      lbWa1: 'Natural-language ordering on WhatsApp',
      lbWa2: 'Dispatch, review request & promos — automated',
      ttDash: 'Live analytics dashboard — interactive demo',
      ttWf: 'One n8n workflow, 83 nodes — sales, expenses, cash register & multimodal input',
      ttVenta: 'Logging a sale in natural language',
      ttGasto: 'Expense from a receipt photo — Gemini Vision',
      duStore: 'Custom Shopify storefront, built with Claude Code',
      duVideo: 'Catalog bot in action — a product live in under a minute (Telegram → Shopify)',
      duOraculo: 'Daily content automation — the message delivered every morning',
    },
    projects: {
      labraza: {
        name: 'La Braza', tag: 'restaurant · Peru', featured: true,
        problem: 'at peak hours they were losing orders, taking WhatsApp by hand on two phones.',
        lead: 'a complete WhatsApp ordering system that runs the order flow on its own, plus a live dashboard for the kitchen. In plain terms, it does everything a person used to do by hand:',
        bullets: [
          'Takes the full order over WhatsApp on its own: shows the menu, builds the order, asks delivery or pickup, captures the address, calculates the delivery fee based on the real distance (Google Maps), takes the payment method, and confirms.',
          'Reads the payment screenshot (Yape) and supplier invoices automatically (Gemini Vision) — and a smart image router tells a payment proof apart from an expense photo, so nothing gets misfiled.',
          'Live kitchen dashboard: every new order appears instantly, with its status (new → preparing → ready → on the way → delivered).',
          'Keeps the customer informed automatically ("being prepared", "on its way").',
          'Cleans up abandoned or incomplete orders on its own, so the board stays accurate.',
          'Notifies dispatch and logs every order to a shared sheet.',
          'Two hours after delivery, automatically asks the customer for a Google review.',
          'Sends the owner an automatic daily summary of the day.',
        ],
        note: 'Built as a 5-part system (130+ steps), handling 100+ orders a day.',
        result: 'they stopped losing orders during rush hours.',
        stack: 'n8n · WhatsApp Cloud API · Gemini Vision · Google Maps · Supabase',
      } as Project,
      tiotoro: {
        name: 'Tío Toro', tag: 'restaurant · Bogotá', featured: true,
        problem: 'the owner tracked sales, expenses and cash by hand on loose sheets — no time, no expensive POS.',
        lead: 'a single WhatsApp assistant that runs the whole back office. The team just chats with it, and it keeps the books:',
        bullets: [
          'Logs expenses three ways: by text, by voice note, or by photo of the invoice (Gemini Vision reads the invoice and pulls the amounts).',
          "Records dine-in table sales — each table's order and total.",
          'Records delivery sales.',
          'Handles split payments (a bill paid in parts or by different methods).',
          'Runs the full cash register: opening the till, cash withdrawals during the day, and end-of-day reconciliation (squaring the cash).',
          'Syncs everything automatically to Google Sheets.',
          'A live dashboard turns it all into clear numbers: daily income, expenses, and cash on hand.',
        ],
        note: 'Built as a single 83-step workflow.',
        result: 'for the first time the owner knows exactly what the business makes each day — no notebooks, no manual data entry.',
        stack: 'n8n · WhatsApp Cloud API · Gemini (text, vision, audio) · Google Sheets',
      } as Project,
      duendes: {
        name: 'Duendes Perú', tag: 'e-commerce + content automation',
        problem: 'a handmade-goods brand needed an online store and a way to manage a growing catalog without touching code.',
        lead: "I ran this client's whole digital operation: a custom store, a catalog bot, and a daily content automation.",
        groups: [
          { label: 'Store + catalog bot:', bullets: [
            'Custom Shopify storefront, with checkout through WhatsApp.',
            'A Telegram bot that manages the catalog end to end: add a product, edit its price or stock, activate or deactivate it, and list or search what\'s in the store.',
            'Mark an item as "sold outside the store" so stock stays accurate.',
            'Automatic sale notifications — the bot tells the owner the moment something sells (via webhook).',
            'Turns a product photo into a finished listing: GPT-4o mini reads each photo and auto-writes its description.',
            'I also used Claude Code to push changes straight to the live store.',
          ] },
          { label: 'Daily content automation (Oráculo):', bullets: [
            'An automated daily message the brand sends its community every morning on Telegram — generated and delivered with no one lifting a finger.',
            'Two scheduled automations: one prepares the content at 3am, another sends it at 9am.',
            'Generates a personalized daily reading with AI (Gemini) on top of a structured data table.',
          ] },
        ],
        result: 'they manage their whole catalog in minutes from their phone — and the community gets a daily message automatically, every day.',
        stack: 'Shopify Admin API · Telegram · GPT-4o mini · Gemini · n8n · Claude Code',
      } as Project,
    },
  },
  es: {
    nav: { work: 'Proyectos', contact: 'Contacto' },
    fullscreen: '⤢ Pantalla completa',
    hero: {
      eyebrow: 'Ingeniero de Automatización con IA',
      h1a: 'Construyo sistemas de IA que ', h1b: 'operan negocios reales.',
      sub: 'Bots de WhatsApp y Telegram, flujos con agentes y dashboards en vivo — de punta a punta.',
      demo: '▶ Ver demo en vivo',
    },
    about: {
      eyebrow: 'Perfil',
      text: 'Antes de la IA, pasé más de 6 años en hotelería y A&B en EE. UU. y Colombia, y luego trabajé como analista de datos de negocio — Python, BigQuery y Data Studio (antes Looker Studio). Esa mezcla —operación real + datos + automatización con IA— me permite entender un problema de negocio y construir la solución yo mismo, de punta a punta y metido en el terreno. Hoy construyo flujos con agentes en producción; voy camino a sistemas autónomos multiagente.',
    },
    work: { eyebrow: 'Proyectos seleccionados', heading: 'Sistemas en producción.' },
    lbl: { problem: 'El problema: ', built: 'Lo que construí — ', result: 'Resultado — ', featured: 'Demo en vivo' },
    tools: 'Herramientas',
    contact: { eyebrow: 'Contacto', line: 'La forma más rápida de contactarme es por correo o LinkedIn. Suelo responder el mismo día.' },
    caps: {
      lbDash: 'Tablero de pedidos en vivo — demo interactivo (clave de acceso: 1111)',
      lbWf: 'Bot de pedidos en n8n — pedido en lenguaje natural, geocodificación y costo de domicilio por distancia',
      lbWa1: 'Pedido en lenguaje natural por WhatsApp',
      lbWa2: 'Despacho, solicitud de reseña y promos — automatizado',
      ttDash: 'Tablero de analítica en vivo — demo interactivo',
      ttWf: 'Un solo flujo en n8n, 83 nodos — ventas, gastos, caja y entrada multimodal',
      ttVenta: 'Registro de una venta en lenguaje natural',
      ttGasto: 'Gasto desde la foto de una factura — Gemini Vision',
      duStore: 'Tienda Shopify a la medida, hecha con Claude Code',
      duVideo: 'El bot de catálogo en acción — un producto publicado en menos de un minuto',
      duOraculo: 'Automatización de contenido diario — el mensaje que se entrega cada mañana',
    },
    projects: {
      labraza: {
        name: 'La Braza', tag: 'restaurante · Perú', featured: true,
        problem: 'en horas pico perdían pedidos, atendiendo WhatsApp a mano en dos teléfonos.',
        lead: 'un sistema completo de pedidos por WhatsApp que maneja el flujo del pedido solo, más un tablero en vivo para la cocina. En palabras simples, hace todo lo que antes se hacía a mano:',
        bullets: [
          'Toma el pedido completo por WhatsApp solo: muestra el menú, arma el pedido, pregunta domicilio o recogida, captura la dirección, calcula el costo del domicilio según la distancia real (Google Maps), toma el método de pago y confirma.',
          'Lee el comprobante de pago (Yape) y las facturas de proveedores automáticamente (Gemini Vision) — y un clasificador inteligente de imágenes distingue un comprobante de pago de una foto de gasto, para que nada se archive mal.',
          'Tablero de cocina en vivo: cada pedido nuevo aparece al instante, con su estado (nuevo → preparando → listo → en camino → entregado).',
          'Mantiene al cliente informado automáticamente ("en preparación", "en camino").',
          'Limpia solo los pedidos abandonados o incompletos, para que el tablero quede siempre exacto.',
          'Notifica el despacho y registra cada pedido en una hoja compartida.',
          'Dos horas después de la entrega, le pide automáticamente al cliente una reseña en Google.',
          'Le envía al dueño un resumen automático del día.',
        ],
        note: 'Hecho como un sistema de 5 partes (130+ pasos), que maneja 100+ pedidos al día.',
        result: 'dejaron de perder pedidos en las horas pico.',
        stack: 'n8n · WhatsApp Cloud API · Gemini Vision · Google Maps · Supabase',
      } as Project,
      tiotoro: {
        name: 'Tío Toro', tag: 'restaurante · Bogotá', featured: true,
        problem: 'el dueño llevaba ventas, gastos y caja a mano en hojas sueltas — sin tiempo, sin un POS costoso.',
        lead: 'un solo asistente de WhatsApp que maneja todo el back office. El equipo simplemente le escribe, y él lleva las cuentas:',
        bullets: [
          'Registra gastos de tres formas: por texto, por nota de voz, o por foto de la factura (Gemini Vision lee la factura y saca los montos).',
          'Registra ventas de mesa (en el local) — el pedido y el total de cada mesa.',
          'Registra ventas de domicilio.',
          'Maneja pagos divididos (una cuenta pagada en partes o por distintos métodos).',
          'Lleva la caja completa: apertura, retiros de efectivo durante el día y cuadre de cierre.',
          'Sincroniza todo automáticamente a Google Sheets.',
          'Un tablero en vivo lo convierte en números claros: ingresos del día, gastos y efectivo en caja.',
        ],
        note: 'Hecho como un solo flujo de 83 pasos.',
        result: 'por primera vez el dueño sabe exactamente cuánto produce el negocio cada día — sin cuadernos, sin digitar a mano.',
        stack: 'n8n · WhatsApp Cloud API · Gemini (texto, visión, audio) · Google Sheets',
      } as Project,
      duendes: {
        name: 'Duendes Perú', tag: 'e-commerce + automatización de contenido',
        problem: 'una marca de productos hechos a mano necesitaba una tienda en línea y una forma de manejar un catálogo creciente sin tocar código.',
        lead: 'le manejé toda la operación digital a este cliente: una tienda a la medida, un bot de catálogo y una automatización de contenido diario.',
        groups: [
          { label: 'Tienda + bot de catálogo:', bullets: [
            'Tienda Shopify a la medida, con checkout por WhatsApp.',
            'Un bot de Telegram que maneja el catálogo de punta a punta: agregar un producto, editar precio o stock, activarlo o desactivarlo, y listar o buscar lo que hay en la tienda.',
            'Marcar un artículo como "vendido fuera de la tienda" para que el stock quede exacto.',
            'Notificaciones de venta automáticas — el bot le avisa al dueño en el momento en que algo se vende (vía webhook).',
            'Convierte la foto de un producto en una publicación lista: usé GPT-4o mini para leer cada foto y escribir su descripción automáticamente.',
            'También usé Claude Code para subir cambios directo a la tienda en vivo.',
          ] },
          { label: 'Automatización de contenido diario (Oráculo):', bullets: [
            'Un mensaje diario automático que la marca le envía a su comunidad cada mañana por Telegram — generado y entregado sin que nadie mueva un dedo.',
            'Dos automatizaciones programadas: una prepara el contenido a las 3am, otra lo envía a las 9am.',
            'Genera una lectura diaria personalizada con IA (Gemini) sobre una tabla de datos estructurada.',
          ] },
        ],
        result: 'manejan todo su catálogo en minutos desde el teléfono — y la comunidad recibe un mensaje diario automáticamente, todos los días.',
        stack: 'Shopify Admin API · Telegram · GPT-4o mini · Gemini · n8n · Claude Code',
      } as Project,
    },
  },
};

const EMAIL = 'tomas-mj@hotmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/tomasemiliomunozdigital/';
const GITHUB = 'https://github.com/tomasmj503';
const DEMO_TIOTORO = 'https://jutilabs.com/demos/panel.html';
const DEMO_LABRAZA = '/demos/labraza.html';
const HERO_STACK = ['n8n', 'WhatsApp Cloud API', 'Claude & Claude Code', 'Gemini', 'Supabase', 'Vercel', 'TypeScript'];
const TOOLS = ['Claude / Claude Code', 'n8n', 'WhatsApp Cloud API', 'Telegram', 'Gemini Vision', 'GPT-4o mini', 'Google Maps', 'Supabase', 'Google Sheets', 'TypeScript', 'Vercel'];

// ─────────────────────────────────────────────────────────────
//  Reveal
// ─────────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: {
  children: React.ReactNode; className?: string; delay?: number;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref as React.RefObject<any>} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</Tag>
  );
}

const Caption = ({ children }: { children: React.ReactNode }) =>
  <p className="mt-2 text-center text-xs text-white/40">{children}</p>;

function Wide({ src, alt, onZoom, caption }: { src: string; alt: string; onZoom: Zoom; caption?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure>
      {failed ? (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-white/10 bg-panel text-sm text-white/30">{alt}</div>
      ) : (
        <button type="button" onClick={() => onZoom(src, alt)} aria-label={alt}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-panel p-2 transition hover:border-white/25">
          <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)}
            className="mx-auto h-auto w-full rounded-md object-contain" />
        </button>
      )}
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

function Phone({ src, alt, onZoom, caption, maxW = 'max-w-[330px]' }: { src: string; alt: string; onZoom: Zoom; caption?: string; maxW?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`mx-auto w-full ${maxW}`}>
      {failed ? (
        <div className="flex aspect-[9/19] w-full items-center justify-center rounded-[2rem] border border-white/10 bg-panel text-sm text-white/30">{alt}</div>
      ) : (
        <button type="button" onClick={() => onZoom(src, alt)} aria-label={alt}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-[2rem] border-[6px] border-[#16181d] bg-[#16181d] shadow-2xl ring-1 ring-white/10 transition hover:ring-white/25">
          <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className="block w-full rounded-[1.4rem]" />
        </button>
      )}
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

function BrowserFrame({ url, fullscreenHref, fullscreenLabel, children }: { url: string; fullscreenHref: string; fullscreenLabel: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08080a] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 truncate text-[11px] text-white/40">{url}</span>
        <a href={fullscreenHref} target="_blank" rel="noreferrer" className="ml-auto whitespace-nowrap text-[11px] font-semibold text-amber hover:underline">{fullscreenLabel}</a>
      </div>
      {children}
    </div>
  );
}

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

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((b) => (
        <li key={b} className="flex gap-3 leading-relaxed text-white/70">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber/70" /><span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ p, lbl, children }: { p: Project; lbl: any; children: React.ReactNode }) {
  return (
    <Reveal as="article">
      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{p.name}</h3>
        <span className="text-sm font-medium text-white/40">{p.tag}</span>
        {p.featured && <span className="rounded-full border border-amber/30 bg-amber/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber">{lbl.featured}</span>}
      </div>
      <div className="max-w-3xl space-y-5">
        {p.problem && <p className="leading-relaxed text-white/70"><span className="font-semibold text-white/90">{lbl.problem}</span>{p.problem}</p>}
        <div className="space-y-4">
          <p className="leading-relaxed text-white/80"><span className="font-semibold text-white">{lbl.built}</span>{p.lead}</p>
          {p.bullets && <Bullets items={p.bullets} />}
          {p.groups && p.groups.map((g) => (
            <div key={g.label} className="space-y-2.5">
              <p className="text-sm font-semibold italic text-amber/90">{g.label}</p>
              <Bullets items={g.bullets} />
            </div>
          ))}
        </div>
        {p.note && <p className="text-sm text-white/45">{p.note}</p>}
        <p className="leading-relaxed"><span className="font-semibold text-white/90">{lbl.result}</span><span className="text-white/90">{p.result}</span></p>
        <p className="text-sm text-white/50">{p.stack}</p>
      </div>
      <div className="mt-12">{children}</div>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────────────
//  Language init
// ─────────────────────────────────────────────────────────────
function initLang(): Lang {
  try {
    const u = new URLSearchParams(window.location.search).get('lang');
    if (u === 'es' || u === 'en') return u;
    const s = localStorage.getItem('lang');
    if (s === 'es' || s === 'en') return s;
  } catch (_) { /* ignore */ }
  return 'en';
}

// ─────────────────────────────────────────────────────────────
//  App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [lang, setLang] = useState<Lang>(initLang);
  const zoom: Zoom = (src, alt) => setLightbox({ src, alt });

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('lang', lang); } catch (_) { /* ignore */ }
  }, [lang]);

  const t = C[lang];
  const P = t.projects;
  const cap = t.caps;

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight text-white">Tomás Muñoz</a>
          <nav className="flex items-center gap-4 text-sm text-white/60 sm:gap-5">
            <a href="#work" className="transition-colors hover:text-white">{t.nav.work}</a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="hidden transition-colors hover:text-white sm:inline">GitHub</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" className="hidden transition-colors hover:text-white sm:inline">LinkedIn</a>
            <a href="#contact" className="rounded-lg border border-white/15 px-3 py-1.5 font-medium text-white transition-colors hover:border-amber hover:text-amber">{t.nav.contact}</a>
            <div className="flex items-center gap-1 pl-1 text-sm font-semibold" role="group" aria-label="Language">
              <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                className={lang === 'en' ? 'text-amber' : 'text-white/40 hover:text-white'}>EN</button>
              <span className="text-white/25">|</span>
              <button type="button" onClick={() => setLang('es')} aria-pressed={lang === 'es'}
                className={lang === 'es' ? 'text-amber' : 'text-white/40 hover:text-white'}>ES</button>
            </div>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-content px-5 md:px-8">
        {/* HERO */}
        <section className="pt-20 pb-16 md:pt-32 md:pb-24">
          <Reveal>
            <Eyebrow>{t.hero.eyebrow}</Eyebrow>
            <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
              {t.hero.h1a}<span className="text-amber">{t.hero.h1b}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{t.hero.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={DEMO_TIOTORO} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-3 text-sm font-bold text-ink shadow-[0_8px_30px_-8px_rgba(255,191,0,0.5)] transition hover:bg-amber/90">{t.hero.demo}</a>
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
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/40">{t.about.eyebrow}</h2>
            <p className="max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">{t.about.text}</p>
          </Reveal>
        </section>

        {/* WORK */}
        <section id="work" className="border-t border-white/10 py-16 md:py-24">
          <Reveal className="mb-14 md:mb-20">
            <Eyebrow>{t.work.eyebrow}</Eyebrow>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.work.heading}</h2>
          </Reveal>

          <div className="space-y-24 md:space-y-36">
            {/* LA BRAZA */}
            <ProjectCard p={P.labraza} lbl={t.lbl}>
              <div className="space-y-10">
                <div>
                  <BrowserFrame url="panel.labraza.com · demo" fullscreenHref={DEMO_LABRAZA} fullscreenLabel={t.fullscreen}>
                    <iframe src={DEMO_LABRAZA} title="La Braza — demo" loading="lazy" className="block h-[440px] w-full md:h-[620px]" style={{ border: 0 }} />
                  </BrowserFrame>
                  <Caption>{cap.lbDash}</Caption>
                </div>
                <Wide src="/img/labraza/workflow.png" alt="La Braza — n8n workflow" onZoom={zoom} caption={cap.lbWf} />
                <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
                  <Phone src="/img/labraza/whatsapp-1.png" alt="La Braza — chat 1" onZoom={zoom} caption={cap.lbWa1} />
                  <Phone src="/img/labraza/whatsapp-2.png" alt="La Braza — chat 2" onZoom={zoom} caption={cap.lbWa2} />
                </div>
              </div>
            </ProjectCard>

            {/* TÍO TORO */}
            <ProjectCard p={P.tiotoro} lbl={t.lbl}>
              <div className="space-y-10">
                <div>
                  <BrowserFrame url="panel.jutilabs.com" fullscreenHref={DEMO_TIOTORO} fullscreenLabel={t.fullscreen}>
                    <iframe src={DEMO_TIOTORO} title="Tío Toro — dashboard" loading="lazy" className="block h-[440px] w-full md:h-[620px]" style={{ border: 0 }} />
                  </BrowserFrame>
                  <Caption>{cap.ttDash}</Caption>
                </div>
                <Wide src="/img/tio-toro/workflow.png" alt="Tío Toro — 83-node workflow" onZoom={zoom} caption={cap.ttWf} />
                <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
                  <Phone src="/img/tio-toro/whatsapp-venta.png" alt="Tío Toro — venta" onZoom={zoom} caption={cap.ttVenta} maxW="max-w-[300px]" />
                  <Phone src="/img/tio-toro/whatsapp-gasto.png" alt="Tío Toro — gasto" onZoom={zoom} caption={cap.ttGasto} maxW="max-w-[300px]" />
                </div>
              </div>
            </ProjectCard>

            {/* DUENDES */}
            <ProjectCard p={P.duendes} lbl={t.lbl}>
              <div className="space-y-10">
                <Wide src="/img/duendes/store.png" alt="Duendes Perú — Shopify storefront" onZoom={zoom} caption={cap.duStore} />
                <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
                  <figure className="mx-auto w-full max-w-[330px]">
                    <div className="overflow-hidden rounded-[2rem] border-[6px] border-[#16181d] bg-[#16181d] shadow-2xl ring-1 ring-white/10">
                      <video controls playsInline preload="metadata" className="block w-full rounded-[1.4rem]">
                        <source src="/media/duendesperu.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <Caption>{cap.duVideo}</Caption>
                  </figure>
                  <Phone src="/img/duendes/telegram.png" alt="Duendes Perú — Telegram (Oráculo)" onZoom={zoom} caption={cap.duOraculo} />
                </div>
              </div>
            </ProjectCard>
          </div>
        </section>

        {/* TOOLS */}
        <section className="border-t border-white/10 py-16 md:py-24">
          <Reveal>
            <Eyebrow>{t.tools}</Eyebrow>
            <div className="flex flex-wrap gap-2.5">{TOOLS.map((tool) => <Chip key={tool}>{tool}</Chip>)}</div>
          </Reveal>
        </section>
      </main>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="border-t border-white/10">
        <div className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <Eyebrow>{t.contact.eyebrow}</Eyebrow>
            <p className="max-w-2xl text-xl font-medium leading-snug text-white sm:text-2xl">{t.contact.line}</p>
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
