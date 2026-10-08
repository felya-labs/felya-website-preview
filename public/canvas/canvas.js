import { directions } from './directions.js';
import { assetStrategies, references } from './asset-strategies.js';
import { readReviewState, writeReviewUrl } from './review-state.js';
let reviewState = readReviewState(location.href);
const reviewLink = (id,scene=1) => {const state={...reviewState,concept:id,scene,section:null};return writeReviewUrl(location.href,state).search;};
const workspace = document.querySelector('#workspace');
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sceneUrl=(id,scene=1,progress=0)=>`scene.html?direction=${id}&scene=${scene}&progress=${progress}`;
const overview=()=>`<section class="canvas-intro"><div class="intro-kicker">FELYA × PATON / RADICAL EXPERIENCE EXPLORATION</div><h1>Six ways<br>to <em>reach further.</em></h1><div class="intro-bottom"><p>Sechs eigenständige digitale Welten.<br>Eine menschliche Absicht.</p><p>Ein Designboard öffnen, beide Szenen betrachten<br>und die Signature-Momente mit der Timeline erkunden.</p><span>06 DIRECTIONS<br>12 SCENES / 12 MOTION STUDIES</span></div></section><section class="gallery" aria-label="Sechs Creative Directions">${directions.map(d=>`<a class="direction-card" href="${reviewLink(d.id)}" aria-label="${d.number} ${d.name} öffnen"><div class="card-top"><span>${d.number} / ${d.strategy.toUpperCase()}</span><span>OPEN BOARD ↗</span></div><div class="mini-scene"><iframe src="${sceneUrl(d.id)}" title="${d.name} Hero Vorschau" tabindex="-1" aria-hidden="true" loading="lazy"></iframe></div><div class="card-caption"><h2>${d.name}</h2><p>${d.line}</p></div></a>`).join('')}</section><section class="canvas-principle"><span>THE CONSTANT</span><p>Your hands.<br>Anywhere on Earth.</p><div>Die Hardware bleibt echt. Die Bildwelt darf sich radikal ändern.<br><br>Authentische Produktquellen, sechs neue eigene Vektorwelten und drei lokal extrahierte Originalfilmframes. Systembilder erklären ein Entwicklungsziel. FUTURES bleiben Vision.</div></section>${comparison()}${sourceNotes()}`;
function comparison(){return `<section class="comparison" id="comparison"><div class="section-kicker">CREATIVE CRITIQUE / V1</div><h2>Eine echte Auswahl.<br>Keine sechs Farbstellungen.</h2><div class="comparison-table-wrap"><table><caption>Strategische Gegenüberstellung der sechs Richtungen</caption><thead><tr><th>Richtung</th><th>Visuelle Logik</th><th>Stärkster Gewinn</th><th>Kritischer Punkt</th><th>Machbarkeit</th></tr></thead><tbody><tr><th><a href="${reviewLink('tactile')}">01 Tactile Index</a></th><td>Zentriertes Exponat / Materialregister</td><td>Produktwertigkeit</td><td>System früh ergänzen</td><td>A · Foto + Konturen</td></tr><tr><th><a href="${reviewLink('field')}">02 Field Manual</a></th><td>Faltblatt / offenes Diagramm</td><td>Systemverständnis</td><td>Emotional kühler</td><td>A · Masken + SVG</td></tr><tr><th><a href="${reviewLink('relay')}">03 The Relay</a></th><td>Portale / Erdmaßstab</td><td>Erlebbarer Claim</td><td>Sci-Fi-Klischee vermeiden</td><td>A · 2.5D-Korridor</td></tr><tr><th><a href="${reviewLink('between')}">04 Between Here & There</a></th><td>Filmrahmen / Serifenessay</td><td>Menschliche Bedeutung</td><td>Archivvariante klar einordnen</td><td>A · Frames + Echo</td></tr><tr><th><a href="${reviewLink('aperture')}">05 Pyra / Aperture</a></th><td>Monumentales Zeichen / Bildöffnung</td><td>Eigenständige Marke</td><td>Produkt nicht zur Dekoration machen</td><td>A · SVG + CSS-Clip</td></tr><tr><th><a href="${reviewLink('intent')}">06 Made of Intent</a></th><td>Typomanifest / menschliche Collage</td><td>Unternehmenspersönlichkeit</td><td>Technischen Fokus halten</td><td>A · Gesten + Collage</td></tr></tbody></table></div><div class="recommendations">${[directions[4],directions[2],directions[0]].map((d,i)=>`<a href="${reviewLink(d.id)}"><span>RECOMMENDATION ${i+1}</span><h3>${d.name}</h3><p>${d.recommendation}</p><b>Board öffnen ↗</b></a>`).join('')}</div><div class="next-iteration"><span>NEXT CREATIVE ITERATION</span><p>Pyra / Aperture und The Relay zu je einer zusammenhängenden 3-Kapitel-Erfahrung vertiefen. Tactile Index als statischen Qualitätsmaßstab daneben halten. Zuerst den Übergang zum System und die mobile Dramaturgie prüfen; anschließend eine Richtung auswählen.</p></div><details class="asset-disclosure"><summary>Assetherkunft, technische Grenzen & Reviewumfang</summary><p>Originalquellen: vorhandene Light-Premium-PATON-WebPs, kanonische V5-Pyra/Lockups, pixelgleiche Operator-Layer, OpenArm-Maske, bestehende Erdgeometrie, Filmcover und freiwillig gestarteter Prototypfilm, Teamfoto und FUTURES-WebPs. Ergänzung: sechs selbst entwickelte SVGs und drei Originalfilmframes. Keine synthetischen PATON-Aufnahmen oder erfundenen Hardwaredetails. Externe Quellen dienen nur der verlinkten Recherche; keine externen Bildassets eingebaut.</p><p>PATON-Fotomaster: 1189 × 1323 px, bestehende Retuschen einschließlich rekonstruierter Manschette. Die Galerie ist kein unbehandelter Foto-Nachweis. Extremes Retina-Makro braucht höhere Originalauflösung. Operator, Roboter und Skizzen sind Illustrationen. Einzelne demonstrierte Fähigkeiten sind durch diese Websitequellen nicht geklärt.</p><p>A: vorhandene authentische Quellen + selbst gezeichnete SVGs/CSS und vorbereitete Filmframes. B: weitere Originalmaterial-Recherche, freigegebene technische Zeichnungen oder zusätzliche Layer. C: echtes 3D / erhebliche neue technische Basis. Die realisierten V1-Momente sind A; die Boards nennen B/C-Erweiterungen ausdrücklich.</p><p>Desktop- und mobile Browserprüfung sowie Assetherkunft sind dokumentiert. <a href="credits.html">Quellen & Nutzungsrechte ↗</a> Mobile Vorschau benutzt einen echten 390-px-iframe; zusätzlich wurden die Boards im mobilen Browserviewport geprüft. Keine Geräte-/Retina-/GPU-Benchmarks. Neue Arbeitstexte sind Deutsch, Szenencopy Englisch; keine vollständige Lokalisierung.</p></details></section>`;}
function motion(m,index){return `<article class="motion-card"><div class="motion-heading"><span>0${index+1} / SIGNATURE MOMENT</span><b class="grade">${m.grade}</b></div><h3>${m.name}</h3><div class="motion-states"><div><span>START</span><p>${m.start}</p></div><i>→</i><div><span>TRANSFORMATION</span><p>${m.change}</p></div><i>→</i><div><span>END</span><p>${m.end}</p></div></div><dl><dt>Scrollauslöser</dt><dd>${m.trigger}</dd><dt>Erzählerische Funktion</dt><dd>${m.purpose}</dd><dt>Assets / Umsetzung</dt><dd>${m.assets}</dd><dt>Timeline-Vorschau</dt><dd>${m.preview}</dd></dl></article>`;}
function board(d){return `<nav class="board-nav" aria-label="Creative Directions"><a class="back" href="?">← Alle Richtungen</a><div>${directions.map(x=>`<a data-concept="${x.id}" href="${reviewLink(x.id)}" aria-label="${x.number} ${x.name}" ${x.id===d.id?'aria-current="page"':''}>${x.number}<span>${x.name}</span></a>`).join('')}</div><button type="button" class="share-button">Link kopieren</button><a href="?#comparison">Vergleich ↗</a></nav><section class="board-intro"><div class="section-kicker">${d.number} / ${d.strategy.toUpperCase()}</div><h1>${d.name}</h1><p>${d.idea}</p><div class="board-tools"><div class="viewport-group" aria-label="Szenenformat"><button type="button" data-format="desktop" aria-pressed="true">Desktop</button><button type="button" data-format="mobile" aria-pressed="false">Mobile / 390</button></div><div class="scene-choice" aria-label="Ausgewählte Szene"><button type="button" data-scene-select="1">Szene 01</button><button type="button" data-scene-select="2">Szene 02</button></div><output class="share-status" aria-live="polite"></output><label class="scroll-toggle"><input type="checkbox" id="scroll-preview"> Scroll-Timeline aktivieren</label><span>V1 · DESIGNBOARD / KEINE LIVE-HARDWARE</span></div></section><div class="board-scenes">${d.scenes.map((name,i)=>`<section class="scene-study" data-scene="${i+1}" aria-labelledby="scene-label-${i}"><div class="scene-study-label"><h2 id="scene-label-${i}"><span>SCENE 0${i+1}</span>${name}</h2><a class="standalone-link" href="${sceneUrl(d.id,i+1)}" target="_blank" rel="noopener">Szene im Browser ↗</a></div><div class="scene-stage"><iframe class="full-scene" src="${sceneUrl(d.id,i+1)}" title="${d.name} — ${name}" loading="eager"></iframe></div><div class="scrub"><span>0${i+1} / ${d.motions[i].name}</span><input type="range" min="0" max="100" value="0" step="1" aria-label="Motion Timeline Szene ${i+1}"><output>0 %</output><div class="keyframes"><button data-progress="0" type="button">Start</button><button data-progress="50" type="button">Mitte</button><button data-progress="100" type="button">Ende</button></div></div></section>`).join('')}</div><section class="board-notes"><div class="creative-spec"><div><span>TYPOGRAPHIC DIRECTION</span><p>${d.type}</p></div><div><span>COLOUR & MATERIAL</span><div class="swatches">${d.colors.map(c=>`<span style="--swatch:${c}" title="${c}"></span>`).join('')}</div><p>${d.material}</p></div><div><span>EMOTIONAL INTENT</span><p>${d.emotion}</p></div><div><span>FELYA / PATON</span><p>${d.roles}</p></div></div>${assetStrategy(d)}<div class="whole-story"><span>SCROLL DRAMATURGY / THE WHOLE WEBSITE</span><ol>${d.flow.map((x,i)=>`<li><b>0${i+1}</b><span>${x}</span></li>`).join('')}</ol></div><div class="motion-section"><div class="section-kicker">SIGNATURE MOTION / A = CSS & SVG · B = ASSETARBEIT · C = 3D</div><h2>Motion with a reason.</h2>${d.motions.map(motion).join('')}</div><div class="judgment"><div><span>TECHNISCHE MACHBARKEIT</span><p>${d.feasibility}</p></div><div><span>GESTALTERISCHE SELBSTKRITIK</span><p>${d.critique}</p></div><div><span>RISIKEN / ASSETGRENZEN</span><p>${d.risk}</p></div><div><span>CREATIVE DIRECTOR'S TAKE</span><p>${d.recommendation}</p></div></div><aside class="truth-note"><b>Produktdarstellungen aus bestehenden Quellen.</b> Das PATON-Foto enthält dokumentierte frühere Retuschen; hier ergänzt durch eigene abstrakte SVGs und authentische Filmframes. Archivprototypen können vom aktuellen Produktfoto abweichen. Systembilder zeigen das Entwicklungsziel, keinen Funktionsnachweis. FUTURES sind Vision. Timeline-Werte sind Gestaltungsfortschritt, keine Messwerte.</aside><div class="board-review"><label for="review-note">Reviewnotiz für ${d.name} <span>nur in diesem Browser gespeichert</span></label><textarea id="review-note" rows="3" placeholder="Was trägt diese Richtung? Was fehlt?"></textarea><output id="note-status" role="status"></output></div><a class="return-gallery" href="?">← Zur visuellen Auswahl</a></section>`;}

