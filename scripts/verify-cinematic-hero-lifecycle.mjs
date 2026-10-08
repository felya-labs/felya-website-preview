// Lifecycle simulations complement native browser checks; no external runtime dependencies.
import assert from 'node:assert/strict';
import { initHeroShowcase } from '../src/scripts/cinematic-hero.js';

class Element extends EventTarget {
  dataset = {};
  attrs = new Map();
  children = new Map();
  textContent = '';
  hidden = false;
  inert = false;
  querySelector(selector) { return this.children.get(selector); }
  setAttribute(key, value) { this.attrs.set(key, value); }
  toggleAttribute(key, force) { if (force) this.attrs.set(key, ''); else this.attrs.delete(key); }
  getBoundingClientRect() { return { top: 0, bottom: 900 }; }
  click() { this.dispatchEvent(new Event('click')); }
}
class Video extends Element {
  paused = true;
  currentTime = 0;
  loads = 0;
  plays = 0;
  load() { this.loads++; }
  async play() { this.plays++; this.paused = false; this.dispatchEvent(new Event('playing')); }
  pause() { const changed = !this.paused; this.paused = true; if (changed) this.dispatchEvent(new Event('pause')); }
}
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture({ query = '', mobile = false, reduce = false } = {}) {
  const root = new Element();
  root.documentElement = new Element();
  root.hidden = false;
  const win = new Element();
  win.location = { search: query };
  const reduced = new Element(); reduced.matches = reduce;
  win.matchMedia = q => q.includes('reduced-motion') ? reduced : { matches: mobile };
  globalThis.document = root;
  globalThis.window = win;
  let intersection;
  globalThis.IntersectionObserver = class { constructor(callback) { intersection = callback; } observe() {} };
  const showcase = new Element(), classic = new Element(), cinematic = new Element(), header = new Element(), film = new Element(), video = new Video(), toggle = new Element(), previous = new Element(), next = new Element();
  video.dataset = { desktop: 'desktop.mp4', mobile: 'mobile.mp4' };
  root.children.set('.hero-showcase', showcase);
  root.children.set('.site-header', header);
  for (const [selector, element] of Object.entries({ '.hero-classic': classic, '.cinematic-hero': cinematic, '.cinematic-hero__film': film, '[data-film-toggle]': toggle, '[data-hero-previous]': previous, '[data-hero-next]': next, '[data-hero-count]': new Element(), '[data-hero-announcement]': new Element() })) showcase.children.set(selector, element);
  film.children.set('video', video);
  toggle.children.set('[data-film-label]', new Element()); toggle.children.set('[data-film-icon]', new Element());
  initHeroShowcase({ root, translate: key => key });
  return { root, win, showcase, classic, cinematic, video, film, toggle, previous, next, reduced, view: visible => intersection([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]) };
}
let f = fixture();
f.view(true); await flush();
assert.equal(f.video.src, 'desktop.mp4'); assert.equal(f.video.loads, 1); assert.equal(f.video.paused, false);
f.toggle.click(); assert.equal(f.video.paused, true);
f.view(false); f.view(true); await flush(); assert.equal(f.video.paused, true, 'explicit pause survives viewport return');
f.next.click(); assert.equal(f.classic.inert, false); assert.equal(f.cinematic.inert, true);
f.previous.click(); await flush(); assert.equal(f.video.paused, true, 'explicit pause survives variant return');
f.toggle.click(); await flush(); assert.equal(f.video.paused, false);
f.root.hidden = true; f.root.dispatchEvent(new Event('visibilitychange')); assert.equal(f.video.paused, true);
f.root.hidden = false; f.root.dispatchEvent(new Event('visibilitychange')); await flush(); assert.equal(f.video.paused, false);
f.next.click(); assert.equal(f.video.paused, true); f.previous.click(); await flush(); assert.equal(f.video.paused, false);
assert.equal(f.video.loads, 1, 'variant and visibility changes do not reload media');
f.win.dispatchEvent(new Event('pagehide')); assert.equal(f.video.paused, true); f.win.dispatchEvent(new Event('pageshow')); await flush(); assert.equal(f.video.paused, false);
f.reduced.matches = true; f.reduced.dispatchEvent(new Event('change')); assert.equal(f.video.paused, true); assert.equal(f.film.dataset.filmState, 'poster');
f = fixture({ mobile: true, reduce: true }); f.view(true); await flush(); assert.equal(f.video.loads, 0, 'real media-query preference prevents initial media load');
f.toggle.click(); await flush(); assert.equal(f.video.src, 'mobile.mp4'); assert.equal(f.video.paused, false); assert.equal(f.video.loads, 1);
f = fixture({ query: '?heroAutoplay=blocked' }); f.view(true); await flush(); assert.equal(f.video.paused, true); assert.equal(f.film.dataset.filmState, 'poster'); f.toggle.click(); await flush(); assert.equal(f.video.paused, false);
f = fixture({ query: '?hero=classic' }); f.view(true); await flush(); assert.equal(f.video.loads, 0); assert.equal(f.classic.inert, false);
f = fixture(); let resolvePlay;
f.video.play = () => { f.video.plays++; return new Promise(resolve => { resolvePlay = () => { f.video.paused = false; f.video.dispatchEvent(new Event('playing')); resolve(); }; }); };
f.view(true); f.next.click(); resolvePlay(); await flush(); assert.equal(f.video.paused, true, 'late autoplay completion cannot start an inactive variant');
console.log('Cinematic lifecycle simulations passed: visibility, pause intent, variants, Reduced Motion, mobile selection, autoplay denial, page lifecycle and late play.');
