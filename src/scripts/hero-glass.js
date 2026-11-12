// Real Liquid Glass over the film hero (Preview).
//
// Why WebGL: the browser can refract arbitrary page content only through SVG displacement maps in
// `backdrop-filter: url()` (kube.io, ObaidQatan's library) — Chromium only, with static maps rebuilt on every size
// change. PATON Studio instead refracts what it knows lies beneath (its own 3D stage) in a WebGL pass
// (stage-glass.ts). The film hero is the same case: beneath the header bar, the switch capsule and the pause lens
// lies the hero's dark ground and the film, placed by object-fit: cover and feathered by the stage mask. One canvas
// over the hero redraws that scene under every glass rect, every frame — so the glass bends the film live while it
// plays and while the page scrolls, identically in Chrome, Safari and Firefox.
//
// The shader follows Studio's stage glass: squircle rim h(t) = (1 − (1 − t)^4)^¼, Snell refraction n 1.0 → 1.5
// sampled towards the centre (normalised so the peak shift equals the thickness), a little lens zoom for small glass,
// frost that is lighter at the rim, a detail layer so thin bars stay crisp, vibrancy, luminosity adjusted to the glass
// tone (Apple: small bars adapt to what is behind them), lens shading inside the rim, colour picked up from just
// outside the edge, a glint and bezel glow from one light at the top-left, and specular saturation.
// Glass materialises: lensing, frost and light grow from zero instead of fading in (WWDC25 219).
// Without WebGL, with reduced transparency or increased contrast nothing changes: the CSS glass stays.
// Technique after kube.io "Liquid Glass in the browser" and Shu Ding's liquid-glass (MIT); own code.

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;       // canvas size, device px
uniform float uDpr;
uniform vec4 uRect;      // glass rect, CSS px, top-left origin, canvas space
uniform float uRadius;
uniform float uBezel;
uniform float uThick;
uniform float uShiftNorm;
uniform float uFrost;
uniform float uSpec;
uniform float uZoom;
uniform float uDark;     // 1 = dark glass (over the film), 0 = light glass
uniform float uLum;      // how strongly the glass adjusts the luminosity beneath (regular ≈ 0.45)
uniform float uThin;     // 1 for bars and capsules (≤ 64 px): the film reads crisp through them
uniform vec3 uBase;      // the hero's ground colour
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMixA;
uniform float uMixB;
uniform vec4 uVidA;      // displayed frame of the media (object-fit: cover), CSS px
uniform vec4 uVidB;
uniform vec4 uFilm;      // film stage rect, CSS px
uniform vec4 uMask;      // feather: left end, right, top, bottom (fractions of the stage)
uniform vec2 uKnee;      // left feather knee (x, alpha), as in the CSS gradient

float sdRound(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float filmMask(vec2 q) {
  vec2 f = (q - uFilm.xy) / uFilm.zw;
  if (f.x < 0.0 || f.x > 1.0 || f.y < 0.0 || f.y > 1.0) return 0.0;
  float left = 1.0;
  if (uMask.x > 0.0) left = f.x < uKnee.x ? uKnee.y * f.x / uKnee.x : mix(uKnee.y, 1.0, clamp((f.x - uKnee.x) / max(uMask.x - uKnee.x, 0.001), 0.0, 1.0));
  float right = uMask.y > 0.0 ? clamp((1.0 - f.x) / uMask.y, 0.0, 1.0) : 1.0;
  float top = uMask.z > 0.0 ? clamp(f.y / uMask.z, 0.0, 1.0) : 1.0;
  float bottom = uMask.w > 0.0 ? clamp((1.0 - f.y) / uMask.w, 0.0, 1.0) : 1.0;
  return left * right * top * bottom;
}

vec3 media(sampler2D tex, vec4 vid, vec2 q) {
  vec2 uv = (q - vid.xy) / vid.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec3(0.0);
  return texture2D(tex, uv).rgb;
}

// What lies beneath: the hero's ground with the feathered film on it (both clips during a crossfade).
vec3 scene(vec2 q) {
  vec3 f = vec3(0.0);
  if (uMixA > 0.001) f += media(uTexA, uVidA, q) * uMixA;
  if (uMixB > 0.001) f += media(uTexB, uVidB, q) * uMixB;
  return mix(uBase, f, filmMask(q));
}

vec3 frost(vec2 q, float radius) {
  vec3 c = scene(q) * 0.2;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398 + 0.39;
    vec2 o = vec2(cos(a), sin(a));
    c += scene(q + o * radius) * 0.06;
    c += scene(q + o * radius * 0.5) * 0.04;
  }
  return c;
}

