// Matches the existing card border, section padding, image caps and 520/768/1024px breakpoints.
// No layout rules are changed: these values only guide the browser's source selection.
export const futureImageSizes = {
  'remote-center': '(max-width: 767px) min(calc(76vw - 38px), 384px), (max-width: 1023px) min(calc(48vw - 47.04px), 560px), min(calc(48vw - 62.4px), 560px)',
  // The denser static-haptic linework is intentionally rendered smaller than
  // the right-hand robot sketch. Its slot hints select the next available
  // lossless WebP step on desktop so both drawings retain comparable detail.
  'hazard-left': '(max-width: 519px) min(calc(70vw - 33.6px), 240px), (max-width: 767px) min(calc(50vw - 59px), 240px), (max-width: 1023px) min(calc(40vw - 30px), 488px), min(calc(36vw - 30px), 488px)',
  'hazard-right': '(max-width: 519px) min(calc(76vw - 74.48px), 272px), (max-width: 767px) min(calc(50vw - 59px), 272px), (max-width: 1023px) min(calc(41vw - 40.18px), 488px), min(calc(41vw - 53.3px), 488px)',
  'presence-left': '(max-width: 767px) min(calc(58vw - 29px), 296px), (max-width: 1023px) min(calc(41vw - 40.18px), 480px), min(calc(41vw - 53.3px), 480px)',
  'presence-right': '(max-width: 767px) min(calc(65vw - 32.5px), 328px), (max-width: 1023px) min(calc(43vw - 42.14px), 504px), min(calc(43vw - 55.9px), 504px)'
};
