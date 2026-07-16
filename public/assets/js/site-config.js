export const mobileNavigation = {
  selectors: {
    container: 'header details',
    links: 'a'
  }
};

export const colorTheme = {
  storageKey: 'felya-labs-theme',
  defaultTheme: 'dark',
  themes: ['dark', 'light'],
  selectors: {
    buttons: '[data-theme-toggle]'
  }
};

export const language = {
  storageKey: 'felya-labs-language',
  defaultLanguage: 'en',
  languages: ['en', 'de'],
  selectors: {
    buttons: '[data-language-toggle]',
    labels: '[data-language-label]'
  },
  ui: {
    en: {
      label: 'DE',
      ariaLabel: 'Switch language to German'
    },
    de: {
      label: 'EN',
      ariaLabel: 'Sprache auf Englisch umstellen'
    }
  },
  translations: {
    en: {
      'nav.skip': 'Skip to content',
      'nav.primary': 'Primary',
      'nav.open': 'Open navigation',
      'nav.team': 'Team',
      'nav.iteration': 'Iteration',
      'nav.vision': 'Vision',
      'nav.contact': 'Contact',
      'support.supportedBy': 'Supported by',
      'hero.eyebrow': 'Wearable teleoperation',
      'hero.headlineHands': 'Your hands.',
      'hero.headlineArms': 'Your arms.',
      'hero.headlineAnywhere': 'Anywhere.',
      'hero.lead': 'PATON turns natural human movement into robotic action, while physical feedback returns to the person in control.',
      'hero.subline': 'Interface for remote robotic work.',
      'system.eyebrow': 'PATON system',
      'system.heading': 'Built for natural teleoperation.',
      'system.lead': 'PATON combines motion capture, robotic control and haptic feedback into one wearable interface for remote manipulation.',
      'system.loop.0': 'Human movement',
      'system.loop.1': 'Robotic action',
      'system.loop.2': 'Physical feedback',
      'system.props.natural.title': 'Natural control',
      'system.props.natural.description': 'Human arm, hand and finger movement becomes the control signal.',
      'system.props.feedback.title': 'Physical feedback',
      'system.props.feedback.description': 'Haptic response helps operators feel contact, resistance and interaction.',
      'system.props.remote.title': 'Remote manipulation',
      'system.props.remote.description': 'Human dexterity reaches tasks and environments beyond the operator.',
      'signup.heading1': 'Stay in the loop.',
      'signup.heading2': 'Sign up now.',
      'signup.description': 'Occasional updates on prototypes, technical milestones and collaboration opportunities.',
      'signup.emailLabel': 'Email address',
      'signup.placeholder': 'Email',
      'signup.button': 'Sign up',
      'signup.pendingButton': 'Joining...',
      'signup.pendingStatus': 'Submitting...',
      'signup.fallbackButton': 'Sign up',
      'signup.success': 'Connection made. You are on the list.',
      'signup.error': 'Something went wrong. Email us at info@felyalabs.com and we will add you manually.',
      'signup.consent': 'By signing up, you agree to Formspark processing your email and technical data for your waitlist registration. You can withdraw consent at any time. See our <a href="privacy.html" target="_blank" class="text-gray-300 underline-offset-4 transition-colors hover:text-white hover:underline">Privacy Policy</a>.',
      'iteration.heading': 'Built through testing. Refined through touch.',
      'iteration.description': 'We started with finger movement. Then the missing piece became obvious: touch. Today, PATON is developed through prototypes that test motion capture, robotic control and physical feedback as one connected system.',
      'iteration.proofAria': 'Prototype focus areas',
      'iteration.proof.0': 'Motion capture',
      'iteration.proof.1': 'Robotic control',
      'iteration.proof.2': 'Physical feedback',
      'iteration.playButton': 'Play',
      'vision.heading': 'Where human skill needs to reach further.',
      'vision.description': 'These sketches explore scenarios where human capability can act and feel at a distance, from robotic arms and hands to embodied teleoperation.',
      'vision.carouselAria': 'PATON use-case sketches',
      'vision.previous': 'Show previous use-case sketch',
      'vision.next': 'Show next use-case sketch',
      'vision.browseTitle': 'Click left or right side to browse sketches',
      'vision.dotsAria': 'Choose use-case sketch',
      'vision.dot.0': 'Show use-case sketch 1',
      'vision.dot.1': 'Show use-case sketch 2',
      'vision.dot.2': 'Show use-case sketch 3',
      'vision.dot.3': 'Show use-case sketch 4',
      'vision.dot.4': 'Show use-case sketch 5',
      'vision.dot.5': 'Show use-case sketch 6',
      'team.heading': 'Built at the intersection of human skill and robotics.',
      'team.bubble': 'Early-stage venture | Cologne, Germany',
      'team.origin': 'FELYA LABS emerged from the <strong class="text-white font-semibold">Code & Context</strong> program at <strong class="text-white font-semibold">TH Köln</strong>.',
      'team.prototypes': 'The current PATON system builds on earlier glove-based prototypes developed through academic research, hands-on testing and industry-supported iteration.',
      'team.system': 'We are developing PATON as a modular wearable teleoperation system, starting with the PATON Glove for hand motion and physical feedback and expanding toward the PATON Suit for arm and body-level control.',
      'team.focus': 'Our current focus is a bilateral demonstrator that transfers natural motion to robotic arms and hands, with contact and force cues sent back to the operator.',
      'team.capabilitiesAria': 'FELYA LABS capabilities',
      'team.capabilities.mechanical': 'Mechanical systems',
      'team.capabilities.wearable': 'Wearable robotics',
      'team.capabilities.embedded': 'Embedded electronics',
      'team.capabilities.software': 'Software',
      'team.capabilities.interaction': 'Human-centered interaction',
      'footer.contactHeading': 'Collaborate on the next interface for robotic work.',
      'footer.contactDescription': 'We are looking for research partners, robotics teams, pilot environments and industry collaborators.',
      'footer.contactButton': 'Contact us',
      'footer.copyright': '© FELYA LABS 2026.',
      'footer.claim1': 'Shape the future.',
      'footer.claim2': 'With FELYA LABS.',
      'legal.terms': 'Terms & Conditions',
      'legal.privacy': 'Privacy Policy',
      'legal.impressum': 'Impressum'
    },
    de: {
      'nav.skip': 'Zum Inhalt springen',
      'nav.primary': 'Hauptnavigation',
      'nav.open': 'Navigation öffnen',
      'nav.team': 'Team',
      'nav.iteration': 'Iteration',
      'nav.vision': 'Vision',
      'nav.contact': 'Kontakt',
      'support.supportedBy': 'Unterstützt durch',
      'hero.eyebrow': 'Wearable Teleoperation',
      'hero.headlineHands': 'Deine Hände.',
      'hero.headlineArms': 'Deine Arme.',
      'hero.headlineAnywhere': 'Überall.',
      'hero.lead': 'PATON überträgt natürliche menschliche Bewegung auf Roboter und gibt physisches Feedback an die steuernde Person zurück.',
      'hero.subline': 'Interface für robotische Fernarbeit.',
      'system.eyebrow': 'PATON System',
      'system.heading': 'Gebaut für natürliche Teleoperation.',
      'system.lead': 'PATON verbindet Bewegungserfassung, Robotersteuerung und haptisches Feedback zu einem tragbaren Interface für Remote-Manipulation.',
      'system.loop.0': 'Menschliche Bewegung',
      'system.loop.1': 'Robotische Aktion',
      'system.loop.2': 'Physisches Feedback',
      'system.props.natural.title': 'Natürliche Steuerung',
      'system.props.natural.description': 'Arm-, Hand- und Fingerbewegungen werden zu direkten Steuersignalen.',
      'system.props.feedback.title': 'Physisches Feedback',
      'system.props.feedback.description': 'Haptische Rückmeldung macht Kontakt, Widerstand und Interaktion spürbar.',
      'system.props.remote.title': 'Remote-Manipulation',
      'system.props.remote.description': 'Menschliche Geschicklichkeit erreicht Aufgaben und Umgebungen jenseits des eigenen Körpers.',
      'signup.heading1': 'Bleib nah dran.',
      'signup.heading2': 'Jetzt eintragen.',
      'signup.description': 'Gelegentliche Updates zu Prototypen, technischen Meilensteinen und Möglichkeiten zur Zusammenarbeit.',
      'signup.emailLabel': 'E-Mail-Adresse',
      'signup.placeholder': 'E-Mail',
      'signup.button': 'Eintragen',
      'signup.pendingButton': 'Wird eingetragen...',
      'signup.pendingStatus': 'Wird gesendet...',
      'signup.fallbackButton': 'Eintragen',
      'signup.success': 'Verbindung hergestellt. Du bist auf der Liste.',
      'signup.error': 'Das hat nicht geklappt. Schreib uns an info@felyalabs.com, dann tragen wir dich manuell ein.',
      'signup.consent': 'Mit deiner Anmeldung stimmst du zu, dass Formspark deine E-Mail-Adresse und technische Daten für die Wartelisten-Anmeldung verarbeitet. Du kannst deine Einwilligung jederzeit widerrufen. Mehr dazu in unserer <a href="privacy.html" target="_blank" class="text-gray-300 underline-offset-4 transition-colors hover:text-white hover:underline">Datenschutzerklärung</a>.',
      'iteration.heading': 'Durch Tests entwickelt. Durch Berührung verfeinert.',
      'iteration.description': 'Wir begannen mit Fingerbewegung. Dann wurde klar, was fehlte: Berührung. Heute entwickeln wir PATON über Prototypen, die Bewegungserfassung, Robotersteuerung und physisches Feedback als verbundenes System testen.',
      'iteration.proofAria': 'Schwerpunkte der Prototypen',
      'iteration.proof.0': 'Bewegungserfassung',
      'iteration.proof.1': 'Robotersteuerung',
      'iteration.proof.2': 'Physisches Feedback',
      'iteration.playButton': 'Play',
      'vision.heading': 'Wo menschliche Fähigkeit weiter reichen muss.',
      'vision.description': 'Diese Skizzen zeigen Szenarien, in denen Menschen aus der Ferne handeln und fühlen können: von Roboterarmen und -händen bis zu verkörperter Teleoperation.',
      'vision.carouselAria': 'PATON Anwendungsskizzen',
      'vision.previous': 'Vorherige Anwendungsskizze anzeigen',
      'vision.next': 'Nächste Anwendungsskizze anzeigen',
      'vision.browseTitle': 'Links oder rechts klicken, um durch die Skizzen zu blättern',
      'vision.dotsAria': 'Anwendungsskizze auswählen',
      'vision.dot.0': 'Anwendungsskizze 1 anzeigen',
      'vision.dot.1': 'Anwendungsskizze 2 anzeigen',
      'vision.dot.2': 'Anwendungsskizze 3 anzeigen',
      'vision.dot.3': 'Anwendungsskizze 4 anzeigen',
      'vision.dot.4': 'Anwendungsskizze 5 anzeigen',
      'vision.dot.5': 'Anwendungsskizze 6 anzeigen',
      'team.heading': 'Gebaut an der Schnittstelle von menschlicher Fähigkeit und Robotik.',
      'team.bubble': 'Early-stage Venture | Köln, Deutschland',
      'team.origin': 'FELYA LABS entstand aus dem <strong class="text-white font-semibold">Code & Context</strong> Programm der <strong class="text-white font-semibold">TH Köln</strong>.',
      'team.prototypes': 'Das heutige PATON System baut auf früheren handschuhbasierten Prototypen auf, entwickelt durch akademische Forschung, praktische Tests und industriegestützte Iteration.',
      'team.system': 'Wir entwickeln PATON als modulares Wearable-System für Teleoperation: vom PATON Glove für Handbewegung und physisches Feedback bis zum PATON Suit für Arm- und Körpersteuerung.',
      'team.focus': 'Unser aktueller Fokus ist ein bilateraler Demonstrator, der natürliche Bewegung auf Roboterarme und -hände überträgt und Kontakt- sowie Kraftsignale zurückgibt.',
      'team.capabilitiesAria': 'Kompetenzen von FELYA LABS',
      'team.capabilities.mechanical': 'Mechanische Systeme',
      'team.capabilities.wearable': 'Wearable Robotics',
      'team.capabilities.embedded': 'Eingebettete Elektronik',
      'team.capabilities.software': 'Software',
      'team.capabilities.interaction': 'Menschzentrierte Interaktion',
      'footer.contactHeading': 'Entwickle mit uns das nächste Interface für robotische Arbeit.',
      'footer.contactDescription': 'Wir suchen Forschungspartner, Robotikteams, Pilotumgebungen und industrielle Partner.',
      'footer.contactButton': 'Kontakt aufnehmen',
      'footer.copyright': '© FELYA LABS 2026.',
      'footer.claim1': 'Gestalte die Zukunft.',
      'footer.claim2': 'Mit FELYA LABS.',
      'legal.terms': 'Nutzungsbedingungen',
      'legal.privacy': 'Datenschutzerklärung',
      'legal.impressum': 'Impressum'
    }
  }
};

export const signupForm = {
  selectors: {
    form: '#signup-form',
    email: 'input[name="email"]',
    submit: 'button[type="submit"]',
    status: '#signup-status'
  },
  labels: {
    pendingButton: 'Joining...',
    pendingStatus: 'Submitting...',
    fallbackButton: 'Join waitlist'
  },
  request: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    credentials: 'omit',
    referrerPolicy: 'no-referrer'
  }
};

export const sponsorMarquee = {
  selectors: {
    container: '.sponsor-marquee',
    track: '.sponsor-marquee__track',
    group: '.sponsor-marquee__group'
  },
  css: {
    distanceProperty: '--sponsor-marquee-distance'
  }
};

export const visionCarousel = {
  selectors: {
    track: '#carouselTrack',
    viewport: '[data-carousel-viewport]',
    previousButton: '#prevBtn',
    nextButton: '#nextBtn',
    dots: '[data-carousel-dot]'
  },
  transition: 'transform 0.5s ease-in-out'
};

export const iterationVideoCover = {
  selectors: {
    cover: '[data-video-cover]'
  }
};
