import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { details, configuredPrice, type Detail } from "@/lib/service-details";
import { services, mxn, whatsapp } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function serviceHead(slug: Detail["slug"]) {
  const d = details[slug];
  const price = services.find((s) => s.id === slug)!.price;
  const title = `${d.title} desde ${mxn(price)} | DMD`;
  return {
    meta: [
      { title },
      { name: "description", content: d.intro },
      { property: "og:title", content: title },
      { property: "og:description", content: d.intro },
    ],
  };
}

export function ServicePage({ slug }: { slug: Detail["slug"] }) {
  const d = details[slug];
  const svc = services.find((s) => s.id === slug)!;
  const cart = useCart();
  const [level, setLevel] = useState(d.levels?.[0]);
  const [picked, setPicked] = useState<string[]>([]);
  const base = level?.price ?? svc.price;
  const chosen = d.extras.filter((e) => picked.includes(e.id));
  const total = configuredPrice(base, chosen.map((e) => e.price));
  const label = [d.title, level?.name, ...chosen.map((e) => e.name)].filter(Boolean).join(" + ");
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 md:pt-16">
          <nav className="text-xs text-muted-foreground"><Link to="/">Inicio</Link> / <Link to="/servicios">Servicios</Link> / {d.title}</nav>
          <span className="mt-6 block text-xs font-bold uppercase tracking-[0.2em] text-primary">{d.eyebrow}</span>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{d.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{d.intro}</p>
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-sm text-muted-foreground">Desde</span>
            <span className="font-display text-4xl font-extrabold text-primary">{mxn(svc.price)}</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">⏱ {d.time}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold">¿Qué incluye?</h2>
            <p className="mt-1 text-sm text-muted-foreground">{d.base}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {d.includes.map((i) => (
                <li key={i} className="flex gap-3 rounded-2xl border bg-card p-4 shadow-card"><span className="text-success">✓</span><span className="text-sm">{i}</span></li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
            <div className="mt-4 space-y-3">
              {d.faq.map((f) => (
                <details key={f.q} className="rounded-2xl border bg-card p-4">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <h3 className="text-lg font-bold">Personaliza tu servicio</h3>
          {d.levels && (
            <div className="mt-4 space-y-2">
              {d.levels.map((l) => (
                <button key={l.id} onClick={() => setLevel(l)}
                  className={`flex w-full justify-between gap-2 rounded-xl border p-3 text-left text-sm ${level?.id === l.id ? "border-primary bg-secondary" : ""}`}>
                  <span>{l.name}</span><span className="shrink-0 font-semibold">{mxn(l.price)}</span>
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 space-y-2">
            {d.extras.map((e) => {
              const on = picked.includes(e.id);
              return (
                <button key={e.id} onClick={() => toggle(e.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left ${on ? "border-primary bg-secondary" : ""}`}>
                  <span className="text-xl">{e.icon}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{e.name}</span><span className="block text-xs text-muted-foreground">{e.desc}</span></span>
                  <span className="shrink-0 text-sm font-semibold text-primary">+${e.price}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 border-t pt-4">
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{mxn(total)}</span></div>
            <div className="flex justify-between text-sm text-primary"><span>Anticipo 50%</span><span>{mxn(Math.round(total / 2))}</span></div>
          </div>
          <button onClick={() => cart.add({ id: `${slug}-${level?.id ?? ""}-${picked.sort().join("-")}`, name: label, price: total })}
            className="mt-5 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-elegant">Agregar a cotización</button>
          <Link to="/servicios" className="mt-2 block py-2 text-center text-sm font-semibold text-primary">Ver mi cotización →</Link>
          <a href={whatsapp(`Hola DMD, me interesa: ${label} (${mxn(total)})`)} target="_blank" rel="noreferrer"
            className="block rounded-full border py-3 text-center text-sm font-semibold">Consultar por WhatsApp</a>
        </aside>
      </div>
    </>
  );
}
