const THEMES=[
  {name:'سایبر',bg:'#05060f',text:'#e6f1ff',accent:'#00e5ff',accent2:'#ff2bd6'},
  {name:'ماتریکس',bg:'#020b05',text:'#d8ffe6',accent:'#00ff6a',accent2:'#b6ff00'},
  {name:'پلاسما',bg:'#0a0418',text:'#f1e8ff',accent:'#9b5cff',accent2:'#ff4d8d'},
  {name:'آمبر',bg:'#0f0803',text:'#fff1e0',accent:'#ff9a00',accent2:'#ff3d00'},
  {name:'یخ',bg:'#050b14',text:'#eaf6ff',accent:'#7fd4ff',accent2:'#ffffff'},
];
const DEFAULTS={name:'نام شما',bio:'دانشجوی برنامه‌نویسی و عاشق فناوری‌های آینده.\nاز اینجا با من در ارتباط باشید.',emoji:'🚀',photo:'',
  links:[{title:'گیت‌هاب',url:'https://github.com'},{title:'لینکدین',url:'https://linkedin.com'}],
  style:{...THEMES[0],font:"'Vazirmatn',Tahoma,sans-serif",radius:'14px',anim:true}};
const KEY='personal-page-futuristic-v1';
let state=load();
const $=id=>document.getElementById(id);
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s)return{...DEFAULTS,...s,style:{...DEFAULTS.style,...s.style}}}catch(e){}return structuredClone(DEFAULTS)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function safeUrl(u){if(!u)return'#';if(!/^[a-z][a-z0-9+.-]*:/i.test(u))u='https://'+u;return/^(https?:|mailto:|tel:)/i.test(u)?u:'#'}

function render(){
  const s=state.style,r=document.documentElement.style;
  r.setProperty('--bg',s.bg);r.setProperty('--text',s.text);r.setProperty('--accent',s.accent);r.setProperty('--accent2',s.accent2);
  r.setProperty('--font',s.font);r.setProperty('--radius',s.radius);
  document.body.classList.toggle('noanim',!s.anim);
  $('vName').textContent=state.name||'—';$('vBio').textContent=state.bio;
  const av=$('vAvatar');av.textContent='';
  if(state.photo){const i=new Image();i.src=state.photo;i.alt=state.name;av.appendChild(i)}else av.textContent=state.emoji;
  const box=$('vLinks');box.innerHTML='';
  if(!state.links.length)box.innerHTML='<div class="empty">هنوز لینکی اضافه نشده است.</div>';
  state.links.forEach((l,i)=>{const a=document.createElement('a');a.textContent=l.title||l.url;a.href=safeUrl(l.url);
    a.target='_blank';a.rel='noopener noreferrer';a.style.setProperty('--i',i);box.appendChild(a)});
}
function renderLinkEditor(){
  const box=$('linkEditor');box.innerHTML='';
  state.links.forEach((l,i)=>{
    const d=document.createElement('div');d.className='link-item';
    d.innerHTML=`<input type="text" placeholder="عنوان"><input type="url" placeholder="https://..." style="margin-top:6px;direction:ltr">
    <div class="row"><button class="btn" data-a="up">↑</button><button class="btn" data-a="down">↓</button><button class="btn danger" data-a="del">حذف</button></div>`;
    const[t,u]=d.querySelectorAll('input');t.value=l.title;u.value=l.url;
    t.oninput=()=>{l.title=t.value;save();render()};u.oninput=()=>{l.url=u.value;save();render()};
    d.querySelectorAll('button').forEach(b=>b.onclick=()=>{const a=b.dataset.a,L=state.links;
      if(a==='del')L.splice(i,1);
      if(a==='up'&&i>0)[L[i-1],L[i]]=[L[i],L[i-1]];
      if(a==='down'&&i<L.length-1)[L[i+1],L[i]]=[L[i],L[i+1]];
      save();renderLinkEditor();render()});
    box.appendChild(d)});
}
$('addLink').onclick=()=>{state.links.push({title:'',url:''});save();renderLinkEditor();render()};
[['name','name'],['bio','bio'],['emoji','emoji']].forEach(([id,k])=>$(id).oninput=e=>{state[k]=e.target.value;save();render()});

