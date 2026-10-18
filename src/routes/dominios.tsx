import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/SiteShell";
import { services, mxn, whatsapp } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/dominios")({
  head: () => ({
    meta: [
      { title: "Dominios .COM y .COM.MX | DMD" },
      { name: "description", content: "Registra el dominio oficial de tu negocio con configuración y conexión a tu sitio incluidas." },
      { property: "og:title", content: "Dominios oficiales para tu empresa | DMD" },
      { property: "og:description", content: "Dominios .COM y .COM.MX con DNS y renovación por un año." },
    ],
  }),
  component: Dominios,
});

function Dominios() {
  const cart = useCart();
  const [name, setName] = useState("");
  const clean = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const domains = services.filter((s) => s.group === "dominio");
  return (
    <>
      <PageHero eyebrow="Tu dirección en internet" title="Dominio oficial para tu negocio">
        Escribe el nombre que quieres y te ayudamos a registrarlo y conectarlo.
      </PageHero>
      <div className="mx-auto max-w-2xl px-5">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="minegocio"
          className="w-full rounded-2xl border bg-card px-5 py-4 text-lg shadow-card outline-none focus:ring-2 focus:ring-ring" />
        <div className="mt-6 space-y-3">
          {domains.map((d) => {
            const ext = d.id === "com" ? ".com" : ".com.mx";
            const full = (clean || "minegocio") + ext;
            return (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-card">
                <div className="min-w-0">
                  <div className="truncate font-display text-lg font-bold">{full}</div>
                  <div className="text-sm text-muted-foreground">{mxn(d.price)} / año</div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a href={whatsapp(`Hola DMD, quiero revisar si está disponible ${full}`)} target="_blank" rel="noreferrer" className="hidden rounded-full border px-4 py-2 text-sm font-semibold sm:block">Consultar</a>
                  <button onClick={() => cart.add({ id: d.id, name: `Dominio ${full}`, price: d.price })} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                    {cart.has(d.id) ? "✓" : "Agregar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">La disponibilidad se confirma con un asesor antes del pago.</p>
      </div>
    </>
  );
}
