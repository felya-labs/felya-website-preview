// Real Liquid Glass over the hero film (Phase 2, Preview): the controls inside the film frame.
//
// Over its own 3D stage PATON Studio refracts what lies beneath each glass surface itself (stage-glass.ts). The
// film hero is the same situation: we know exactly what lies beneath the header and the hero controls — the film
// frame, placed by object-fit: cover and feathered by the film's mask. One WebGL canvas inside the hero redraws
// that frame under every glass rect: squircle rim, Snell refraction (n 1.0 → 1.5) towards the centre, a little lens
// zoom, frost (less at the rim), one light from the top. The element itself then only carries a light tint, its
// edge and its content ([data-lens] in liquid-glass.css). Without WebGL, with reduced transparency or increased
// contrast nothing changes: the CSS glass stays.
// Technique after kube.io "Liquid Glass in the browser" and Shu Ding's liquid-glass (MIT); own code, see
// paton-studio THIRD_PARTY_NOTICES.md.

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;      // canvas size in device px
uniform float uDpr;
uniform vec4 uRect;     // glass rect, CSS px, top-left origin, canvas space
uniform float uRadius;
uniform float uBezel;
uniform float uThick;
uniform float uFrost;
uniform float uSpec;
uniform float uZoom;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMixA;
uniform float uMixB;
uniform vec4 uVidA;     // displayed frame of clip A (after object-fit: cover), CSS px
uniform vec4 uVidB;
uniform vec4 uFilm;     // film element rect (mask space)
uniform vec4 uMask;     // feather widths left, right, top, bottom (fraction of the film box)
uniform vec2 uDetailA;  // B2 letterbox mask: x = on, y unused
uniform vec2 uDetailB;

