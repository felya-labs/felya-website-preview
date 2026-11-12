export const mobileNavigation = {
  selectors: { container: 'header details.mobile-navigation', links: 'a' }
};

export const colorTheme = {
  storageKey: 'felya-labs-theme',
  defaultTheme: 'light',
  themes: ['dark', 'light'],
  selectors: { buttons: '[data-theme-toggle]' }
};

export const language = {
  storageKey: 'felya-labs-language',
  defaultLanguage: 'en',
  languages: ['en', 'de', 'ru', 'pt', 'fr', 'es', 'it', 'ky', 'id', 'ko', 'ja', 'zh-cn', 'zh-tw'],
  selectors: {
    openButtons: '[data-language-open]',
    closeButtons: '[data-language-close]',
    dialog: '[data-language-dialog]',
    options: '[data-language-option]'
  }
};

export const developmentUpdatesFormConfig = {
  selectors: {
    form: '#development-updates-form',
    email: 'input[name="email"]',
    submit: 'button[type="submit"]',
    status: '#development-updates-status'
  },
  request: {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'omit',
    referrerPolicy: 'no-referrer'
  }
};

export const prototypeVideoCover = {
  selectors: { cover: '[data-video-cover]' }
};

// Which homepage hero a visitor sees first (Preview). Order of precedence:
// 1. ?hero=cinematic|classic in the URL (campaigns, QR codes, reviews; never stored)
// 2. the visitor's own choice from the Film | Globe switch (remembered when rememberChoice is true)
// 3. classicWhenSaveData: browsers that ask to save data start with the globe instead of the film
// 4. defaultVariant
export const heroShowcase = {
  defaultVariant: 'cinematic',
  rememberChoice: true,
  classicWhenSaveData: true,
  storageKey: 'felya-hero-variant'
};
