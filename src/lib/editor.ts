export type ElType = "text" | "rect" | "circle";
export type El = {
  id: string; type: ElType; x: number; y: number; w: number; h: number;
  color: string; text?: string; size?: number; font?: string; bold?: boolean; align?: "left" | "center" | "right";
};
export type Design = { w: number; h: number; bg: string; els: El[] };

export const FORMATS = {
  post: { label: "Post / Logo 1:1", w: 1080, h: 1080 },
  tarjeta: { label: "Tarjeta 9:5", w: 1050, h: 600 },
  banner: { label: "Banner 16:9", w: 1600, h: 900 },
  historia: { label: "Historia 9:16", w: 1080, h: 1920 },
  presentacion: { label: "Presentación 16:9", w: 1920, h: 1080 },
  documento: { label: "Documento A4", w: 794, h: 1123 },
  video: { label: "Portada de video 16:9", w: 1920, h: 1080 },
  sitio: { label: "Maqueta web", w: 1440, h: 1024 },
  pizarra: { label: "Pizarra", w: 1600, h: 1200 },
  flyer: { label: "Flyer vertical", w: 1080, h: 1350 },
  invitacion: { label: "Invitación", w: 1080, h: 1350 },
} as const;
export type FormatKey = keyof typeof FORMATS | "custom";

export const FONTS = ["Montserrat", "Georgia", "Arial", "Courier New", "Impact"];
export const PALETTE = ["#0067b8", "#0f172a", "#ffffff", "#f59e0b", "#16a34a", "#dc2626", "#7e22ce", "#db2777"];

export const uid = () => Math.random().toString(36).slice(2, 9);
const t = (text: string, x: number, y: number, w: number, size: number, color: string, bold = true): El =>
  ({ id: uid(), type: "text", x, y, w, h: size * 1.3, text, size, color, bold, font: "Montserrat", align: "center" });

export type Template = { name: string; cat: string; format: keyof typeof FORMATS; make: () => Design };
export const TEMPLATES: Template[] = [
  { name: "Logo inicial", cat: "Logotipos", format: "post", make: () => ({ w: 1080, h: 1080, bg: "#ffffff", els: [
    { id: uid(), type: "circle", x: 340, y: 220, w: 400, h: 400, color: "#0067b8" },
    t("D", 340, 300, 400, 220, "#ffffff"), t("Tu Negocio", 90, 680, 900, 90, "#0067b8"), t("Tu eslogan aquí", 90, 800, 900, 44, "#475569", false)] }) },
  { name: "Logo minimal", cat: "Logotipos", format: "post", make: () => ({ w: 1080, h: 1080, bg: "#0f172a", els: [
    { id: uid(), type: "rect", x: 140, y: 520, w: 800, h: 8, color: "#f59e0b" },
    t("TU MARCA", 90, 380, 900, 120, "#ffffff"), t("estudio creativo", 90, 570, 900, 48, "#f59e0b", false)] }) },
  { name: "Tarjeta clásica", cat: "Tarjetas", format: "tarjeta", make: () => ({ w: 1050, h: 600, bg: "#ffffff", els: [
    { id: uid(), type: "rect", x: 0, y: 0, w: 40, h: 600, color: "#0067b8" },
    { ...t("Tu Nombre", 100, 150, 850, 72, "#0067b8"), align: "left" },
    { ...t("Puesto · Tu Negocio", 100, 250, 850, 36, "#334155", false), align: "left" },
    { ...t("712 205 2904 · correo@negocio.com", 100, 460, 850, 30, "#64748b", false), align: "left" }] }) },
  { name: "Tarjeta oscura", cat: "Tarjetas", format: "tarjeta", make: () => ({ w: 1050, h: 600, bg: "#0f172a", els: [
    { id: uid(), type: "circle", x: 750, y: -100, w: 450, h: 450, color: "#0067b8" },
    { ...t("TU NEGOCIO", 80, 220, 700, 70, "#ffffff"), align: "left" },
    { ...t("Contacto: 712 205 2904", 80, 330, 700, 32, "#cbd5e1", false), align: "left" }] }) },
  { name: "Banner promo", cat: "Banners", format: "banner", make: () => ({ w: 1600, h: 900, bg: "#0067b8", els: [
    { id: uid(), type: "rect", x: 100, y: 600, w: 520, h: 120, color: "#f59e0b" },
    { ...t("¡GRAN PROMOCIÓN!", 100, 220, 1400, 130, "#ffffff"), align: "left" },
    { ...t("Hasta 30% de descuento esta semana", 100, 420, 1400, 56, "#e0f2fe", false), align: "left" },
    t("Pide el tuyo", 100, 630, 520, 56, "#0f172a")] }) },
  { name: "Portada web", cat: "Banners", format: "banner", make: () => ({ w: 1600, h: 900, bg: "#f8fafc", els: [
    { id: uid(), type: "rect", x: 0, y: 0, w: 1600, h: 110, color: "#0f172a" },
    { ...t("Tu Negocio", 60, 25, 600, 52, "#ffffff"), align: "left" },
    t("Lo que hacemos, bien hecho", 100, 330, 1400, 100, "#0f172a"),
    t("Agenda tu cita hoy", 100, 490, 1400, 50, "#0067b8", false)] }) },
  { name: "Historia oferta", cat: "Identidad / Redes", format: "historia", make: () => ({ w: 1080, h: 1920, bg: "#db2777", els: [
    { id: uid(), type: "circle", x: 190, y: 500, w: 700, h: 700, color: "#ffffff" },
    t("NUEVO", 90, 300, 900, 120, "#ffffff"), t("-20%", 190, 720, 700, 220, "#db2777"), t("Solo hoy", 90, 1400, 900, 80, "#ffffff", false)] }) },
  { name: "Post identidad", cat: "Identidad / Redes", format: "post", make: () => ({ w: 1080, h: 1080, bg: "#f59e0b", els: [
    { id: uid(), type: "rect", x: 80, y: 80, w: 920, h: 920, color: "#ffffff" },
    t("Conoce nuestra marca", 120, 400, 840, 80, "#0f172a"), t("@tunegocio", 120, 600, 840, 50, "#0067b8", false)] }) },
];

