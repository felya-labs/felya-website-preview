// Liquid Glass behaviour for the website (Preview), ported from PATON Studio (plugins/squish.ts, GlassSegmented).
// Guideline: paton-studio docs/design/liquid-glass.md; web summary: docs/design/liquid-glass-web.md.

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A damped spring per value, integrated per frame (response in seconds, damping ratio like SwiftUI).
const spring = (response, damping) => {
  const k = (2 * Math.PI / response) ** 2;
  return { v: 0, vel: 0, target: 0, k, c: 2 * damping * Math.sqrt(k) };
};
const stepSprings = (springs, dt) => {
  let moving = false;
  for (const sp of springs) {
    const a = -sp.k * (sp.v - sp.target) - sp.c * sp.vel;
    sp.vel += a * dt;
    sp.v += sp.vel * dt;
    if (Math.abs(sp.vel) > 0.0005 || Math.abs(sp.v - sp.target) > 0.0005) moving = true;
    else { sp.v = sp.target; sp.vel = 0; }
  }
  return moving;
};

/**
 * Squish: interactive glass "flexes" and "illuminates from within, under your fingertips" (WWDC25).
 * Hover lifts a touch, press grows like a drop and leans towards the pointer, release springs back past rest.
 * Reduced motion: light only.
 */
export function bindSquish(el, { grow = 1.08, lift = 1.03 } = {}) {
  if (!el || el.dataset.squishBound) return;
  el.dataset.squishBound = '';
  el.classList.add('squish');
  const s = { hover: spring(0.35, 0.7), press: spring(0.3, 0.52), dx: spring(0.32, 0.55), dy: spring(0.32, 0.55), raf: 0, pointer: null };
  const all = [s.hover, s.press, s.dx, s.dy];
  const apply = () => {
    const h = s.hover.v, p = s.press.v, lx = s.dx.v, ly = s.dy.v;
    const base = 1 + (lift - 1) * h * (1 - p) + (grow - 1) * p;
    const stretchX = 1 + 0.06 * Math.abs(lx) - 0.03 * Math.abs(ly);
    const stretchY = 1 + 0.06 * Math.abs(ly) - 0.03 * Math.abs(lx);
    const tx = lx * Math.min(6, el.offsetWidth * 0.05);
    const ty = ly * Math.min(6, el.offsetHeight * 0.08);
    const idle = Math.abs(base - 1) < 0.0005 && Math.abs(tx) < 0.05 && Math.abs(ty) < 0.05;
    el.style.transform = idle || reducedMotion() ? '' : `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${(base * stretchX).toFixed(4)}, ${(base * stretchY).toFixed(4)})`;
    el.style.setProperty('--squish-glow', (0.18 * h + 0.42 * p).toFixed(3));
  };
  const frame = (last) => (now) => {
    const dt = Math.min(0.032, Math.max(0.004, (now - last) / 1000));
    const moving = stepSprings(all, dt);
    apply();
    s.raf = moving ? requestAnimationFrame(frame(now)) : 0;
  };
  const kick = () => {
    if (reducedMotion()) { for (const sp of all) sp.v = sp.target; apply(); return; }
    if (!s.raf) s.raf = requestAnimationFrame(frame(performance.now()));
  };
  const local = (event) => {
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / Math.max(1, r.width);
    const y = (event.clientY - r.top) / Math.max(1, r.height);
    el.style.setProperty('--squish-x', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--squish-y', `${(y * 100).toFixed(1)}%`);
    return { x: x * 2 - 1, y: y * 2 - 1 };
  };
  el.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    local(event); s.hover.target = 1; kick();
  });
  el.addEventListener('pointermove', (event) => {
    const p = local(event);
    if (s.pointer !== event.pointerId) return;
    s.dx.target = Math.max(-1, Math.min(1, p.x)) * 0.8;
    s.dy.target = Math.max(-1, Math.min(1, p.y)) * 0.8;
    kick();
  });
  el.addEventListener('pointerleave', () => { s.hover.target = 0; if (s.pointer === null) kick(); });
  el.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || el.disabled) return;
    s.pointer = event.pointerId;
    const p = local(event);
    s.press.target = 1; s.dx.target = p.x * 0.35; s.dy.target = p.y * 0.35;
    kick();
  });
  const up = (event) => {
    if (s.pointer !== event.pointerId) return;
    s.pointer = null;
    s.press.target = 0; s.dx.target = 0; s.dy.target = 0;
    s.press.vel -= 2.2; // the drop rebounds before it settles
    if (!el.matches(':hover')) s.hover.target = 0;
    kick();
  };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
}

const squishTargets = [
  ['.site-nav .theme-toggle, .site-nav .language-toggle, .site-nav .mobile-nav-toggle', { grow: 1.12, lift: 1.06 }],
  ['.film-hero__toggle, .hero-switch__arrow', { grow: 1.1, lift: 1.05 }],
  ['.film-hero__primary', { grow: 1.04, lift: 1.02 }],
  ['.video-play-cta', { grow: 1.08, lift: 1.04 }],
  ['#development-updates-form button[type="submit"]', { grow: 1.04, lift: 1.02 }],
];

