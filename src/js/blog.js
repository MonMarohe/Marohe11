'use strict';
(() => {
  const byId = id => document.getElementById(id);
  if (!byId('blog-posts')) return;
  const POSTS_KEY = 'welcome-mate-blog-posts-v1';
  const ADMIN_KEY = 'welcome-mate-blog-admin-v1';
const allowedCovers = new Set(["assets/blog/post-mvlnktwz.jpg","assets/blog/post-mvlnnsmu.jpg",'assets/about-block-bunny.jpg','assets/build-world-kit.jpg','assets/boba-taro-classic.jpg','assets/parfait.jpg','assets/episodio-lima.png','assets/club-polimata-banner.jpg','assets/clothing-peru.jpg','assets/welcome-mate-boba-purple.jpg','assets/welcome-mate-boba-matcha.jpg','assets/welcome-mate-boba-pixel.jpg','assets/welcome-mate-kit-matcha.jpg','assets/welcome-mate-kit-purple.jpg']);
  const seeds = [{"id":"post-mvlnktwz","title":"No estás disperso. Eres polímata.","category":"Creatividad","cover":"assets/blog/post-mvlnktwz.jpg","excerpt":"La palabra viene del griego polymathēs, que significa «el que ha aprendido mucho».","body":"Durante mucho tiempo pensé que había algo mal en mí por no poder elegir una sola cosa. \nMe gustaban demasiadas cosas. Saltaba de una idea a otra.\n\nHasta que me fui a Australia.\n\nAllá, por primera vez, eso que en otros lugares se veía como “falta de foco” fue mi mayor ventaja.\n\nPude conseguir buenos trabajos justamente porque no me centro en una sola cosa. Un día estaba en un proyecto creativo, otro día resolviendo logística, otro día enseñando, otro día creando algo con las manos. Era como si mi CV encajara en muchos trabajos, y si bien, me frustraba porque no encajaba como especialista en nada a la vez yo podía adaptarme, conectar puntos y aprender rápido.\n\nAhí entendí: no soy una especialista fallida. Soy polímata.\n\n¿Tenemos un cerebro diferente?\n\nNo más inteligente. Más flexible.\n\nLa ciencia lo llama flexibilidad cognitiva: la capacidad de tu cerebro para saltar entre conceptos, desaprender y reaprender, conectar una idea de la cocina con una idea de negocios.\n\nLos especialistas profundizan. Los polímatas conectamos.\nNinguno es mejor. Son estrategias distintas.\n\nEl especialista hace un pozo de 100 metros de profundidad.\nEl polímata hace una red de ríos que conectan varios territorios.\n\nEl mundo necesita a ambos. Pero si tú eres polímata, intentar vivir como especialista te va a agotar.\n\nLo bueno de ser polímata que nadie te cuenta:\n\nEres más adaptable. En un mundo que cambia, no dependes de una sola habilidad.\n\nInnovas por naturaleza. Las mejores ideas no nacen dentro de una sola disciplina, nacen en la intersección.\n\nEres más resiliente. Si un proyecto no funciona, tienes otros 5 intereses que te sostienen.\n\nNo te aburres. Y eso no es un capricho, es combustible.\n\n¿Y cómo se entrena? ¿Se puede mejorar? Sí. Y aquí el juego es clave.\n\nEl juego no es una pérdida de tiempo. Es el gimnasio de la mente polímata. Cuando juegas, tu cerebro practica sin miedo a equivocarse. Prueba, combina, falla y vuelve a intentar. Eso es exactamente lo que necesitas.\n\nSi eres como yo, prueba esto esta semana:\n\n1. Juega a propósito. 20 minutos sin objetivo productivo. Un puzzle, Lego, acuarelas, un juego de mesa. Solo por el placer de conectar.\n\n2. Crea tu mapa de conexiones. Agarra una hoja. En el centro escribe un tema que te obsesiona hoy. Alrededor, escribe otros 3 intereses que parecen no tener nada que ver. Oblígate a dibujar una línea que los conecte. Ahí está tu idea original.\n\n3. Haz un proyecto puente. No elijas entre A o B. Crea un mini-proyecto que necesite A + B. Ej: fotografía + psicología, cocina + escritura.\n\nSer polímata no es hacer de todo sin profundizar. Es darle lenguaje a tu forma de pensar para que deje de sentirse como caos y empiece a sentirse como un universo.\n\nTu curiosidad no es ruido. Es tu brújula.\n\n¿Te identificas? Cuéntame, ¿cuáles son esas 2-3 cosas que amas y que parecen no tener nada que ver?","published":true,"created":"2026-10-24T00:20:55.280Z","updated":"2026-10-24T00:20:55.280Z"},{"id":"post-mvlnnsmu","title":"Especialistas y polímatas: dos formas distintas de ser profundo","category":"Creatividad","cover":"assets/blog/post-mvlnnsmu.jpg","excerpt":"Siempre nos hacen elegir: ¿quieres ser muy bueno en una cosa o saber un poco de muchas?","body":"Siempre nos hacen elegir: ¿quieres ser muy bueno en una cosa o saber un poco de muchas?\n\nEsa pregunta está mal hecha. Especialista y polímata no compiten por lo mismo. Son dos tipos de profundidad diferentes.\n\n1. El especialista: profundidad vertical\n\nEs el pozo de 1.000 metros.\n\nPasa años en un solo territorio. Conoce cada detalle, cada excepción, cada fallo. Por eso llega a donde nadie más llega. Cuando el problema está dentro de su campo, es imbatible.\n\nSu ventaja es la precisión.\nSu riesgo es la rigidez. Tanto tiempo dentro de la misma caja que empieza a creer que todos los problemas se resuelven con las mismas herramientas. En psicología le llaman atrincheramiento cognitivo.\n\n2. El polímata: profundidad por conexión\n\nEs el océano que conecta varios pozos.\n\nNo baja 1.000 metros en un punto, baja 200 metros en cinco puntos distintos. Y lo que ve es cómo esos puntos se conectan.\n\nSu ventaja no es saber de todo, es traer una idea de un campo a otro. La biología le da una idea para arquitectura. La música le da una estructura para matemáticas.\n\nSu riesgo es el otro: quedarse en la superficie. Hablar de muchos temas sin la capacidad de construir algo que funcione de verdad. El polímata de verdad no es superficial, profundiza lo suficiente para ser útil en varios campos.\n\n3. Entonces, ¿quién es más profundo?\n\nNinguno. Depende de qué mides.\n\nSi mides profundidad como llegar al límite del conocimiento humano en un tema, gana el especialista.\n\nSi mides profundidad como la capacidad de integrar y crear algo nuevo combinando campos, gana el polímata.\n\nUno es profundo hacia abajo. El otro es profundo hacia los lados.\n\n4. Lo que funciona hoy\n\nEl mercado ya no premia al especialista puro encerrado en una sola caja, ni al generalista que sabe un poco de todo y no domina nada.\n\nLo que funciona es el perfil en forma de T o de peine:\n\nTienes 1 o 2 temas donde eres especialista de verdad, donde sí has hecho el pozo profundo. Y tienes la curiosidad y la disciplina del polímata para moverte con soltura entre otros 3 o 4 temas y conectar puntos.\n\nNo tienes que elegir entre ser profundo o ser flexible. Tienes que elegir dónde vas a ser profundo, para luego poder ser flexible en todo lo demás.","published":true,"created":"2026-10-24T00:23:13.590Z","updated":"2026-10-24T00:23:13.590Z"}];
  let posts = readPosts();
  let localPosts = posts.map(post => ({...post}));
  let cloudReady = false, syncing = false, sharedOpened = false, syncWaiters = [];
  let adminUnlocked = false;
  let adminDestination = 'blog';
  const shareable = post => Boolean(post?.published && (cloudReady || seeds.some(seed=>seed.id===post.id)));
  const publicPostUrl = post => new URL('/blog/'+encodeURIComponent(post.id),'https://marohe11.vercel.app');
  let currentPost = null;
  let uploadedCover = null, uploadGeneration = 0, uploadBusy = false;
  const inlineEditor=window.createBlogImageEditor({canEdit:()=>adminUnlocked,onBusy:busy=>{byId('blog-post-form').querySelector('button[type="submit"]').disabled=busy||uploadBusy;}});
  const updatedCovers = new Map([['assets/parfait.jpg','assets/welcome-mate-boba-purple.jpg'],['assets/boba-taro-classic.jpg','assets/welcome-mate-boba-purple.jpg'],['assets/build-world-kit.jpg','assets/welcome-mate-kit-matcha.jpg'],['assets/about-block-bunny.jpg','assets/welcome-mate-boba-pixel.jpg']]);
  const coverSource = cover => updatedCovers.get(cover) || (allowedCovers.has(cover) || window.BunnyBlogMedia.safeCover(cover) || /^\/api\/blog\?action=cover&id=[a-zA-Z0-9_-]+&v=/.test(cover || '') ? cover : 'assets/rabbit.png');

  function readPosts() {
    try {
      const saved = JSON.parse(localStorage.getItem(POSTS_KEY));
      return Array.isArray(saved) ? saved.filter(post => post && post.id && post.title) : seeds.map(post => ({...post}));
    } catch { return seeds.map(post => ({...post})); }
  }
  function savePosts() {
    try { localStorage.setItem(POSTS_KEY, JSON.stringify(cloudReady ? localPosts : posts)); return true; }
    catch { return false; }
  }
  async function api(query='',method='GET',payload) {
    const response = await fetch(`/api/blog${query}`,{method,cache:'no-store',credentials:'same-origin',headers:payload?{'Content-Type':'application/json'}:{},body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(15000)});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'No se pudo conectar con el blog compartido.');
    return data;
  }
  function cloudStatus(message) { byId('blog-sync-status').textContent = message; }
  function configureDashboard() {
    byId('blog-dashboard-note').textContent = cloudReady ? 'Blog compartido: al publicar, tu entrada estará disponible en computadora y celular. Las fotos también se guardan en el servidor. Puedes importar las entradas anteriores de este navegador.' : 'Falta conectar Storage en Vercel. Por ahora guardas copias locales: no se publican en otros dispositivos. Descarga un respaldo o importa estas entradas después de conectar el servidor.';
    byId('blog-import-local').disabled = !cloudReady;
    byId('blog-post-form').querySelector('button[type="submit"]').textContent = cloudReady ? 'Guardar publicación' : 'Guardar copia local';
  }
  async function refreshShared(checkConfig=false) {
    if (syncing) { await new Promise(resolve=>syncWaiters.push(resolve)); return refreshShared(checkConfig); }
    if (!cloudReady && !checkConfig) return;
    syncing=true;
    try {
      if (checkConfig) { const status=await api('?action=status'); cloudReady=!!status.configured; configureDashboard(); }
      if (!cloudReady) { cloudStatus('Mostrando las entradas disponibles en este navegador.'); return; }
      const data=await api(adminUnlocked?'?action=admin':''); posts=data.posts; renderPublic(); renderAdmin();
      try { localStorage.setItem('welcome-mate-blog-public-cache-v1',JSON.stringify(posts.filter(post=>post.published))); } catch {}
      cloudStatus('Blog actualizado.');
      const sharedId=new URLSearchParams(location.search).get('post');
      const shared=posts.find(post=>post.id===sharedId && post.published);
      if (shared && !sharedOpened) { sharedOpened=true; openReader(shared); }
      if (sharedId && !shared) cloudStatus('Este artículo ya no está publicado o el enlace no existe.');
    } catch (error) {
      cloudStatus(cloudReady ? 'No se pudo actualizar el blog. Mostramos la última copia disponible; vuelve a intentarlo con conexión.' : 'Mostrando las entradas disponibles en este navegador.');
      if (cloudReady && !adminUnlocked) {
        try { posts=JSON.parse(localStorage.getItem('welcome-mate-blog-public-cache-v1')) || seeds; } catch { posts=seeds; }
        renderPublic();
      }
    } finally { syncing=false; configureDashboard(); const waiting=syncWaiters;syncWaiters=[];waiting.forEach(resolve=>resolve()); }
  }
  function rememberLocal(entry) {
    const i=localPosts.findIndex(post=>post.id===entry.id);
    if(i<0)localPosts.push({...entry}); else localPosts[i]={...entry};
    savePosts();
  }
  async function storeShared(entry) {
    rememberLocal(entry);
    return (await api('','POST',{post:entry})).post;
  }
  async function importLocal() {
    if (!adminUnlocked || !cloudReady) return;
    const button=byId('blog-import-local'); button.disabled=true;
    let imported=0;
    try {
      const existing=new Set(posts.map(post=>post.id));
      for(const entry of localPosts) {
        if(existing.has(entry.id))continue;
        await api('','POST',{post:entry}); imported++; existing.add(entry.id);
        byId('blog-admin-status').textContent=`Importando entradas… ${imported} guardadas en el servidor.`;
      }
      await refreshShared();
      byId('blog-admin-status').textContent=`${imported} entradas importadas. Las publicadas ya se pueden leer desde el celular. Las entradas existentes se conservaron.`;
    } catch(error) { byId('blog-admin-status').textContent=`Se importaron ${imported} entradas. ${error.message} Puedes reintentar sin duplicarlas.`; }
    finally { button.disabled=false; }
  }
  function exportLocal() {
    const blob=new Blob([JSON.stringify(localPosts,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
    const link=make('a'); link.href=url; link.download='welcome-mate-blog-respaldo.json'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function importBackup() {
    const file=byId('blog-import-backup').files?.[0]; if(!file || !adminUnlocked || !cloudReady)return;
    try {
      if(file.size>20000000)throw new Error('El respaldo es demasiado grande. Usa un archivo de hasta 20 MB.');
      const entries=JSON.parse(await file.text());
      if(!Array.isArray(entries) || entries.length>200 || entries.some(post=>!post || typeof post.id!=='string' || typeof post.title!=='string' || typeof post.body!=='string'))throw new Error('Este archivo no es un respaldo válido del blog.');
      const combined=new Map(localPosts.map(post=>[post.id,post])); for(const post of entries)combined.set(post.id,post);
      localPosts=[...combined.values()];savePosts();await importLocal();
    } catch(error) { byId('blog-admin-status').textContent=error.message || 'No se pudo leer el respaldo.'; }
    finally { byId('blog-import-backup').value=''; }
  }
  function formatDate(value) {
    try { return new Intl.DateTimeFormat('es-PE',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value)); }
    catch { return ''; }
  }
  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function publicPosts() {
    const query = byId('blog-search').value.trim().toLocaleLowerCase('es');
    const category = byId('blog-category-filter').value;
    return posts.filter(post => post.published && (category === 'todos' || post.category === category) && (!query || `${post.title} ${post.excerpt} ${post.body}`.toLocaleLowerCase('es').includes(query))).sort((a,b) => new Date(b.created) - new Date(a.created));
  }
  function renderPublic() {
    renderHome();
    const list = publicPosts();
    const container = byId('blog-posts');
    container.replaceChildren();
    byId('blog-empty').hidden = list.length > 0;
    list.forEach(post => {
      const card = make('article','blog-post-card');
      const image = make('img'); image.src = coverSource(post.cover); image.alt = `Portada de ${post.title}`; image.loading = 'lazy';
      const copy = make('div','blog-post-copy');
      const meta = make('div','blog-post-meta'); meta.append(make('span','',post.category),make('time','',formatDate(post.created)));
      const title = make('h2','',post.title);
      const excerpt = make('p','',post.excerpt);
      const open = make('a','', 'Leer artículo ↗'); open.href=publicPostUrl(post).href; open.target='_blank'; open.rel='noopener'; if(!cloudReady&&!seeds.some(seed=>seed.id===post.id))open.addEventListener('click',event=>{event.preventDefault();openReader(post);});
      copy.append(meta,title,excerpt,open); card.append(image,copy); container.append(card);
    });
  }
  function renderHome() {
    const container = byId('home-blog-posts');
    if (!container) return;
    container.replaceChildren();
    const latest = posts.filter(post => post.published).sort((a,b) => new Date(b.created)-new Date(a.created)).slice(0,3);
    if (!latest.length) { container.append(make('p','home-empty-note','Las próximas historias están en camino.')); return; }
    for (const post of latest) {
      const card = make('a'); card.href = publicPostUrl(post).href; card.target='_blank'; card.rel='noopener';
      const image = make('img'); image.src = coverSource(post.cover); image.alt = `Portada de ${post.title}`; image.loading='lazy';
      card.append(image,make('span','',post.category.toLocaleUpperCase('es')),make('h3','',post.title),make('p','',post.excerpt));
      if(!cloudReady&&!seeds.some(seed=>seed.id===post.id))card.addEventListener('click',event=>{event.preventDefault();openReader(post);}); container.append(card);
    }
  }
  function openReader(post) {
    currentPost = post;
    byId('blog-reader-category').textContent = post.category;
    byId('blog-reader-cover').src = coverSource(post.cover);
    byId('blog-reader-cover').alt = `Portada de ${post.title}`;
    byId('blog-reader-date').textContent = formatDate(post.created);
    byId('blog-reader-title').textContent = post.title;
    const body = byId('blog-reader-body'); body.replaceChildren();
    body.innerHTML=window.MaroheBlogContent.render(post.body,post.images);
    const shareUrl = publicPostUrl(post);
    const canonical = shareUrl.href;
    const shareText = `${post.title} — ${post.excerpt}`;
    byId('blog-share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}&quote=${encodeURIComponent(shareText)}`;
    byId('blog-share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${canonical}`)}`;
    const available=shareable(post);
      for(const id of ['blog-share-facebook','blog-share-whatsapp']){byId(id).hidden=!available;if(!available)byId(id).removeAttribute('href');}
      byId('blog-share-copy').disabled=!available;byId('blog-share-native').disabled=!available;
      byId('blog-share-status').textContent=available?'':'Esta es una copia local. Impórtala al blog público antes de compartirla.';
    byId('blog-reader-dialog').showModal();
  }
  async function sharePost() {
    if (!shareable(currentPost)) return;
    const shareUrl = publicPostUrl(currentPost);
    const data = {title:currentPost.title,text:currentPost.excerpt,url:shareUrl.href};
    if (navigator.share) {
      try { await navigator.share(data); byId('blog-share-status').textContent = 'Listo, compartiste esta idea.'; }
      catch (error) { if (error.name !== 'AbortError') byId('blog-share-status').textContent = 'No se pudo abrir el menú para compartir.'; }
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(`${data.title} — ${data.text}`)}`,'_blank','noopener');
    }
  }
  async function copyPostLink() {
    if (!shareable(currentPost)) return;
    const shareUrl = publicPostUrl(currentPost);
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(shareUrl.href);
      else { const field = make('textarea'); field.value = shareUrl.href; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.append(field); field.select(); const ok = document.execCommand('copy'); field.remove(); if (!ok) throw new Error('copy'); }
      byId('blog-share-status').textContent = 'Enlace copiado.';
    } catch { byId('blog-share-status').textContent = 'No se pudo copiar. Usa los botones de Facebook o WhatsApp.'; }
  }
  function getAdminConfig() {
    try { const value = JSON.parse(localStorage.getItem(ADMIN_KEY)); return value?.salt && value?.hash ? value : null; }
    catch { return null; }
  }
  function setAuthMode() {
    const setup = !cloudReady && !getAdminConfig();
    byId('blog-auth-title').textContent = setup ? 'Crear acceso de administradora' : 'Acceder al dashboard';
    byId('blog-auth-intro').textContent = cloudReady ? 'Ingresa la contraseña de administradora configurada en Vercel para publicar para todos tus lectores.' : setup ? 'Crea una contraseña de al menos 8 caracteres para acceder a tus copias locales en este dispositivo.' : 'Ingresa tu contraseña local. Para publicar a otros dispositivos, primero conecta Storage en Vercel.';
    byId('blog-password-confirm-wrap').hidden = !setup;
    byId('blog-admin-password-confirm').required = setup;
    byId('blog-admin-password').autocomplete = setup ? 'new-password' : 'current-password';
    byId('blog-auth-form').querySelector('button[type="submit"]').textContent = setup ? 'Crear acceso y entrar' : 'Entrar al dashboard';
    byId('blog-auth-status').textContent = '';
  }
  function bytesToHex(bytes) { return [...bytes].map(value => value.toString(16).padStart(2,'0')).join(''); }
  async function passwordHash(password,salt) {
    const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${salt}:${password}`));
    return bytesToHex(new Uint8Array(digest));
  }
  async function authenticate(event) {
    event.preventDefault();
    const password = byId('blog-admin-password').value;
    const current = getAdminConfig();
    try {
      if (cloudReady) { await api('?action=login','POST',{password}); }
      else if (!current) {
        if (password.length < 8) throw new Error('Usa al menos 8 caracteres.');
        if (password !== byId('blog-admin-password-confirm').value) throw new Error('Las contraseñas no coinciden.');
        const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
        localStorage.setItem(ADMIN_KEY,JSON.stringify({salt,hash:await passwordHash(password,salt)}));
      } else if (await passwordHash(password,current.salt) !== current.hash) throw new Error('La contraseña no es correcta.');
      adminUnlocked = true;
      if (cloudReady) await refreshShared();
      byId('blog-admin-auth').close();
      byId('blog-auth-form').reset();
      enterDashboard();
    } catch (error) { byId('blog-auth-status').textContent = error.message || 'No se pudo abrir el dashboard en este navegador.'; }
  }
  function resetEditor() {
    byId('blog-post-form').reset(); byId('blog-post-id').value = ''; byId('blog-post-published').checked = true;
    resetPhoto(); inlineEditor.load();
    byId('blog-admin-status').textContent = 'Editor listo para una nueva publicación.';
  }
  function enterDashboard(){
    if(!adminUnlocked)return;
    if(adminDestination==='city'){location.hash='#explorar';route();window.cityAdmin?.open();}
    else{location.hash='#blog';route();byId('blog-dashboard').hidden=false;renderAdmin();byId('blog-dashboard').scrollIntoView({behavior:'smooth',block:'start'});}
  }
  async function openAdmin(destination='blog'){adminDestination=destination;await refreshShared(true);if(adminUnlocked)enterDashboard();else{setAuthMode();byId('blog-admin-auth').showModal();}}
  async function logoutAdmin(){if(cloudReady){try{await api('?action=logout','POST',{});}catch{byId('blog-admin-status').textContent='No se pudo cerrar la sesión del servidor. Reintenta con conexión.';return;}}adminUnlocked=false;byId('blog-dashboard').hidden=true;resetEditor();window.cityAdmin?.close();await refreshShared();}
  function photoPreview() {
    byId('blog-photo-preview').src = uploadedCover || byId('blog-post-cover').value;
    byId('blog-photo-remove').hidden = !uploadedCover;
  }
  function resetPhoto() {
    uploadGeneration++; uploadedCover = null; uploadBusy = false;
    byId('blog-photo-upload').value = '';
    byId('blog-post-form').querySelector('button[type="submit"]').disabled = false;
    byId('blog-photo-status').textContent = 'JPG, PNG o WebP · máximo 8 MB. La foto se reduce automáticamente.';
    photoPreview();
  }
  async function uploadPhoto() {
    if (!adminUnlocked) return;
    const file = byId('blog-photo-upload').files?.[0]; if (!file) return;
    const generation = ++uploadGeneration; uploadBusy = true;
    byId('blog-post-form').querySelector('button[type="submit"]').disabled = true;
    byId('blog-photo-status').textContent = 'Preparando tu foto…';
    try {
      const cover = await window.BunnyBlogMedia.prepare(file);
      if (generation !== uploadGeneration || !adminUnlocked) return;
      uploadedCover = cover; photoPreview();
      byId('blog-photo-status').textContent = cloudReady ? 'Foto lista. Se publicará con el artículo en todos los dispositivos.' : 'Foto lista para tu copia local. Falta conectar Storage para publicarla.';
    } catch (error) { if (generation === uploadGeneration) byId('blog-photo-status').textContent = error.message || 'No se pudo preparar la foto.'; }
    finally { if (generation === uploadGeneration) { uploadBusy = false; byId('blog-post-form').querySelector('button[type="submit"]').disabled = false; } }
  }
  function renderAdmin() {
    if (!adminUnlocked) return;
    const list = byId('blog-admin-list'); list.replaceChildren();
    const ordered = [...posts].sort((a,b) => new Date(b.updated || b.created) - new Date(a.updated || a.created));
    byId('blog-admin-count').textContent = `${ordered.length} ${ordered.length === 1 ? 'entrada' : 'entradas'}`;
    ordered.forEach(post => {
      const row = make('article','admin-post-row');
      const state = make('span',`admin-post-state${post.published?'':' draft'}`,post.published?'PUBLICADA':'BORRADOR');
      const title = make('h4','',post.title);
      const meta = make('p','',`${post.category} · ${formatDate(post.updated || post.created)}`);
      const actions = make('div','admin-post-actions');
      const edit = make('button','','Editar'); edit.type='button'; edit.addEventListener('click',() => editPost(post.id));
      const toggle = make('button','',post.published?'Ocultar':'Publicar'); toggle.type='button'; toggle.addEventListener('click',() => togglePost(post.id));
      const remove = make('button','delete','Eliminar'); remove.type='button'; remove.addEventListener('click',() => deletePost(post.id));
      actions.append(edit,toggle,remove); row.append(state,title,meta,actions); list.append(row);
    });
  }
  async function editPost(id) {
    if (!adminUnlocked) return;
    let post = posts.find(item => item.id === id); if (!post) return;
    if(cloudReady){try{post=(await api(`?action=edit&id=${encodeURIComponent(id)}`)).post;}catch(error){byId('blog-admin-status').textContent=error.message;return;}}
    resetPhoto();
    byId('blog-post-id').value = post.id; byId('blog-post-title').value = post.title; byId('blog-post-category').value = post.category;
    byId('blog-post-cover').value = allowedCovers.has(post.cover) ? post.cover : 'assets/about-block-bunny.jpg';
    uploadedCover = window.BunnyBlogMedia.safeCover(post.cover) ? post.cover : null; photoPreview();
    byId('blog-post-excerpt').value = post.excerpt; byId('blog-post-body').value = post.body; byId('blog-post-published').checked = !!post.published; inlineEditor.load(post.images);
    byId('blog-admin-status').textContent = `Editando “${post.title}”.`; byId('blog-post-title').focus();
  }
  async function togglePost(id) {
    if (!adminUnlocked) return;
    const post = posts.find(item => item.id === id); if (!post) return;
    if(cloudReady){try{const entry=(await api(`?action=edit&id=${encodeURIComponent(id)}`)).post;entry.published=!entry.published;await storeShared(entry);await refreshShared();}catch(error){byId('blog-admin-status').textContent=error.message;}return;}
    const before = posts.map(item => ({...item}));
    post.published = !post.published; post.updated = new Date().toISOString();
    if (savePosts()) { renderAdmin(); renderPublic(); }
    else { posts = before; byId('blog-admin-status').textContent = 'No se pudo guardar el cambio. Revisa el espacio disponible del navegador.'; }
  }
  async function deletePost(id) {
    if (!adminUnlocked) return;
    const post = posts.find(item => item.id === id); if (!post || !confirm(`¿Eliminar “${post.title}”? Esta acción no se puede deshacer.`)) return;
    if(cloudReady){try{await api(`?id=${encodeURIComponent(id)}`,'DELETE',{});localPosts=localPosts.filter(item=>item.id!==id);savePosts();resetEditor();await refreshShared();}catch(error){byId('blog-admin-status').textContent=error.message;}return;}
    const before = posts;
    posts = posts.filter(item => item.id !== id);
    if (savePosts()) { resetEditor(); renderAdmin(); renderPublic(); }
    else { posts = before; byId('blog-admin-status').textContent = 'No se pudo guardar el cambio. Inténtalo de nuevo.'; }
  }
  async function savePost(event) {
    event.preventDefault(); if (!adminUnlocked || uploadBusy || inlineEditor.isBusy()) return;
    const id = byId('blog-post-id').value;
    const now = new Date().toISOString();
    const entry = {id:id || `post-${Date.now().toString(36)}`,title:byId('blog-post-title').value.trim(),category:byId('blog-post-category').value,cover:uploadedCover || byId('blog-post-cover').value,excerpt:byId('blog-post-excerpt').value.trim(),body:byId('blog-post-body').value.trim(),images:inlineEditor.getImages(),published:byId('blog-post-published').checked,created:now,updated:now};
    if (!entry.title || !entry.excerpt || !entry.body) { byId('blog-admin-status').textContent = 'Completa el título, el resumen y el artículo.'; return; }
    const existing = posts.findIndex(post => post.id === id);
    if (cloudReady) {
      if(existing>=0)entry.created=posts[existing].created;
      byId('blog-post-id').value=entry.id;
      const button=byId('blog-post-form').querySelector('button[type="submit"]');button.disabled=true;
      try {
        await storeShared(entry); resetEditor(); await refreshShared();
        byId('blog-admin-status').textContent=entry.published?'Publicación guardada en el servidor. Ya puede verse desde otros dispositivos, sin un nuevo deployment.':'Borrador guardado en el servidor; solo lo ve la administradora.';
      } catch(error) { byId('blog-admin-status').textContent=`${error.message} El texto sigue en el editor. El artículo aún no se publicó; vuelve a guardar cuando tengas conexión.`; }
      finally { button.disabled=false; }
      return;
    }
    const before = posts.map(post => ({...post}));
    if (existing >= 0) { entry.created = posts[existing].created; posts[existing] = entry; } else posts.push(entry);
    if (!savePosts()) { posts = before; byId('blog-admin-status').textContent = 'No se pudo guardar. Revisa el espacio disponible del navegador.'; return; }
    localPosts=posts.map(post=>({...post}));
    resetEditor(); byId('blog-admin-status').textContent = 'Copia local guardada. Aún no se publicó en otros dispositivos: conecta Storage e importa tus entradas.';
    renderAdmin(); renderPublic();
  }

  byId('blog-search').addEventListener('input',renderPublic);
  byId('blog-category-filter').addEventListener('change',renderPublic);
  byId('blog-reader-close').addEventListener('click',() => byId('blog-reader-dialog').close());
  byId('blog-share-native').addEventListener('click',sharePost);
  byId('blog-share-copy').addEventListener('click',copyPostLink);
  byId('blog-admin-open')?.addEventListener('click',() => openAdmin('blog'));
  byId('city-admin-open').addEventListener('click',() => openAdmin('city'));
  byId('blog-city-dashboard').addEventListener('click',() => openAdmin('city'));
  byId('blog-auth-close').addEventListener('click',() => byId('blog-admin-auth').close());
  byId('blog-auth-form').addEventListener('submit',authenticate);
  byId('blog-admin-logout').addEventListener('click',logoutAdmin);
  byId('blog-post-form').addEventListener('submit',savePost);
  byId('blog-post-cancel').addEventListener('click',resetEditor);
  byId('blog-import-local').addEventListener('click',importLocal);
  byId('blog-export-local').addEventListener('click',exportLocal);
  byId('blog-import-backup').addEventListener('change',importBackup);
  byId('blog-refresh').addEventListener('click',()=>refreshShared(true));
  byId('blog-photo-upload').addEventListener('change',uploadPhoto);
  byId('blog-photo-remove').addEventListener('click',resetPhoto);
  byId('blog-post-cover').addEventListener('change',resetPhoto);
  photoPreview();
  renderPublic();
  configureDashboard(); void refreshShared(true);
  addEventListener('online',()=>refreshShared(true));
  addEventListener('hashchange',()=>{if(['#blog','#news','#podcast'].includes(location.hash))void refreshShared(true);});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden && ['','#inicio','#blog','#news','#podcast'].includes(location.hash))void refreshShared(true);});
  setInterval(()=>{if(!document.hidden && ['','#inicio','#blog','#news','#podcast'].includes(location.hash) && !adminUnlocked)void refreshShared();},30000);
  window.blogApp = {refresh:()=>refreshShared(true),count:() => posts.filter(post => post.published).length};
  window.mateAdmin = {isUnlocked:()=>adminUnlocked,open:openAdmin,logout:logoutAdmin};
})();