$('photo').onchange=e=>{const f=e.target.files[0];if(!f)return;const img=new Image(),url=URL.createObjectURL(f);
  img.onload=()=>{const c=document.createElement('canvas'),s=240,m=Math.min(img.width,img.height);c.width=c.height=s;
    c.getContext('2d').drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,s,s);
    state.photo=c.toDataURL('image/jpeg',.85);URL.revokeObjectURL(url);save();render()};img.src=url};
$('removePhoto').onclick=()=>{state.photo='';save();render()};

THEMES.forEach(t=>{const b=document.createElement('button');b.className='swatch';b.title=t.name;b.setAttribute('aria-label','تم '+t.name);
  b.style.background=`linear-gradient(135deg,${t.accent} 50%,${t.accent2} 50%)`;
  b.onclick=()=>{Object.assign(state.style,{bg:t.bg,text:t.text,accent:t.accent,accent2:t.accent2});save();sync();render()};$('themes').appendChild(b)});
[['cBg','bg'],['cText','text'],['cAccent','accent'],['cAccent2','accent2'],['font','font'],['shape','radius']]
  .forEach(([id,k])=>$(id).oninput=e=>{state.style[k]=e.target.value;save();render()});
$('anim').onchange=e=>{state.style.anim=e.target.checked;save();render()};
function sync(){const s=state.style;$('name').value=state.name;$('bio').value=state.bio;$('emoji').value=state.emoji;
  $('cBg').value=s.bg;$('cText').value=s.text;$('cAccent').value=s.accent;$('cAccent2').value=s.accent2;
  $('font').value=s.font;$('shape').value=s.radius;$('anim').checked=s.anim}

$('exportBtn').onclick=()=>{const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='my-page.json';a.click()};
$('importBtn').onclick=()=>$('importFile').click();
$('importFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const s=JSON.parse(r.result);state={...DEFAULTS,...s,style:{...DEFAULTS.style,...s.style}};save();sync();renderLinkEditor();render()}catch(x){alert('فایل معتبر نیست.')}};r.readAsText(f)};
$('resetBtn').onclick=()=>{if(!confirm('همه‌ی تغییرات پاک شود؟'))return;state=structuredClone(DEFAULTS);save();sync();renderLinkEditor();render()};
$('toggleMode').onclick=()=>{const v=document.body.classList.toggle('view');$('toggleMode').textContent=v?'✏️ حالت ویرایش':'👁 حالت نمایش'};

/* ===== افکت‌ها: نور دنبال‌کننده‌ی موس + چرخش سه‌بعدی کارت ===== */
const glow=$('glow'),hud=$('hud');
addEventListener('pointermove',e=>{
  glow.style.transform=`translate(${e.clientX-210}px,${e.clientY-210}px)`;
  const b=hud.getBoundingClientRect();
  const x=(e.clientX-(b.left+b.width/2))/innerWidth,y=(e.clientY-(b.top+b.height/2))/innerHeight;
  hud.style.setProperty('--ry',(x*14)+'deg');hud.style.setProperty('--rx',(-y*14)+'deg');
});

/* ===== ذرات شبکه‌ای روی بوم ===== */
const cv=$('fx'),cx=cv.getContext('2d');let P=[];
function size(){cv.width=innerWidth;cv.height=innerHeight;P=Array.from({length:Math.min(70,innerWidth/18|0)},()=>
  ({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))}
addEventListener('resize',size);size();
(function loop(){
  if(state.style.anim&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    cx.clearRect(0,0,cv.width,cv.height);
    const c=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#0ff';
    cx.fillStyle=c;cx.strokeStyle=c;
    P.forEach((p,i)=>{p.x=(p.x+p.vx+cv.width)%cv.width;p.y=(p.y+p.vy+cv.height)%cv.height;
      cx.globalAlpha=.7;cx.beginPath();cx.arc(p.x,p.y,1.6,0,7);cx.fill();
      for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<120){cx.globalAlpha=(1-d/120)*.35;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}});
  }
  requestAnimationFrame(loop);
})();

sync();renderLinkEditor();render();
