import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/SiteShell";

export const Route = createFileRoute("/politica-cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies | Digital Majfa Dreams" },
      { name: "description", content: "Cómo usamos las cookies y el almacenamiento local en el sitio de DMD." },
      { property: "og:title", content: "Política de cookies | DMD" },
      { property: "og:description", content: "Información sobre cookies en Digital Majfa Dreams." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Política de cookies" />
      <article className="mx-auto max-w-2xl space-y-5 px-5 text-muted-foreground">
        <p>Usamos almacenamiento local de tu navegador para recordar tu cotización y tu decisión sobre cookies.</p>
        <h2 className="text-xl font-bold text-foreground">Cookies necesarias</h2>
        <p>Permiten que el cotizador funcione. No se pueden desactivar.</p>
        <h2 className="text-xl font-bold text-foreground">Tu control</h2>
        <p>Puedes borrar estos datos en cualquier momento desde la configuración de tu navegador.</p>
      </article>
    </>
  ),
});
