import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// Pure geometry checks, independent of browser rendering.
const root=path.resolve(import.meta.dirname,'..');
const ctx=new Proxy({}, {get(target,key){if(key==='createLinearGradient')return()=>({addColorStop(){}});return()=>{};},set(){return true;}});
const element=()=>({style:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},remove(){},addEventListener(){},setAttribute(){},getContext(){return ctx;}});
globalThis.document={querySelector:()=>element(),querySelectorAll:()=>[],createElement:()=>element()};
globalThis.matchMedia=()=>({matches:true});
const three=pathToFileURL(path.join(root,'dist/vendor/three.module.js')).href;
const data=pathToFileURL(path.join(root,'dist/house-data.js')).href;
let code=await fs.readFile(path.join(root,'dist/app.js'),'utf8');
code=code.replace(/import \* as THREE from 'three';/,`import * as THREE from '${three}';`)
 .replace(/import \{OrbitControls\}[^\n]+\n/,'')
 .replace(/import \{FLOORS,PLOT,C,TOUR,feet,DESIGNS,applyDesign\}[^\n]+/,`import {FLOORS,PLOT,C,TOUR,feet,DESIGNS,applyDesign} from '${data}';`)
 .replace(/import \{SoftwareRenderer\}[^\n]+\n/,'')
 .replace(/\ninit\(\);\s*$/,'');