export const blank = (w: number, h: number): Design => ({ w, h, bg: "#ffffff", els: [] });

export function duplicateElement(d: Design, id: string): Design {
  const source = d.els.find((el) => el.id === id);
  if (!source) return d;
  return { ...d, els: [...d.els, { ...source, id: uid(), x: source.x + 24, y: source.y + 24 }] };
}

export function textLines(text: string, width: number, measure: (s: string) => number): string[] {
  return text.split("\n").flatMap((paragraph) => {
    const lines: string[] = []; let line = "";
    for (const word of paragraph.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (line && measure(next) > width) { lines.push(line); line = word; }
      else line = next;
    }
    lines.push(line); return lines;
  });
}

/** Draws the design to a canvas for PNG export / thumbnails. */
export function renderToCanvas(d: Design, scale = 1): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = d.w * scale; c.height = d.h * scale;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear la imagen.");
  ctx.scale(scale, scale);
  ctx.fillStyle = d.bg; ctx.fillRect(0, 0, d.w, d.h);
  for (const e of d.els) {
    ctx.fillStyle = e.color;
    if (e.type === "rect") ctx.fillRect(e.x, e.y, e.w, e.h);
    else if (e.type === "circle") { ctx.beginPath(); ctx.ellipse(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, e.h / 2, 0, 0, Math.PI * 2); ctx.fill(); }
    else {
      const size = e.size ?? 48;
      ctx.font = `${e.bold ? "bold " : ""}${size}px ${e.font ?? "Montserrat"}`;
      ctx.textBaseline = "top";
      const al = e.align ?? "left"; ctx.textAlign = al;
      const x = al === "center" ? e.x + e.w / 2 : al === "right" ? e.x + e.w : e.x;
      textLines(e.text ?? "", e.w, (s) => ctx.measureText(s).width).forEach((line, i) => ctx.fillText(line, x, e.y + i * size * 1.2, e.w));
    }
  }
  return c;
}
