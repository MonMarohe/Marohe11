'use strict';
(() => {
 const root=document.getElementById('play');
 const tabMarkup=`<div class="play-tabs" aria-label="Herramientas Play"><a href="#play/ruletas" data-play="ruletas">RULETAS</a><a href="#play/retos" data-play="retos">RETOS</a><a href="#play/memes" data-play="memes">MEME GENERATOR</a><a href="#explorar" data-play="ar">AR CITY</a><a href="#play/games" data-play="games">VIDEOJUEGOS</a></div>`;
 root.innerHTML=`<div class="play-heading"><span class="eyebrow">EL LABORATORIO DE MAROHE</span><h1>CREA. JUEGA. RÍE.</h1><p>Un lugar para jugar con tus ideas y llevarlas al mundo.</p></div>${tabMarkup}
 <section class="play-tool play-catalog" data-tool="games"><h2>VIDEOJUEGOS</h2><p>Ocho aventuras. Encuentra tu chispa.</p><div id="play-games"></div></section>
 <section class="play-tool play-retos" data-tool="retos" hidden aria-labelledby="quiz-shelf-title"><span class="play-slogan">PREGUNTA. DESCUBRE. CONECTA.</span><h2 id="quiz-shelf-title">RETOS</h2><p>Dos retos para encender la curiosidad.</p><div id="quiz-root"></div></section>
 <section class="play-tool play-roulettes" data-tool="ruletas" hidden aria-labelledby="roulette-shelf-title"><span class="play-slogan">TÚ PONES EL ANTOJO. EL AZAR PONE EL PLAN.</span><h2 id="roulette-shelf-title">RULETAS MAROHE</h2><p>Para esas veces en que elegir también puede ser un juego.</p><div class="roulette-picker">
 <a class="roulette-cover roulette-cover-movies" href="peliculas/index.html" aria-label="Abrir MAROHE Ruleta de Pelis"><span class="roulette-kicker">01 / UNA NOCHE DE PELI</span><div class="roulette-cover-scene" aria-hidden="true"><span class="roulette-flower">✿</span><div class="mini-slot"><span>✦ MAROHE ✦</span><div><i>★</i><i>▶</i><i>♡</i></div><b>EL AZAR DA PLAY</b></div><span class="roulette-star">✦</span></div><h3>Ruleta<br>de Pelis</h3><p>Géneros, moods y un poquito de azar.</p><span class="roulette-card-action">Elegir mi peli ↗</span></a>
 <article class="roulette-cover roulette-cover-restaurants" aria-label="Ruleta de Restaurantes, próximamente"><span class="roulette-kicker">02 / UN NUEVO ANTOJO</span><div class="roulette-cover-scene" aria-hidden="true"><span class="roulette-flower">✿</span><div class="mini-slot"><span>✦ MAROHE ✦</span><div><i>☕</i><i>♡</i><i>✿</i></div><b>UNA MESA POR DESCUBRIR</b></div><span class="roulette-star">✦</span></div><h3>Ruleta de<br>Restaurantes</h3><p>Tu próxima mesa en Perú está en camino.</p><span class="roulette-soon">PRÓXIMAMENTE</span></article>
 </div></section>
 <section class="play-tool" data-tool="memes" hidden><span class="play-slogan">CREA. JUEGA. RÍE.</span><h2>MEME GENERATOR</h2><p>Elige una escena de cine, arte o teatro y escribe tu propia reacción.</p><div class="studio-grid"><div class="studio-controls"><div id="meme-templates" class="template-list"></div><label for="meme-image">Tu propia foto · opcional</label><input id="meme-image" type="file" accept="image/png,image/jpeg,image/webp"><label for="meme-top">Texto de arriba</label><input id="meme-top" type="text" maxlength="100" value="CUANDO DICEN QUE EL CINE ES ABURRIDO"><label for="meme-bottom">Texto de abajo</label><input id="meme-bottom" type="text" maxlength="100" value=""><button id="meme-ideas" type="button">Sugerir frases</button><div id="meme-captions" class="caption-ideas" aria-live="polite"></div></div><div class="studio-preview"><canvas id="meme-canvas" width="1024" height="1024" aria-label="Vista previa de tu meme"></canvas><button id="meme-download" type="button">Descargar PNG ↓</button></div></div></section>
 `;
 const gameCatalog=[
  ['usa','usa-bunny.svg','Welcome Cusco','Aventura por Perú','Cusco','Sigue a la alpaca por terrazas de piedra inspiradas en Machu Picchu, Cusco.'],
  ['fuel','lima-bunny.svg','Welcome Lima','Plataformas','Lima','Salta entre letreros chicha y descubre nuevos caminos.'],
  ['peru','peru-bunny.svg','Welcome Chan Chan','Aventura por Perú','Chan Chan','Recorre los patios de adobe de Chan Chan junto a una alpaca.'],
  ['australia','australia-bunny.svg','Welcome Iquitos','Aventura por Perú','Iquitos','Explora una selva inspirada en Iquitos. Cada sendero abre una nueva aventura.'],
  ['city','arequipa-vicuna.png','Welcome Arequipa','Vuelo','Arequipa','Vuela con la vicuña entre edificios de sillar y encuentra tu ritmo.'],
  ['match','boba-bunny.png','Boba Mate','Combina 3','Boba','Combina bobas y colores en una pausa de juego inspirada en los sabores del Perú.'],
  ['blocks','block-bunny.png','Block Mate','Bloques','Construcción','Pieza a pieza, imagina construcciones y patrones inspirados en el Perú.'],
  ['juego','escape-bunny-v3.png','Escape Mate','4 mundos','Aventura','Abre caminos con Mate por mundos inspirados en la costa, la selva y los Andes.']
 ];
 document.getElementById('play-games').innerHTML=`<div class="poster-row">${gameCatalog.map(([route,image,title,genre,place,description],index)=>`<a class="poster-card" href="#${route}" aria-label="Jugar ${title}"><div class="poster-image"><img loading="lazy" decoding="async" src="assets/${image}" alt="Portada de ${title}"><span class="poster-number">${String(index+1).padStart(2,'0')}</span><span class="poster-play" aria-hidden="true"><span>▶</span></span></div><div class="poster-meta"><strong>JUGAR</strong><span>${genre}</span><span>${place}</span></div><h3>${title}</h3><p>${description}</p></a>`).join('')}</div>`;
 const ar=document.getElementById('explorar');ar.insertAdjacentHTML('afterbegin',tabMarkup);
 function sync(){const isPlay=location.hash.split('/')[0]==='#play';const requested=location.hash.split('/')[1],key=['games','memes','retos','ruletas'].includes(requested)?requested:'ruletas';root.querySelectorAll('[data-tool]').forEach(el=>el.hidden=el.dataset.tool!==key);document.querySelectorAll('[data-play]').forEach(a=>{if(a.dataset.play===(isPlay?key:'ar'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
 addEventListener('hashchange',sync);sync();route();
 const get=id=>document.getElementById(id);
 const templates=[['Cine','assets/meme-cine.png'],['Arte','assets/blog/post-mvlnnsmu.jpg'],['Teatro','assets/crush-02.jpg']];
 const scenes=templates.map(([,src])=>{const img=new Image();img.src=src;return img;});
 let selected=0, ownImage=null;
 function art(canvas,index){
   const ctx=canvas.getContext('2d');
   const img=canvas.id==='meme-canvas' && ownImage || scenes[index];
   ctx.fillStyle='#161018';ctx.fillRect(0,0,canvas.width,canvas.height);
   if(!img.naturalWidth)return;
   const scale=Math.min(canvas.width/img.naturalWidth,canvas.height/img.naturalHeight);
   const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
   ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
 }
 function lines(x,text,max){const words=text.toUpperCase().split(/\s+/);const result=[];let row='';for(const word of words){for(const part of (word.match(/.{1,22}/gu)||[''])){const next=row?row+' '+part:part;if(x.measureText(next).width>max&&row){result.push(row);row=part;}else row=next;}}if(row)result.push(row);return result.slice(0,4);}
 function meme(){const c=get('meme-canvas'),x=c.getContext('2d');art(c,selected);x.font='900 58px Arial';x.textAlign='center';x.lineJoin='round';x.lineWidth=9;x.strokeStyle='#201627';x.fillStyle='white';for(const [text,bottom]of[[get('meme-top').value,false],[get('meme-bottom').value,true]]){const rows=lines(x,text,900);rows.forEach((t,i)=>{const y=bottom?960-(rows.length-1-i)*62:78+i*62;x.strokeText(t,512,y);x.fillText(t,512,y);});}}
 templates.forEach((t,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Plantilla ${t[0]}`);b.setAttribute('aria-pressed',String(i===0));const c=document.createElement('canvas');c.width=c.height=160;const label=document.createElement('small');label.textContent=t[0];b.append(c,label);b.onclick=()=>{selected=i;ownImage=null;get('meme-image').value='';get('meme-templates').querySelectorAll('button').forEach((el,j)=>el.setAttribute('aria-pressed',String(j===i)));get('meme-captions').replaceChildren();meme();};get('meme-templates').append(b);});
 function redraw(){get('meme-templates').querySelectorAll('canvas').forEach((c,i)=>art(c,i));meme();}scenes.forEach(img=>img.onload=redraw);redraw();get('meme-image').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10*1024*1024){alert('Usa PNG, JPG o WebP de hasta 10 MB.');return;}const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();ownImage=img;meme();}catch{alert('No se pudo abrir la foto.');}finally{URL.revokeObjectURL(url);}};['meme-top','meme-bottom'].forEach(id=>get(id).addEventListener('input',meme));
 function download(c,name){const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download=name;document.body.append(a);a.click();a.remove();}
 get('meme-download').onclick=()=>download(get('meme-canvas'),'marohe-meme.png');
 const ideas=[[['VINE POR LAS PALOMITAS','SALÍ DISCUTIENDO EL FINAL']], [['YO FRENTE AL CUADRO','MI AMIGA YA LEYÓ LA CARTELA']], [['ÚLTIMO ENSAYO','ALGUIEN CAMBIÓ EL GUIÓN']]];
 get('meme-ideas').onclick=()=>{const pairs=ideas[selected];get('meme-captions').replaceChildren();pairs.forEach(([a,b])=>{const button=document.createElement('button');button.type='button';button.textContent=a+' / '+b;button.onclick=()=>{get('meme-top').value=a;get('meme-bottom').value=b;meme();};get('meme-captions').append(button);});};

})();
