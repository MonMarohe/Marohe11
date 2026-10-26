const test=require('node:test'),assert=require('node:assert/strict');
const {render}=require('../src/js/blog-content');
const {createHandler}=require('../api/post');
test('inline images render between text on public article with safe captions and URLs',async()=>{
 const post={id:'image-post',title:'Imágenes',excerpt:'Resumen',published:true,cover:'assets/marohe-stained-hearts.jpg',body:'Antes\n\n[[imagen:foto-1]]\n\nDespués <script>bad()</script>',images:[{id:'foto-1',src:'/api/blog?action=image&id=image-post&image=foto-1&v=2026',alt:'Un "corazón" <3'}]};
 const r={setHeader(){},end(body){this.body=body}};await createHandler(async()=>post)({method:'GET',url:'/api/post?id=image-post'},r);
 assert.equal(r.statusCode,200);assert.match(r.body,/<p>Antes<\/p><figure/);assert.match(r.body,/<\/figure><p>Después &lt;script&gt;/);assert.match(r.body,/Un &quot;corazón&quot; &lt;3/);assert.doesNotMatch(r.body,/\[\[imagen:|<script>/);
 assert.equal(render('[[imagen:foto-1]]',[{...post.images[0],src:'javascript:alert(1)'}]),'');
 assert.equal(render('Texto antiguo\n\nSegundo párrafo'),'<p>Texto antiguo</p><p>Segundo párrafo</p>');
});