// Colour of the surroundings: only coloured light counts (chroma), as in Studio's envLight.
vec4 envLight(vec2 q) {
  vec3 e = frost(q, 6.0);
  float l = dot(e, vec3(0.2126, 0.7152, 0.0722));
  float chroma = smoothstep(0.035, 0.22, length(e - vec3(l)));
  return vec4(max(vec3(0.0), mix(vec3(l), e, 1.5)), chroma);
}

float snell(float t) {
  float u = 1.0 - t;
  float u4 = u * u * u * u;
  float h = pow(max(1.0 - u4, 0.0001), 0.25);
  float dh = pow(max(1.0 - u4, 0.0001), -0.75) * u * u * u;
  float theta = atan(min(dh * uThick / uBezel, 12.0));
  return h * tan(theta - asin(sin(theta) / 1.5));
}

void main() {
  vec2 q = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 b = uRect.zw * 0.5;
  vec2 centre = uRect.xy + b;
  vec2 p = q - centre;
  float r = min(uRadius, min(b.x, b.y));
  float d = sdRound(p, b, r);
  float coverage = clamp(0.5 - d * uDpr, 0.0, 1.0);
  if (coverage <= 0.0) discard;

  float dist = max(-d, 0.0);
  float bez = max(1.0, min(uBezel, min(b.x, b.y)));
  float t = clamp(dist / bez, 0.0, 1.0);
  vec2 e = vec2(0.5, 0.0);
  vec2 g2 = vec2(sdRound(p + e.xy, b, r) - sdRound(p - e.xy, b, r), sdRound(p + e.yx, b, r) - sdRound(p - e.yx, b, r));
  float nl = length(g2);
  vec2 n = nl > 0.001 ? g2 / nl : vec2(0.0, 1.0);   // guarded on the medial axis (Studio, Brave/Metal)

  // Refraction inside the bezel only; the flat interior stays calm. Lens zoom for small glass.
  vec2 off = t < 1.0 ? -n * snell(t) * uShiftNorm * uThick : vec2(0.0);
  off -= p * uZoom;
  vec2 sp = q + off;

  // Matte body, lighter frost at the rim so the bending stays readable.
  float rimFrost = mix(min(uFrost, 4.0), uFrost, smoothstep(0.0, bez * 1.6, dist));
  vec3 g = frost(sp, rimFrost);
  // Detail layer: sharp minus frosted, added back — thin bars show the film crisp beneath them.
  vec3 detail = scene(sp) - g;
  // Vibrancy: what shines through is a little richer.
  float luma = dot(g, vec3(0.2126, 0.7152, 0.0722));
  g = max(vec3(0.0), mix(vec3(luma), g, mix(0.95, 1.3, uDark)));
  // Luminosity adjusted to the glass tone: dark glass compresses into a dark range, light glass into a bright one.
  vec3 adjusted = uDark > 0.5 ? 0.012 + 0.3 * g : 0.64 + 0.36 * g;
  g = mix(g, adjusted, uLum);
  g += detail * mix(0.35, 0.85, uThin) * (1.0 - uLum * 0.5);
  // Lens shading just inside the rim gives the glass body.
  g *= 1.0 - (1.0 - smoothstep(0.0, bez * 0.7, dist)) * mix(0.06, 0.14, uDark);

  // One light from the top-left: a crisp glint where the rim faces it, a soft bezel glow on thicker glass.
  vec2 L = normalize(vec2(-0.5, -0.86));
  float facing = max(0.0, dot(n, L));
  float back = max(0.0, dot(n, -L));
  float glint = (1.0 - smoothstep(0.0, 1.6, dist)) * pow(facing, 4.0) * mix(0.55, 0.32, uDark);
  float band = 1.0 - smoothstep(0.0, bez, dist);
  float glow = (1.0 - uThin) * band * band * (0.28 * facing * facing + 0.08 * back * back);
  float spec = uSpec * (glint + glow + band * band * 0.05 * back);
  // Colour from just outside the edge scatters into the rim (Apple: light bleeds into the material).
  vec4 env = mix(envLight(q + n * (dist + 10.0)), envLight(q + n * (dist + 28.0)), 0.4);
  float edgeBand = 1.0 - smoothstep(0.0, bez * 1.25, dist);
  float pick = edgeBand * edgeBand * env.a * mix(0.5, 0.65, uDark);
  g = mix(g, g * (0.7 + 0.45 * env.rgb) + env.rgb * mix(0.08, 0.05, uDark), pick);
  // Specular saturation (kube.io): where the rim catches the light, bent-in colours are richer.
  float rimLuma = dot(g, vec3(0.2126, 0.7152, 0.0722));
  g = max(vec3(0.0), mix(vec3(rimLuma), g, 1.0 + 0.5 * uSpec * band * facing));
  g += vec3(spec);

  gl_FragColor = vec4(g * coverage, coverage);
}
`;

const supportsLens = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return false;
  if (window.matchMedia('(prefers-contrast: more)').matches) return false;
  return true;
};

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'shader');
  return shader;
}

// object-fit: cover + object-position: the frame of the media inside its element, in CSS px.
function coverRect(box, mediaW, mediaH, posX, posY) {
  if (!mediaW || !mediaH) return [box.x, box.y, box.w, box.h];
  const scale = Math.max(box.w / mediaW, box.h / mediaH);
  const w = mediaW * scale;
  const h = mediaH * scale;
  return [box.x + (box.w - w) * posX, box.y + (box.h - h) * posY, w, h];
}

// The same rim refraction on the CPU, to normalise the shader's shift so its peak equals the thickness (kube.io).
function shiftPeak(thick, bezel) {
  let peak = 0;
  for (let i = 0; i <= 64; i++) {
    const u = 1 - i / 64;
    const u4 = u ** 4;
    const h = Math.max(1 - u4, 0.0001) ** 0.25;
    const dh = Math.max(1 - u4, 0.0001) ** -0.75 * u ** 3;
    const theta = Math.atan(Math.min(dh * thick / bezel, 12));
    peak = Math.max(peak, h * Math.tan(theta - Math.asin(Math.sin(theta) / 1.5)));
  }
  return peak > 0 ? 1 / peak : 0;
}

const springStep = (s, target, dt, response = 0.55, damping = 0.9) => {
  const k = (2 * Math.PI / response) ** 2;
  const c = 2 * damping * Math.sqrt(k);
  s.vel += (-k * (s.v - target) - c * s.vel) * dt;
  s.v += s.vel * dt;
  if (Math.abs(s.v - target) < 0.001 && Math.abs(s.vel) < 0.001) { s.v = target; s.vel = 0; }
  return s.v;
};

export function initHeroGlass({ root = document } = {}) {
  if (!supportsLens()) return;
  const hero = root.querySelector('.film-hero');
  const showcase = root.querySelector('.hero-showcase');
  const film = hero?.querySelector('.cinematic-hero__film');
  if (!hero || !film) return;
  const clips = Array.from(film.querySelectorAll('video'));
  const poster = film.querySelector('img');
  const nav = root.querySelector('.site-header .site-nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const canvas = document.createElement('canvas');
  canvas.className = 'cinematic-hero__lens';
  canvas.setAttribute('aria-hidden', 'true');
  let gl = null;
  try {
    gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
  } catch { gl = null; }
  if (!gl) return;

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'link');
  } catch (error) {
    console.warn('[hero-glass] falling back to CSS glass:', error);
    return;
  }
  // Above the film, below every control. The canvas only paints inside glass rects.
  film.after(canvas);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  for (const name of ['uRes', 'uDpr', 'uRect', 'uRadius', 'uBezel', 'uThick', 'uShiftNorm', 'uFrost', 'uSpec', 'uZoom', 'uDark', 'uLum', 'uThin', 'uBase', 'uTexA', 'uTexB', 'uMixA', 'uMixB', 'uVidA', 'uVidB', 'uFilm', 'uMask', 'uKnee']) {
    U[name] = gl.getUniformLocation(program, name);
  }
  const makeTexture = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    return tex;
  };
  const textures = [makeTexture(), makeTexture()];
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  // Glass that may become a lens: the header bar (only while it lies completely over the hero), the switch capsule
  // and the pause lens. Each materialises on a spring when it becomes a lens and dissolves when it stops.
  const candidates = () => {
    const list = [];
    if (nav) list.push({ el: nav, frost: 6 });
    const sw = showcase?.querySelector('.hero-switch');
    if (sw && showcase.dataset.heroVariant === 'cinematic') list.push({ el: sw, frost: 5 });
    hero.querySelectorAll('[data-lens-surface]').forEach((el) => list.push({ el, frost: 4, small: true }));
    return list;
  };
  const appear = new Map();
  let lenses = new Set();
  const setLenses = (next) => {
    for (const el of lenses) if (!next.has(el)) el.removeAttribute('data-lens');
    for (const el of next) if (!lenses.has(el)) el.setAttribute('data-lens', '');
    lenses = next;
  };
  const upload = (unit, source) => {
    gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source); return true; } catch { return false; }
  };

  let running = false;
  let raf = 0;
  let last = 0;
  const draw = (now) => {
    raf = 0;
    if (!running) return;
    const dt = last ? Math.min(0.05, Math.max(0.004, (now - last) / 1000)) : 0.016;
    last = now;
    const heroBox = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(heroBox.width * dpr));
    const h = Math.max(1, Math.round(heroBox.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Which glass lies completely over the hero, and how far each has materialised.
    const active = [];
    const next = new Set();
    for (const c of candidates()) {
      const r = c.el.getBoundingClientRect();
      const rect = { x: r.left - heroBox.left, y: r.top - heroBox.top, w: r.width, h: r.height };
      const visible = parseFloat(getComputedStyle(c.el).opacity) > 0.01;
      const inside = rect.w > 4 && rect.x >= 0 && rect.y >= 0 && rect.x + rect.w <= heroBox.width && rect.y + rect.h <= heroBox.height;
      const s = appear.get(c.el) ?? { v: 0, vel: 0 };
      const target = inside && visible ? 1 : 0;
      if (reducedMotion.matches) { s.v = target; s.vel = 0; } else springStep(s, target, dt);
      appear.set(c.el, s);
      if (inside && visible) next.add(c.el);
      if (inside && s.v > 0.002) active.push({ ...c, rect, a: Math.min(1, Math.max(0, s.v)) });
    }
    setLenses(next);

    if (active.length) {
      const filmBox = film.getBoundingClientRect();
      const box = { x: filmBox.left - heroBox.left, y: filmBox.top - heroBox.top, w: filmBox.width, h: filmBox.height };
      const style = getComputedStyle(film.querySelector('video') ?? film);
      const [posX, posY] = style.objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5));
      const layers = [];
      if (film.dataset.filmState !== 'video') {
        if (poster?.complete && poster.naturalWidth) layers.push({ source: poster, mw: poster.naturalWidth, mh: poster.naturalHeight, mix: 1 });
      } else {
        for (const clip of clips) {
          const mix = parseFloat(getComputedStyle(clip).opacity) || 0;
          if (mix > 0.01 && clip.readyState >= 2) layers.push({ source: clip, mw: clip.videoWidth, mh: clip.videoHeight, mix });
        }
      }
      const vids = [0, 1].map((i) => {
        const layer = layers[i];
        if (layer && upload(i, layer.source)) return { mix: layer.mix, rect: coverRect(box, layer.mw, layer.mh, posX, posY) };
        return { mix: 0, rect: [0, 0, 1, 1] };
      });
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[0]);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[1]);
      gl.uniform1i(U.uTexA, 0); gl.uniform1i(U.uTexB, 1);
      gl.uniform2f(U.uRes, w, h);
      gl.uniform1f(U.uDpr, dpr);
      gl.uniform1f(U.uMixA, vids[0].mix); gl.uniform1f(U.uMixB, vids[1].mix);
      gl.uniform4f(U.uVidA, ...vids[0].rect); gl.uniform4f(U.uVidB, ...vids[1].rect);
      gl.uniform4f(U.uFilm, box.x, box.y, box.w, box.h);
      // Same feathering as the CSS mask of .film-hero__stage.
      const wide = window.matchMedia('(min-width: 721px)').matches;
      gl.uniform4f(U.uMask, wide ? 0.38 : 0, 0, wide ? 0 : 0.14, wide ? 0.14 : 0.16);
      gl.uniform2f(U.uKnee, 0.16, 0.45);
      const ground = getComputedStyle(hero).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [5, 6, 8];
      gl.uniform3f(U.uBase, ground[0] / 255, ground[1] / 255, ground[2] / 255);
      gl.enable(gl.SCISSOR_TEST);
      for (const c of active) {
        const { rect, a } = c;
        const minSide = Math.min(rect.w, rect.h);
        const radius = Math.min(parseFloat(getComputedStyle(c.el).borderTopLeftRadius) || minSide / 2, minSide / 2);
        // Thin bars are thin glass: narrow rim, gentle refraction (Studio §2).
        const bezel = Math.min(28, Math.max(6, minSide * 0.22));
        const thick = Math.min(30, Math.max(8, minSide * 0.2));
        const tone = c.el.closest('.site-header')?.dataset.glassTone ?? 'dark';
        gl.uniform4f(U.uRect, rect.x, rect.y, rect.w, rect.h);
        gl.uniform1f(U.uRadius, radius);
        gl.uniform1f(U.uBezel, bezel);
        gl.uniform1f(U.uThick, thick * a);
        gl.uniform1f(U.uShiftNorm, shiftPeak(thick, bezel));
        gl.uniform1f(U.uFrost, c.frost * a);
        gl.uniform1f(U.uSpec, 0.9 * a);
        gl.uniform1f(U.uZoom, c.small ? Math.min(0.06, 0.16 * thick / Math.max(1, minSide)) * a : 0);
        gl.uniform1f(U.uDark, tone === 'light' ? 0 : 1);
        gl.uniform1f(U.uLum, 0.45 * a);
        gl.uniform1f(U.uThin, minSide <= 64 ? 1 : 0);
        const sx = Math.max(0, Math.floor((rect.x - 2) * dpr));
        const sy = Math.max(0, Math.floor(h - (rect.y + rect.h + 2) * dpr));
        gl.scissor(sx, sy, Math.ceil((rect.w + 4) * dpr), Math.ceil((rect.h + 4) * dpr));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
    raf = requestAnimationFrame(draw);
  };

  // Runs only while the film hero is shown, in view and the page visible.
  let inView = true;
  const sync = () => {
    const should = inView && showcase?.dataset.heroVariant === 'cinematic' && !hero.hidden && document.visibilityState === 'visible';
    if (should === running) return;
    running = should;
    canvas.toggleAttribute('data-active', running);
    if (running && !raf) { last = 0; raf = requestAnimationFrame(draw); }
    if (!running) { cancelAnimationFrame(raf); raf = 0; appear.clear(); setLenses(new Set()); }
  };
  document.addEventListener('felya:herovisibilitychange', (event) => { inView = !!event.detail?.visible; sync(); });
  document.addEventListener('felya:herovariantchange', sync);
  document.addEventListener('visibilitychange', sync);
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); running = false; setLenses(new Set()); });
  sync();
}
