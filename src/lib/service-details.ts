export type Extra = { id: string; icon: string; name: string; desc: string; price: number };
export type Detail = {
  slug: "web" | "logo" | "identidad" | "banners" | "tarjetas" | "enlaces";
  eyebrow: string;
  title: string;
  intro: string;
  base: string;
  includes: string[];
  time: string;
  extras: Extra[];
  levels?: { id: string; name: string; price: number }[];
  faq: { q: string; a: string }[];
};

const commonFaq = [
  { q: "¿Cómo empiezo?", a: "Pagas el 50% de anticipo y arrancamos. El resto lo liquidas al aprobar el resultado." },
  { q: "¿Puedo pedir cambios?", a: "Sí, todas las entregas incluyen rondas de revisión." },
];

export const details: Record<Detail["slug"], Detail> = {
  web: {
    slug: "web", eyebrow: "Desarrollo web corporativo", title: "Página Web Profesional",
    intro: "Sitios rápidos, seguros y enfocados en convertir visitantes en clientes. Adaptados a celular, tableta y computadora.",
    base: "Landing page corporativa",
    includes: ["Diseño adaptado a cualquier pantalla", "Certificado SSL (candado HTTPS)", "Botones directos a WhatsApp Business", "Formulario de contacto y SEO inicial"],
    time: "5 a 7 días hábiles",
    extras: [
      { id: "tienda", icon: "🛒", name: "Catálogo o tienda en línea", desc: "Productos con carrito o pedidos a WhatsApp", price: 400 },
      { id: "bot", icon: "💬", name: "Asistente / ChatBot", desc: "Respuestas automáticas 24/7", price: 150 },
      { id: "dominio", icon: "🌐", name: "Dominio .COM anual", desc: "Registro y configuración por 1 año", price: 299 },
    ],
    faq: [{ q: "¿Necesito pagar hosting aparte?", a: "Te asesoramos con la opción más económica para tu negocio." }, ...commonFaq],
  },
  logo: {
    slug: "logo", eyebrow: "Identidad de marca", title: "Diseño de Logotipo",
    intro: "Tu logotipo es la firma de tu empresa. Creamos logos limpios, versátiles y memorables que transmiten confianza.",
    base: "Logotipo profesional",
    includes: ["3 propuestas iniciales para elegir", "PNG sin fondo, JPG y PDF en alta resolución", "Versiones para fondo claro, oscuro y marca de agua", "Rondas de ajuste garantizadas"],
    time: "3 a 4 días hábiles",
    levels: [
      { id: "min", name: "Minimalista / tipográfico", price: 250 },
      { id: "ilu", name: "Ilustrativo / mascota", price: 350 },
      { id: "pre", name: "Premium con presentación 3D", price: 450 },
    ],
    extras: [
      { id: "manual", icon: "📘", name: "Manual de uso de marca", desc: "Áreas de respeto, colores y tipografías", price: 100 },
      { id: "vector", icon: "📐", name: "Archivos vectoriales (AI / SVG)", desc: "Para gran formato, bordado y rotulación", price: 80 },
    ],
    faq: commonFaq,
  },
  identidad: {
    slug: "identidad", eyebrow: "Estandarización corporativa", title: "Colores e Identidad Visual",
    intro: "Elegimos los colores y tipografías ideales para que tu empresa se vea seria, ordenada y coherente en todos lados.",
    base: "Estudio de colores y tipografía",
    includes: ["Paleta oficial en HEX, RGB y CMYK", "Tipografías para títulos y textos", "Psicología del color aplicada a tu giro", "Lámina de referencia rápida para tu equipo"],
    time: "2 a 3 días hábiles",
    extras: [
      { id: "manual", icon: "📘", name: "Manual corporativo (PDF)", desc: "Reglas de uso, fondos y proporciones", price: 100 },
      { id: "mockups", icon: "📦", name: "Presentación en mockups", desc: "Tu marca en papelería, fachada y uniforme", price: 80 },
    ],
    faq: commonFaq,
  },
  banners: {
    slug: "banners", eyebrow: "Imagen para redes sociales", title: "Banners y Portadas",
    intro: "Portadas y promociones que captan la atención desde el primer segundo en Facebook, Instagram, LinkedIn o YouTube.",
    base: "Portada para 1 red social",
    includes: ["Zonas seguras para tu foto de perfil", "Se ve nítida en celular y computadora", "Entrega en PNG y JPG", "Destaca teléfono, servicios o promociones"],
    time: "24 a 48 horas",
    extras: [
      { id: "red2", icon: "📱", name: "Segunda red social", desc: "Adaptación de medidas a otra red", price: 80 },
      { id: "fuente", icon: "📁", name: "Archivo editable", desc: "Para cambiar textos o promociones después", price: 50 },
    ],
    faq: commonFaq,
  },
  tarjetas: {
    slug: "tarjetas", eyebrow: "Papelería ejecutiva", title: "Tarjetas de Presentación",
    intro: "Tu primer contacto en reuniones y ventas. Entregamos archivos listos para imprenta profesional.",
    base: "Diseño a una cara",
    includes: ["Medida estándar 9 × 5 cm", "Márgenes y sangrías para corte exacto", "PDF CMYK a 300 DPI listo para imprenta", "Alineada a la identidad de tu marca"],
    time: "24 a 48 horas",
    extras: [
      { id: "doble", icon: "📄", name: "Doble cara", desc: "Reverso con logo o lista de servicios", price: 50 },
      { id: "qr", icon: "🔳", name: "Código QR", desc: "Directo a tu WhatsApp, ubicación o web", price: 30 },
    ],
    faq: commonFaq,
  },
  enlaces: {
    slug: "enlaces", eyebrow: "Conversión en redes", title: "Bio Links",
    intro: "Una mini página con todos tus botones de contacto, catálogo, ubicación y redes, lista para tu perfil de Instagram, TikTok o WhatsApp.",
    base: "Micrositio con hosting incluido",
    includes: ["Hasta 6 botones personalizados", "WhatsApp con mensaje de bienvenida", "Con tu logo y tus colores", "Hosting incluido sin mensualidades"],
    time: "2 a 3 días hábiles",
    extras: [
      { id: "vip", icon: "🌐", name: "Enlace corto personalizado", desc: "Dirección limpia con el nombre de tu marca", price: 100 },
      { id: "destacados", icon: "✨", name: "Botones destacados", desc: "Tarjetas para tus 3 productos principales", price: 50 },
    ],
    faq: commonFaq,
  },
};

export function configuredPrice(base: number, extras: number[]) {
  return base + extras.reduce((a, b) => a + b, 0);
}
