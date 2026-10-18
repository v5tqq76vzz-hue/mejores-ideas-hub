import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { PageHero } from "@/components/site/SiteShell";
import { DesignEditor } from "@/components/editor/DesignEditor";

export const Route = createFileRoute("/boceto")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s["id"] === "string" ? { id: s["id"] } : {}),
  head: () => ({
    meta: [
      { title: "Editor de diseño gratis | DMD" },
      { name: "description", content: "Diseña logos, tarjetas, banners e historias con plantillas, guarda tus bocetos y envíalos a DMD." },
      { property: "og:title", content: "Editor de diseño DMD | Digital Majfa Dreams" },
      { property: "og:description", content: "Plantillas editables para tu marca en un solo editor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Boceto,
});

function Boceto() {
  const { id } = Route.useSearch();
  return (
    <>
      <PageHero eyebrow="Estudio de marca gratis" title="Editor de diseño DMD">
        Elige una plantilla, ajusta medidas, textos y colores. Guarda tu boceto y lo afinamos contigo.
      </PageHero>
      <ClientOnly fallback={<p className="p-12 text-center text-muted-foreground">Cargando editor…</p>}>
        <DesignEditor key={id ?? "new"} designId={id} />
      </ClientOnly>
    </>
  );
}
