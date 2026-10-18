import { createFileRoute, Link } from "@tanstack/react-router";
import { services, packs, mxn } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Majfa Dreams | Páginas web y marca para tu negocio" },
      { name: "description", content: "Sitios web desde $699 MXN, logotipos desde $250 MXN y paquetes de identidad. Inicia con 50% de anticipo." },
      { property: "og:title", content: "Digital Majfa Dreams | Agencia digital" },
      { property: "og:description", content: "Construimos la presencia digital de tu empresa con precios claros desde $150 MXN." },
    ],
  }),
  component: Index,
});

const stats = [
  { k: "24–72 h", v: "Entrega de diseño" },
  { k: "100%", v: "Adaptado a celular" },
  { k: "50%", v: "Anticipo para iniciar" },
  { k: "$150", v: "Precios desde (MXN)" },
];

const steps = [
  { n: "01", t: "Cotiza en línea", d: "Elige servicios o un paquete y ve el precio al instante." },
  { n: "02", t: "Paga el 50%", d: "Aparta tu proyecto con la mitad y arrancamos de inmediato." },
  { n: "03", t: "Aprueba y recibe", d: "Liquidas solo cuando el resultado te encanta." },
];

function Index() {
  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-[1.1fr_1fr] md:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-success" /> Soluciones digitales para negocios
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] md:text-6xl">
              Tu negocio, <span className="text-gradient">profesional</span> en internet.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Diseñamos páginas web, logotipos e identidad visual con entregas puntuales y precios transparentes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/servicios" className="rounded-full bg-primary px-7 py-4 text-center font-semibold text-primary-foreground shadow-elegant transition hover:-translate-y-0.5">Armar mi cotización →</Link>
              <Link to="/paquetes" className="rounded-full border bg-card px-7 py-4 text-center font-semibold">Ver paquetes</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-brand opacity-20 blur-3xl" />
            <div className="relative rounded-3xl border bg-card p-6 shadow-card">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Más vendido</div>
              <div className="mt-2 font-display text-2xl font-bold">Página Web Profesional</div>
              <div className="mt-1 text-4xl font-extrabold text-primary">{mxn(699)}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {["Lista para celular y computadora", "Botón directo a WhatsApp", "Certificado de seguridad SSL", "Carga ultrarrápida"].map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-success">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/servicios" className="mt-6 block rounded-xl bg-ink py-3 text-center font-semibold text-ink-foreground">Cotizar ahora</Link>
            </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.v} className="bg-card p-5 text-center">
              <div className="font-display text-2xl font-bold">{s.k}</div>
              <div className="text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold md:text-4xl">Servicios</h2>
          <Link to="/servicios" className="shrink-0 text-sm font-semibold text-primary">Ver todos →</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <Link key={s.id} to="/servicios" className="group rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-4 font-display text-lg font-bold">{s.name}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-4 font-semibold text-primary">Desde {mxn(s.price)}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="rounded-3xl bg-ink p-8 text-ink-foreground md:p-14">
          <h2 className="text-3xl font-bold md:text-4xl">Así de fácil trabajamos</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="font-display text-4xl font-extrabold text-primary-glow">{s.n}</div>
                <div className="mt-3 text-lg font-semibold">{s.t}</div>
                <p className="mt-2 text-sm opacity-70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className="text-3xl font-bold md:text-4xl">Paquetes todo en uno</h2>
        <p className="mt-2 text-muted-foreground">Ahorra hasta 25% contratando en paquete.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {packs.map((p) => (
            <Link key={p.id} to="/paquetes" className={`rounded-2xl border p-6 transition hover:-translate-y-1 ${p.featured ? "bg-brand text-primary-foreground shadow-elegant" : "bg-card shadow-card"}`}>
              <div className="font-display font-bold">{p.name}</div>
              <div className="mt-3 text-2xl font-extrabold">{mxn(p.price)}</div>
              <div className="text-xs opacity-70">/ {p.unit}</div>
              <p className="mt-3 text-sm opacity-80">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