/** Header: compact once the page scrolls; the current section's link carries a gliding glass selection. */
export function initGlassHeader({ root = document } = {}) {
  const header = root.querySelector('.site-header');
  const links = root.querySelector('[data-nav-links]');
  const indicator = links?.querySelector('[data-nav-indicator]');
  if (!header) return;

  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  initAdaptiveTone(header);

  if (!links || !indicator) return;
  const anchors = Array.from(links.querySelectorAll('a[data-nav-link]'));
  const targets = anchors
    .map((a) => {
      // Anchors point at section headings; the section is the area that counts as "current".
      const target = root.getElementById?.(a.getAttribute('href')?.split('#')[1] || '');
      return { a, section: target?.closest('section') ?? target };
    })
    .filter((entry) => entry.section);

  // Position and width ride on springs; the selection stretches a little with its speed and squashes across.
  const x = spring(0.42, 0.8), w = spring(0.42, 0.8);
  let raf = 0, current = null, placed = false;
  const render = () => {
    const stretch = 1 + Math.min(0.12, Math.abs(x.vel) / 4000);
    indicator.style.setProperty('--nav-indicator-x', `${x.v.toFixed(2)}px`);
    indicator.style.setProperty('--nav-indicator-w', `${w.v.toFixed(2)}px`);
    indicator.style.setProperty('--nav-indicator-stretch', stretch.toFixed(4));
    indicator.style.setProperty('--nav-indicator-squash', (1 / Math.sqrt(stretch)).toFixed(4));
  };
  const frame = (last) => (now) => {
    const dt = Math.min(0.032, Math.max(0.004, (now - last) / 1000));
    const moving = stepSprings([x, w], dt);
    render();
    raf = moving ? requestAnimationFrame(frame(now)) : 0;
  };
  const place = (anchor) => {
    anchors.forEach((a) => (a === anchor ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    if (!anchor) { indicator.removeAttribute('data-visible'); placed = false; return; }
    x.target = anchor.offsetLeft; w.target = anchor.offsetWidth;
    if (!placed || reducedMotion()) { x.v = x.target; w.v = w.target; x.vel = w.vel = 0; render(); }
    else if (!raf) raf = requestAnimationFrame(frame(performance.now()));
    placed = true;
    indicator.setAttribute('data-visible', '');
  };

  // The current section is the last one whose top has passed a line a third down the viewport.
  const update = () => {
    const line = window.innerHeight * 0.34;
    let next = null;
    for (const { a, section } of targets) {
      const r = section.getBoundingClientRect();
      if (r.top <= line && r.bottom > line * 0.5) next = a;
    }
    if (next !== current) { current = next; place(current); }
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', () => { placed = false; place(current); }, { passive: true });
  document.fonts?.ready?.then(() => { placed = false; place(current); });
  update();
}

/**
 * Adaptive glass (Apple, WWDC25 219): small bars "flip between light and dark" with what lies behind them, their
 * symbols with them — so the bar is dark glass with light ink over the dark film hero or a dark section, and light
 * glass with dark ink over a light page, whatever the theme. The tone is read from the backgrounds under the bar
 * (colours and gradient stops of the elements beneath, three points across it), with hysteresis so it never flickers.
 */
const colourStops = (value) => [...value.matchAll(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/g)]
  .map((m) => ({ l: 0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3], a: m[4] === undefined ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]) }));

function backdropLuminance(header, x, y) {
  const stack = document.elementsFromPoint(x, y).filter((el) => !header.contains(el));
  for (const el of stack) {
    const style = getComputedStyle(el);
    const solid = colourStops(style.backgroundColor).filter((c) => c.a > 0.5);
    if (solid.length) return solid[0].l;
    const stops = colourStops(style.backgroundImage).filter((c) => c.a > 0.5);
    if (stops.length) return stops.reduce((sum, c) => sum + c.l, 0) / stops.length;
  }
  return document.documentElement.dataset.theme === 'light' ? 245 : 10;
}

export function initAdaptiveTone(header) {
  const nav = header.querySelector('.site-nav');
  if (!nav || typeof document.elementsFromPoint !== 'function') return;
  let tone = null;
  const update = () => {
    const r = nav.getBoundingClientRect();
    const y = r.top + r.height / 2;
    const samples = [0.2, 0.5, 0.8].map((f) => backdropLuminance(header, r.left + r.width * f, y));
    const lum = samples.sort((a, b) => a - b)[1];
    // Hysteresis: only a clear change flips the glass.
    const next = lum < 105 ? 'dark' : lum > 150 ? 'light' : tone ?? (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    if (next !== tone) { tone = next; header.dataset.glassTone = tone; }
  };
  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  for (const name of ['felya:themechange', 'felya:herovariantchange', 'felya:languagechange']) document.addEventListener(name, queue);
  update();
}

/**
 * Theme switch outside the live hero wipe: the new theme spreads from the click as a soft-edged disc (Studio, 820 ms).
 * Returns false when the caller should switch without it (no View Transitions, reduced motion).
 */
export function revealTheme(apply, origin) {
  if (typeof document.startViewTransition !== 'function' || reducedMotion()) return false;
  const html = document.documentElement;
  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 40;
  const far = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  html.style.setProperty('--theme-x', `${x}px`);
  html.style.setProperty('--theme-y', `${y}px`);
  // The soft rim is the outer 45 % of the disc: grow until even the core covers the farthest corner.
  html.style.setProperty('--theme-reveal-max', `${Math.ceil(far / 0.55)}px`);
  html.setAttribute('data-theme-reveal', '');
  const transition = document.startViewTransition(apply);
  transition.finished.finally(() => html.removeAttribute('data-theme-reveal'));
  return true;
}

export function initLiquidGlass({ root = document } = {}) {
  for (const [selector, options] of squishTargets) root.querySelectorAll(selector).forEach((el) => bindSquish(el, options));
  initGlassHeader({ root });
}
