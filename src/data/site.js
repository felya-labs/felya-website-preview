const responsiveImageWidths = [640, 768, 960, 1200, 1440, 1600, 1920, 2048, 2400, 2560, 3000, 3200, 3568];
const imageSrc = (directory, fileName) => `assets/images/${directory}/${fileName}.webp`;
const imageSrcset = (directory, fileStem, widths = responsiveImageWidths) =>
  widths.map((width) => [imageSrc(directory, `${fileStem}-${width}`), width]);

export const brand = {
  name: 'FELYA LABS',
  logo: {
    src: 'assets/images/brand/felya-labs-logo/FELYA LABS Logo + Word_white_transparent.webp',
    width: 2935,
    height: 1034
  }
};

export const navLinks = [
  { href: '#team', key: 'team', label: 'Team' },
  { href: '#iteration', key: 'iteration', label: 'Iteration' },
  { href: '#vision', key: 'vision', label: 'Vision' },
  { href: '#contact', key: 'contact', label: 'Contact' }
];

export const legalLinks = [
  { href: 'terms.html', key: 'terms', label: 'Terms & Conditions' },
  { href: 'privacy.html', key: 'privacy', label: 'Privacy Policy' },
  { href: 'impressum.html', key: 'impressum', label: 'Impressum' }
];

export const socialLinks = [
  {
    id: 'linkedin',
    href: 'https://linkedin.com/company/felya-labs',
    label: 'FELYA LABS on LinkedIn'
  },
  {
    id: 'instagram',
    href: 'https://instagram.com/felya_labs/',
    label: 'FELYA LABS on Instagram'
  },
  {
    id: 'github',
    href: 'https://github.com/felyalabs/',
    label: 'FELYA LABS on GitHub'
  },
  {
    id: 'youtube',
    href: 'https://youtube.com/watch?v=230vny1l3fE',
    label: 'FELYA LABS prototype video on YouTube'
  }
];

export const gloveImage = {
  src: 'assets/images/hero/paton-glove/paton-glove-dark-premium-v1.webp',
  srcset: [
    ...imageSrcset('hero/paton-glove', 'paton-glove-dark-premium-v1', [640, 768, 960, 1200])
  ],
  sizes: '(min-width: 1536px) 760px, (min-width: 1024px) 680px, (min-width: 768px) 620px, 300px',
  width: 1200,
  height: 1343,
  alt: 'Close-up of the FELYA LABS haptic glove with blue finger mechanisms over a fabric glove.'
};

export const gloveCutoutImage = {
  src: 'assets/images/hero/paton-glove/paton-glove-light-premium-v1.webp',
  srcset: [
    ...imageSrcset('hero/paton-glove', 'paton-glove-light-premium-v1', [640, 768, 960, 1200])
  ],
  sizes: '(min-width: 1536px) 760px, (min-width: 1024px) 680px, (min-width: 768px) 620px, 300px',
  width: 1200,
  height: 1343,
  alt: gloveImage.alt
};

const waitlistFormAction = 'https://submit-form.com/5I3xX6ZMl';

export const waitlistForm = {
  action: waitlistFormAction,
  origin: new URL(waitlistFormAction).origin
};

export const teamImage = {
  src: 'assets/images/about/team-4/team_4-3568.webp',
  srcset: imageSrcset('about/team-4', 'team_4'),
  sizes: '(min-width: 1344px) 568px, (min-width: 768px) calc((100vw - 12rem) / 2), calc(100vw - 4rem)',
  width: 3568,
  height: 2585,
  alt: 'Four FELYA LABS team members holding and wearing haptic glove prototypes.'
};

export const sponsors = [
  {
    src: 'assets/images/sponsors/igus/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/igus/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/igus/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/igus/logo-light-color.webp',
    width: 1280,
    height: 664,
    frameClass: 'sponsor-logo-frame--igus'
  },
  {
    src: 'assets/images/sponsors/innovation-hub/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/innovation-hub/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/innovation-hub/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/innovation-hub/logo-light-color.webp',
    width: 1418,
    height: 684,
    frameClass: 'sponsor-logo-frame--innovation-hub'
  },
  {
    src: 'assets/images/sponsors/knipex/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/knipex/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/knipex/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/knipex/logo-light-color.webp',
    width: 3840,
    height: 1824,
    frameClass: 'sponsor-logo-frame--knipex'
  },
  {
    src: 'assets/images/sponsors/coco/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/coco/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/coco/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/coco/logo-light-color.webp',
    width: 1200,
    height: 430,
    frameClass: 'sponsor-logo-frame--coco'
  },
  {
    src: 'assets/images/sponsors/gateway-th-koeln/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/gateway-th-koeln/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/gateway-th-koeln/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/gateway-th-koeln/logo-light-color.webp',
    width: 1836,
    height: 596,
    frameClass: 'sponsor-logo-frame--gateway'
  },
  {
    src: 'assets/images/sponsors/wuerth-elektronik/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/wuerth-elektronik/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/wuerth-elektronik/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/wuerth-elektronik/logo-light-color.webp',
    width: 1266,
    height: 571,
    frameClass: 'sponsor-logo-frame--wuerth'
  },
  {
    src: 'assets/images/sponsors/fidlock/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/fidlock/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/fidlock/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/fidlock/logo-light-color.webp',
    width: 450,
    height: 92,
    frameClass: 'sponsor-logo-frame--fidlock'
  },
  {
    src: 'assets/images/sponsors/th-koeln/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/th-koeln/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/th-koeln/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/th-koeln/logo-light-color.webp',
    width: 3840,
    height: 2079,
    frameClass: 'sponsor-logo-frame--th-koeln'
  },
  {
    src: 'assets/images/sponsors/solingen-business/logo-original.webp',
    darkDefaultSrc: 'assets/images/sponsors/solingen-business/logo-dark-muted.webp',
    lightDefaultSrc: 'assets/images/sponsors/solingen-business/logo-light-muted.webp',
    lightHoverSrc: 'assets/images/sponsors/solingen-business/logo-light-color.webp',
    width: 3898,
    height: 1772,
    frameClass: 'sponsor-logo-frame--solingen'
  }
];

