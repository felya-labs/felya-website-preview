import {readFile,readdir,realpath,lstat} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const runtime=new Set(['index.html','scene.html','canvas.js','canvas.css','directions.js','asset-strategies.js','scenes.js','scenes.css','review-state.js','earth.js','asset-paths.js','credits.html']);
const originals=['contact-contours.svg','functional-atlas.svg','relay-corridor.svg','echo-score.svg','aperture-fold.svg','gesture-atlas.svg','prototype-hand.webp','prototype-finger-detail.webp','prototype-contact-detail.webp'];
const common=[
 'assets/images/hero/paton-glove/paton-glove-light-premium-v1-1200.webp',
 ...['felya-logo-horizontal-white.svg','felya-logo-horizontal-black.svg','felya-mark-white.svg','felya-mark-black.svg'].map(x=>'assets/images/brand/felya-logo/'+x),
 ...['paton-operator-long-mask.webp','paton-operator-suit-mask.webp','paton-operator-glove-left-hand-mask.webp','paton-operator-glove-right-hand-mask.webp'].map(x=>'assets/images/system/operator/'+x),
 'assets/images/system/openarm-system-blueprint-refined.webp','assets/images/about/team-portrait/team5-pyra-clean-1535.webp',
 ...['vr-hydrogen-engine-touch','humanoid-arms-knipex-pliers','humanoid-with-rose'].map(x=>'assets/images/possible-futures/sketches/webp/'+x+'-black.webp'),
 'assets/video/paton-interface/h264/1200.mp4','fonts/manrope-variable.ttf','fonts/licenses/manrope-OFL-1.1.txt'
];
const required=new Set([...runtime,...originals.map(x=>'canvas-assets/'+x)]);
const allowed=new Set([...required,...common.map(x=>'site-assets/'+x)]);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function verifyPagesCanvas(repository){
 const repo=await realpath(resolve(repository));
 const git=args=>execFileSync('git',['-C',repo,...args],{encoding:'utf8'}).trim();
 if(git(['rev-parse','--is-shallow-repository'])!=='false')throw Error('Canvas preservation requires complete checkout history.');
 if((await readFile(resolve(repo,'public/CNAME'),'utf8')).trim()!=='preview.felya.com')throw Error('Not FELYA Preview.');
 const introduced=git(['log','--format=%H','HEAD','--','public/canvas/release-manifest.json']).length>0;
 const publicRoot=await realpath(resolve(repo,'public'));
 if(publicRoot!==resolve(repo,'public'))throw Error('Public root cannot be a symlink.');
 const folder=resolve(publicRoot,'canvas');let exists;
 try{exists=await lstat(folder);}catch(e){if(e.code!=='ENOENT')throw e;}
 if(!exists){if(introduced)throw Error('Previously introduced Canvas is missing; Pages publication refused.');return {canvas:false,files:0};}
 if(!exists.isDirectory()||exists.isSymbolicLink())throw Error('Canvas root is not a regular directory.');
 const manifest=JSON.parse(await readFile(resolve(folder,'release-manifest.json'),'utf8'));
 if(manifest.version!==1||manifest.base!=='/canvas/'||!Array.isArray(manifest.externalAssetRequests)||manifest.externalAssetRequests.length||!Array.isArray(manifest.runtimeFiles)||!Array.isArray(manifest.sharedAssets))throw Error('Invalid Canvas release profile.');
 const css=await readFile(resolve(repo,'src/styles/global.css'),'utf8');
 if(!css.includes('@source not "../../public/canvas";'))throw Error('Canvas CSS isolation missing.');
 const names=manifest.runtimeFiles.map(f=>f.path);
 if(new Set(names).size!==names.length||names.some(name=>!allowed.has(name))||[...required].some(name=>!names.includes(name)))throw Error('Canvas file allowlist violated.');
 const actual=[];
 async function walk(dir,prefix=''){for(const item of await readdir(dir,{withFileTypes:true})){if(item.isSymbolicLink())throw Error('Canvas symlink refused.');const name=prefix+item.name;if(item.isDirectory())await walk(resolve(dir,item.name),name+'/');else actual.push(name);}}
 await walk(folder);
 const expected=new Set([...names,'release-manifest.json']);
 if(actual.length!==expected.size||actual.some(name=>!expected.has(name)))throw Error('Unexpected or missing Canvas file.');
 for(const file of manifest.runtimeFiles){const bytes=await readFile(resolve(folder,file.path));if(hash(bytes)!==file.sha256||bytes.length!==file.bytes)throw Error('Canvas file changed: '+file.path);if(/\.(html|css|js|svg)$/.test(file.path)&&/(?:\/Users\/|\/private\/|\/home\/|file:\/\/|localhost|127\.0\.0\.1|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20}|github_pat_)/.test(bytes.toString()))throw Error('Private Canvas content refused.');}
 const shared=new Map();
 for(const file of manifest.sharedAssets){const name=file.url?.slice(1);if(file.url!=='/'+name||!common.includes(name)||shared.has(name))throw Error('Unapproved or duplicate shared dependency.');const path=await realpath(resolve(publicRoot,name));if(!path.startsWith(publicRoot+sep))throw Error('Shared dependency escaped public root.');const bytes=await readFile(path);if(hash(bytes)!==file.sha256||bytes.length!==file.bytes)throw Error('Canvas shared dependency changed: '+name);shared.set(name,file);}
 for(const name of common){const embedded=names.includes('site-assets/'+name);if(Number(shared.has(name))+Number(embedded)!==1)throw Error('Canvas dependency must be shared or embedded exactly once: '+name);}
 return {canvas:true,files:actual.length};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(JSON.stringify(await verifyPagesCanvas(process.cwd())));
