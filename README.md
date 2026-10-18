# Welcome Mate

Este repositorio contiene la web de Welcome Mate que se publica en `marohe11.vercel.app`. La raíz debe contener `index.html`, `src/`, `assets/`, `api/`, `peliculas/`, `vendor/` y `sw.js`. No hace falta compilar ni instalar paquetes para publicar los archivos estáticos.

## Registro de noticias bonitas

El formulario de `#news` pide un correo siempre y permite elegir correo, WhatsApp o Instagram. El teléfono solo es obligatorio cuando se elige WhatsApp. Cada registro se guarda en Redis; la administradora puede descargar los registros desde **Admin Blog → Descargar registros del newsletter**. Los datos no se guardan en el navegador de quien se registra.

Para activar el registro en Vercel:

1. Abre el proyecto **marohe11** en Vercel y entra a **Storage** (o **Infrastructure → Storage**). Crea una base **Upstash Redis** desde el Marketplace y conéctala a este proyecto para **Production**.
2. En **Settings → Environment Variables** verifica que se hayan añadido `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`. También se admiten `KV_REST_API_URL` y `KV_REST_API_TOKEN`. No copies esos valores a GitHub.
3. Añade `BLOG_ADMIN_PASSWORD` con al menos 16 caracteres en **Production** para habilitar el panel y la descarga privada de registros. Guárdala fuera del repositorio.
4. Vuelve a desplegar la última versión de `main` para que las funciones reciban las variables nuevas.
5. Comprueba `/api/newsletter?action=status`: debe responder `{"configured":true}`. Luego registra un correo de prueba desde `#news`, entra a Admin Blog y descarga los registros para comprobar que se guardó.

La web no inscribe automáticamente el correo en Substack. Si alguien elige recibir la carta por mail, verá un enlace para confirmar la suscripción en [Welcome Mate en Substack](https://substack.com/@welcomemate1). Los canales de WhatsApp e Instagram se gestionan manualmente; el formulario guarda las preferencias y, cuando corresponde, el teléfono. Hasta que Redis esté conectado, el formulario se mantiene desactivado y muestra el enlace directo a Substack.

## Otras funciones

La Ruleta de Pelis necesita `TMDB_API_KEY` para consultar el catálogo real. No es necesaria para el newsletter ni para publicar la web.
