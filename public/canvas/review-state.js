import { directions } from './directions.js';
const clamp = value => Math.round(Math.max(0,Math.min(100,Number(value) || 0)));
export function readReviewState(input){
  const url=new URL(input,'http://canvas.local/');
  const hash=url.hash.slice(1);
  const concept=url.searchParams.get('concept');
  const direction=directions.find(d=>d.number===concept || d.id===concept) || directions.find(d=>d.id===hash);
  return {concept:direction?.id || null,scene:url.searchParams.get('scene')==='02'||url.searchParams.get('scene')==='2'?2:1,view:url.searchParams.get('view')==='mobile'?'mobile':'desktop',motion:clamp(url.searchParams.get('motion')),section:['sources','comparison'].includes(hash)?hash:null};
}
export function writeReviewUrl(input,state){
  const url=new URL(input,'http://canvas.local/');
  url.search='';
  const d=directions.find(d=>d.id===state.concept);
  if(d){url.searchParams.set('concept',d.number);url.searchParams.set('scene',String(state.scene===2?2:1).padStart(2,'0'));url.searchParams.set('view',state.view==='mobile'?'mobile':'desktop');url.searchParams.set('motion',String(Math.round(clamp(state.motion))));}
  url.hash=state.section?`#${state.section}`:'';
  return url;
}
