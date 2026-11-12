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
  const video = film.querySelector('video');
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
  // The header follows the hero that is fully shown: during a crossfade it keeps the outgoing hero's contrast.
  let shown = active;
  let firstApply = true;
  let inView = false;
  let pageActive = true;
  let intent = !staticMode();
  let loaded = false;
  let pending = false;
  let generation = 0;
  let frame = null;
  let failed = false;
  const visible = () => active && inView && pageActive && !document.hidden;
  const labels = () => {
    const key = video.paused ? 'hero.play' : 'hero.pause';
    toggle.setAttribute('aria-label', translate(key));
    toggle.querySelector('[data-film-label]').textContent = translate(key);
    toggle.querySelector('[data-film-icon]').textContent = video.paused ? '▷' : 'Ⅱ';
    announcement.textContent = translate(active ? 'hero.cinematic' : 'hero.classic');
  };
  const stopFrames = () => {
    if (frame !== null) video.cancelVideoFrameCallback?.(frame);
    frame = null;
  };
  const shot = (time) => { film.dataset.shot = time >= 100 / 30 ? 'detail' : 'whole'; };
  const updateFrame = (_, metadata) => {
    frame = null;
    shot(metadata.mediaTime);
    if (!video.paused && visible()) frame = video.requestVideoFrameCallback(updateFrame);
  };
  const syncHeader = () => {
    const bounds = showcase.getBoundingClientRect();
    const headerBounds = header?.getBoundingClientRect();
    header?.toggleAttribute('data-cinematic-context', shown && bounds.top < (headerBounds?.bottom ?? 0) && bounds.bottom > (headerBounds?.top ?? 0));
  };
  const pause = () => { generation++; video.pause(); stopFrames(); labels(); };
  const play = async (user = false) => {
    if (!visible() || pending || !intent) return;
    pending = true;
    const token = generation;
    if (!loaded) {
      loaded = true;
      video.src = video.dataset[profile];
      video.load();
    }
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
  // Materialise: the film layer lies above the globe, so fading only that layer crossfades the two heroes.
  const fade = (incoming) => {
    const motion = !staticMode() && typeof cinematic.animate === 'function' && !firstApply;
    if (!motion) return null;
    const frames = incoming
      ? [{ opacity: 0, filter: 'blur(12px)', transform: 'scale(1.02)' }, { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }]
      : [{ opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }, { opacity: 0, filter: 'blur(12px)', transform: 'scale(1.02)' }];
    const animation = cinematic.animate(frames, { duration: 620, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
    return animation.finished.then(() => animation.cancel(), () => {});
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
      shown = active;
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
  const choose = (variant) => {
    if ((variant === 'cinematic') === active) return;
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
  window.addEventListener('resize', placeSelection, { passive: true });
  document.fonts?.ready?.then(placeSelection);
  toggle.addEventListener('click', () => {
    if (!video.paused || pending) { intent = false; pause(); }
    else { intent = true; failed = false; play(true); }
  });
  video.addEventListener('playing', () => {
    if (!visible() || !intent) { pause(); return; }
    failed = false;
    film.dataset.filmState = 'video';
    shot(video.currentTime);
    if (video.requestVideoFrameCallback && frame === null) frame = video.requestVideoFrameCallback(updateFrame);
    labels();
  });
  video.addEventListener('pause', () => { stopFrames(); labels(); });
  video.addEventListener('timeupdate', () => { if (!video.requestVideoFrameCallback) shot(video.currentTime); });
  video.addEventListener('error', () => { failed = true; intent = false; film.dataset.filmState = 'poster'; labels(); });
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
  // Errors and blocked autoplay preserve the same selected static product frame.
  video.addEventListener('loadeddata', () => { if (failed) film.dataset.filmState = 'poster'; });
  applyVariant();
}
