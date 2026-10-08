export const assetStrategies = {
  tactile: {
    principle:'Eine eigene Bildwelt für Kontakt — neben der echten Hardware.',
    addition:'Ein gezeichnetes Feld aus 32 organischen Konturen gibt dem Exponat eine eigenständige räumliche Umgebung. Im Materialkapitel wird dieses Feld zu einer grafischen Lesespur. Die Konturen sind keine gemessene Druckverteilung.',
    assets:[{file:'contact-contours.svg',name:'Contact contours',kind:'Original SVG / künstlerische Metapher'}],
    motion:'Das Kontaktfeld kontrahiert mit dem Absenken des Produkts; im zweiten Bild verschiebt es sich hinter die Bildfenster. Kein Schaubild erfundener Kräfte.',
    next:'B: Ein nach fachlicher Freigabe gezeichneter Kontaktatlas könnte reale Prototypdaten verwenden. C: Eine CAD-basierte Lichtstudie wäre nur mit Originalgeometrie sinnvoll.'
  },
  field: {
    principle:'Eine Ingenieurpublikation braucht eigene Zeichnungen, nicht nur Produktbilder.',
    addition:'Das neue Funktionsschema abstrahiert Bewegung, PATON, robotische Aktion und Rückkopplung in eine lesbare technische Platte. Es zeigt Ziel und Rollen, ausdrücklich keine interne Verdrahtung oder bestätigte Elektronikarchitektur.',
    assets:[{file:'functional-atlas.svg',name:'Functional atlas',kind:'Original SVG / konzeptionelles Systemprinzip'}],
    motion:'Ein eigener Scanstreifen wechselt auf der Systemplatte vom oberen Hinweg zum unteren Rückweg. Die statische Zeichnung bleibt vollständig verfügbar.',
    next:'B: Fachlich freigegebene Subsystemzeichnungen und echte Schnittstellen ergänzen. Explosionszeichnungen erfordern Originaldaten; keine frei erfundenen Bauteile.'
  },
  relay: {
    principle:'Der Zwischenraum wird selbst zum visuellen Protagonisten.',
    addition:'27 versetzte elliptische Querschnitte bilden einen eigenen 2.5D-Verbindungskorridor. Zwei gezeichnete Bahnen erzählen Hin- und Rückrichtung. Die Erde bleibt ein späterer Maßstab, der Korridor eine künstlerische Raummetapher.',
    assets:[{file:'relay-corridor.svg',name:'Interval corridor',kind:'Original SVG / räumliche Illustration'}],
    motion:'Der Korridor verengt sich im Timeline-Verlauf zu einem gerichteten Intervall zwischen den Orten. Der Planet löst sich anschließend aus dem großen Bildmaßstab.',
    next:'B: Weitere eigene räumliche Perspektiven und Masken vorbereiten. C: Ein echter WebGL-Flug durch abstrakte Geometrie ist ohne Produkt-CAD möglich, benötigt aber eine eigene Performance- und Fallbackbasis.'
  },
  between: {
    principle:'Filmische Originalaufnahmen statt eines immer wieder angeordneten Cutouts.',
    addition:'Drei unveränderte, lokal dekodierte Frames des vorhandenen Films erweitern die fotografische Welt: Handschuhansicht bei 01:26.333, Fingermechanik bei 01:35.500 und Kontakt-/Fingerdetail bei 01:53.867. Das eigene Echo-Motiv verbindet sie als Essay. Die archivierte Prototypvariante kann vom Produktfoto abweichen.',
    assets:[{file:'prototype-hand.webp',name:'Archive / 01:26.333',kind:'Originalfilm → lokales Frame-Derivat'},{file:'prototype-finger-detail.webp',name:'Archive / 01:35.500',kind:'Originalfilm → lokales Frame-Derivat'},{file:'prototype-contact-detail.webp',name:'Archive / 01:53.867',kind:'Originalfilm → lokales Frame-Derivat'},{file:'echo-score.svg',name:'The return score',kind:'Original SVG / gezeichnetes Echo'}],
    motion:'Das echte Filmbild erhält mehr Raum; die zweite Tafel verschiebt zwei echte Detailansichten über eine gezeichnete Echo-Spur. Das Echo ist weder Audioanalyse noch gemessene haptische Antwort.',
    next:'B: Im selben Originalfilm gezielt weitere Momente kuratieren. Neue menschliche Szenen nur aus geeigneten Originalquellen oder späterer Produktion. Keine KI-Hardware.'
  },
  aperture: {
    principle:'FELYA bekommt eine eigene geometrische Umgebung um das intakte Markenzeichen.',
    addition:'Eine aus 30 unabhängigen Linienflächen entwickelte Faltstruktur gibt der Markenbühne räumliche Tiefe. Sie ist ein eigenes grafisches Umfeld, kein Umbau der Pyra und kein technisches Produktmodell.',
    assets:[{file:'aperture-fold.svg',name:'Architectural fold',kind:'Original SVG / abstrakter Markenraum'}],
    motion:'Die Faltstruktur verschiebt und staffelt sich um die unveränderte Pyra; das separate Bildfenster öffnet sich zum Produktsystem.',
    next:'B: Weitere Originalperspektiven der abstrakten Faltstruktur zeichnen. C: Ein echter 3D-Markenraum kann unabhängig von der Hardware modelliert werden. Pyra-Geometrie bleibt kanonisch.'
  },
  intent: {
    principle:'Ein gezeichnetes Vokabular menschlicher Absicht.',
    addition:'Neun eigene Bewegungsglyphen erweitern das Manifest zu einem Gestenatlas. Sie entstehen aus gezeichneten Kurven, nicht aus PATON-Trackingdaten. Teamfoto und reales Produkt bleiben die authentischen Anker, FUTURES die gekennzeichneten Möglichkeiten.',
    assets:[{file:'gesture-atlas.svg',name:'Gesture atlas',kind:'Original SVG / gezeichnete Bewegungsstudien'}],
    motion:'Der Atlas wird vom leisen Hintergrund zum offenen Papierfeld zwischen den Zukunftsskizzen. Die Linien geben dem Manifest eine eigene Motion-Sprache.',
    next:'B: Weitere eigene Gesten und handschriftliche Notationen entwickeln. Spätere KI-Ideen höchstens für abstrakte Umgebungen, nach bewusster Entscheidung; keine vertraulichen Uploads oder synthetischen Produktmerkmale.'
  }
};

