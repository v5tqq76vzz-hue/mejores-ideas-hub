export type Item = { id: string; name: string; price: number; unit?: string; desc: string; icon: string; group: "web" | "marca" | "redes" | "dominio" | "paquete" };

export const services: Item[] = [
  { id: "web", icon: "💻", name: "Página Web Profesional", price: 699, group: "web", desc: "Sitio optimizado para celular, con SSL, botón de WhatsApp y formulario de contacto." },
  { id: "logo", icon: "✒️", name: "Diseño de Logotipo", price: 250, group: "marca", desc: "3 propuestas originales y archivos en alta resolución." },
  { id: "tarjetas", icon: "📇", name: "Tarjetas de Presentación", price: 150, group: "marca", desc: "Diseño ejecutivo 9×5 cm en CMYK, listo para imprenta." },
  { id: "banners", icon: "🖼️", name: "Banners y Portadas", price: 180, group: "redes", desc: "Portadas para Facebook, Instagram y LinkedIn." },
  { id: "enlaces", icon: "🔗", name: "Ecosistema Bio Links", price: 190, group: "redes", desc: "Micrositio con todos tus botones y redes para tu biografía." },
  { id: "identidad", icon: "🎨", name: "Colores e Identidad Visual", price: 150, group: "marca", desc: "Paleta HEX/RGB y tipografías para una marca uniforme." },
  { id: "com", icon: "🌐", name: "Dominio .COM", price: 299, unit: "año", group: "dominio", desc: "Registro, configuración DNS y conexión a tu sitio por 1 año." },
  { id: "commx", icon: "🇲🇽", name: "Dominio .COM.MX", price: 399, unit: "año", group: "dominio", desc: "Identidad comercial mexicana para tu negocio por 1 año." },
];

export type Pack = { id: string; name: string; tagline: string; price: number; unit: string; features: string[]; featured?: boolean; time: string };

export const packs: Pack[] = [
  { id: "identity", name: "Identity Dream Pack", tagline: "Tu marca lista desde cero o renovada.", price: 1499, unit: "único", featured: true, time: "5 a 6 días hábiles",
    features: ["Investigación de marca y concepto", "Logotipo profesional (3 propuestas)", "Manual de identidad en PDF", "Paleta de colores y tipografías", "Tarjetas, hoja membretada y firma de correo"] },
  { id: "social", name: "Social Media Visual Pack", tagline: "Coherencia visual en todas tus redes.", price: 1299, unit: "único", time: "4 a 5 días hábiles",
    features: ["12 plantillas editables para feed", "Portadas y banners multired", "6 portadas para Historias Destacadas", "Formatos Instagram, Facebook y LinkedIn", "Guía rápida de estilo"] },
  { id: "editorial", name: "Layout & Editorial B2B", tagline: "Diseño ejecutivo para vender más.", price: 1650, unit: "único", time: "5 a 7 días hábiles",
    features: ["Catálogo digital hasta 12 páginas", "Folleto tríptico corporativo", "Presentación comercial", "Reporte ejecutivo editorial", "Archivos para digital e imprenta"] },
  { id: "iguala", name: "Iguala Mensual In-House", tagline: "Tu equipo de diseño interno.", price: 2499, unit: "mes", time: "Entregas semanales",
    features: ["10 piezas gráficas al mes", "Actualización de tu sitio web", "Atención prioritaria", "Formatos para campañas y anuncios", "Sin plazos forzosos"] },
];

export const PROMO_CODE = "DMD10";
export const PROMO_RATE = 0.1;
export const DEPOSIT_RATE = 0.5;

export function quoteTotals(prices: number[], promo: boolean) {
  const subtotal = prices.reduce((a, b) => a + b, 0);
  const discount = promo ? Math.round(subtotal * PROMO_RATE) : 0;
  const total = subtotal - discount;
  return { subtotal, discount, total, deposit: Math.round(total * DEPOSIT_RATE) };
}

export const mxn = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;

export const whatsapp = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
