# Welcome Mate

Este repositorio contiene la web de Welcome Mate que se publica en `marohe11.vercel.app`. La raíz debe contener `index.html`, `src/`, `assets/`, `api/`, `peliculas/`, `vendor/`, `package.json`, `package-lock.json` y `sw.js`. Vercel instala automáticamente `@vercel/blob` para la API de suscripciones.

## Noticias bonitas

El botón **News** abre la carta de Alpaca. El formulario propio de la página pide correo y consentimiento; guarda cada correo en un **Vercel Blob privado**, separado de los archivos de la web. El botón **Admin correos** del pie abre un panel con contraseña donde se pueden copiar los correos y borrarlos uno por uno después de pasarlos manualmente a [Substack](https://welcomemate1.substack.com/). El sitio no los envía automáticamente a Substack.

### Activar el registro sin pagar

1. Confirma que el proyecto `marohe11` esté en un **equipo Vercel Hobby**. Blob tiene cupos gratuitos en Hobby; cuando se agotan, Vercel detiene el acceso hasta que se renueven y no cobra uso adicional. No actives esta configuración en un equipo Pro si quieres evitar cargos.
2. En Vercel abre `marohe11` → **Storage** → **Create Database** → **Blob**. Selecciona **Private** y conecta la tienda al proyecto. Vercel añadirá `BLOB_READ_WRITE_TOKEN` automáticamente.
3. En **Settings** → **Environment Variables** añade `NEWSLETTER_ADMIN_PASSWORD` con una contraseña distinta de las demás, de al menos 16 caracteres, para **Production**. No la escribas en el código ni la compartas con los visitantes.
4. Vuelve a desplegar el proyecto después de crear la tienda y la variable. Comprueba que `/api/newsletter?action=status` responda `{"configured":true}`. Envía un correo de prueba desde la página, entra en **Admin correos**, cópialo y bórralo.

Si falta cualquiera de las dos variables, el campo de correo sigue visible pero el botón de envío se desactiva y la página explica que todavía no puede guardar datos. El panel muestra hasta 50 registros por página. Los datos son privados y solo se consultan después de iniciar sesión en el panel.

## Tienda y juegos

**Tienda** muestra las bobas y kits con sus fotos, incluidas las variantes con mate de coca y chicha, y un enlace de consulta por Instagram. Aún no incluye precios ni pago en línea. **Juegos** abre el catálogo de videojuegos, retos y memes.

## Otras funciones

La Ruleta de Pelis necesita `TMDB_API_KEY` para consultar el catálogo real. No es necesaria para el newsletter ni para publicar la web.
