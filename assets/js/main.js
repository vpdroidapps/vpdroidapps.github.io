/* ══ THEME — persists to localStorage ══ */
const html=document.documentElement,tBtn=document.getElementById('themeToggle'),tIcon=document.getElementById('themeIcon');
const sysMQ=window.matchMedia('(prefers-color-scheme: light)');
let saved=localStorage.getItem('vp_theme'); // 'dark' | 'light' | null

function isDark(){
  if(saved==='dark') return true;
  if(saved==='light') return false;
  return !sysMQ.matches; // follow system
}
function applyTheme(animate){
  if(animate) html.style.transition='background .35s,color .35s';
  const d=isDark();
  html.classList.toggle('dark',d);
  html.classList.toggle('light',!d);
  tIcon.textContent=d?'☀️':'🌙';
  tBtn.setAttribute('title', d?'Switch to Light Mode':'Switch to Dark Mode');
  updateNavBg();
}
sysMQ.addEventListener('change',()=>{ if(!saved) applyTheme(true); });
tBtn.addEventListener('click',()=>{
  saved=isDark()?'light':'dark';
  localStorage.setItem('vp_theme',saved);
  applyTheme(true);
});
applyTheme(false);

/* ══ NAV BG ══ */
function updateNavBg(){
  const d=isDark(),s=window.scrollY>10,nb=document.getElementById('navbar');
  nb.style.background=s?(d?'rgba(9,8,10,.97)':'rgba(255,253,244,.98)'):(d?'rgba(9,8,10,.82)':'rgba(255,253,244,.88)');
}
window.addEventListener('scroll',updateNavBg,{passive:true});

/* ══ SCROLL PROGRESS BAR ══ */
const pb=document.getElementById('progress-bar');
window.addEventListener('scroll',()=>{
  const h=document.documentElement,b=document.body;
  const total=Math.max(h.scrollHeight,h.offsetHeight,b.scrollHeight,b.offsetHeight)-h.clientHeight;
  pb.style.width=(window.scrollY/total*100)+'%';
},{ passive:true });

/* ══ BACK TO TOP ══ */
const btt=document.getElementById('back-top');
window.addEventListener('scroll',()=>{
  btt.classList.toggle('show',window.scrollY>400);
},{ passive:true });

/* ══ ACTIVE NAV HIGHLIGHT ══ */
const sections=['about','services','work','pricing','faq','blog','contact'];
const navLinks=document.querySelectorAll('.nav-links a[data-section]');
const mobLinks=document.querySelectorAll('.mobile-menu a');

function setActive(id){
  navLinks.forEach(a=>{
    a.classList.toggle('active',a.getAttribute('data-section')===id && !a.classList.contains('nav-cta'));
  });
  mobLinks.forEach(a=>{
    const href=a.getAttribute('href');
    a.classList.toggle('active',href==='#'+id);
  });
}

const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) setActive(e.target.id);
  });
},{rootMargin:'-30% 0px -60% 0px'});
sections.forEach(id=>{ const el=document.getElementById(id); if(el) sectionObserver.observe(el); });

/* ══ HAMBURGER ══ */
const hbg=document.getElementById('hamburger'),mob=document.getElementById('mobileMenu');
hbg.addEventListener('click',()=>{
  const open=hbg.classList.toggle('open');
  mob.classList.toggle('open',open);
  hbg.setAttribute('aria-expanded',open);
});
function closeMenu(){hbg.classList.remove('open');mob.classList.remove('open');hbg.setAttribute('aria-expanded','false');}
document.addEventListener('click',e=>{if(!hbg.contains(e.target)&&!mob.contains(e.target))closeMenu();});

/* ══ PRELOADER ══ */
window.addEventListener('load',()=>{setTimeout(()=>document.getElementById('preloader').classList.add('hide'),1500);});