export const references = [
 {name:'NASA / Pale Blue Dot Revisited',url:'https://science.nasa.gov/photojournal/pale-blue-dot-revisited/',use:'Konkreter Bildkandidat für ein späteres Distanzkapitel: Erde als winziger Bezug im Raum. Nicht heruntergeladen oder eingebaut.',rights:'Bildcredit NASA/JPL-Caltech; Aufbereitung Kevin M. Gill mit Candy Hansen und William Kosmann. NASA/JPL-Nutzungsbedingungen und korrekte Attribution gelten; kein Endorsement. Spätere Bearbeitung muss Bildkontext und Credit erhalten.'},
 {name:'Studio Dumbar / DEMO 2025',url:'https://studiodumbar.com/work/demo-2025',use:'Referenz für eine kohärente Motion-Identität. Keine Bilder, Logos, Fonts, Videos oder konkrete Formen übernommen.',rights:'Urheber: Studio Dumbar/DEPT® und beteiligte Gestaltende. Keine Reproduktionslizenz geprüft oder vorausgesetzt; nur verlinkte Referenz.'},
 {name:'NASA / Images and Media Usage Guidelines',url:'https://www.nasa.gov/nasa-brand-center/images-and-media/',use:'Prüfung einer möglichen späteren Earth-Bildquelle. In dieser Erweiterung kein NASA-Medium eingebaut.',rights:'Konkrete Bildcredits, Drittmaterial, Personen, Logos und mögliche Endorsementwirkung je Asset prüfen. Keine pauschale Freigabe abgeleitet.'},
 {name:'JPL / Image Use Policy',url:'https://www.jpl.nasa.gov/jpl-image-use-policy/',use:'Konkrete Bedingungen für eine mögliche spätere kosmische Bildwelt recherchiert; kein JPL-Asset übernommen.',rights:'Credits und Ausnahmen je Bild prüfen; kein Eindruck einer Unterstützung durch NASA/JPL/Caltech. Lizenzstatus hier: Recherche, kein verwendetes Asset.'}
];