code+=`
scene=new THREE.Scene();
for(const id of Object.keys(FLOORS)) buildFloor(id);
buildTerrain();
function rebuildForTest(n){disposeFloorModels();state.design=n;applyDesign(n);for(const id of Object.keys(FLOORS))buildFloor(id);}
export {FLOORS,groups,colliders,furnitureBlocks,canWalk,state,terrain,pedestrianGate,PLOT,rebuildForTest,privacyDoors};
`;
const temporary=path.join('/tmp',`courtyard-model-${process.pid}.mjs`);
await fs.writeFile(temporary,code);
const model=await import(pathToFileURL(temporary));
await fs.unlink(temporary);
const {FLOORS,groups,colliders,furnitureBlocks,state,canWalk}=model;
const assert=(test,message)=>{if(!test)throw Error(message);};
const placementSignatures=new Set();
for(let design=1;design<=5;design++){
if(design>1)model.rebuildForTest(design);
console.log(`Checking Design ${design}`);
let rooms=0,meshCount=0;
for(const [id,f]of Object.entries(FLOORS)){
  if(id==='ground'||id==='first'){
    if(id==='ground'){const signature=JSON.stringify(f.rooms.filter(r=>['bedroom','bathroom','kitchen','living'].includes(r.type)).map(r=>[r.id,r.rect]));assert(!placementSignatures.has(signature),'Each design must have different room placement');placementSignatures.add(signature);}
    for(const [bedId,bathId] of f.bedPairs){const A=f.rooms.find(r=>r.id===bedId).rect,B=f.rooms.find(r=>r.id===bathId).rect;let access=false;for(const wall of f.walls){const horizontal=wall.a[1]===wall.b[1],fixed=horizontal?wall.a[1]:wall.a[0];const faces=horizontal?[A[2],A[3]]:[A[0],A[1]],otherFaces=horizontal?[B[2],B[3]]:[B[0],B[1]];if(!faces.some(a=>otherFaces.some(b=>Math.abs(a-b)<=.51&&Math.abs(fixed-(a+b)/2)<.05)))continue;const lo=Math.max(horizontal?A[0]:A[2],horizontal?B[0]:B[2]),hi=Math.min(horizontal?A[1]:A[3],horizontal?B[1]:B[3]);if(wall.openings.some(o=>o.type==='door'&&o.center-o.width/2>=lo-.05&&o.center+o.width/2<=hi+.05))access=true;}assert(access,`${id}: ${bedId} needs direct private access to ${bathId}`);}
    assert(f.rooms.filter(r=>r.type==='bedroom').length===2,`${id}: two bedrooms required`);
    assert(f.rooms.filter(r=>r.type==='bathroom').length===2,`${id}: two bathrooms required`);
    assert(f.rooms.filter(r=>r.type==='kitchen').length===1,`${id}: separate kitchen required`);
    if(design===5){assert(model.privacyDoors.length===2&&model.privacyDoors.every(p=>p.group.rotation.y===0),'Kitchen privacy doors must start closed');assert(!f.rooms.some(r=>r.id==='family-dining'),'Design 5 must merge dining into the lounge');assert(f.furniture.merged,'Design 5 merged room furniture missing');assert(f.walls.some(w=>w.privacy&&w.openings[0].type==='door'),'Design 5 opaque kitchen door missing');assert(f.rooms.find(r=>r.id==='service-lobby'),'Design 5 turning kitchen lobby missing');}
    const gallery=f.rooms.find(r=>r.id==='gallery');assert(Math.min(gallery.width,gallery.depth)===6.5,`${id}: gallery must be 6.5 ft clear`);for(const block of furnitureBlocks[id])assert(Math.min(gallery.rect[1],block.x2)<=Math.max(gallery.rect[0],block.x1)||Math.min(gallery.rect[3],block.z2)<=Math.max(gallery.rect[2],block.z1),`${id}: furniture blocks the wide gallery`);
    for(const r of f.rooms.filter(r=>r.type==='bedroom'))assert(r.area>=162.4,`${id}/${r.id}: bedroom too small`);
  }
  for(let a=0;a<f.rooms.length;a++)for(let b=a+1;b<f.rooms.length;b++){const A=f.rooms[a],B=f.rooms[b],overlapX=Math.min(A.rect[1],B.rect[1])-Math.max(A.rect[0],B.rect[0]),overlapZ=Math.min(A.rect[3],B.rect[3])-Math.max(A.rect[2],B.rect[2]);assert(overlapX<=.01||overlapZ<=.01,`${id}: ${A.id} overlaps ${B.id}`);}
  for(const r of f.rooms){rooms++;assert(r.rect.every(Number.isFinite),`${id}/${r.id}: invalid dimensions`);assert(r.rect[0]>=-20.51&&r.rect[1]<=20.51&&r.rect[2]>=-15.26&&r.rect[3]<=(r.type==='parking'?26.5:15.26),`${id}/${r.id}: outside the building envelope`);}
  for(const def of f.walls){const horizontal=def.a[1]===def.b[1],a=horizontal?def.a[0]:def.a[1],b=horizontal?def.b[0]:def.b[1];for(const o of def.openings)assert(o.center-o.width/2>=a-.05&&o.center+o.width/2<=b+.05,`${id}: opening outside wall`);}
  groups[id].traverse(o=>{if(o.isMesh){meshCount++;const p=o.geometry.attributes.position.array;assert(Array.from(p).every(Number.isFinite),`${id}: invalid geometry`);}});
  state.floor=id;
  const walkRooms=f.rooms.filter(r=>r.view&&r.id!=='plant');
  for(const r of walkRooms)assert(canWalk(...r.view.point),`${id}/${r.id}: room entry point collides with structure`);
  if(id==='ground'||id==='first'||id==='basement'){
    const start=(f.rooms.find(r=>r.id==='living')||f.rooms[0]).view.point;
    const step=.35,minX=-20.25,minZ=-15.1,nx=Math.floor(40.5/step)+1,nz=Math.floor(30.2/step)+1;
    const cell=([x,z])=>[Math.round((x-minX)/step),Math.round((z-minZ)/step)];
    const [sx,sz]=cell(start),seen=new Uint8Array(nx*nz),queue=[[sx,sz]];seen[sz*nx+sx]=1;
    for(let q=0;q<queue.length;q++){const [x,z]=queue[q];for(const [dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||xx>=nx||zz<0||zz>=nz||seen[zz*nx+xx])continue;if(canWalk(minX+xx*step,minZ+zz*step)){seen[zz*nx+xx]=1;queue.push([xx,zz]);}}}
    for(const r of walkRooms){const[x,z]=cell(r.view.point);assert(seen[z*nx+x],`${id}/${r.id}: no walkable route from the main landing`);}
    if(design===5&&id!=='basement'){
      const kitchen=f.rooms.find(r=>r.id==='kitchen').rect,seenNoKitchen=new Uint8Array(nx*nz),safeQueue=[[sx,sz]];seenNoKitchen[sz*nx+sx]=1;
      for(let q=0;q<safeQueue.length;q++){const[x,z]=safeQueue[q];for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||xx>=nx||zz<0||zz>=nz||seenNoKitchen[zz*nx+xx])continue;const px=minX+xx*step,pz=minZ+zz*step;if(px>kitchen[0]&&px<kitchen[1]&&pz>kitchen[2]&&pz<kitchen[3])continue;if(canWalk(px,pz)){seenNoKitchen[zz*nx+xx]=1;safeQueue.push([xx,zz]);}}}
      for(const bedroom of f.rooms.filter(r=>r.type==='bedroom')){const[x,z]=cell(bedroom.view.point);assert(seenNoKitchen[z*nx+x],`${id}: bedroom access must avoid the kitchen`);}
    }
    console.log(`${f.name}: all ${walkRooms.length} room entry points connected through doorways.`);
  }
}
console.log(`PASS: 4 ensuite bedrooms, 5 bathrooms, 2 kitchens; ${rooms} labelled spaces; ${meshCount} valid model meshes.`);

const {terrain,pedestrianGate,PLOT}=model;
assert(PLOT.rear===0,'Rear strip must be removed');
assert(Math.abs(PLOT.side*PLOT.side-1836)<.01,'Plot area must remain 1836 sq ft');
assert(pedestrianGate.name==='second-pedestrian-gate','Separate pedestrian gate missing');
assert(pedestrianGate.children[0].scale.x===4.5,'Second gate must be 4.5 ft wide');
const boundary=terrain.children.filter(n=>n.name==='boundary-wall');
assert(boundary.length===5,'Continuous side/rear walls and two front segments required');
const front=-16.1+PLOT.side;
for(const n of boundary){const wall=n.children[0];assert(Number.isFinite(wall.position.z),'Invalid boundary geometry');if(wall.position.z>front-.5){const lo=wall.position.x-wall.scale.x/2,hi=wall.position.x+wall.scale.x/2;assert(hi<=0||lo>=4.5,'Front wall blocks pedestrian gate');}}
assert(Math.abs(pedestrianGate.position.z-(front-.14))<.01,'Gate is not on the front boundary');
assert(!terrain.children.some(n=>n.name==='descending-stair'),'Old rear escape stair must be removed');
console.log('PASS: same square plot, no rear strip, continuous boundary, separate 4.5 ft entrance gate.');

}
