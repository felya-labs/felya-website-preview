import {
  colorTheme,
  iterationVideoCover,
  language,
  mobileNavigation,
  signupForm,
  sponsorMarquee,
  visionCarousel
} from './site-config.js';

export {
  colorTheme,
  iterationVideoCover,
  language,
  mobileNavigation,
  signupForm,
  sponsorMarquee,
  visionCarousel
} from './site-config.js';

export function getActiveLanguage(config = language) {
  const currentLanguage = document.documentElement.dataset.language;
  return config.languages.includes(currentLanguage) ? currentLanguage : config.defaultLanguage;
}

export function translate(key, { config = language, languageCode = getActiveLanguage(config) } = {}) {
  return config.translations[languageCode]?.[key] ?? config.translations[config.defaultLanguage]?.[key] ?? key;
}

export function onDocumentReady(callback) {
  if (typeof document === 'undefined') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
}

export function initColorTheme({ root = document, config = colorTheme } = {}) {
  const buttons = Array.from(root.querySelectorAll(config.selectors.buttons));
  if (!buttons.length) return;

  const isValidTheme = (theme) => config.themes.includes(theme);

  const readStoredTheme = () => {
    try {
      const storedTheme = window.localStorage.getItem(config.storageKey);
      return isValidTheme(storedTheme) ? storedTheme : config.defaultTheme;
    } catch {
      return config.defaultTheme;
    }
  };

  const persistTheme = (theme) => {
    try {
      window.localStorage.setItem(config.storageKey, theme);
    } catch {}
  };

  const applyTheme = (theme, shouldPersist = true) => {
    const nextTheme = isValidTheme(theme) ? theme : config.defaultTheme;
    const nextAction = nextTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    buttons.forEach((button) => {
      button.dataset.themeNext = nextAction;
      button.setAttribute('aria-pressed', String(nextTheme === 'light'));
      button.setAttribute('aria-label', `Switch to ${nextAction} mode`);
    });
    if (shouldPersist) persistTheme(nextTheme);
  };

  applyTheme(readStoredTheme(), false);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.themeNext || (document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
    });
  });
}

export function initLanguage({ root = document, config = language } = {}) {
  const buttons = Array.from(root.querySelectorAll(config.selectors.buttons));
  if (!buttons.length) return;

  const isValidLanguage = (languageCode) => config.languages.includes(languageCode);
  const readStoredLanguage = () => {
    try {
      const storedLanguage = window.localStorage.getItem(config.storageKey);
      return isValidLanguage(storedLanguage) ? storedLanguage : config.defaultLanguage;
    } catch {
      return config.defaultLanguage;
    }
  };

  const persistLanguage = (languageCode) => {
    try {
      window.localStorage.setItem(config.storageKey, languageCode);
    } catch {}
  };

  const writeDatasetValue = (element, attribute, value) => {
    if (!attribute.startsWith('data-i18n-data-')) return;

    const datasetKey = attribute
      .replace('data-i18n-data-', '')
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    element.dataset[datasetKey] = value;
  };

  const applyLanguage = (languageCode, shouldPersist = true) => {
    const nextLanguage = isValidLanguage(languageCode) ? languageCode : config.defaultLanguage;
    const nextAction = nextLanguage === 'de' ? 'en' : 'de';
    document.documentElement.dataset.language = nextLanguage;
    document.documentElement.lang = nextLanguage;

    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.innerHTML = translate(element.dataset.i18n, { config, languageCode: nextLanguage });
    });

    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute('placeholder', translate(element.dataset.i18nPlaceholder, { config, languageCode: nextLanguage }));
    });

    root.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.setAttribute('title', translate(element.dataset.i18nTitle, { config, languageCode: nextLanguage }));
    });

    root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel, { config, languageCode: nextLanguage }));
    });

    root.querySelectorAll('*').forEach((element) => {
      Array.from(element.attributes).forEach((attribute) => {
        if (!attribute.name.startsWith('data-i18n-data-')) return;
        writeDatasetValue(element, attribute.name, translate(attribute.value, { config, languageCode: nextLanguage }));
      });
    });

    buttons.forEach((button) => {
      const uiState = config.ui[nextLanguage];
      button.dataset.languageNext = nextAction;
      button.setAttribute('aria-label', uiState.ariaLabel);
      button.querySelectorAll(config.selectors.labels).forEach((label) => {
        label.textContent = uiState.label;
      });
    });

    if (shouldPersist) persistLanguage(nextLanguage);
  };

  applyLanguage(readStoredLanguage(), false);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.languageNext || (getActiveLanguage(config) === 'de' ? 'en' : 'de'));
    });
  });
}

