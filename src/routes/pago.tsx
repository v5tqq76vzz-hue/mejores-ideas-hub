import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/SiteShell";
import { mxn, quoteTotals, whatsapp, PROMO_CODE } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/pago")({
  head: () => ({
    meta: [
      { title: "Confirmar pedido y pago | DMD" },
      { name: "description", content: "Revisa tu cotización, deja tus datos y aparta tu proyecto con el 50% de anticipo." },
      { property: "og:title", content: "Confirma tu pedido | Digital Majfa Dreams" },
      { property: "og:description", content: "Aparta tu proyecto con el 50% de anticipo." },
    ],
  }),
  component: Pago,
});

function Pago() {
  const cart = useCart();
  const [promo, setPromo] = useState(false);
  const [code, setCode] = useState("");
  const [c, setC] = useState({ nombre: "", tel: "", correo: "", metodo: "Transferencia" });
  const t = quoteTotals(cart.items.map((i) => i.price), promo);
  const ready = cart.items.length > 0 && c.nombre.trim() && c.tel.trim().length >= 10;
  const msg = `Hola DMD, quiero confirmar mi pedido:\n${cart.items.map((i) => `• ${i.name} – ${mxn(i.price)}`).join("\n")}\n${promo ? `Descuento ${PROMO_CODE}: -${mxn(t.discount)}\n` : ""}Total: ${mxn(t.total)}\nAnticipo 50%: ${mxn(t.deposit)}\nPago por: ${c.metodo}\n\nNombre: ${c.nombre}\nTeléfono: ${c.tel}\nCorreo: ${c.correo || "-"}`;
  const field = "w-full rounded-xl border bg-background px-4 py-3";

  if (cart.items.length === 0) {
    return (
      <>
        <PageHero eyebrow="Pago" title="Tu cotización está vacía" />
        <div className="text-center"><Link to="/servicios" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Elegir servicios</Link></div>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Último paso" title="Confirma tu pedido">Aparta tu proyecto con el 50% y liquida al aprobar.</PageHero>
      <div className="mx-auto grid max-w-5xl gap-8 px-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="space-y-3 rounded-3xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">Tus datos</h2>
            <input className={field} placeholder="Nombre o empresa *" value={c.nombre} onChange={(e) => setC({ ...c, nombre: e.target.value })} maxLength={80} />
            <input className={field} placeholder="Teléfono (10 dígitos) *" inputMode="tel" value={c.tel} onChange={(e) => setC({ ...c, tel: e.target.value.replace(/[^0-9 ]/g, "") })} maxLength={14} />
            <input className={field} placeholder="Correo (opcional)" type="email" value={c.correo} onChange={(e) => setC({ ...c, correo: e.target.value })} maxLength={120} />
          </section>
          <section className="rounded-3xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold">¿Cómo quieres pagar?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Transferencia", "Depósito en efectivo"].map((m) => (
                <button key={m} onClick={() => setC({ ...c, metodo: m })} className={`rounded-xl border p-4 text-left font-semibold ${c.metodo === m ? "border-primary bg-secondary" : ""}`}>{m === "Transferencia" ? "🏦" : "💵"} {m}</button>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground">Al confirmar te enviamos por WhatsApp los datos para pagar tu anticipo.</p>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <h3 className="text-lg font-bold">Resumen</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="min-w-0">{i.name}</span>
                <span className="shrink-0 font-semibold">{mxn(i.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código promocional" className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2 text-sm" />
            <button onClick={() => setPromo(code.trim().toUpperCase() === PROMO_CODE)} className="rounded-full border px-4 text-sm font-semibold">Aplicar</button>
          </div>
          <dl className="mt-4 space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{mxn(t.subtotal)}</dd></div>
            {promo && <div className="flex justify-between text-success"><dt>Descuento 10%</dt><dd>-{mxn(t.discount)}</dd></div>}
            <div className="flex justify-between pt-2 text-lg font-bold"><dt>Total</dt><dd>{mxn(t.total)}</dd></div>
            <div className="flex justify-between font-semibold text-primary"><dt>Anticipo hoy</dt><dd>{mxn(t.deposit)}</dd></div>
          </dl>
          <a href={ready ? whatsapp(msg) : undefined} target="_blank" rel="noreferrer" aria-disabled={!ready}
            className={`mt-5 block rounded-full bg-success py-3 text-center font-semibold text-primary-foreground ${ready ? "" : "pointer-events-none opacity-50"}`}>
            Confirmar pedido por WhatsApp
          </a>
          {!ready && <p className="mt-2 text-center text-xs text-muted-foreground">Escribe tu nombre y teléfono para continuar.</p>}
        </aside>
      </div>
    </>
  );
}