const wideImageSizes = '(min-width: 1536px) 1440px, (min-width: 1228px) 1100px, (min-width: 768px) calc(100vw - 8rem), calc(100vw - 4rem)';

export const visionSlides = [
  {
    src: 'assets/images/gallery/paton-sketch/paton-sketch.webp',
    srcset: imageSrcset('gallery/paton-sketch', 'paton-sketch'),
    sizes: wideImageSizes,
    width: 3584,
    height: 2012,
    alt: 'Blueprint-style diagram showing a human operator controlling a robotic arm, with motion commands sent to the robot and haptic feedback returned to the person.'
  },
  {
    src: 'assets/images/gallery/remote-humanoid/remote-humanoid.webp',
    srcset: imageSrcset('gallery/remote-humanoid', 'remote-humanoid'),
    sizes: wideImageSizes,
    width: 3584,
    height: 2012,
    alt: 'Blueprint-style diagram labeled Embodied telepresence, showing a robot handing a rose to a person wearing a VR headset and haptic glove.'
  },
  {
    src: 'assets/images/gallery/remote-object-handling/remote-object-handling.webp',
    srcset: imageSrcset('gallery/remote-object-handling', 'remote-object-handling'),
    sizes: wideImageSizes,
    width: 3584,
    height: 2012,
    alt: 'Blueprint-style diagram showing a robotic arm interacting with an object while a haptic glove controls the remote movement.'
  },
  {
    src: 'assets/images/gallery/immersive-glove/immersive-glove.webp',
    srcset: imageSrcset('gallery/immersive-glove', 'immersive-glove'),
    sizes: wideImageSizes,
    width: 3584,
    height: 2012,
    alt: 'Blueprint-style diagram captioned Touch another reality, showing a VR user holding a detailed haptic glove.'
  },
  {
    src: 'assets/images/gallery/haptic-feedback/haptic-feedback.webp',
    srcset: imageSrcset('gallery/haptic-feedback', 'haptic-feedback'),
    sizes: wideImageSizes,
    width: 3584,
    height: 2012,
    alt: 'Blueprint-style diagram captioned Haptic Feedback, showing a haptic glove mirroring the motion of another hand.'
  },
  {
    src: 'assets/images/gallery/your-hands-your-arms/your-hands-your-arms.webp',
    srcset: imageSrcset('gallery/your-hands-your-arms', 'your-hands-your-arms'),
    sizes: wideImageSizes,
    width: 3584,
    height: 2012,
    alt: 'Blueprint-style diagram captioned Your hands. Your arms. Anywhere on Earth, showing a VR user remotely controlling robotic arms.'
  }
];

export const iterationVideo = {
  title: 'FELYA LABS prototype video',
  width: 1280,
  height: 720,
  preload: 'none',
  cover: {
    src: 'assets/images/videoCover/Interface_of_Craft_Thumbnail.png',
    poster: 'assets/images/videoCover/Interface_of_Craft_Thumbnail-1200.webp',
    srcset: imageSrcset('videoCover', 'Interface_of_Craft_Thumbnail'),
    sizes: wideImageSizes,
    width: 3584,
    height: 2012,
    label: 'Play prototype video'
  },
  sources: [
    {
      src: 'assets/video/paton-interface/av1/640.webm',
      type: 'video/webm; codecs="av01.0.05M.08.0.111.01.01.01.0, opus"',
      media: '(max-width: 640px)',
      width: 640
    },
    {
      src: 'assets/video/paton-interface/av1/768.webm',
      type: 'video/webm; codecs="av01.0.05M.08.0.111.01.01.01.0, opus"',
      media: '(max-width: 768px)',
      width: 768
    },
    {
      src: 'assets/video/paton-interface/av1/960.webm',
      type: 'video/webm; codecs="av01.0.05M.08.0.111.01.01.01.0, opus"',
      media: '(max-width: 960px)',
      width: 960
    },
    {
      src: 'assets/video/paton-interface/av1/1200.webm',
      type: 'video/webm; codecs="av01.0.05M.08.0.111.01.01.01.0, opus"',
      media: '(max-width: 1200px)',
      width: 1200
    },
    {
      src: 'assets/video/paton-interface/av1/1280.webm',
      type: 'video/webm; codecs="av01.0.05M.08.0.111.01.01.01.0, opus"',
      width: 1280
    },
    {
      src: 'assets/video/paton-interface/h264/640.mp4',
      type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
      media: '(max-width: 640px)',
      width: 640
    },
    {
      src: 'assets/video/paton-interface/h264/768.mp4',
      type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
      media: '(max-width: 768px)',
      width: 768
    },
    {
      src: 'assets/video/paton-interface/h264/960.mp4',
      type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
      media: '(max-width: 960px)',
      width: 960
    },
    {
      src: 'assets/video/paton-interface/h264/1200.mp4',
      type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
      media: '(max-width: 1200px)',
      width: 1200
    },
    {
      src: 'assets/video/paton-interface/PATON - Interface of Craft.mp4',
      type: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
      width: 1280
    }
  ],
  fallbackText: 'Your browser does not support embedded video.'
};
