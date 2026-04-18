/* ═══════════════════════════════════════════════
   ROTATING QUOTES
═══════════════════════════════════════════════ */
(function () {
  const quotes = document.querySelectorAll('.hero-quote');
  if (!quotes.length) return;
  let current = 0;
  setInterval(() => {
    quotes[current].classList.remove('active');
    current = (current + 1) % quotes.length;
    quotes[current].classList.add('active');
  }, 4000);
})();

/* ═══════════════════════════════════════════════
   NAVBAR — scroll effect + hamburger
═══════════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ═══════════════════════════════════════════════
   INTERSECTION OBSERVER — reveal on scroll
═══════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ═══════════════════════════════════════════════
   ACTIVE NAV LINK — highlight on scroll
═══════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id], footer[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════════
   GALLERY LIGHTBOX
═══════════════════════════════════════════════ */
(function () {
  const lightbox  = document.getElementById('lightbox');
  const lbBg      = document.getElementById('lb-bg');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');
  const lbImg     = document.getElementById('lb-img');
  const lbCounter = document.getElementById('lb-counter');
  const lbYear    = document.getElementById('lb-year-el');
  const lbTitle   = document.getElementById('lb-title-el');
  const lbMedium  = document.getElementById('lb-medium-el');
  const lbDesc    = document.getElementById('lb-desc-el');

  if (!lightbox) return;

  const cards = Array.from(document.querySelectorAll('.work-card[data-img]'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    populateLightbox(currentIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Return focus to the card that opened it
    if (cards[currentIndex]) cards[currentIndex].focus();
  }

  function populateLightbox(index) {
    const card = cards[index];
    if (!card) return;

    // Show loading state
    lbImg.classList.add('loading');

    const src    = card.dataset.img    || '';
    const title  = card.dataset.title  || '';
    const year   = card.dataset.year   || '';
    const medium = card.dataset.medium || '';
    const desc   = card.dataset.desc   || '';
    const total  = cards.length;

    lbCounter.textContent = `${index + 1} / ${total}`;
    lbYear.textContent    = year;
    lbTitle.textContent   = title;
    lbMedium.textContent  = medium;
    lbDesc.textContent    = desc;
    lbImg.alt             = `${title}, ${year}`;

    // Load image
    const tmpImg = new Image();
    tmpImg.onload = () => {
      lbImg.src = src;
      lbImg.classList.remove('loading');
    };
    tmpImg.onerror = () => {
      lbImg.src = src; // try anyway
      lbImg.classList.remove('loading');
    };
    tmpImg.src = src;

    // Show/hide arrows
    lbPrev.style.opacity = index === 0 ? '0.3' : '1';
    lbNext.style.opacity = index === total - 1 ? '0.3' : '1';
  }

  function prevWork() {
    if (currentIndex > 0) populateLightbox(--currentIndex);
  }

  function nextWork() {
    if (currentIndex < cards.length - 1) populateLightbox(++currentIndex);
  }

  // Open on card click or Enter/Space
  cards.forEach((card, i) => {
    card.addEventListener('click', () => openLightbox(i));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  // Controls
  lbClose.addEventListener('click', closeLightbox);
  lbBg.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevWork);
  lbNext.addEventListener('click', nextWork);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevWork();
    if (e.key === 'ArrowRight') nextWork();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextWork() : prevWork();
  });
})();

/* ═══════════════════════════════════════════════
   BLUEPRINT CORNER MARKS — injected dynamically
═══════════════════════════════════════════════ */
document.querySelectorAll('.invention-card').forEach(card => {
  ['tl','tr','bl','br'].forEach(pos => {
    const s = document.createElement('span');
    s.className = `bp-corner bp-${pos}`;
    s.setAttribute('aria-hidden', 'true');
    card.appendChild(s);
  });
});

/* ═══════════════════════════════════════════════
   BLOG — expand / collapse posts
═══════════════════════════════════════════════ */
function togglePost(id, btn) {
  const full = document.getElementById(id);
  const isOpen = full.classList.toggle('open');
  btn.textContent = isOpen ? 'Collapse' : 'Read Full Post';
}

/* ═══════════════════════════════════════════════
   NEWSLETTER — subscribe handler
═══════════════════════════════════════════════ */
function handleSubscribe(event) {
  event.preventDefault();
  const input   = event.target.querySelector('input[type="email"]');
  const confirm = document.getElementById('newsletter-confirm');
  confirm.textContent = `Thank you — "${input.value}" has been subscribed.`;
  input.value = '';
  setTimeout(() => { confirm.textContent = ''; }, 6000);
}

/* ═══════════════════════════════════════════════
   HERO — WEBGL ANIMATED SHADER BACKGROUND
   Vanilla JS port of animated-shader-hero.tsx
   Original shader by Matthias Hurrle (@atzedent)
═══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl2');
  if (!gl) {
    // WebGL2 not supported — hero falls back to CSS gradient background
    canvas.style.display = 'none';
    document.querySelector('.hero').style.background =
      'linear-gradient(180deg,#0a0805 0%,#1a1005 40%,#0a0805 100%)';
    return;
  }

  /* ── Shaders ── */
  const VS = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

  const FS = `#version 300 es
/*
 * Shader by Matthias Hurrle (@atzedent)
 * Adapted for Leonardo da Vinci tribute site
 */
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 move;
uniform vec2 touch;
uniform int pointerCount;
uniform vec2 pointers;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p){
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}
  return t;
}
float clouds(vec2 p){
  float d=1.,t=.0;
  for(float i=.0;i<3.;i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);d=a;p*=2./(i+1.);
  }
  return t;
}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

  /* ── Compile helper ── */
  function compileShader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('Shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  /* ── Build program ── */
  const vs = compileShader(gl.VERTEX_SHADER, VS);
  const fs = compileShader(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Program link error:', gl.getProgramInfoLog(program));
    return;
  }

  /* ── Geometry (full-screen triangle strip) ── */
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  /* ── Uniform locations ── */
  const uRes      = gl.getUniformLocation(program, 'resolution');
  const uTime     = gl.getUniformLocation(program, 'time');
  const uMove     = gl.getUniformLocation(program, 'move');
  const uTouch    = gl.getUniformLocation(program, 'touch');
  const uPtrCount = gl.getUniformLocation(program, 'pointerCount');
  const uPtrs     = gl.getUniformLocation(program, 'pointers');

  /* ── State ── */
  let mouse  = [0, 0];
  let moves  = [0, 0];
  let raf    = null;
  let active = false;

  /* ── Resize ── */
  function resize() {
    const dpr = Math.max(1, 0.5 * (window.devicePixelRatio || 1));
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  /* ── Pointer / mouse tracking ── */
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    const dpr = canvas.width / r.width;
    mouse = [(e.clientX - r.left) * dpr, canvas.height - (e.clientY - r.top) * dpr];
    moves = [moves[0] + e.movementX, moves[1] + e.movementY];
  });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    const r = canvas.getBoundingClientRect();
    const dpr = canvas.width / r.width;
    mouse = [(t.clientX - r.left) * dpr, canvas.height - (t.clientY - r.top) * dpr];
  }, { passive: false });

  /* ── Render loop ── */
  function render(now) {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);

    gl.uniform2f(uRes,      canvas.width, canvas.height);
    gl.uniform1f(uTime,     now * 1e-3);
    gl.uniform2f(uMove,     moves[0], moves[1]);
    gl.uniform2f(uTouch,    mouse[0], mouse[1]);
    gl.uniform1i(uPtrCount, 0);
    gl.uniform2fv(uPtrs,    [0, 0]);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(render);
  }

  /* ── Init ── */
  resize();
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(render);

  /* ── Pause when tab is hidden (save GPU) ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else {
      if (!raf) raf = requestAnimationFrame(render);
    }
  });
})();
