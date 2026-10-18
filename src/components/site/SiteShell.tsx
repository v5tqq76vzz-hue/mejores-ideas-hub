import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/logo-dmd.png.asset.json";
import { useCart } from "@/lib/cart";
import { whatsapp } from "@/lib/catalog";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/paquetes", label: "Paquetes" },
  { to: "/dominios", label: "Dominios" },
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 md:flex md:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={logo.url} alt="DMD" className="h-9 w-9 shrink-0 rounded-lg object-contain" />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-sm font-bold">Digital Majfa Dreams</div>
            <div className="truncate text-xs text-muted-foreground">Agencia digital</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/servicios" className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant">
            Cotizar
            {items.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-accent-foreground">{items.length}</span>}
          </Link>
          <button aria-label="Menú" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border md:hidden">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background px-5 py-3 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-medium">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold">Digital Majfa Dreams</div>
          <p className="mt-3 text-sm opacity-70">Desarrollo web, identidad corporativa y diseño para empresas y comercios en México.</p>
        </div>
        <div className="text-sm opacity-80">
          <div className="font-semibold opacity-100">Contacto</div>
          <p className="mt-3">Jocotitlán, Estado de México</p>
          <p>Lunes a sábado · 9:00 – 19:00</p>
        </div>
        <div className="flex flex-col gap-2 text-sm opacity-80">
          <Link to="/servicios">Servicios</Link>
          <Link to="/paquetes">Paquetes</Link>
          <Link to="/dominios">Dominios</Link>
          <Link to="/politica-cookies">Política de cookies</Link>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-5 text-center text-xs opacity-60">© {new Date().getFullYear()} DMD · Todos los derechos reservados</div>
    </footer>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(!localStorage.getItem("dmd_cookies")), []);
  if (!show) return null;
  const decide = (v: string) => { localStorage.setItem("dmd_cookies", v); setShow(false); };
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-lg rounded-2xl border bg-card p-4 shadow-card md:bottom-6">
      <p className="text-sm">Usamos cookies para guardar tu cotización y mejorar el sitio. <Link to="/politica-cookies" className="font-semibold text-primary underline">Más información</Link></p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => decide("ok")} className="flex-1 rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground">Aceptar</button>
        <button onClick={() => decide("no")} className="flex-1 rounded-full border py-2 text-sm font-semibold">Solo necesarias</button>
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <a href={whatsapp("Hola DMD, quiero asesoría para mi negocio")} target="_blank" rel="noreferrer" aria-label="WhatsApp"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-success text-2xl shadow-elegant md:bottom-6">💬</a>
      <CookieBanner />
    </div>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="bg-hero">
      <div className="mx-auto max-w-4xl px-5 pb-12 pt-16 text-center md:pt-24">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</span>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">{title}</h1>
        {children && <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{children}</p>}
      </div>
    </section>
  );
}
