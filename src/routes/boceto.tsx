import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { DesignEditor } from "@/components/editor/DesignEditor";
import { FORMATS, type FormatKey } from "@/lib/editor";

export const Route = createFileRoute("/boceto")({
  validateSearch: (s: Record<string, unknown>): { id?: string; template?: string; blank?: FormatKey } => ({
    ...(typeof s["id"] === "string" ? { id: s["id"] } : {}),
    ...(typeof s["template"] === "string" ? { template: s["template"] } : {}),
    ...(typeof s["blank"] === "string" && s["blank"] in FORMATS ? { blank: s["blank"] as FormatKey } : {}),
  }),
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
  const { id, template, blank } = Route.useSearch();
  return (
    <>
      <ClientOnly fallback={<p className="p-12 text-center text-muted-foreground">Cargando editor…</p>}>
        <DesignEditor key={id ?? template ?? blank ?? "new"} designId={id} templateName={template} blankFormat={blank} />
      </ClientOnly>
    </>
  );
}
