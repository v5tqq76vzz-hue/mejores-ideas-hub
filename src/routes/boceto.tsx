import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/SiteShell";
import { whatsapp } from "@/lib/catalog";

export const Route = createFileRoute("/boceto")({
  head: () => ({
    meta: [
      { title: "Diseña tu boceto gratis | DMD" },
      { name: "description", content: "Escribe el nombre de tu negocio, elige colores y ve al instante un boceto de tu marca." },
      { property: "og:title", content: "Estudio de marca gratis | Digital Majfa Dreams" },
      { property: "og:description", content: "Crea un boceto de tu logo, tarjeta o página web en segundos." },
    ],
  }),
  component: Boceto,
});

const colors = ["#0067b8", "#0f766e", "#b91c1c", "#a16207", "#7e22ce", "#111827", "#db2777"];
const kinds = ["Página web", "Logotipo", "Tarjeta"] as const;

function Boceto() {
  const [f, setF] = useState({ name: "", giro: "", slogan: "", color: colors[0], kind: kinds[0] as string });
  const set = (k: keyof typeof f, v: string) => setF({ ...f, [k]: v });
  const name = f.name || "Tu Negocio";
  const msg = `Hola DMD, hice un boceto:\nTipo: ${f.kind}\nNegocio: ${name}\nGiro: ${f.giro || "-"}\nEslogan: ${f.slogan || "-"}\nColor: ${f.color}`;
  const field = "w-full rounded-xl border bg-background px-4 py-3";

  return (
    <>
      <PageHero eyebrow="Estudio de marca gratis" title="Diseña el boceto de tu marca">
        Llena los datos y mira cómo podría verse. Después lo afinamos contigo.
      </PageHero>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex gap-2">
            {kinds.map((k) => (
              <button key={k} onClick={() => set("kind", k)} className={`flex-1 rounded-full py-2 text-sm font-semibold ${f.kind === k ? "bg-primary text-primary-foreground" : "border"}`}>{k}</button>
            ))}
          </div>
          <input className={field} placeholder="Nombre del negocio" value={f.name} onChange={(e) => set("name", e.target.value)} maxLength={40} />
          <input className={field} placeholder="Giro (ej. cafetería, estética)" value={f.giro} onChange={(e) => set("giro", e.target.value)} maxLength={40} />
          <input className={field} placeholder="Eslogan" value={f.slogan} onChange={(e) => set("slogan", e.target.value)} maxLength={60} />
          <div>
            <div className="mb-2 text-sm font-semibold">Color principal</div>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button key={c} aria-label={c} onClick={() => set("color", c)} style={{ background: c }}
                  className={`h-10 w-10 rounded-full ring-offset-2 ${f.color === c ? "ring-2 ring-ring" : ""}`} />
              ))}
            </div>
          </div>
          <a href={whatsapp(msg)} target="_blank" rel="noreferrer" className="block rounded-full bg-success py-3 text-center font-semibold text-primary-foreground">Enviar mi boceto por WhatsApp</a>
        </div>

        <div className="grid place-items-center rounded-3xl border bg-muted p-6">
          {f.kind === "Página web" && (
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="flex items-center justify-between px-4 py-3" style={{ background: f.color }}>
                <span className="font-display font-bold text-primary-foreground">{name}</span>
                <span className="text-xs text-primary-foreground opacity-80">Inicio · Servicios · Contacto</span>
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{f.giro || "Tu giro"}</div>
                <div className="mt-2 font-display text-2xl font-bold">{f.slogan || "Tu eslogan aquí"}</div>
                <div className="mt-4 inline-block rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground" style={{ background: f.color }}>Contáctanos</div>
              </div>
            </div>
          )}
          {f.kind === "Logotipo" && (
            <div className="text-center">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-3xl font-display text-5xl font-extrabold text-primary-foreground shadow-elegant" style={{ background: f.color }}>{name.charAt(0).toUpperCase()}</div>
              <div className="mt-4 font-display text-3xl font-bold" style={{ color: f.color }}>{name}</div>
              <div className="text-sm text-muted-foreground">{f.slogan || f.giro || "Tu eslogan"}</div>
            </div>
          )}
          {f.kind === "Tarjeta" && (
            <div className="flex aspect-[9/5] w-full max-w-sm flex-col justify-between rounded-2xl bg-card p-6 shadow-card" style={{ borderLeft: `10px solid ${f.color}` }}>
              <div className="font-display text-2xl font-bold" style={{ color: f.color }}>{name}</div>
              <div>
                <div className="text-sm font-semibold">{f.giro || "Tu giro"}</div>
                <div className="text-xs text-muted-foreground">{f.slogan || "Tu eslogan"} · 712 205 2904</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