float sdRound(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float filmMask(vec2 q) {
  vec2 f = (q - uFilm.xy) / uFilm.zw;
  if (f.x < 0.0 || f.x > 1.0 || f.y < 0.0 || f.y > 1.0) return 0.0;
  return clamp(f.x / max(uMask.x, 0.001), 0.0, 1.0)
    * clamp((1.0 - f.x) / max(uMask.y, 0.001), 0.0, 1.0)
    * clamp(f.y / max(uMask.z, 0.001), 0.0, 1.0)
    * clamp((1.0 - f.y) / max(uMask.w, 0.001), 0.0, 1.0);
}

vec3 clip(sampler2D tex, vec4 vid, vec2 detail, vec2 q) {
  vec2 uv = (q - vid.xy) / vid.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec3(0.0);
  vec3 c = texture2D(tex, uv).rgb;
  if (detail.x > 0.5) {
    vec2 f = (q - uFilm.xy) / uFilm.zw;
    c *= smoothstep(0.072, 0.11, f.y) * (1.0 - smoothstep(0.90, 0.93, f.y));
  }
  return c;
}

// What lies beneath: the film frame (both clips during a crossfade) on the hero's black, feathered by the mask.
vec3 scene(vec2 q) {
  vec3 c = vec3(0.0);
  if (uMixA > 0.001) c += clip(uTexA, uVidA, uDetailA, q) * uMixA;
  if (uMixB > 0.001) c += clip(uTexB, uVidB, uDetailB, q) * uMixB;
  return c * filmMask(q);
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

  float inside = max(-d, 0.0);
  float t = clamp(inside / uBezel, 0.0, 1.0);
  // Outward rim normal from the distance field; guarded where it vanishes (the medial axis), as in Studio.
  vec2 e = vec2(0.5, 0.0);
  vec2 g = vec2(sdRound(p + e.xy, b, r) - sdRound(p - e.xy, b, r), sdRound(p + e.yx, b, r) - sdRound(p - e.yx, b, r));
  float gl = length(g);
  vec2 n = gl > 0.0001 ? g / gl : vec2(0.0);

  // Convex squircle rim h(t) = (1 - (1 - t)^4)^(1/4); its slope bends light by Snell's law into the glass.
  float u = 1.0 - t;
  float u4 = u * u * u * u;
  float h = pow(max(1.0 - u4, 0.0001), 0.25);
  float dh = pow(max(1.0 - u4, 0.0001), -0.75) * u * u * u;
  float theta = atan(min(dh * uThick / uBezel, 12.0));
  float thetaT = asin(sin(theta) / 1.5);
  float shift = min(uThick * h * tan(theta - thetaT) * 1.6, uThick);
  // Sampled towards the centre; small glass magnifies a little, like a drop.
  vec2 sp = centre + p * (1.0 - uZoom) - n * shift;

  // Frost: matte body, a less frosted rim (it keeps the lens readable).
  float frost = uFrost * mix(0.45, 1.0, smoothstep(0.0, 1.6, inside / uBezel));
  vec3 col = scene(sp) * 0.2;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398;
    vec2 o = vec2(cos(a), sin(a));
    col += scene(sp + o * frost) * 0.06;
    col += scene(sp + o * frost * 0.5) * 0.04;
  }

  // One light from the top, slightly left: a bright rim facing it, a faint return opposite.
  vec2 light = normalize(vec2(-0.35, -1.0));
  float rim = pow(1.0 - t, 3.0);
  float facing = max(dot(n, light), 0.0);
  col *= 1.0 + rim * facing * 0.35;               // colours bent in at the lit rim read a touch richer
  col += vec3(rim * facing * uSpec * 0.42 + rim * max(dot(n, -light), 0.0) * 0.06);

  gl_FragColor = vec4(col * coverage, coverage);
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

export function initHeroGlass({ root = document } = {}) {
  if (!supportsLens()) return;
  const hero = root.querySelector('.cinematic-hero');
  const showcase = root.querySelector('.hero-showcase');
  const film = hero?.querySelector('.cinematic-hero__film');
  if (!hero || !film) return;
  const clips = Array.from(film.querySelectorAll('video'));
  const poster = film.querySelector('img');

  const canvas = document.createElement('canvas');
  canvas.className = 'cinematic-hero__lens';
  canvas.setAttribute('aria-hidden', 'true');
  let gl = null;
  try {
    gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true, preserveDrawingBuffer: false });
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
  // The canvas lives inside the film frame: above the film, below the controls, clipped by the frame's corners.
  film.insertBefore(canvas, film.querySelector('[data-lens-surface]'));
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  for (const name of ['uRes', 'uDpr', 'uRect', 'uRadius', 'uBezel', 'uThick', 'uFrost', 'uSpec', 'uZoom', 'uTexA', 'uTexB', 'uMixA', 'uMixB', 'uVidA', 'uVidB', 'uFilm', 'uMask', 'uDetailA', 'uDetailB']) {
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
  gl.enable(gl.SCISSOR_TEST);

  // Glass that lies over the film: every [data-lens-surface] inside the frame.
  const surfaces = () => Array.from(film.querySelectorAll('[data-lens-surface]'))
    .filter((el) => parseFloat(getComputedStyle(el).opacity) > 0.01)
    .map((el) => ({ el, frost: 4 }));

  let running = false;
  let raf = 0;
  let lenses = new Set();
  const upload = (unit, source) => {
    gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source); return true; } catch { return false; }
  };
  const setLenses = (next) => {
    for (const el of lenses) if (!next.has(el)) el.removeAttribute('data-lens');
    for (const el of next) if (!lenses.has(el)) el.setAttribute('data-lens', '');
    lenses = next;
  };

  const draw = () => {
    raf = 0;
    if (!running) return;
    const heroBox = film.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(heroBox.width * dpr);
    const h = Math.round(heroBox.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.SCISSOR_TEST);

    const box = { x: 0, y: 0, w: heroBox.width, h: heroBox.height };
    const style = getComputedStyle(film.querySelector('video') ?? film);
    const [posX, posY] = style.objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5));
    const posterMode = film.dataset.filmState !== 'video';
    // Up to two visible clips (a crossfade); otherwise the poster.
    const layers = [];
    if (posterMode) {
      if (poster?.complete && poster.naturalWidth) layers.push({ source: poster, mw: poster.naturalWidth, mh: poster.naturalHeight, mix: 1, detail: 0 });
    } else {
      for (const clip of clips) {
        const mix = parseFloat(getComputedStyle(clip).opacity) || 0;
        if (mix > 0.01 && clip.readyState >= 2) layers.push({ source: clip, mw: clip.videoWidth, mh: clip.videoHeight, mix, detail: film.dataset.shot === 'detail' && clip.dataset.detailFrom ? 1 : 0 });
      }
    }
    const vids = [];
    for (let i = 0; i < 2; i++) {
      const layer = layers[i];
      if (layer && upload(i, layer.source)) vids.push({ ...layer, rect: coverRect(box, layer.mw, layer.mh, posX, posY) });
      else vids.push({ mix: 0, rect: [0, 0, 1, 1], detail: 0 });
    }
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    gl.uniform1i(U.uTexA, 0); gl.uniform1i(U.uTexB, 1);
    gl.uniform2f(U.uRes, w, h);
    gl.uniform1f(U.uDpr, dpr);
    gl.uniform1f(U.uMixA, vids[0].mix); gl.uniform1f(U.uMixB, vids[1].mix);
    gl.uniform4f(U.uVidA, ...vids[0].rect); gl.uniform4f(U.uVidB, ...vids[1].rect);
    gl.uniform2f(U.uDetailA, vids[0].detail, 0); gl.uniform2f(U.uDetailB, vids[1].detail, 0);
    gl.uniform4f(U.uFilm, box.x, box.y, box.w, box.h);
    // The frame is not feathered: the film fills it edge to edge.
    gl.uniform4f(U.uMask, 0, 0, 0, 0);

    const next = new Set();
    for (const surface of surfaces()) {
      const r = surface.el.getBoundingClientRect();
      const rect = { x: r.left - heroBox.left, y: r.top - heroBox.top, w: r.width, h: r.height };
      // Only glass that lies completely over the hero becomes a lens; anything else keeps CSS glass.
      if (rect.w < 4 || rect.x < 0 || rect.y < 0 || rect.x + rect.w > heroBox.width || rect.y + rect.h > heroBox.height) continue;
      next.add(surface.el);
      const minSide = Math.min(rect.w, rect.h);
      const radius = Math.min(parseFloat(getComputedStyle(surface.el).borderTopLeftRadius) || minSide / 2, minSide / 2);
      const bezel = Math.min(28, Math.max(6, minSide * 0.18));
      const thick = Math.min(30, Math.max(8, minSide * 0.14));
      gl.uniform4f(U.uRect, rect.x, rect.y, rect.w, rect.h);
      gl.uniform1f(U.uRadius, radius);
      gl.uniform1f(U.uBezel, bezel);
      gl.uniform1f(U.uThick, thick);
      gl.uniform1f(U.uFrost, surface.frost + Math.min(3, minSide / 120));
      gl.uniform1f(U.uSpec, 0.9);
      // Lens zoom ≈ 0.16 × thickness / half-size for small glass; large panels stay flat.
      gl.uniform1f(U.uZoom, minSide <= 64 && !surface.whole ? Math.min(0.08, 0.16 * thick / Math.max(rect.w, rect.h) * 2) : 0);
      const sx = Math.max(0, Math.floor((rect.x - 2) * dpr));
      const sy = Math.max(0, Math.floor(h - (rect.y + rect.h + 2) * dpr));
      gl.scissor(sx, sy, Math.ceil((rect.w + 4) * dpr), Math.ceil((rect.h + 4) * dpr));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    setLenses(next);
    raf = requestAnimationFrame(draw);
  };

  // Runs only while the film hero is the shown variant, in view and the page is visible.
  let inView = true;
  const sync = () => {
    const should = inView && showcase?.dataset.heroVariant === 'cinematic' && !hero.hidden && document.visibilityState === 'visible';
    if (should === running) return;
    running = should;
    canvas.toggleAttribute('data-active', running);
    if (running && !raf) raf = requestAnimationFrame(draw);
    if (!running) { cancelAnimationFrame(raf); raf = 0; setLenses(new Set()); }
  };
  document.addEventListener('felya:herovisibilitychange', (event) => { inView = !!event.detail?.visible; sync(); });
  document.addEventListener('felya:herovariantchange', sync);
  document.addEventListener('visibilitychange', sync);
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); running = false; setLenses(new Set()); });
  sync();
}
