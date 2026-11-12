import { heroShowcase as heroPolicy } from './site-config.js';

const variants = ['cinematic', 'classic'];

// Resolves the first hero for this visit; see heroShowcase in site-config.js for the order of precedence.
export function resolveInitialVariant({ params, policy = heroPolicy, storage, connection } = {}) {
  const requested = params?.get('hero');
  if (variants.includes(requested)) return requested;
  if (policy.rememberChoice) {
    try {
      const stored = storage?.getItem(policy.storageKey);
      if (variants.includes(stored)) return stored;
    } catch { /* Storage can be unavailable (private mode, blocked site data). */ }
  }
  if (policy.classicWhenSaveData && connection?.saveData) return 'classic';
  return variants.includes(policy.defaultVariant) ? policy.defaultVariant : 'cinematic';
}

export function initHeroShowcase({ root = document, translate, policy = heroPolicy } = {}) {
  const showcase = root.querySelector('.hero-showcase');
  if (!showcase) return;
  const cinematic = showcase.querySelector('.cinematic-hero');
  const classic = showcase.querySelector('.hero-classic');
  const header = root.querySelector('.site-header');
  const film = showcase.querySelector('.cinematic-hero__film');
  // The film is a sequence of clips (B2, then C), crossfaded and looped; `video` is always the current clip.
  const listed = film.querySelectorAll ? Array.from(film.querySelectorAll('video')) : [];
  const clips = listed.length ? listed : [film.querySelector('video')];
  let index = 0;
  let video = clips[0];
  const loadedClips = new Set();
  if (clips.length === 1) video.loop = true;
  const toggle = showcase.querySelector('[data-film-toggle]');
  const selection = showcase.querySelector('[data-hero-selection]');
  const options = { cinematic: showcase.querySelector('[data-hero-option="cinematic"]'), classic: showcase.querySelector('[data-hero-option="classic"]') };
  const announcement = showcase.querySelector('[data-hero-announcement]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(window.location.search);
  // Explicit review simulations; ordinary requests use the real browser conditions.
  const staticMode = () => reduced.matches || params.get('heroMotion') === 'reduce';
  const profile = window.matchMedia('(max-width: 720px)').matches ? 'mobile' : 'desktop';
  let storage = null;
  try { storage = window.localStorage; } catch { storage = null; }
  let active = resolveInitialVariant({ params, policy, storage, connection: globalThis.navigator?.connection }) === 'cinematic';
  let swap = 0;
  let firstApply = true;
  let inView = false;
  let pageActive = true;
  let intent = !staticMode();
  let pending = false;
  let generation = 0;
  let frame = null;
  let failed = false;
  const visible = () => active && inView && pageActive && !document.hidden;
  const labels = () => {
    const key = video.paused ? 'hero.play' : 'hero.pause';
    toggle.setAttribute('aria-label', translate(key));
    toggle.querySelector('[data-film-label]').textContent = translate(key);
    toggle.dataset.playing = String(!video.paused);
    announcement.textContent = translate(active ? 'hero.cinematic' : 'hero.classic');
  };
  const stopFrames = () => {
    if (frame !== null) video.cancelVideoFrameCallback?.(frame);
    frame = null;
  };
  // B2's second shot is letterboxed in its export; only that clip carries data-detail-from.
  const shot = (time) => {
    const from = Number(video.dataset?.detailFrom);
    film.dataset.shot = from && time >= from ? 'detail' : 'whole';
  };
  // The pause control carries the film's progress as a ring.
  const progress = (time) => {
    if (!video.duration || !toggle.style) return;
    toggle.style.setProperty('--film-progress', (time / video.duration).toFixed(4));
  };
  const updateFrame = (_, metadata) => {
    frame = null;
    shot(metadata.mediaTime);
    progress(metadata.mediaTime);
    if (!video.paused && visible()) frame = video.requestVideoFrameCallback(updateFrame);
  };
  // While the bar lies over the dark film hero it shows the theme in its glass (liquid-glass.css, data-over-film).
  const syncHeader = () => {
    if (!header?.getBoundingClientRect) return;
    const bounds = showcase.getBoundingClientRect();
    const bar = header.getBoundingClientRect();
    header.toggleAttribute('data-over-film', active && bounds.top < bar.bottom && bounds.bottom > bar.top);
  };
  const load = (clip) => {
    if (loadedClips.has(clip)) return;
    loadedClips.add(clip);
    clip.src = clip.dataset[profile];
    clip.load();
  };
  const showClip = (clip) => {
    for (const other of clips) other.toggleAttribute?.('data-active', other === clip);
    film.dataset.clip = clip.dataset?.clip ?? '';
  };
  // At the end of a clip the next one starts at its first frame and fades in over the held last frame.
  const advance = async () => {
    const from = video;
    index = (index + 1) % clips.length;
    video = clips[index];
    load(video);
    try { video.currentTime = 0; } catch { /* not seekable yet: starts at 0 anyway */ }
    showClip(video);
    shot(0);
    if (visible() && intent) play();
    setTimeout(() => { if (from !== video) { from.pause(); try { from.currentTime = 0; } catch { /* ignore */ } } }, 700);
  };
  const pause = () => { generation++; video.pause(); stopFrames(); labels(); };
  const play = async (user = false) => {
    if (!visible() || pending || !intent) return;
    pending = true;
    const token = generation;
    load(video);
    try {
      if (!user && params.get('heroAutoplay') === 'blocked') throw new DOMException('Review simulation', 'NotAllowedError');
      await video.play();
      if (token !== generation || !visible() || !intent) video.pause();
    } catch {
      if (token === generation) {
        intent = false;
        failed = true;
        film.dataset.filmState = 'poster';
        labels();
      }
    } finally {
      pending = false;
      // A return to the viewport while an interrupted play was pending must reconcile once.
      if (token !== generation && visible() && intent) reconcile();
    }
  };
  const reconcile = () => {
    syncHeader();
    if (!visible()) pause();
    else if (intent && video.paused) play();
  };
  // The selection glides to the chosen option (Liquid Glass segmented control); sizes follow the translated labels.
  const placeSelection = () => {
    const option = options[active ? 'cinematic' : 'classic'];
    if (!selection?.style || !option || typeof option.offsetWidth !== 'number') return;
    selection.style.setProperty('--hero-selection-x', `${option.offsetLeft}px`);
    selection.style.setProperty('--hero-selection-w', `${option.offsetWidth}px`);
  };
  // Swipe: both heroes move side by side; dir 1 = the next one comes in from the right, -1 = from the left.
  let direction = 1;
  const fade = (incoming) => {
    const motion = !staticMode() && typeof cinematic.animate === 'function' && typeof classic.animate === 'function' && !firstApply;
    if (!motion) return null;
    const timing = { duration: 780, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', fill: 'both' };
    const enter = [{ transform: `translate3d(${direction * 100}%, 0, 0)` }, { transform: 'translate3d(0, 0, 0)' }];
    const leave = [{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(${-direction * 100}%, 0, 0)` }];
    showcase.setAttribute('data-hero-swiping', '');
    const film = cinematic.animate(incoming ? enter : leave, timing);
    const globe = classic.animate(incoming ? leave : enter, timing);
    return Promise.all([film.finished, globe.finished]).then(() => {
      film.cancel(); globe.cancel(); showcase.removeAttribute('data-hero-swiping');
    }, () => {});
  };
  const applyVariant = () => {
    const variant = active ? 'cinematic' : 'classic';
    const token = ++swap;
    showcase.dataset.heroVariant = variant;
    if (active) delete document.documentElement.dataset.themeWipeDirection;
    cinematic.inert = !active;
    cinematic.setAttribute('aria-hidden', String(!active));
    classic.inert = active;
    classic.setAttribute('aria-hidden', String(active));
    for (const [name, option] of Object.entries(options)) option?.setAttribute('aria-checked', String(name === variant));
    placeSelection();
    // Both layers stay visible while the film fades; the outgoing one is only hidden when the fade is done.
    cinematic.hidden = false;
    classic.toggleAttribute('data-hero-inactive', false);
    const settle = () => {
      if (token !== swap) return;
      cinematic.hidden = !active;
      classic.toggleAttribute('data-hero-inactive', active);
      document.dispatchEvent(new CustomEvent('felya:herovariantchange', { detail: { variant } }));
      reconcile();
    };
    const fading = fade(active);
    firstApply = false;
    labels();
    if (fading) { fading.then(settle); reconcile(); } else settle();
  };
  const choose = (variant, dir) => {
    if ((variant === 'cinematic') === active) return;
    // Without an explicit direction the film sits "left" of the globe: going to the globe moves forward.
    direction = dir ?? (variant === 'classic' ? 1 : -1);
    active = variant === 'cinematic';
    if (policy.rememberChoice) { try { storage?.setItem(policy.storageKey, variant); } catch { /* not stored */ } }
    applyVariant();
  };
  for (const [name, option] of Object.entries(options)) {
    option?.addEventListener('click', () => choose(name));
    // Radio group keyboard model: arrows move between the two options.
    option?.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const next = name === 'cinematic' ? 'classic' : 'cinematic';
      choose(next);
      options[next]?.focus?.();
    });
  }
  // Arrows in the switch: with two heroes both lead to the other one; the arrow says which way the swipe goes.
  showcase.querySelectorAll?.('[data-hero-step]').forEach((arrow) => {
    arrow.addEventListener('click', () => {
      const dir = Number(arrow.dataset.heroStep) || 1;
      choose(active ? 'classic' : 'cinematic', dir);
    });
  });
  // Touch: a horizontal swipe switches; vertical movement stays page scrolling, the globe keeps its own drag.
  let swipe = null;
  showcase.addEventListener?.('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || event.target?.closest?.('[data-hero-earth-drag], .hero-earth, [data-hero-glove-toggle], button, a')) return;
    swipe = { x: event.clientX, y: event.clientY, id: event.pointerId, t: performance.now() };
  }, { passive: true });
  showcase.addEventListener?.('pointerup', (event) => {
    if (!swipe || swipe.id !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    const fast = performance.now() - swipe.t < 700;
    swipe = null;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4 && fast) choose(active ? 'classic' : 'cinematic', dx < 0 ? 1 : -1);
  });
  showcase.addEventListener?.('pointercancel', () => { swipe = null; });
  window.addEventListener('resize', placeSelection, { passive: true });
  document.fonts?.ready?.then(placeSelection);
  toggle.addEventListener('click', () => {
    if (!video.paused || pending) { intent = false; pause(); }
    else { intent = true; failed = false; play(true); }
  });
  for (const clip of clips) {
  clip.addEventListener('playing', () => {
    if (clip !== video) return;
    if (!visible() || !intent) { pause(); return; }
    failed = false;
    film.dataset.filmState = 'video';
    shot(video.currentTime);
    if (video.requestVideoFrameCallback && frame === null) frame = video.requestVideoFrameCallback(updateFrame);
    labels();
  });
  clip.addEventListener('pause', () => {
    if (clip !== video) return;
    stopFrames();
    // A clip that reached its end is handed over to the next one; the label keeps saying "Pause".
    if (!(clip.ended && clips.length > 1)) labels();
  });
  clip.addEventListener('ended', () => { if (clip === video && clips.length > 1) advance(); });
  clip.addEventListener('timeupdate', () => {
    if (clip !== video) return;
    if (!clip.requestVideoFrameCallback) { shot(clip.currentTime); progress(clip.currentTime); }
    // Fetch the next clip once this one is half way through, so the cut never waits for the network.
    if (clips.length > 1 && clip.duration && clip.currentTime > clip.duration / 2) load(clips[(index + 1) % clips.length]);
  });
  clip.addEventListener('error', () => { if (clip !== video) return; failed = true; intent = false; film.dataset.filmState = 'poster'; labels(); });
  // Errors and blocked autoplay preserve the same selected static product frame.
  clip.addEventListener('loadeddata', () => { if (failed) film.dataset.filmState = 'poster'; });
  }
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting && entry.intersectionRatio > .15;
    document.dispatchEvent(new CustomEvent('felya:herovisibilitychange', { detail: { visible: inView } }));
    reconcile();
  }, { threshold: [0, .15, .5] });
  observer.observe(showcase);
  document.addEventListener('visibilitychange', reconcile);
  document.addEventListener('felya:languagechange', labels);
  window.addEventListener('scroll', syncHeader, { passive: true });
  window.addEventListener('resize', syncHeader, { passive: true });
  window.addEventListener('pagehide', () => { pageActive = false; pause(); });
  window.addEventListener('pageshow', () => { pageActive = true; reconcile(); });
  reduced.addEventListener('change', () => {
    if (staticMode()) { intent = false; pause(); film.dataset.filmState = 'poster'; }
  });
  applyVariant();
}
