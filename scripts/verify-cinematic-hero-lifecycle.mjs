// Lifecycle simulations complement native browser checks; no external runtime dependencies.
import assert from 'node:assert/strict';
import { initHeroShowcase, resolveInitialVariant } from '../src/scripts/cinematic-hero.js';

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
function fixture({ query = '', mobile = false, reduce = false, sequence = false } = {}) {
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
  previous.focus = () => {}; next.focus = () => {};
  video.dataset = { desktop: 'desktop.mp4', mobile: 'mobile.mp4' };
  root.children.set('.hero-showcase', showcase);
  root.children.set('.site-header', header);
  for (const [selector, element] of Object.entries({ '.hero-classic': classic, '.cinematic-hero': cinematic, '.cinematic-hero__film': film, '[data-film-toggle]': toggle, '[data-hero-option="cinematic"]': previous, '[data-hero-option="classic"]': next, '[data-hero-selection]': new Element(), '[data-hero-announcement]': new Element() })) showcase.children.set(selector, element);
  film.children.set('video', video);
  const second = new Video(); second.dataset = { desktop: 'c-desktop.mp4', mobile: 'c-mobile.mp4', clip: 'c' };
  video.toggleAttribute = second.toggleAttribute = Element.prototype.toggleAttribute;
  if (sequence) film.querySelectorAll = () => [video, second];
  toggle.children.set('[data-film-label]', new Element()); toggle.children.set('[data-film-icon]', new Element());
  initHeroShowcase({ root, translate: key => key, policy: { defaultVariant: 'cinematic', rememberChoice: false, classicWhenSaveData: true, storageKey: 'test' } });
  return { second, root, win, showcase, classic, cinematic, video, film, toggle, previous, next, reduced, view: visible => intersection([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]) };
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

// Initial hero policy: URL beats the stored choice, the stored choice beats data saving, data saving beats the default.
const policy = { defaultVariant: 'cinematic', rememberChoice: true, classicWhenSaveData: true, storageKey: 'k' };
const store = (value) => ({ getItem: () => value });
assert.equal(resolveInitialVariant({ params: new URLSearchParams('?hero=classic'), policy, storage: store('cinematic') }), 'classic');
assert.equal(resolveInitialVariant({ params: new URLSearchParams(''), policy, storage: store('classic') }), 'classic');
assert.equal(resolveInitialVariant({ params: new URLSearchParams(''), policy, storage: store(null), connection: { saveData: true } }), 'classic');
assert.equal(resolveInitialVariant({ params: new URLSearchParams(''), policy, storage: store('cinematic'), connection: { saveData: true } }), 'cinematic');
assert.equal(resolveInitialVariant({ params: new URLSearchParams('?hero=bogus'), policy, storage: { getItem() { throw new Error('blocked'); } } }), 'cinematic');
assert.equal(resolveInitialVariant({ params: new URLSearchParams(''), policy: { ...policy, rememberChoice: false }, storage: store('classic') }), 'cinematic');
f = fixture(); f.view(true); await flush(); f.previous.click(); assert.equal(f.cinematic.inert, false, 'choosing the active hero changes nothing');

// Sequence: at the end of B2 the C clip loads, becomes current and plays; B2 is reset afterwards; pause targets C.
f = fixture({ sequence: true }); f.view(true); await flush();
assert.ok(!f.video.loop, 'a sequence does not loop single clips');
f.video.paused = true; f.video.ended = true; f.video.dispatchEvent(new Event('ended')); await flush();
assert.equal(f.second.src, 'c-desktop.mp4'); assert.equal(f.second.paused, false); assert.equal(f.film.dataset.clip, 'c');
f.toggle.click(); assert.equal(f.second.paused, true, 'pause acts on the current clip');
f.second.ended = true; f.toggle.click(); await flush(); assert.equal(f.second.paused, false);
f.second.paused = true; f.second.dispatchEvent(new Event('ended')); await flush();
assert.equal(f.video.paused, false, 'the sequence loops back to the first clip'); assert.equal(f.video.loads, 1, 'clips load once');
f = fixture(); assert.equal(f.video.loop, true, 'a single clip loops');
console.log('Cinematic lifecycle simulations passed: visibility, pause intent, variants, Reduced Motion, mobile selection, autoplay denial, page lifecycle, late play, the initial hero policy and the clip sequence.');
