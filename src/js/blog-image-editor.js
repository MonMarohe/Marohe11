'use strict';
window.createBlogImageEditor=function({canEdit,onBusy}){
 const field=document.getElementById('blog-post-body'),upload=document.getElementById('blog-body-upload'),list=document.getElementById('blog-body-images'),status=document.getElementById('blog-body-image-status'),preview=document.getElementById('blog-body-preview');
 let images=[],generation=0,busy=false;
 const token=id=>'[[imagen:'+id+']]';
 function updatePreview(){preview.innerHTML=window.MaroheBlogContent.render(field.value,images);}
 function insert(image,pos=field.selectionEnd){
  const value='\n\n'+token(image.id)+'\n\n';
  if(field.value.length+value.length>field.maxLength)throw new Error('El artículo llegó al límite de texto. Quita unas líneas para insertar la imagen.');
  field.setRangeText(value,pos,pos,'end');field.focus();updatePreview();
 }
 function renderList(){
  list.replaceChildren();
  images.forEach((image,index)=>{
   const row=document.createElement('div');row.className='blog-body-image-item';
   const img=document.createElement('img');img.src=image.src;img.alt=image.alt||'Imagen '+(index+1);
   const label=document.createElement('label');label.textContent='Descripción / pie de foto '+(index+1);
   const caption=document.createElement('input');caption.value=image.alt;caption.maxLength=160;caption.addEventListener('input',()=>{image.alt=caption.value;img.alt=caption.value;updatePreview();});label.append(caption);
   const put=document.createElement('button');put.type='button';put.textContent='Insertar aquí';put.addEventListener('click',()=>{try{insert(image);}catch(e){status.textContent=e.message;}});
   const remove=document.createElement('button');remove.type='button';remove.textContent='Quitar imagen';remove.addEventListener('click',()=>{images=images.filter(i=>i.id!==image.id);field.value=field.value.split(token(image.id)).join('');renderList();updatePreview();status.textContent='Imagen quitada del editor. Guarda para aplicar el cambio.';});
   row.append(img,label,put,remove);list.append(row);
  });
  upload.disabled=busy||images.length>=4;
 }
 upload.addEventListener('change',async()=>{
  const file=upload.files?.[0];if(!file||!canEdit()||busy)return;
  if(images.length>=4){status.textContent='Puedes incluir hasta 4 imágenes dentro del artículo.';return;}
  const version=generation,pos=field.selectionEnd;busy=true;onBusy(true);upload.disabled=true;status.textContent='Preparando imagen…';
  try{
   const src=await window.BunnyBlogMedia.prepare(file);
   if(version!==generation||!canEdit())return;
   const image={id:'foto-'+crypto.randomUUID(),src,alt:''};
   insert(image,Math.min(pos,field.value.length));images.push(image);renderList();updatePreview();
   status.textContent='Imagen insertada. Puedes escribir antes y después, añadir un pie de foto y guardar la publicación.';
  }catch(e){if(version===generation)status.textContent=e.message||'No se pudo subir la imagen.';}
  finally{if(version===generation){busy=false;onBusy(false);upload.value='';renderList();}}
 });
 field.addEventListener('input',updatePreview);
 return {
  getImages:()=>images.filter(i=>field.value.includes(token(i.id))).map(i=>({...i})),
  load(values=[]){generation++;busy=false;onBusy(false);upload.value='';images=(values||[]).map(i=>({...i}));status.textContent='Hasta 4 imágenes por artículo. JPG, PNG o WebP · máximo 8 MB cada una.';renderList();updatePreview();},
  isBusy:()=>busy
 };
};
