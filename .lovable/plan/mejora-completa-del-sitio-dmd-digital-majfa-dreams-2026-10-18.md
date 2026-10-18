# Mejora completa del sitio DMD (Digital Majfa Dreams)

Se mantienen tus colores azules y tu logo. Por el tamaño (unas 40 páginas), lo hacemos por etapas.

## Etapa 1 – Base y diseño
- Un solo diseño compartido: menú superior (con menú de celular), pie de página y aviso de cookies.
- Inicio rediseñado: presentación principal, servicios, paquetes con precios, testimonios y contacto.
- Revisado primero en celular y después en computadora.

## Etapa 2 – Páginas del sitio
- Servicios, Paquetes, Web, Logo, Identidad, Banners, Tarjetas, Enlaces, Dominios, Boceto, Checkout, Política de cookies.
- Cada página con su propio título y descripción para Google y WhatsApp.

## Etapa 3 – Funciones reales (Lovable Cloud)
- Inicio de sesión real para clientes y administradores.
- Portal del cliente: ver sus pedidos y su estado.
- Panel admin: pedidos, pagos, prospectos y equipo guardados de verdad (hoy solo viven en el navegador).
- Formularios de contacto y bocetos guardados como prospectos.

## Etapa 4 – Editor tipo Canva y plantillas
- Hoy hay 22 copias casi idénticas del editor (260 KB cada una, unos 5.7 MB). Se juntan en un solo editor que abre cada plantilla (manicura, café, boutique, lealtad, etc.).
- Los diseños se guardan en la cuenta del cliente.

## Etapa 5 – Velocidad y orden
- Quitar código repetido, comprimir imágenes, arreglar enlaces rotos y la imagen de vista previa que falta.

## Detalles técnicos
- Las páginas HTML se pasan a rutas TanStack; style.css se convierte en tokens del tema (azul #0067b8).
- Tablas: profiles, user_roles (admin), orders, leads, designs, con RLS.
- Las plantillas pasan a datos JSON que carga una sola ruta /editor/$plantilla.
- El logo y las imágenes se suben como recursos de la app.
