import { useEffect, useState } from "react";
import { renderToCanvas, type Template } from "@/lib/editor";

export function TemplatePreview({ template }: { template: Template }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    const d = template.make();
    setSrc(renderToCanvas(d, 500 / Math.max(d.w, d.h)).toDataURL("image/png"));
  }, [template]);
  return <div className="studio-preview grid h-52 place-items-center overflow-hidden bg-muted p-5">{src && <img src={src} alt={`Vista previa de ${template.name}`} className="max-h-full max-w-full object-contain shadow-card" />}</div>;
}