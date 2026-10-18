import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/SiteShell";
import { packs, mxn, whatsapp } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/paquetes")({
  head: () => ({
    meta: [
      { title: "Paquetes empresariales | Digital Majfa Dreams" },
      { name: "description", content: "Identity Dream Pack, Social Media Pack, Editorial B2B e Iguala mensual con precios preferenciales." },
      { property: "og:title", content: "Paquetes corporativos DMD" },
      { property: "og:description", content: "Soluciones completas de marca, redes y diseño editorial para tu empresa." },
    ],
  }),
  component: Paquetes,
});

function Paquetes() {
  const cart = useCart();
  return (
    <>
      <PageHero eyebrow="Planes llave en mano" title="Paquetes diseñados para crecer">
        Identidad, redes, diseño editorial y soporte continuo con precios preferenciales.
      </PageHero>
      <div className="mx-auto grid max-w-6xl gap-5 px-5 md:grid-cols-2 lg:grid-cols-4">
        {packs.map((p) => (
          <div key={p.id} className={`relative flex flex-col rounded-3xl border p-6 ${p.featured ? "bg-ink text-ink-foreground shadow-elegant" : "bg-card shadow-card"}`}>
            {p.featured && <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">Más solicitado</span>}
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="mt-1 text-sm opacity-70">{p.tagline}</p>
            <div className="mt-5 text-3xl font-extrabold">{mxn(p.price)}</div>
            <div className="text-xs opacity-60">/ {p.unit} · {p.time}</div>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-success">✓</span>{f}</li>)}
            </ul>
            <button onClick={() => cart.add({ id: p.id, name: p.name, price: p.price })}
              className="mt-6 rounded-full bg-primary py-3 font-semibold text-primary-foreground">{cart.has(p.id) ? "✓ En tu cotización" : "Agregar a cotización"}</button>
            <a href={whatsapp(`Hola DMD, me interesa el ${p.name}`)} target="_blank" rel="noreferrer" className="mt-2 py-2 text-center text-sm font-semibold opacity-80">Consultar por WhatsApp</a>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/servicios" className="font-semibold text-primary">Ver mi cotización →</Link>
      </div>
    </>
  );
}