function assetStrategy(d){const a=assetStrategies[d.id];return `<section class="asset-strategy"><div class="section-kicker">ASSET STRATEGY / EXPANDED V1</div><h2>${esc(a.principle)}</h2><p>${esc(a.addition)}</p><div class="asset-studies">${a.assets.map(x=>`<figure><div class="asset-image ${d.id}"><img src="./canvas-assets/${x.file}" alt="${esc(x.name)}" loading="lazy"></div><figcaption><b>${esc(x.name)}</b><span>${esc(x.kind)}</span></figcaption></figure>`).join('')}</div><div class="asset-plan"><div><span>MOTION LANGUAGE</span><p>${esc(a.motion)}</p></div><div><span>NEXT ASSET OPPORTUNITY</span><p>${esc(a.next)}</p></div></div><a class="asset-source-link" href="?#sources">Quellen, Rechte und Referenzen ↗</a></section>`;}
function sourceNotes(){return `<section class="source-notes" id="sources"><div class="section-kicker">PROVENANCE / SOURCES & REFERENCES</div><h2>Eigene Grafiken.<br>Authentisches Archiv.</h2><p>Sechs mathematisch gezeichnete Original-SVGs, ohne fremde Vektoren, Messdaten oder CAD. Drei Filmframes aus der vorhandenen lokalen PATON-MP4, vollständig dekodiert und als WebP gespeichert. Kein KI-Dienst, kein Upload von Produktdaten. Das Filmarchiv zeigt eine frühere Prototypvariante. Die projektseitigen Nutzungsrechte bleiben Voraussetzung der internen Originalquellen.</p><p><a href="credits.html">Quellen, Bearbeitungen und Nutzungsrechte ↗</a>. Originalgrafiken und Archivaufnahmen sind getrennt dokumentiert.</p><div class="reference-list">${references.map(x=>`<article><a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(x.name)} ↗</a><p>${esc(x.use)}</p><small>${esc(x.rights)}</small></article>`).join('')}</div><a class="return-gallery" href="?">← Zur visuellen Auswahl</a></section>`;}