export function initMobileNavigation({ root = document, config = mobileNavigation } = {}) {
  const container = root.querySelector(config.selectors.container);
  if (!container) return;

  container.querySelectorAll(config.selectors.links).forEach((link) => {
    link.addEventListener('click', () => {
      container.removeAttribute('open');
    });
  });

  document.addEventListener('pointerdown', (event) => {
    if (!container.open) return;
    if (container.contains(event.target)) return;

    container.removeAttribute('open');
  }, { capture: true });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !container.open) return;

    container.removeAttribute('open');
  });
}

export function setSignupStatus(statusElement, message, state = 'idle') {
  if (!statusElement) return;

  statusElement.textContent = message;
  statusElement.dataset.state = state;
}

export function initSignupForm({ root = document, config = signupForm } = {}) {
  const form = root.querySelector(config.selectors.form);
  if (!form) return;

  const emailInput = form.querySelector(config.selectors.email);
  const submitButton = form.querySelector(config.selectors.submit);
  const status = root.querySelector(config.selectors.status);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!emailInput || !submitButton || !status) return;
    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submitButton.textContent = translate('signup.pendingButton');
    setSignupStatus(status, translate('signup.pendingStatus'), 'idle');

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(form.action, {
        ...config.request,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        form.reset();
        setSignupStatus(status, form.dataset.successMessage, 'success');
      } else {
        setSignupStatus(status, form.dataset.errorMessage, 'error');
      }
    } catch {
      setSignupStatus(status, form.dataset.errorMessage, 'error');
    } finally {
      submitButton.disabled = false;
      form.removeAttribute('aria-busy');
      submitButton.textContent = submitButton.dataset.label || translate('signup.fallbackButton');
    }
  });
}

export function initSponsorMarquee({ root = document, config = sponsorMarquee } = {}) {
  const container = root.querySelector(config.selectors.container);
  const track = root.querySelector(config.selectors.track);
  const group = root.querySelector(config.selectors.group);
  if (!container || !track || !group) return;

  const updateDistance = () => {
    container.style.removeProperty(config.css.distanceProperty);
    const distance = group.scrollWidth;
    if (!distance) return;

    const requiredGroups = Math.ceil(container.clientWidth / distance) + 1;
    while (track.children.length < requiredGroups) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    container.style.setProperty(config.css.distanceProperty, `${distance}px`);
  };

  updateDistance();
  window.addEventListener('load', updateDistance);
  window.addEventListener('resize', updateDistance);

  container.addEventListener('pointerdown', (event) => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const logo = event.target.closest?.('.sponsor-logo-frame');
    if (!logo || !container.contains(logo)) return;

    container.querySelectorAll('.sponsor-logo-frame--active').forEach((activeLogo) => {
      activeLogo.classList.remove('sponsor-logo-frame--active');
    });
    logo.classList.add('sponsor-logo-frame--active');
  }, { passive: true });

  return updateDistance;
}

