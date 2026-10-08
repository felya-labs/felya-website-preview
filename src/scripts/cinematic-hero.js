export function initHeroShowcase({ root = document, translate } = {}) {
  const showcase = root.querySelector('.hero-showcase');
  if (!showcase) return;
  const cinematic = showcase.querySelector('.cinematic-hero');
  const classic = showcase.querySelector('.hero-classic');
  const header = root.querySelector('.site-header');
  const film = showcase.querySelector('.cinematic-hero__film');
  const video = film.querySelector('video');
  const toggle = showcase.querySelector('[data-film-toggle]');
  const count = showcase.querySelector('[data-hero-count]');
  const announcement = showcase.querySelector('[data-hero-announcement]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(window.location.search);
  // Explicit review simulations; ordinary requests use the real browser conditions.
  const staticMode = () => reduced.matches || params.get('heroMotion') === 'reduce';
  const profile = window.matchMedia('(max-width: 720px)').matches ? 'mobile' : 'desktop';
  let active = params.get('hero') !== 'classic';
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
    header?.toggleAttribute('data-cinematic-context', active && bounds.top < (headerBounds?.bottom ?? 0) && bounds.bottom > (headerBounds?.top ?? 0));
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
  const applyVariant = () => {
    showcase.dataset.heroVariant = active ? 'cinematic' : 'classic';
    if (active) delete document.documentElement.dataset.themeWipeDirection;
    cinematic.hidden = !active;
    cinematic.inert = !active;
    cinematic.setAttribute('aria-hidden', String(!active));
    classic.toggleAttribute('data-hero-inactive', active);
    classic.inert = active;
    classic.setAttribute('aria-hidden', String(active));
    count.textContent = active ? '01 / 02' : '02 / 02';
    document.dispatchEvent(new CustomEvent('felya:herovariantchange', { detail: { variant: active ? 'cinematic' : 'classic' } }));
    labels();
    reconcile();
  };
  const switchVariant = () => { active = !active; applyVariant(); };
  showcase.querySelector('[data-hero-previous]').addEventListener('click', switchVariant);
  showcase.querySelector('[data-hero-next]').addEventListener('click', switchVariant);
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
