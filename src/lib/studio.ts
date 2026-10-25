import { FORMATS, uid, type Design, type El, type Template } from "./editor";

export const CATEGORIES = ["Todas", "Publicaciones / Redes", "Presentaciones", "Documentos", "Video", "Sitios web", "Pizarras", "Logos / Branding", "Flyers", "Invitaciones"] as const;

const colors = { paper: "#ffffff", ink: "#17252a", blue: "#0067b8", pink: "#e5a7bd", green: "#b8dcc8", lemon: "#eced8b", muted: "#56646b" };
const text = (value: string, x: number, y: number, w: number, size: number, color: string = colors.ink): El => ({ id: uid(), type: "text", x, y, w, h: size * 2.5, text: value, size, color, bold: true, font: "Arial", align: "left" });
const shape = (type: "rect" | "circle", x: number, y: number, w: number, h: number, color: string): El => ({ id: uid(), type, x, y, w, h, color });

function sample(name: string, cat: string, format: Template["format"], variant: number, headline: string, subtitle: string): Template {
  return { name, cat, format, make: () => {
    const { w, h } = FORMATS[format];
    const accent = [colors.green, colors.pink, colors.lemon][variant % 3] ?? colors.green;
    const dark = variant % 2 === 1;
    const fg = dark ? colors.paper : colors.ink;
    const design: Design = { w, h, bg: dark ? colors.ink : colors.paper, els: [
      shape("rect", w * .055, h * .07, w * .075, h * .018, accent),
      text("ESTUDIO / 2026", w * .055, h * .12, w * .8, w * .022, fg),
      shape("rect", w * .62, h * .28, w * .32, h * .48, accent),
      shape("circle", w * .64, h * .30, w * .25, w * .25, dark ? colors.blue : colors.ink),
      shape("rect", w * .74, h * .50, w * .16, h * .025, dark ? colors.paper : colors.blue),
      text(headline, w * .055, h * .32, w * .55, w * .066, fg),
      { ...text(subtitle, w * .055, h * .72, w * .51, w * .026, fg), bold: false },
      text(name.toUpperCase(), w * .055, h * .91, w * .85, w * .016, fg),
    ] };
    if (format === "documento") {
      design.els = [shape("rect", 0, 0, w, 30, accent), text("CUADERNO / 01", 55, 85, 660, 20, fg), text(headline, 55, 190, 680, 62, fg), text(subtitle, 55, 420, 660, 26, fg), ...[580, 650, 720, 790].map((y) => shape("rect", 55, y, 680, 4, accent)), text("Notas y próximos pasos", 55, 950, 660, 22, fg)];
    }
    if (format === "pizarra") {
      design.els = [text(headline, 80, 70, 1440, 65, fg), ...["IDEA", "ENFOQUE", "PRÓXIMO PASO"].flatMap((label, i) => [shape("rect", 80 + i * 500, 300, 440, 560, accent), text(label, 110 + i * 500, 350, 375, 32), { ...text(i === 0 ? "Una nueva posibilidad" : i === 1 ? "Lo que importa" : "Hagámoslo realidad", 110 + i * 500, 470, 365, 45), bold: false }]), text(subtitle, 80, 1030, 1400, 28, fg)];
    }
    return design;
  } };
}

export const STUDIO_TEMPLATES: Template[] = [
  sample("Nueva colección", "Publicaciones / Redes", "post", 0, "Ideas que\nflorecen.", "Nueva temporada · Tu marca"),
  sample("Historia editorial", "Publicaciones / Redes", "historia", 1, "Haz espacio\npara lo nuevo.", "Descubre nuestra colección"),
  sample("Visión de proyecto", "Presentaciones", "presentacion", 2, "El siguiente\ncapítulo.", "Propuesta de proyecto / Tu equipo"),
  sample("Pitch creativo", "Presentaciones", "presentacion", 3, "Una idea.\nMil caminos.", "Visión, estrategia y próximos pasos"),
  sample("Cuaderno de proyecto", "Documentos", "documento", 4, "El plan\ncomienza aquí.", "Objetivos / Alcance / Entregables"),
  sample("Informe editorial", "Documentos", "documento", 5, "Una mirada\nal futuro.", "Resultados y aprendizajes del equipo"),
  sample("Portada de episodio", "Video", "video", 6, "Detrás de\nla idea.", "Episodio 01 · Conversaciones creativas"),
  sample("Título de lanzamiento", "Video", "video", 7, "Ya es\nnuestro momento.", "Estreno / Tu proyecto"),
  sample("Estudio independiente", "Sitios web", "sitio", 8, "Diseñamos\ncon intención.", "Proyectos / Estudio / Contacto"),
  sample("Marca local", "Sitios web", "sitio", 9, "Hecho cerca.\nPensado para ti.", "Tu negocio · Tu comunidad"),
  sample("Mapa de ideas", "Pizarras", "pizarra", 10, "De la idea a la acción", "Proyecto / Equipo / Fecha"),
  sample("Sesión de equipo", "Pizarras", "pizarra", 11, "Conectemos los puntos", "Visión compartida / Próximos pasos"),
  sample("Identidad botánica", "Logos / Branding", "post", 12, "NATIVA\nESTUDIO", "Crecer con intención"),
  sample("Marca tipográfica", "Logos / Branding", "post", 13, "PUNTO\nAPARTE", "Ideas que dejan huella"),
  sample("Encuentro creativo", "Flyers", "flyer", 14, "Nos vemos\npara crear.", "Fecha / Lugar / Tu evento"),
  sample("Taller de ideas", "Flyers", "flyer", 15, "Manos\na la idea.", "Taller creativo · Reserva tu lugar"),
  sample("Una gran celebración", "Invitaciones", "invitacion", 16, "Celebremos\njuntos.", "Nombre / Fecha / Lugar"),
  sample("Noche de encuentro", "Invitaciones", "invitacion", 17, "Una noche\npara recordar.", "Te esperamos · Fecha y dirección"),
];

export function filterTemplates(query: string, category: string) {
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return STUDIO_TEMPLATES.filter((t) => (category === "Todas" || t.cat === category) && normalize(`${t.name} ${t.cat}`).includes(normalize(query.trim())));
}