# MAROHE World · repositorio para Vercel

Esta carpeta es la raíz independiente de la web. Incluye `index.html`, `src/css/`, `src/js/`, `assets/`, la Ruleta de Pelis en `peliculas/` y las funciones necesarias en `api/`. No requiere compilación ni instalación de paquetes.

**Importante:** descomprime el ZIP completo. Dentro de `marohe-world-vercel-organizado` deben verse juntos `index.html` y las carpetas `src`, `assets`, `api`, `lib`, `peliculas` y `vendor`. Sube a GitHub el contenido de esa carpeta conservando las subcarpetas. Subir el ZIP como archivo único, o elegir solo los archivos de la raíz, produce una web sin estilos ni imágenes.

## Subir únicamente esta carpeta a GitHub

1. Crea en GitHub un repositorio vacío llamado `marohe-world`. No agregues README, `.gitignore` ni licencia desde GitHub porque esta carpeta ya incluye los archivos necesarios.
2. Abre PowerShell y ejecuta estos comandos, reemplazando `TU_USUARIO` por tu usuario de GitHub:

```powershell
cd "C:\Users\Claudia\Documents\Codex\2026-10-09\x20-x20-te-mando-imagenes-para\marohe-world-vercel-organizado"
git init -b main
git add .
git commit -m "Preparar MAROHE World para Vercel"
git remote add origin https://github.com/TU_USUARIO/marohe-world.git
git push -u origin main
```

Si Git solicita tu nombre y correo antes del primer commit, configúralos con `git config --global user.name "Tu nombre"` y `git config --global user.email "tu-correo@example.com"`, y repite `git commit` y `git push`.

## Conectar GitHub con Vercel

1. En Vercel, entra en **Add New → Project** e importa el repositorio `marohe-world` desde GitHub.
2. Selecciona **Framework Preset: Other** y **Root Directory: `./`**. La raíz del repositorio contiene `index.html`.
3. En **Build and Output Settings**, activa la opción de sobrescribir el **Build Command** y déjalo vacío. La web se publica sin compilación. En **Output Directory**, usa `.` (la raíz), si Vercel no lo detecta automáticamente.
4. Selecciona **Deploy**. Vercel publicará el sitio y creará nuevas versiones automáticamente al subir cambios a `main`.

## Funciones que necesitan claves

El sitio se puede desplegar sin claves. Para activar funciones conectadas, añade las variables en **Project Settings → Environment Variables** y vuelve a desplegar:

- Podcast y dashboard compartido: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` y `BLOG_ADMIN_PASSWORD` (mínimo 16 caracteres). También se admiten `KV_REST_API_URL` y `KV_REST_API_TOKEN` en lugar del par de Upstash.
- Catálogo real de la Ruleta de Pelis: `TMDB_API_KEY`.

No guardes valores de estas claves en GitHub ni en archivos públicos. Sin ellas, la web estática se publica, pero las funciones correspondientes mostrarán que falta configuración.

Después del despliegue, abre la portada, `/src/css/style.css`, `/src/js/app.js`, `/assets/marohe-logo.png`, `/#agency/portfolio`, `/peliculas/index.html` y `/api/blog?action=status`. Los archivos CSS, JS e imagen deben responder sin error 404; la última ruta debe responder `{"configured":true}` cuando el podcast tenga su almacenamiento y contraseña configurados.
