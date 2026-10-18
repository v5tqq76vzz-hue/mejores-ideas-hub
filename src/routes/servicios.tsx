import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/SiteShell";
import { services, packs, mxn, quoteTotals, PROMO_CODE, whatsapp, servicePages, type ServicePageId } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios y cotizador en vivo | DMD" },
      { name: "description", content: "Arma tu cotización de página web, logotipo, tarjetas, banners y dominios con precio al instante." },
      { property: "og:title", content: "Cotizador en vivo | Digital Majfa Dreams" },
      { property: "og:description", content: "Elige tus servicios y conoce tu inversión y anticipo del 50% al momento." },
    ],
  }),
  component: Servicios,
});

const filters = [
  { k: "all", l: "Todos" }, { k: "web", l: "Web" }, { k: "marca", l: "Marca" }, { k: "redes", l: "Redes" }, { k: "dominio", l: "Dominios" },
] as const;

function Servicios() {
  const cart = useCart();
  const [f, setF] = useState<string>("all");
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState(false);
  const t = quoteTotals(cart.items.map((i) => i.price), promo);
  const list = services.filter((s) => f === "all" || s.group === f);
  const msg = `Hola DMD, quiero cotizar:\n${cart.items.map((i) => `• ${i.name} – ${mxn(i.price)}`).join("\n")}\nTotal: ${mxn(t.total)}`;

  return (
    <>
      <PageHero eyebrow="Cotizador en tiempo real" title="Arma tu cotización a la medida">
        Agrega servicios o paquetes y ve tu inversión y anticipo al instante.
      </PageHero>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((x) => (
              <button key={x.k} onClick={() => setF(x.k)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${f === x.k ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{x.l}</button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {list.map((s) => {
              const added = cart.has(s.id);
              return (
                <div key={s.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
                  <div className="text-3xl">{s.icon}</div>
                  <div className="mt-3 font-display font-bold">{s.name}</div>
                  {s.id in servicePages && <Link to={servicePages[s.id as ServicePageId]} className="text-xs font-semibold text-primary">Ver detalles y opciones →</Link>}
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="font-bold text-primary">{mxn(s.price)}{s.unit && <small className="font-normal text-muted-foreground"> / {s.unit}</small>}</span>
                    <button onClick={() => added ? cart.remove(s.id) : cart.add({ id: s.id, name: s.name, price: s.price })}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${added ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
                      {added ? "✓ Agregado" : "+ Agregar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {f === "all" && (
            <>
              <h2 className="mt-12 text-2xl font-bold">Paquetes</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {packs.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-card">
                    <div className="min-w-0"><div className="font-bold">{p.name}</div><div className="text-sm text-primary">{mxn(p.price)} / {p.unit}</div></div>
                    <button onClick={() => cart.has(p.id) ? cart.remove(p.id) : cart.add({ id: p.id, name: p.name, price: p.price })}
                      className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold">{cart.has(p.id) ? "✓" : "+ Agregar"}</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="h-fit rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Tu selección</h3>
            {cart.items.length > 0 && <button onClick={cart.clear} className="text-xs text-muted-foreground underline">Vaciar</button>}
          </div>
          {cart.items.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Aún no has agregado servicios.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {cart.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-2"><span className="min-w-0 truncate">{i.name}</span><span className="shrink-0 font-semibold">{mxn(i.price)}</span></li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código promocional" className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2 text-sm" />
            <button onClick={() => setPromo(code.trim().toUpperCase() === PROMO_CODE)} className="rounded-full border px-4 text-sm font-semibold">Aplicar</button>
          </div>
          <dl className="mt-5 space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{mxn(t.subtotal)}</dd></div>
            {promo && <div className="flex justify-between text-success"><dt>Descuento 10%</dt><dd>-{mxn(t.discount)}</dd></div>}
            <div className="flex justify-between pt-2 text-lg font-bold"><dt>Total</dt><dd>{mxn(t.total)}</dd></div>
            <div className="flex justify-between text-primary"><dt>Anticipo 50%</dt><dd className="font-semibold">{mxn(t.deposit)}</dd></div>
          </dl>
          <Link to="/pago" className={`mt-5 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground shadow-elegant ${cart.items.length ? "" : "pointer-events-none opacity-50"}`}>
            Confirmar pedido →
          </Link>
          <a href={whatsapp(msg)} target="_blank" rel="noreferrer"
            className={`mt-5 block rounded-full bg-success py-3 text-center font-semibold text-primary-foreground ${cart.items.length ? "" : "pointer-events-none opacity-50"}`}>
            Enviar cotización por WhatsApp
          </a>
        </aside>
      </div>
    </>
  );
}
