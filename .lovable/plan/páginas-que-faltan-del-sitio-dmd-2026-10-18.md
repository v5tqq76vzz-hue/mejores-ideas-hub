# Páginas que faltan del sitio DMD

Todas con el mismo diseño actual (menú, pie, botón de WhatsApp) y su propio título y descripción para Google y WhatsApp.

## Páginas de servicio (una por servicio)
Cada una tiene: encabezado con el precio, qué incluye, opciones extra, tiempo de entrega, preguntas frecuentes cortas, y botones "Agregar a cotización" y "Consultar por WhatsApp" (mensaje ya escrito con el nombre del servicio).

- **Web** (/web) – desde $699 MXN
- **Logo** (/logo) – desde $250 MXN
- **Identidad** (/identidad) – desde $150 MXN
- **Banners** (/banners) – desde $180 MXN
- **Tarjetas** (/tarjetas) – desde $150 MXN
- **Enlaces** (/enlaces) – desde $190 MXN

Los textos de "qué incluye" y de las opciones extra salen de tus páginas originales. Los precios son los que ya tiene el cotizador.

## Boceto (/boceto)
Formulario guiado: nombre del negocio, giro, eslogan, color favorito y tipo de diseño. Muestra al momento una vista previa sencilla del boceto con esos datos. Al final hay un botón para mandarlo por WhatsApp. Guardarlo como prospecto en el panel será parte de la etapa de funciones reales.

## Pago (/pago)
Resumen de la cotización con subtotal, descuento DMD10, total y anticipo del 50%. Pide los datos del cliente (nombre, teléfono, correo) y muestra cómo pagar: transferencia o depósito. Termina con un botón "Confirmar pedido por WhatsApp" que manda el pedido completo ya escrito. El cotizador lleva a esta página.

## Conexiones
- Las tarjetas de servicio en Inicio y en Servicios llevan a su página.
- El menú agrega "Diseñar" (Boceto) y el pie de página lista todos los servicios.

## Detalles técnicos
- Una plantilla compartida ServicePage alimentada por `catalog.ts` (features, extras, tiempo y FAQ por servicio) para no repetir código.
- Rutas nuevas: web, logo, identidad, banners, tarjetas, enlaces, boceto, pago.
- Prueba nueva: el total de pago coincide con el del cotizador.
- Sin datos bancarios reales: si no los das, pongo un aviso de "te enviamos los datos por WhatsApp".