/* ══ CURSOR — fully rebuilt ══ */
(function(){
  // Only run on devices with a real pointer (not touch-only)
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  const dot  = document.getElementById('cur');
  const ring = document.getElementById('cur-r');
  if(!dot || !ring) return;

  let mx = window.innerWidth/2;  // start at center, not 0,0
  let my = window.innerHeight/2;
  let rx = mx, ry = my;
  let visible = false;
  let rafId;

  // Immediately position at center so first appearance isn't a jump from 0,0
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';

  // Show cursor on first mouse move
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Snap dot to cursor instantly (no lag on dot)
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    if(!visible){
      visible = true;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    }
  }, { passive: true });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    visible = false;
  });
  document.addEventListener('mouseenter', () => {
    if(visible) return;
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
    visible = true;
  });

  // Ring smoothly follows with lag (RAF loop)
  function animateRing(){
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Click effect
  document.addEventListener('mousedown', () => {
    dot.classList.add('is-click');
    ring.classList.add('is-click');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('is-click');
    ring.classList.remove('is-click');
  });

  // Hover states on interactive elements
  const hoverEls = 'a, button, [role="button"], .bc, .wc, .ccard, .faq-q, .blog-card, .pc, .tc, .tech-card, .pill, .client-logo, .stag, label, select, .play-link, .wa-float, #back-top, .hamburger, .theme-toggle, .sub-btn, .btn-acc, .btn-outline, input, textarea';

  function addHover(el){
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    }, { passive: true });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    }, { passive: true });
  }

  // Text input cursor style
  function addText(el){
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-text');
      ring.classList.add('is-text');
    }, { passive: true });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-text');
      ring.classList.remove('is-text');
    }, { passive: true });
  }

  // Apply to existing elements
  document.querySelectorAll(hoverEls).forEach(addHover);
  document.querySelectorAll('input, textarea').forEach(el => {
    addText(el);
    // text elements also need the hover removed to avoid conflict
    el.addEventListener('mouseenter', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    }, { passive: true });
  });

  // Watch for new elements added to DOM (modals, dynamic content)
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if(node.nodeType !== 1) return;
        if(node.matches && node.matches(hoverEls)) addHover(node);
        node.querySelectorAll && node.querySelectorAll(hoverEls).forEach(addHover);
        if(node.matches && node.matches('input, textarea')) addText(node);
        node.querySelectorAll && node.querySelectorAll('input, textarea').forEach(addText);
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

/* ══ SCROLL REVEAL ══ */
const revIO=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('on'),i*60);revIO.unobserve(e.target);}});
},{threshold:.07});
document.querySelectorAll('.reveal').forEach(el=>revIO.observe(el));

/* ══ FAQ ══ */
function toggleFaq(el){
  const item=el.parentElement;
  const wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>{
    i.classList.remove('open');
    i.querySelector('.faq-q').setAttribute('aria-expanded','false');
  });
  if(!wasOpen){
    item.classList.add('open');
    el.setAttribute('aria-expanded','true');
  }
}

/* ══ COOKIE ══ */
(function(){if(localStorage.getItem('vp_cookie'))document.getElementById('cookie-banner').classList.add('hide');})();
function acceptCookies(){localStorage.setItem('vp_cookie','1');document.getElementById('cookie-banner').classList.add('hide');}
function declineCookies(){document.getElementById('cookie-banner').classList.add('hide');}

/* ══ FORM — inline validation ══ */
function validateField(id,errId,check){
  const el=document.getElementById(id);
  const err=document.getElementById(errId);
  const valid=check(el.value.trim());
  el.classList.toggle('err-field',!valid);
  el.classList.toggle('ok-field',valid);
  if(err){err.classList.toggle('show',!valid);}
  return valid;
}

function clearFieldErr(id,errId){
  const el=document.getElementById(id);
  const err=errId?document.getElementById(errId):null;
  el.classList.remove('err-field');
  if(err) err.classList.remove('show');
}

// Live validation on blur
['f-name','f-email','f-service','f-msg'].forEach(id=>{
  const el=document.getElementById(id);
  if(!el) return;
  el.addEventListener('input',()=>{ if(el.classList.contains('err-field')) clearFieldErr(id,null); });
});

function submitForm(){
  let ok=true;
  ok=validateField('f-name','err-name',v=>v.length>0) && ok;
  ok=validateField('f-email','err-email',v=>v.includes('@')&&v.includes('.')) && ok;
  ok=validateField('f-service','err-service',v=>v.length>0) && ok;
  ok=validateField('f-msg','err-msg',v=>v.length>10) && ok;
  if(!ok) return;

  const btn=document.getElementById('submitBtn');
  btn.disabled=true; btn.textContent='Sending…';

  const n=document.getElementById('f-name').value.trim();
  const e=document.getElementById('f-email').value.trim();
  const s=document.getElementById('f-service').value;
  const b=document.getElementById('f-budget').value||'Not specified';
  const m=document.getElementById('f-msg').value.trim();
  const ph=document.getElementById('f-phone').value.trim();

  const sub=encodeURIComponent(`[VPDroid] ${s} — from ${n}`);
  const body=encodeURIComponent(`Name: ${n}\nEmail: ${e}\nPhone: ${ph}\nBudget: ${b}\n\nProject Details:\n${m}`);
  window.location.href=`mailto:vpdroidapps@gmail.com?subject=${sub}&body=${body}`;
  document.getElementById('form-area').style.display='none';
  document.getElementById('form-ok').style.display='block';
  document.getElementById('reply-email').textContent=e;
}