let resizeObserver;
let cleanup=()=>{};
function render(){
  if(location.hash === '#workspace') return;
  cleanup(); resizeObserver?.disconnect();
  reviewState=readReviewState(location.href);
  const d=directions.find(x=>x.id===reviewState.concept);
  workspace.innerHTML=d?board(d):overview();
  document.title=d?`FELYA — ${d.name} / Creative Canvas`:'FELYA — Creative Canvas V1';
  resizeObserver=new ResizeObserver(entries=>entries.forEach(e=>e.target.style.setProperty('--scale',e.contentRect.width/1440)));
  document.querySelectorAll('.mini-scene').forEach(e=>resizeObserver.observe(e));
  if(d){
    setupBoard(d);
    document.querySelector(`[data-scene="${reviewState.scene}"]`).scrollIntoView({block:'start',behavior:'instant'});
  }else if(reviewState.section) document.querySelector(`#${reviewState.section}`).scrollIntoView();
  else window.scrollTo({top:0,behavior:'instant'});
}
function persistReview(){
  history.replaceState(null,'',writeReviewUrl(location.href,reviewState));
  document.querySelectorAll('.board-nav [data-concept]').forEach(link=>link.href=reviewLink(link.dataset.concept));
}
function selectScene(number){
  reviewState.scene=number;
  const study=document.querySelector(`.scene-study[data-scene="${number}"]`);
  reviewState.motion=Number(study.querySelector('input').value);
  document.querySelectorAll('[data-scene-select]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.sceneSelect)===number));
  document.querySelectorAll('.scene-study').forEach(s=>s.classList.toggle('selected-scene',Number(s.dataset.scene)===number));
  persistReview();
}
function setupBoard(d){
  const studies=[...document.querySelectorAll('.scene-study')];
  const toggle=document.querySelector('#scroll-preview');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const set=(study,value,sync=true)=>{
    const input=study.querySelector('input[type="range"]');
    input.value=value;
    study.querySelector('output').textContent=`${Math.round(value)} %`;
    study.querySelector('iframe').contentWindow.postMessage({type:'felya-canvas-progress',progress:value/100},location.origin);
    const link=study.querySelector('.standalone-link');link.href=sceneUrl(d.id,Number(study.dataset.scene),value/100);
    if(sync){reviewState.motion=value;selectScene(Number(study.dataset.scene));}
  };
  studies.forEach(study=>{
    const value=Number(study.dataset.scene)===reviewState.scene?reviewState.motion:0;
    study.querySelector('iframe').src=sceneUrl(d.id,Number(study.dataset.scene),value/100);
    set(study,value,false);
    study.querySelector('iframe').addEventListener('load',()=>set(study,Number(study.querySelector('input').value),false));
    study.querySelector('input').addEventListener('input',event=>{toggle.checked=false;set(study,Number(event.target.value));});
    study.querySelectorAll('[data-progress]').forEach(b=>b.addEventListener('click',()=>{toggle.checked=false;set(study,Number(b.dataset.progress));}));
  });
  const applyFormat=()=>{
    document.querySelector('.board-scenes').classList.toggle('mobile-preview',reviewState.view==='mobile');
    document.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.format===reviewState.view));
  };
  applyFormat();selectScene(reviewState.scene);
  document.querySelectorAll('[data-format]').forEach(b=>b.addEventListener('click',()=>{reviewState.view=b.dataset.format;applyFormat();persistReview();}));
  document.querySelectorAll('[data-scene-select]').forEach(b=>b.addEventListener('click',()=>{selectScene(Number(b.dataset.sceneSelect));document.querySelector(`[data-scene="${reviewState.scene}"]`).scrollIntoView({block:'start',behavior:'instant'});}));
  document.querySelector('.share-button').addEventListener('click',async()=>{
    const status=document.querySelector('.share-status');persistReview();
    try{await navigator.clipboard.writeText(location.href);status.textContent='Link kopiert.';}
    catch{status.textContent='Link markieren und kopieren:';let field=document.querySelector('.share-url');if(!field){field=document.createElement('input');field.className='share-url';field.readOnly=true;field.setAttribute('aria-label','URL zum Teilen');status.after(field);}field.value=location.href;field.focus();field.select();}
  });
  let raf;
  const onScroll=()=>{
    if(!toggle.checked || reduced.matches || raf) return;
    raf=requestAnimationFrame(()=>{
      raf=undefined;
      studies.forEach(study=>{
        const rect=study.querySelector('.scene-stage').getBoundingClientRect();
        const value=Math.max(0,Math.min(100,(window.innerHeight*.7-rect.top)/(rect.height+window.innerHeight*.3)*100));
        set(study,value,false);
      });
      const selected=studies.find(s=>Number(s.dataset.scene)===reviewState.scene);reviewState.motion=Number(selected.querySelector('input').value);persistReview();
    });
  };
  const syncReduced=()=>{toggle.disabled=reduced.matches;if(reduced.matches)toggle.checked=false;};
  syncReduced(); reduced.addEventListener('change',syncReduced);
  toggle.addEventListener('change',onScroll);
  window.addEventListener('scroll',onScroll,{passive:true});
  const note=document.querySelector('#review-note'),status=document.querySelector('#note-status');
  try{note.value=localStorage.getItem(`felya-creative-canvas-v1-${d.id}`)||'';}catch{status.textContent='Browserspeicher nicht verfügbar.';}
  note.addEventListener('input',()=>{try{localStorage.setItem(`felya-creative-canvas-v1-${d.id}`,note.value);status.textContent='Lokal gespeichert.';}catch{status.textContent='Speichern nicht verfügbar; Notiz bitte kopieren.';}});
  cleanup=()=>{window.removeEventListener('scroll',onScroll);reduced.removeEventListener('change',syncReduced);if(raf)cancelAnimationFrame(raf);};
}
window.addEventListener('hashchange',render);
window.addEventListener('popstate',render);
document.addEventListener('click',event=>{
  const a=event.target.closest('a');
  if(!a||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||a.target||a.hasAttribute('download'))return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||url.pathname!==location.pathname||url.hash==='#workspace')return;
  event.preventDefault();history.pushState(null,'',url);render();
});
render();
