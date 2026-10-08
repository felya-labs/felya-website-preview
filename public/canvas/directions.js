export const directions = [
  {
    id:'tactile', number:'01', name:'Tactile Index', strategy:'Product First', line:'Ein Instrument. Eine Bühne. Kein Ablenkungsmanöver.',
    idea:'PATON als kostbares Forschungsinstrument in einem digitalen Skulpturenraum. Zentrierte Hardware, metallische Flächen und ruhige vertikale Typografie geben dem Produkt eine außergewöhnliche Präsenz.',
    scenes:['The specimen / Das Produktexponat','From object to contact / Das Materialregister'],
    type:'Manrope 500–700, monumental und zentriert; vertikale Randtitel; kleine Monospace-Beschriftungen.',
    colors:['#d6dbdf','#0e1720','#184df1'], material:'Kühles Aluminium, dunkles Glas, diffuse fotografische Materialität. Licht liegt hinter der Hardware, niemals als erfundener Produktreflex.',
    emotion:'Präzision, Begehrlichkeit, ruhiges Vertrauen.', roles:'PATON ist das Exponat; FELYA signiert als Hersteller. Der Mensch wird im Materialkapitel und Systemprinzip eingeführt.',
    flow:['Ein einzelnes Instrument','Das Objekt wird zum Register','Bewegung → robotische Aktion','Kontakt → Mensch','Prototypfilm als Belegkontext','Forschende Menschen / Kontakt'],
    motions:[
      {name:'The specimen descends', start:'Großes Produkt über einem elliptischen Sockel; PATON als vertikaler Titel.', trigger:'Beim Weiterrollen vom ersten zum zweiten Kapitel (0–100 % Kapitelweg).', change:'Das unveränderte Foto sinkt um 80 px; Sockel und eigenes Kontaktfeld kontrahieren, Randtitel und Registerlinien erscheinen.', end:'Das Exponat bekommt eine Lesart als Instrument; kein Rotieren und kein Explodieren mechanischer Teile.', purpose:'Von emotionaler Präsenz zu sachlicher Betrachtung.', grade:'A', assets:'Light-Premium-WebP, eigenes contact-contours.svg, CSS-Linien.', preview:'Die erste Szene zeigt die Absenkung und das Register.'},
      {name:'A detail becomes a question', start:'Drei echte Cropfenster: Fingeransatz, Textil, Handgelenk.', trigger:'Scroll über die drei Materialtafeln.', change:'Die Fenster verschieben sich horizontal in ein gemeinsames, offenes Raster; die Frage „What comes back?“ schiebt sich dazwischen.', end:'Materialbeobachtung leitet zum Rückkanal des Systemprinzips über.', purpose:'Haptik als Fragestellung begreifen, ohne Funktion aus einem Foto abzuleiten.', grade:'A', assets:'Dasselbe Produktfoto; eigenes Kontaktfeld, CSS-Crops, Text.', preview:'Die zweite Szene führt die Fenster zusammen.'}
    ],
    feasibility:'A · Authentisches Foto, eigene Kontaktkonturen, Typografie und CSS. Größere echte Makrodetails wären B mit höher aufgelösten Originalfotos; freie Rotation wäre C mit freigegebener Geometrie.',
    critique:'Sehr starke Produktpräsenz und ohne Motion verständlich. Die Galerieästhetik kann das System zu einem einzelnen Handschuh verkürzen: Das nächste Kapitel muss Operator und Roboter früh erklären. Mobile zeigt das Exponat ganz und drei begrenzte Cropfenster nebeneinander; größere Detailtafeln wären eine nächste Iteration. Retina-Schärfe begrenzt die Größe.',
    risk:'Keine neuen Perspektiven; die drei Fenster sind Bildausschnitte, keine echten Makroaufnahmen. Bestehende Retuschen bleiben sichtbar dokumentiert.',
    recommendation:'Eine der drei stärksten Richtungen: sofortige Wertigkeit und hoher Umsetzungsgrad. Beste Wahl für einen konsequenten Produktauftakt.'
  },
  {
    id:'field', number:'02', name:'Field Manual', strategy:'Product First', line:'Technologie, die sich beim Lesen entfaltet.',
    idea:'Ein digitales technisches Faltblatt. Nicht das Objekt allein, sondern die Beziehung seiner Systemteile ist der Hero. Weißer Planraum, leuchtende Kapitelmarken und verbindende Linien bilden eine offene Ingenieurpublikation.',
    scenes:['Plate 001 / Das offene Systemblatt','Plate 002 / Die geschlossene Verbindung'],
    type:'Manrope 700 für kompakte Satzüberschriften; System-Monospace für Plattennummern und Annotationen. Keine Zahlen als Leistungsnachweise.',
    colors:['#f8f9f5','#214de8','#c8ed63'], material:'Falzlinien, dünnes Zeichnungspapier, technische Linework. Keine Interface-Karten oder Dashboard-Metriken.',
    emotion:'Kompetenz, Zugänglichkeit, nachvollziehbare Forschung.', roles:'PATON verbindet Mensch und robotisches System; FELYA ist die verantwortliche Forschungsmarke und Herausgeberin des Manuals.',
    flow:['Aufgeschlagenes Systemblatt','Operator / PATON / Robotik','Die zwei Signalrichtungen','Was Prototypen zeigen','Menschen hinter dem Instrument','Offene Forschungsfragen / Kontakt'],
    motions:[
      {name:'Unfold the relationship', start:'Drei voneinander getrennte Spalten: Mensch, Instrument, robotisches System.', trigger:'Erster Kapitelwechsel durch Scroll.', change:'Spalten rücken mit unterschiedlichen 2D-Übersetzungen zusammen, Verbindungslinien zeichnen sich ein; das PATON-Foto bleibt unverändert.', end:'Ein einziges offenes Systemblatt mit lesbaren Beziehungen.', purpose:'PATON als Produktsystem verstehen, bevor Details erklärt werden.', grade:'A', assets:'Operator-Masken, OpenArm-Maske, Light-Premium-Foto, SVG.', preview:'Die erste Szene zeigt das Zusammenschieben der Spalten.'},
      {name:'Read the return', start:'Zwei beschriftete, getrennte Pfade sind bereits sichtbar.', trigger:'Scroll durch die Systemtafel; erster Halbweg Hinpfad, zweiter Halbweg Rückpfad.', change:'Ein Scanstreifen liest das eigene Funktionsschema zuerst oben von Mensch zu Roboter, dann unten zurück zum Menschen.', end:'Das vollständige bidirektionale Systemprinzip steht lesbar auf der Seite.', purpose:'Feedback als wesentlichen Teil des Ziels verständlich machen.', grade:'A', assets:'Eigenes functional-atlas.svg und CSS-Scan. Konzeptuelle Rollen, keine interne Verdrahtung oder Latenz.', preview:'Die zweite Szene scannt das eigene Funktionsschema von Hinweg zu Rückweg.'}
    ],
    feasibility:'A · Sehr gut mit CSS-Masken und SVG. Falz als echte Papierphysik wäre C, ist nicht vorgesehen. Das Faltblatt wird mobil vertikal; die neue Systemplatte wird mobil als vertikales, beschriftetes Funktionsschema mit Hin- und Rückweg gesetzt.',
    critique:'Die klarste Systemerklärung und ohne Animation vollständig lesbar. Das Risiko ist zu viel technische Publikation und zu wenig eigenständige emotionale Marke. Die leuchtenden Kapitelzahlen und offene Fläche sollen Persönlichkeit tragen. Kein vorgetäuschtes Control-Panel.',
    risk:'Illustrationen sind Systemprinzip, kein Integrationsnachweis. Capability-Freigabe muss vor einer späteren Website belastbar werden.',
    recommendation:'Stärkste sachliche Alternative. Ideal für technische Partner; als alleinige Markeneinführung weniger überraschend als Relay oder Aperture.'
  },
  {
    id:'relay', number:'03', name:'The Relay', strategy:'Experience First', line:'Zwei Orte. Eine menschliche Handlung.',
    idea:'Der Browser wird zum Verbindungsraum. Zwei kreisförmige Fenster und ein eigener gezeichneter Korridor aus 27 perspektivisch gestaffelten Querschnitten erzählen die Distanz. Die Erde erscheint erst in der zweiten Szene und wird vom Planet zum Maßstab zwischen zwei Orten.',
    scenes:['Across the room / Die zwei Portale','Earth becomes distance / Der Verbindungsmaßstab'],
    type:'Manrope 600–800 mit eng gesetzten, großflächigen Wortblöcken; sehr kleine Ort-/Richtungstitel.',
    colors:['#111914','#d7ff69','#e3e9dc'], material:'Dunkler Raum, matte Portalflächen, saures Signalgrün. Ein präzise gezeichneter Verbindungskorridor als eigene Raummetapher.',
    emotion:'Nähe trotz Distanz, Entdeckung, gerichtete Energie.', roles:'Die Verbindung führt; PATON erscheint im Übergang als physisches Instrument dieser Zielsetzung. FELYA zeichnet den Raum.',
    flow:['Zwei getrennte Orte','Ein Band verbindet die Orte','Die Erde wird zum Abstand','PATON erklärt die Verbindung','Vorwärts- und Rückkanal','Prototyp / Zukunft / Kontakt'],
    motions:[
      {name:'Close the distance', start:'Operator und Roboter stehen in entfernten kreisförmigen Fenstern.', trigger:'Scroll vom räumlichen Auftakt zur Erklärung.', change:'Portale nähern sich um 50 px, der eigene 2.5D-Korridor kontrahiert zwischen ihnen; seine Mittelstelle enthält das echte PATON-Foto.', end:'Drei Rollen werden sichtbar: Mensch, PATON, robotisches System.', purpose:'Die Verbindung zuerst fühlen, dann die Technologie identifizieren.', grade:'A', assets:'Operator-Layer, OpenArm-Maske, PATON-Foto, eigenes relay-corridor.svg.', preview:'Die erste Szene zeigt die Annäherung.'},
      {name:'A planet becomes a measure', start:'Die originale SVG-Erde steht groß im Zentrum.', trigger:'Scroll durch das Erd-Kapitel.', change:'Die unveränderte Küstenzeichnung verkleinert sich; die horizontale Achse wächst zwischen Mensch und Roboter. Zwei gerichtete Signalspuren bleiben separat.', end:'Der Planet wird zum räumlichen Bezug, die bidirektionale Verbindung zum Protagonisten.', purpose:'Den Claim in eine konkrete Bilddramaturgie übersetzen. Keine weltweite Betriebsfähigkeit behaupten.', grade:'A', assets:'Vorhandene heroEarthPath-Geometrie, SVG-Achse, Systemmasken.', preview:'Die zweite Szene verkleinert die Erde zur Achse.'}
    ],
    feasibility:'A · Eigener 2.5D-Korridor, 2D-Kreise, Masken und bestehende Erdgeometrie. Echtes räumliches Durchfliegen wäre C und ist hier bewusst durch 2D-Annäherung ersetzt.',
    critique:'Sehr eigenständig und mit guter Systemdramaturgie. Die Portale dürfen nicht zu einem generischen Sci-Fi-Interface werden. Auf Mobile stehen sie vertikal, das Band bleibt mit gerichteten Pfeilen lesbar. PATON muss im ersten Bildschirm gut genug sichtbar sein.',
    risk:'Geografische Distanz ist Markenvision, kein Nachweis von Reichweite oder Echtzeitfähigkeit. Keine Netzwerkdaten, keine erfundenen Latenzen.',
    recommendation:'Eine der drei stärksten Richtungen: Der Claim bekommt eine eigene räumliche Erzählung; System und Emotion lassen sich verbinden.'
  },
  {
    id:'between', number:'04', name:'Between Here & There', strategy:'Experience First', line:'Distanz als filmisches Essay über Berührung.',
    idea:'Ein ruhiger, filmischer Auftakt mit unerwarteter Serifentypografie. Dunkle Aubergine, ein authentischer Originalfilmframe und eine eigene Echozeichnung führen in ein geteiltes Essay mit zwei weiteren Archivdetails.',
    scenes:['A film in the dark / Das Distanzessay','Touch / Zwei Originaldetails aus dem Archiv'],
    type:'Lokale Systemserife Georgia für emotionale Headlines; Manrope für produktbezogene Aussagen. Plattformabhängige Serifendarstellung ist Teil der V1-Grenze.',
    colors:['#251923','#efddd6','#b95d5d'], material:'Kinosaal, weiches dunkles Papier, rahmenartige Bildfenster, sanfte Maskenblenden. Kein automatisch startender Film.',
    emotion:'Intimität, Sehnsucht, menschliche Bedeutung.', roles:'Menschliche Handlung führt. PATON wird über das echte Prototypfilm-Motiv und einen Produktabsatz eingeführt; FELYA ist Autorin des Essays.',
    flow:['Die Frage nach Distanz','Interface of Craft / freiwilliger Filmstart','Menschliche Handlung','Physische Rückkopplung als Ziel','PATON als Instrument','Zukunft getrennt vom Prototyp / Kontakt'],
    motions:[
      {name:'A frame becomes a place', start:'Ein lokal extrahierter Originalframe bei 01:26.333 steht als Filmfenster im Satzraum; eine eigene Echozeichnung trägt den Hintergrund.', trigger:'Scroll aus dem Intro.', change:'Der Bildrahmen wächst, während die gezeichnete Echo-Spur leicht weiterzieht. Kein Filmload bis Klick.', end:'Das echte Archivmotiv erhält Raum. Die Prototypvariante bleibt klar benannt.', purpose:'Von einer menschlichen Frage zum vorhandenen Prototypmaterial wechseln.', grade:'A', assets:'Originalframe 01:26.333, eigenes echo-score.svg, CSS; MP4 erst auf Klick.', preview:'Die erste Szene erweitert das Filmfenster.'},
      {name:'The reply crosses the fold', start:'Zwei authentische Detailframes bei 01:35.500 und 01:53.867 stehen auf gegenüberliegenden Tafeln.', trigger:'Scroll im Essay-Kapitel.', change:'Die Mittelfuge verengt sich über einer eigenen gezeichneten Echo-Spur. Die Originaldetails zeigen reale Archivhardware; die Richtungslabels bleiben konzeptionell.', end:'Hin- und Rückweg bilden eine gemeinsame visuelle Aussage.', purpose:'Berührung als menschliches Anliegen erzählen. Fotos belegen keine Rückkopplungsleistung; die Echozeichnung ist keine Telemetrie.', grade:'A', assets:'Zwei lokal dekodierte Originalfilmframes, eigenes echo-score.svg, CSS.', preview:'Die zweite Szene bewegt beide Essayhälften aufeinander zu.'}
    ],
    feasibility:'A · Drei vorbereitete Originalfilmframes, eigene Echozeichnung und responsive Bildfenster. B · Weitere Originalmomente kuratieren. Ein neu inszenierter Film braucht Originalproduktion.',
    critique:'Emotional die feinste Richtung; ruhige Bildfolge funktioniert ohne Animation. Das Archiv enthält echte Nahaufnahmen ohne eingebrannte Covertypografie. Die niedrige native Filmauflösung und frühere Prototypvariante begrenzen Vergrößerung und Aktualitätsaussage. Mobile zeigt zwei kompakte Archivfenster nebeneinander.',
    risk:'16 Originalfilmframes wurden lokal untersucht; drei ausgewählt. Frühere Hardwareversion, 1201 × 676 px dekodierte Auflösung, kein Funktionsnachweis oder aktueller Produktstand.',
    recommendation:'Starke spätere Kommunikationsrichtung. Die geprüften Archivdetails machen sie deutlich eigenständiger. Als Hauptwebsite braucht sie früheren Systemkontext und eine bewusste Einordnung des Prototypstands.'
  },
  {
    id:'aperture', number:'05', name:'Pyra / Aperture', strategy:'Brand First', line:'Eine Marke öffnet einen Handlungsraum.',
    idea:'FELYA besetzt einen kompromisslosen geometrischen Raum. Eine eigene architektonische Faltzeichnung staffelt den Raum. Das unveränderte kanonische Pyra-Zeichen wird zum monumentalen Markenanker; ein unabhängiges rundes Bildfenster stellt PATON daneben. Die Marke eröffnet, das Produktsystem beantwortet.',
    scenes:['The opening / Die Markenbühne','One mark. A system. / Die technologische Umsetzung'],
    type:'Manrope 800 als große horizontale Markentypografie; kurze Zeilen und präzise Randlabels. Keine neu gezeichnete Wortmarke.',
    colors:['#2449ec','#f5f6ef','#121626'], material:'Plane Kobaltfläche, scharfe Geometrie, helle Negativräume. Kreisfenster sind separate Kompositionselemente und verändern die Pyra nicht.',
    emotion:'Selbstbewusstsein, Wiedererkennbarkeit, Vorwärtsbewegung.', roles:'FELYA eröffnet mit der kanonischen Pyra. PATON ist im ersten Bild die konkrete Hardware und in Szene zwei das sichtbare System.',
    flow:['Monumentale Pyra / reales PATON','Die Öffnung wird zum Systemraum','Mensch / PATON / Robotik','Prototypfilm','Forschende Menschen','Zukunftsvision / Einladung'],
    motions:[
      {name:'Open the aperture', start:'Große intakte Pyra links; PATON in einem separaten hellen Kreisfenster rechts.', trigger:'Scroll aus der Markenbühne.', change:'Das Kreisfenster wächst, die Pyra verschiebt sich als ganzes SVG nach links. Die Hardware bleibt ein unverändertes Foto.', end:'Die Marke gibt der Hardware mehr Raum; das Zeichen bleibt geometrisch intakt.', purpose:'FELYA visuell etablieren und unmittelbar an ihr Produkt binden.', grade:'A', assets:'Kanonische Pyra-white.svg, eigenes aperture-fold.svg, Light-Premium-WebP, CSS.', preview:'Die erste Szene öffnet das Produktfenster.'},
      {name:'From mark to system', start:'Eine große runde Öffnung um PATON, Operator und Roboter als Randfiguren.', trigger:'Scroll zum Systemkapitel.', change:'Die Öffnung weitet sich, beide Figuren treten aus ihren eigenen Masken hervor, getrennte Signalpfade werden betont.', end:'Eine horizontale Systembühne mit kleinem kanonischem Markenanker.', purpose:'Das starke Zeichen in eine nachvollziehbare Produktgeschichte überführen.', grade:'A', assets:'PATON-Foto, Operator-/OpenArm-Masken, kanonische Pyra, SVG.', preview:'Die zweite Szene öffnet den Systemraum.'}
    ],
    feasibility:'A · Keine neue 3D-Geometrie nötig; unveränderte Markendateien und CSS-Clips. Glasbrechung oder CAD-basierte Produktflüge wären C und sind nicht Bestandteil dieser Idee.',
    critique:'Die stärkste eigenständige Markenwelt. Große Flächen brauchen genaue Balance, damit PATON nicht zur Dekoration wird. Zweite Szene erklärt früh das System. Ohne Bewegung bleiben Bildfenster und Rollen klar. Mobile nutzt Pyra oben, Produktfenster darunter.',
    risk:'Kobalt ist eine explorative Umgebungsfarbe, keine Änderung am Markenmaster. Markengeometrie bleibt exakt; spätere Palette braucht Markenentscheidung.',
    recommendation:'Eine der drei stärksten Richtungen: hohe Wiedererkennbarkeit, echte Markenhierarchie und hoher Umsetzungsgrad mit eigenen Vektoren und authentischen Produktquellen.'
  },
  {
    id:'intent', number:'06', name:'Made of Intent', strategy:'Brand First', line:'Technologie beginnt mit Menschen, die etwas vorhaben.',
    idea:'Ein offenes Markenmanifest mit einem eigenen Atlas aus neun gezeichneten Bewegungsglyphen und asymmetrischen Collagen aus Team, realem PATON und Zukunftsskizzen. Pfirsich, Flieder und Tinte schaffen eine menschliche Forschungswelt, ohne PATON zu verniedlichen.',
    scenes:['Human ambition / Das Forschungsmanifest','A future in the making / Die offene Zukunftscollage'],
    type:'Manrope 800 in modularen, bewusst versetzten Satzblöcken; Georgia italic als menschliche Randnotiz. Auf Mobile echte Umbrüche statt verkleinerter Collage.',
    colors:['#eee1fa','#f6a77e','#24232a'], material:'Editorial-Collage, ausgeschnittene transparente Skizzen, echte Fotografie, flache Papierfelder. Keine künstlichen Schatten oder Cartoon-Hardware.',
    emotion:'Optimismus, Menschlichkeit, mutige gemeinsame Forschung.', roles:'FELYA sind Menschen mit technologischer Absicht. PATON steht als heutiges zentrales Produktsystem in der Collage; zukünftige Anwendungen bleiben separate Vision.',
    flow:['Menschen und Absicht','PATON als zentrales Forschungsinstrument','Die bidirektionale Zielsetzung','Prototypmaterial','Offene Zukunftsbilder','Einladung zur Zusammenarbeit'],
    motions:[
      {name:'Words make room for people', start:'Große versetzte Wortblöcke, reales Teamfoto und PATON als getrennte Bildfelder.', trigger:'Scroll durch das Manifest.', change:'Wortblöcke verschieben sich um höchstens 28 px; das Teamfoto wächst leicht, PATON bleibt auf seiner eigenen Fläche.', end:'Die menschlichen Urheber bekommen Raum innerhalb der Marke.', purpose:'FELYA als eigenständiges Unternehmen statt bloßes Produktlabel erlebbar machen.', grade:'A', assets:'Teamfoto, Light-Premium-WebP, eigenes gesture-atlas.svg, lokales Manrope.', preview:'Die erste Szene verschiebt Text und Teamfeld.'},
      {name:'The unfinished future', start:'Drei getrennte Zukunftsskizzen stehen auf eigenen Papierfeldern.', trigger:'Scroll durch das Vision-Kapitel.', change:'Der eigene Gestenatlas öffnet ein zusätzliches Papierfeld; die Zukunftsbilder nähern sich in 2D einer gemeinsamen Collage; eine klare FUTURES-Zeile und PATON-Produktmarkierung bleiben bestehen.', end:'Eine gemeinsame Zukunftstafel aus unveränderten Quellen, ohne erfundene technische Verbindung.', purpose:'Offene Forschung zeigen, ohne Vision als heutige Fähigkeit zu verkaufen.', grade:'A', assets:'Eigenes gesture-atlas.svg, drei vorhandene FUTURES-WebPs, echtes Produktfoto, CSS.', preview:'Die zweite Szene setzt die Collage zusammen.'}
    ],
    feasibility:'A · Eigener Gestenatlas, transparentes vorhandenes Bildmaterial und unverändertes Teamfoto. Echte räumliche Skizzenrotation wäre C; zusätzliche Teamdetails oder Portraits wären B.',
    critique:'Die menschlichste Markenrichtung, mit hoher eigenständiger Typografie. Collage kann zu einer Kulturpublikation werden und den technischen Fokus verlieren. Deshalb bleibt PATON früh und groß genug sichtbar. Mobile stapelt in der Reihenfolge Absicht → Team → Produkt → Zukunft.',
    risk:'Teamfoto maximal 1535 px, keine erfundenen Einzelporträts. Drei illustrative Anwendungen gehören ausschließlich zur Vision; keine neue Hardware entsteht aus den Skizzen.',
    recommendation:'Interessante Gegenposition für Recruiting und Marke; als Hauptauftritt braucht sie eine deutlichere frühe Systemerklärung.'
  }
];