export function initVisionCarousel({ root = document, config = visionCarousel } = {}) {
  const track = root.querySelector(config.selectors.track);
  const viewport = root.querySelector(config.selectors.viewport);
  const previousButton = root.querySelector(config.selectors.previousButton);
  const nextButton = root.querySelector(config.selectors.nextButton);
  const dots = Array.from(root.querySelectorAll(config.selectors.dots));
  if (!track || !previousButton || !nextButton) return;

  let slides = Array.from(track.children);
  if (!slides.length) return;
  const slideCount = slides.length;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  firstClone.alt = '';
  lastClone.alt = '';

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = Array.from(track.children);

  let currentIndex = 1;
  let isTransitioning = false;
  track.style.transform = 'translateX(-100%)';

  const activeSlideIndex = () => {
    if (currentIndex === 0) return slideCount - 1;
    if (currentIndex === slides.length - 1) return 0;
    return currentIndex - 1;
  };

  const updateDots = () => {
    dots.forEach((dot, index) => {
      const isActive = index === activeSlideIndex();
      dot.dataset.active = String(isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const updateCarousel = (instant = false) => {
    track.style.transition = instant ? 'none' : config.transition;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  const goNext = () => {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex++;
    updateCarousel();
  };

  const goPrevious = () => {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex--;
    updateCarousel();
  };

  nextButton.addEventListener('click', goNext);
  previousButton.addEventListener('click', goPrevious);

  viewport?.addEventListener('click', (event) => {
    const interactiveElement = event.target.closest?.('button, a');
    if (interactiveElement && viewport.contains(interactiveElement)) return;

    const bounds = viewport.getBoundingClientRect();
    const clickX = event.clientX - bounds.left;
    if (clickX >= bounds.width / 2) {
      goNext();
      return;
    }

    goPrevious();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isTransitioning || index === activeSlideIndex()) return;

      isTransitioning = true;
      currentIndex = index + 1;
      updateCarousel();
    });
  });

  track.addEventListener('transitionend', () => {
    isTransitioning = false;

    if (currentIndex === slides.length - 1) {
      currentIndex = 1;
      updateCarousel(true);
    }

    if (currentIndex === 0) {
      currentIndex = slides.length - 2;
      updateCarousel(true);
    }
  });

  updateDots();
}

export function initIterationVideoCover({ root = document, config = iterationVideoCover } = {}) {
  const covers = Array.from(root.querySelectorAll(config.selectors.cover));
  if (!covers.length) return;

  const loadVideoSources = (video) => {
    if (video.dataset.videoLoaded === 'true') return;

    video.querySelectorAll('source[data-src]').forEach((source) => {
      source.src = source.dataset.src;
      delete source.dataset.src;
    });
    video.dataset.videoLoaded = 'true';
    video.load();
  };

  covers.forEach((cover) => {
    const targetId = cover.dataset.videoTarget;
    const video = targetId ? document.getElementById(targetId) : cover.parentElement?.querySelector('video');
    if (!video) return;
    const frame = cover.closest('[data-video-frame]');
    const startingCue = frame?.querySelector('[data-video-starting]');
    let startingTimer;

    const hideStartingCue = () => {
      window.clearTimeout(startingTimer);
      if (startingCue) delete startingCue.dataset.active;
    };

    const showStartingCue = () => {
      hideStartingCue();
      if (!startingCue) return;
      startingCue.dataset.active = 'true';
      startingTimer = window.setTimeout(hideStartingCue, 500);
    };

    const hideCover = () => {
      cover.hidden = true;
    };

    const showCover = () => {
      hideStartingCue();
      video.pause();
      video.currentTime = 0;
      cover.hidden = false;
    };

    cover.hidden = false;
    cover.addEventListener('click', () => {
      loadVideoSources(video);
      hideCover();
      showStartingCue();
      const playRequest = video.play();
      if (playRequest) {
        playRequest.catch(() => {
          hideStartingCue();
          cover.hidden = false;
        });
      }
    });
    video.addEventListener('ended', showCover);
  });
}

export function initHeroMobileGloveScroll({ root = document } = {}) {
  const gloves = Array.from(root.querySelectorAll('.hero-scroll-glove'));
  if (!gloves.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;

  const update = () => {
    frame = null;

    if (reduceMotion.matches || window.innerWidth >= 1024) {
      gloves.forEach((glove) => glove.style.removeProperty('transform'));
      return;
    }

    const progress = Math.min(Math.max(window.scrollY / 320, 0), 1);
    const scale = 0.96 + progress * 0.12;
    gloves.forEach((glove) => {
      glove.style.transform = `rotate(2deg) scale(${scale.toFixed(3)})`;
    });
  };

  const requestUpdate = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  reduceMotion.addEventListener?.('change', requestUpdate);
}

export function initVideoPlayCtaScroll({ root = document } = {}) {
  const ctas = Array.from(root.querySelectorAll('[data-video-play-cta]'));
  if (!ctas.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;

  const update = () => {
    frame = null;

    if (reduceMotion.matches || window.innerWidth >= 768) {
      ctas.forEach((cta) => cta.style.removeProperty('transform'));
      return;
    }

    const viewportCenter = window.innerHeight / 2;
    const activationDistance = window.innerHeight * 0.5;

    ctas.forEach((cta) => {
      const videoFrame = cta.closest('[data-video-frame]');
      if (!videoFrame) return;

      const rect = videoFrame.getBoundingClientRect();
      const videoCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(videoCenter - viewportCenter);
      const progress = 1 - Math.min(distanceFromCenter / activationDistance, 1);
      const scale = 0.84 + progress * 0.16;

      cta.style.transform = `scale(${scale.toFixed(3)})`;
    });
  };

  const requestUpdate = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  reduceMotion.addEventListener?.('change', requestUpdate);
}

export function initSite(root = document) {
  initColorTheme({ root });
  initLanguage({ root });
  initMobileNavigation({ root });
  initSignupForm({ root });
  initSponsorMarquee({ root });
  initVisionCarousel({ root });
  initIterationVideoCover({ root });
  initHeroMobileGloveScroll({ root });
  initVideoPlayCtaScroll({ root });
}

if (typeof document !== 'undefined') {
  onDocumentReady(() => initSite());
}
