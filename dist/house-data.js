export const PLOT = {area:1836, side:Math.sqrt(1836), width:42.5, depth:32, rear:0, front:10.54857, height:10.5, wall:.5};
export const C = {bedroom:'#ded9cc',bathroom:'#cfdbd9',kitchen:'#dddac9',living:'#dbe0cd',parking:'#e1e0d4',balcony:'#e2dfcc',stairs:'#d0d4c5',hall:'#e9e7db',cinema:'#c9d0ca',drawing:'#d9dccd',study:'#ded8c7',prayer:'#d4decc',utility:'#d6d8d0',terrace:'#e5dfcb',solar:'#c9d4d7'};
const room=(id,name,type,x1,x2,z1,z2,description,badges=[],view=null)=>({id,name,type,rect:[x1,x2,z1,z2],description,badges,view,width:x2-x1,depth:z2-z1,area:(x2-x1)*(z2-z1)});
const w=(a,b,openings=[],exterior=false)=>({a,b,openings,exterior});
const d=(center,width=3)=>({center,width,type:'door',height:7});
const win=(center,width=6,sill=3.2,height=4.5)=>({center,width,type:'window',sill,height});
const commonWalls=()=>[
  w([-20.875,-15.625],[20.875,-15.625],[],true),
  w([-20.875,-15.625],[-20.875,15.625],[win(-9,5)],true),
  w([20.875,-15.625],[20.875,15.625],[win(-9,5),win(8.5,6)],true),
  w([-20.875,15.625],[20.875,15.625],[{...d(-15.25,10.5),height:9.7},win(-5.7,3.5,5.5,2.8),d(2.2,4.5),win(7,4.5,2.4,5.8),win(15.75,8.5,2.4,5.8)],true),
  w([-6.75,-15.25],[-6.75,-2.5],[d(-11,2.75),d(-4.8)]),
  w([.25,-15.25],[.25,-7]),
  w([7.25,-15.25],[7.25,-2.5],[d(-11.25,2.75),d(-4.8)]),
  w([-6.5,-7],[7,-7],[]),
  w([10.75,2.5],[10.75,15.25],[d(6.6,3.25)]),
  w([10.75,2.5],[20.5,2.5]),
  w([-20.5,-2.5],[-7,-2.5]),
  w([7.5,-2.5],[20.5,-2.5],[d(17,3.25)]),
  w([-9.75,-2.25],[-9.75,15.25],[d(1.3,3)]),
];
const mainRooms=(upper)=>[
  room('bed-west',upper?'Bedroom 3':'Bedroom 1','bedroom',-20.5,-7,-15.25,-2.75,'A redesigned queen bedroom with the headboard on the outer side wall, a fitted wardrobe beside the entry and clear access to the private ensuite. Warm oak, ivory bedding and restrained lighting keep it minimal.',['13½′ × 12½′','Private ensuite','Queen bed'],{point:[-10,-5.7],look:[-16,-10]}),
  room('bed-primary',upper?'Bedroom 4 — primary':'Bedroom 2 — primary','bedroom',7.5,20.5,-15.25,-2.75,'A redesigned king bedroom with a side-wall upholstered headboard, fitted wardrobe and a reading seat. The entrance is moved toward the outer side to create a more private arrival, with a clear route to the ensuite.',['13′ × 12½′','Attached bath','King bed'],{point:[16,-4],look:[16,-10]}),
  room('bath-shared',upper?'Bedroom 3 ensuite':'Bedroom 1 ensuite','bathroom',-6.5,0,-15.25,-7.25,'A private bathroom accessed only from the west bedroom: glazed shower, floating vanity and WC.',['6½′ × 8′','Private access','Glass shower'],{point:[-4.6,-11],look:[-2,-13]}),
  room('bath-primary','Primary ensuite','bathroom',.5,7,-15.25,-7.25,'A private full bathroom directly connected to the primary bedroom, with a glass shower and floating vanity.',['6½′ × 8′','Private access','Glass shower'],{point:[5.8,-11],look:[2.7,-13.3]}),
  room('kitchen',upper?'First-floor kitchen':'Ground-floor kitchen','kitchen',11,20.5,2.75,15.25,'Relocated to the front-right corner, this enclosed kitchen has a wide front window, an L-shaped worktop, integrated appliances and tall storage. A side doorway opens toward the dining area without placing cooking on the main entrance route.',['9½′ × 12½′','Separate kitchen','Front window'],{point:[12,6.6],look:[17,10.5]}),
  room('living','TV lounge','living',-1.5,10.5,2.75,15.25,'A reoriented family lounge with a long sofa, an occasional chair and a pale stone coffee table facing a fitted media wall. A clear strip behind the sofa connects the entrance, dining area and bedroom hall.',['12′ × 12½′','Reoriented seating','Fitted TV wall'],{point:[5,4.4],look:[7,10.5]}),
  room('family-dining','Family dining','hall',-1.5,7,-6.75,2.25,'The former central kitchen becomes a bright open dining space. Four seats and a slim sideboard and uncluttered circulation link the new kitchen, TV lounge and the two bedroom entrances.',['8½′ × 9′','4-seat table','Open to lounge'],{point:[6.3,1.2],look:[3.5,-3.4]}),
  room('dining','Entrance & landing','hall',-9.5,-2,-2.25,4,'An uncluttered entrance landing joins the kitchen, stairs and bedroom corridor. The separate dining area lies beside the TV lounge.',['Clear circulation','Entry console'],{point:[-2,-.5],look:[-5,1.5]}),
  upper?room('terrace','Covered balcony','balcony',-20.5,-10,-2.25,15.25,'A shaded balcony above the car bay, furnished with outdoor seating, planters and a small breakfast table.',['10½′ × 17½′','Shaded balcony','Outdoor seating'],{point:[-13,1.1],look:[-16,9]}):room('parking','Car porch','parking',-20.5,-10,-2.25,15.25,'A single straight-in parking bay. The compact car is shown to scale, with a separate pedestrian entry into the house. Check your vehicle before finalising.',['10½′ × 17½′','One compact car'],{point:[-11.1,13],look:[-15,3]}),
  room('stairs','Central staircase','stairs',-9.5,-2,4.5,15.25,'An aligned dog-leg stair connects every level. Two flights, a middle landing, 3½-foot clear flight widths and handrails are modelled; final headroom and details need verification.',['Aligned on every floor','18 risers / level','3½′ clear flights'],{point:[-6,3.1],look:[-6,9]})
];
const groundWalls=commonWalls();
const upperWalls=commonWalls();
// Remove the front and side enclosure around the uncovered upper terrace.
upperWalls[1]=w([-20.875,-15.625],[-20.875,-2.5],[],true);
upperWalls[3]=w([-9.75,15.625],[20.875,15.625],[win(-5.7,3.5,5.5,2.8),win(2.2,3.5,3.2,4.5),win(7,4.5,2.4,5.8),win(15.75,8.5,2.4,5.8)],true);

export const FLOORS={
  basement:{name:'Basement',short:'B1',level:-1,title:'A little escape, downstairs.',subtitle:'Gather, create, unwind — and find a quiet moment.',rooms:[
    room('drawing','Social lounge','drawing',-20.5,-2,-15.25,-2.25,'A relaxed basement social lounge with generous seating, a games table, a refreshment cabinet and layered lighting. A separate cinema keeps movie nights away from the quiet study and prayer rooms.',['18½′ × 13′','Games + refreshments','Layered lighting'],{point:[-5,-4],look:[-13,-11]}),
    room('cinema','Home cinema','cinema',2,20.5,-15.25,-2.25,'Six lounge seats face a wide screen, with acoustic wall panels, soft floor lighting and a raised second row.',['18½′ × 13′','6 seats','Acoustic treatment'],{point:[5,-3.8],look:[15,-12.5]}),
    room('study','Study & library','study',-20.5,-10,2.75,15.25,'A dedicated work room with a long desk, two chairs, bookshelves and a quiet reading seat. Mechanical fresh-air ventilation is required.',['10½′ × 12½′','Two workstations','Library wall'],{point:[-15,4.3],look:[-16,12]}),
    room('prayer','Prayer room','prayer',7.5,20.5,2.75,15.25,'A quiet dedicated room with three prayer mats, a low bookcase and a shoe bench. Final qibla orientation must be established for the actual site.',['13′ × 12½′','Quiet space','Illustrative direction'],{point:[10,4.5],look:[15,11]}),
    room('bath-spa','Basement bathroom','bathroom',-1.5,6.75,2.75,15.25,'A larger full bathroom with a glazed shower, bathtub, vanity and towel storage. Basement drainage needs a properly designed pumped system.',['8¼′ × 12½′','Bath + shower','Pumped drainage'],{point:[2.5,4.3],look:[3,11.5]}),
    room('plant','Plant & sump closet','utility',-1.5,1.5,-15.25,-2.25,'A service closet reserved for ventilation equipment, drainage controls and pumping systems. Exact equipment and access must be engineered.',['Service access','Sump equipment'],{point:[0,-3],look:[0,-10]}),
    room('stairs','Central staircase','stairs',-9.5,-2,4.5,15.25,'The main internal stair returns to the ground floor. The former rear escape court is removed; an alternative compliant emergency escape needs architectural design.',['Internal stair','Escape design pending'],{point:[-6,3],look:[-6,9]})
  ],walls:[
    w([-20.875,-15.625],[20.875,-15.625],[],true),
    w([-20.875,-15.625],[-20.875,15.625],[win(-9,5)],true),w([20.875,-15.625],[20.875,15.625],[win(-9,5),win(8.5,6)],true),w([-20.875,15.625],[20.875,15.625],[win(-9,5),win(8.5,6)],true),
    w([-1.75,-15.25],[-1.75,-2]),w([1.75,-15.25],[1.75,-2]),
    w([-20.5,-2],[-2,-2],[d(-4.6,3.3)]),w([-1.5,-2],[1.5,-2],[d(0,2.7)]),w([2,-2],[20.5,-2],[d(5.5,3.3)]),
    w([-20.5,2.5],[-10,2.5],[d(-15,3.3)]),w([-1.5,2.5],[6.75,2.5],[d(2.4,3)]),w([7.5,2.5],[20.5,2.5],[d(12,3.3)]),
    w([-9.75,2.75],[-9.75,15.25]),w([-1.75,2.75],[-1.75,15.25]),w([7.125,2.75],[7.125,15.25])
  ]},
  ground:{name:'Ground floor',short:'00',level:0,title:'Everyday, beautifully lived.',subtitle:'Two ensuite bedrooms, a reoriented TV lounge & a front kitchen.',rooms:mainRooms(false),walls:groundWalls},
  first:{name:'First floor',short:'01',level:1,title:'Another level of belonging.',subtitle:'A fresh room arrangement, a front kitchen & your shaded balcony.',rooms:mainRooms(true),walls:upperWalls},
  roof:{name:'Roof terrace',short:'RF',level:2,title:'A slower kind of evening.',subtitle:'Open sky, a shaded lounge & room for the practical things.',rooms:[
    room('pergola','Pergola lounge','terrace',7.5,20.5,2.75,15.25,'A timber pergola shades outdoor sofas and a dining table. Planting softens the edge; pergola and planter loads need structural design.',['13′ × 12½′','Outdoor dining','Timber shade'],{point:[10,4.3],look:[15,11]}),
    room('deck','Open roof deck','terrace',-1.5,20.5,-4,2.25,'An open tiled terrace links the stair lobby, shaded lounge and rear service area. Suitable for flexible family use.',['Open to sky','Family space'],{point:[1,0],look:[12,0]}),
    room('solar','Solar & services','solar',-20.5,20.5,-15.25,-5,'A service zone with six solar modules, a screened water tank and an outdoor laundry counter. Final panel layout follows sun, wind and structural checks.',['6 solar modules','Tank on main slab','Laundry'],{point:[-8,-6],look:[0,-12]}),
    room('stairs','Stair lobby','stairs',-9.5,-2,4.5,15.25,'A small stair head protects the arrival from the first floor. The water tank is kept on the main roof rather than on this stair enclosure.',['Approx. 118 sq ft gross','Covered arrival'],{point:[-5,2.4],look:[-5,8]})
  ],walls:[]}
};
export const TOUR=[['ground','living'],['ground','bed-west'],['ground','bed-primary'],['ground','bath-primary'],['ground','kitchen'],['first','living'],['first','terrace'],['basement','drawing'],['basement','cinema'],['basement','study'],['basement','prayer'],['roof','pergola']];
export function feet(n){const whole=Math.floor(n);const inch=Math.round((n-whole)*12);return inch?`${whole}′ ${inch}″`:`${whole}′`;}


export const DESIGNS = [
 {id:1,name:'Rear bedroom plan',summary:'Two rear bedrooms · rear-centre baths · front kitchen',detail:'Bedrooms sit at the back left and back right. Their bathrooms occupy the rear centre; the kitchen is at the front right and the TV lounge at the front centre.'},
 {id:2,name:'Central bedroom plan',summary:'Centre + right bedrooms · left kitchen · front-right TV lounge',detail:'One bedroom moves to the rear centre. The kitchen moves to the rear left and the TV lounge to the front right. The second attached bathroom moves forward on the right, beside a separate dining area.'},
 {id:3,name:'Forward bedroom plan',summary:'Mid-side bedrooms · rear bathrooms · left galley kitchen',detail:'Both bedrooms move forward along the sides, with private bathrooms behind them. A long kitchen occupies the rear-left centre and a 6½-foot-wide gallery runs beside it. Lounge and dining face the front.'},
 {id:4,name:'Rear kitchen plan',summary:'Bedrooms farther forward · larger rear baths · rear kitchen',detail:'The kitchen spans the rear centre. Bedrooms sit farther forward along both sides and their bathrooms move behind them. A wide central gallery leads to a large front TV lounge; dining sits in the left centre.'}
];
DESIGNS.push({id:5,name:'Private kitchen · social centre',summary:'Side bedrooms · merged lounge + dining · screened kitchen',detail:'R1 and R2 sit on opposite sides, each with a private ensuite. The TV lounge and dining share one open front room. A separate rear kitchen is entered through a turning service lobby and a solid privacy door, keeping cooking out of the guest sightline. Bedroom doors open onto clear circulation, without passing through the kitchen.'});
const ORIGINAL_FLOORS=JSON.parse(JSON.stringify(FLOORS));
const resizeRoom=(r,rect)=>{r.rect=rect;r.width=rect[1]-rect[0];r.depth=rect[3]-rect[2];r.area=r.width*r.depth;};
function applyPreviousDesign(value){
 const number=Number(value);if(!DESIGNS.some(d=>d.id===number))throw Error('Unknown design');
 for(const key of Object.keys(FLOORS))FLOORS[key]=JSON.parse(JSON.stringify(ORIGINAL_FLOORS[key]));
 for(const key of ['ground','first']){
  const f=FLOORS[key],central=number===2||number===4,sideBeds=number===1||number===4;
  const find=id=>f.rooms.find(r=>r.id===id);
  // Same generous gallery in all four options: 6.5 ft clear between wall faces.
  f.rooms.push(room('gallery','Wide bedroom passage','hall',7.5,20.5,-2.25,4.25,'A clear 6½-foot-deep passage separates the bedroom wall from the kitchen or front living spaces. No furniture is placed in this gallery.',['6½′ clear depth','Uncluttered route'],{point:[15,1],look:[17,-3]}));
  f.walls[6].openings=f.walls[6].openings.filter(o=>o.center!==-4.8);
  f.walls=f.walls.filter(wall=>![8,9].includes(f.walls.indexOf(wall)));
  if(central){
   resizeRoom(find('kitchen'),[-1.5,7,-6.75,2.25]);
   find('kitchen').view={point:[1.7,.9],look:[4,-4.2]};
   find('kitchen').description='A separate central kitchen with fitted cabinetry, stone worktops and appliances. Its broad entrance opens toward the front lounge; a clear gallery leads to both bedrooms.';
   find('kitchen').badges=['8½′ × 9′','Central kitchen','Separate cooking'];
   f.walls.push(w([-1.75,-6.75],[-1.75,2.5]),w([-1.5,2.5],[7,2.5],[d(2.3,3.5)]));
   resizeRoom(find('living'),[-1.5,10.75,4.75,15.25]);
   resizeRoom(find('family-dining'),[11.25,20.5,4.75,15.25]);
   find('family-dining').view={point:[12,5.9],look:[16,10]};
   find('family-dining').description='A four-seat dining setting at the front-right window, connected to the lounge and the wide bedroom gallery.';
  }else{
   resizeRoom(find('kitchen'),[11,20.5,4.75,15.25]);
   find('kitchen').view={point:[12,9.3],look:[17,11]};
   find('kitchen').badges=['9½′ × 10½′','Front kitchen','Wide passage outside'];
   f.walls.push(w([10.75,4.5],[10.75,15.25],[d(9.3,3.5)]),w([10.75,4.5],[20.5,4.5]));
   resizeRoom(find('living'),[-1.5,10.5,4.75,15.25]);
  }
  find('living').view={point:[4.6,5.4],look:[6,10.5]};
  find('living').badges=[feet(find('living').width)+' × '+feet(find('living').depth),'Design '+number,'TV + family seating'];
  find('family-dining').badges=[feet(find('family-dining').width)+' × '+feet(find('family-dining').depth),'4 seats','Open dining'];
  find('family-dining').description=central?find('family-dining').description:'A four-seat dining nook in the centre of the house, kept away from the broad bedroom-to-kitchen gallery.';
  find('dining').view={point:[-4,.8],look:[-6,3]};
  f.subtitle=DESIGNS[number-1].name+' · two ensuite bedrooms · 6½′ clear passage';
  f.furniture={sideBeds,central,style:number,
   beds:sideBeds?[{x:-16,z:-10,king:false,angle:Math.PI/2},{x:16,z:-10,king:true,angle:-Math.PI/2}]:[{x:-13.75,z:-11.2,king:false,angle:0},{x:14,z:-11.2,king:true,angle:0}],
   dining:central?[15.8,10]:[3.5,-2.4]
  };
  if(sideBeds){find('bed-west').view={point:[-10,-5.7],look:[-16,-10]};find('bed-primary').view={point:[16,-4],look:[16,-10]};}
  else{find('bed-west').view={point:[-10,-4.6],look:[-14,-11]};find('bed-primary').view={point:[17,-4.5],look:[14,-11]};}
  for(const id of ['bed-west','bed-primary'])find(id).description=(sideBeds?'Side-wall headboards, fitted storage and simple bedside lighting.':'Rear-wall upholstered headboards, fitted wardrobes and a clean approach from the bedroom door.')+' Both bedrooms retain a private attached bathroom.';
 }
 const b=FLOORS.basement;b.furniture={style:number,swapBack:number>=3,swapFront:number===4};
 if(number>=3){for(const id of ['drawing','cinema']){const r=b.rooms.find(r=>r.id===id),dx=id==='drawing'?22.5:-22.5;resizeRoom(r,[r.rect[0]+dx,r.rect[1]+dx,r.rect[2],r.rect[3]]);r.view.point[0]+=dx;r.view.look[0]+=dx;}}
 if(number===4){const study=b.rooms.find(r=>r.id==='study'),prayer=b.rooms.find(r=>r.id==='prayer');resizeRoom(study,[7.5,20.5,2.75,15.25]);study.view={point:[13,4.3],look:[12,12]};resizeRoom(prayer,[-20.5,-10,2.75,15.25]);prayer.view={point:[-18.5,4.5],look:[-15,11]};}
 for(const r of b.rooms)if(r.badges.length&&r.badges[0].includes('×'))r.badges[0]=feet(r.width)+' × '+feet(r.depth);
 b.subtitle=DESIGNS[number-1].name+' · cinema, social lounge, study & prayer';
 b.rooms.find(r=>r.id==='cinema').badges=['18½′ × 13′',number%2===0?'4 lounge seats':'6 lounge seats','Acoustic treatment'];
 b.rooms.find(r=>r.id==='cinema').description=(number%2===0?'Four larger lounge seats in two rows':'Six lounge seats in two rows')+' face the cinema screen. The room changes sides in Designs 3 and 4.';
 return DESIGNS[number-1];
}


export function applyDesign(value){
 const n=Number(value);if(n===5)return applyDesignFive();applyPreviousDesign(n);
 if(n===1){for(const key of ['ground','first']){FLOORS[key].furniture.custom=false;FLOORS[key].bedPairs=[['bed-west','bath-shared'],['bed-primary','bath-primary']];}return DESIGNS[0];}
 const layouts={
  2:{bed1:[-6.5,7,-15.25,-2.75],bed2:[7.5,20.5,-15.25,-2.75],bath1:[-13.5,-7,-15.25,-7.25],bath2:[13.5,20.5,-2.25,5.75],kitchen:[-20.5,-14,-15.25,-2.75],living:[7.5,20.5,6.25,15.25],dining:[-1.5,7,4.75,15.25],gallery:[-9.5,13,-2.25,4.25],entry:[-13.5,-7,-6.75,-2.75],parking:-2.25,
   walls:[w([-20.5,-2.5],[-14,-2.5]),w([-13.75,-15.25],[-13.75,-2.5],[d(-4.8,3)]),w([-6.75,-15.25],[-6.75,-2.5],[d(-11,2.75)]),w([-13.5,-7],[-7,-7]),w([7.25,-15.25],[7.25,-2.5]),w([-13.5,-2.5],[-7,-2.5],[d(-8.25,2.5)]),w([-6.5,-2.5],[7,-2.5],[d(2,3.5)]),w([7.5,-2.5],[20.5,-2.5],[d(10,3.5),d(17,3)]),w([13.25,-2.25],[13.25,6]),w([13.5,6],[20.5,6])]},
  3:{bed1:[-20.5,-7,-10,2.5],bed2:[7.5,20.5,-10,2.5],bath1:[-20.5,-7,-15.25,-10.5],bath2:[7.5,20.5,-15.25,-10.5],kitchen:[-6.5,0,-15.25,-2.75],living:[8.5,20.5,3,15.25],dining:[-1.5,8,3,15.25],gallery:[.5,7,-15.25,2.5],entry:[-6.5,-2,-2.25,4],parking:3,
   walls:[w([-6.75,-15.25],[-6.75,2.75],[d(.5,3)]),w([7.25,-15.25],[7.25,2.75],[d(.5,3.5)]),w([-20.5,-10.25],[-7,-10.25],[d(-13.75,3)]),w([7.5,-10.25],[20.5,-10.25],[d(14,3)]),w([.25,-15.25],[.25,-2.5],[d(-4.8,3.25)]),w([-6.5,-2.5],[0,-2.5]),w([-20.5,2.75],[-7,2.75]),w([7.5,2.75],[20.5,2.75])]},
  4:{bed1:[-20.5,-7,-9,3.5],bed2:[7.5,20.5,-9,3.5],bath1:[-20.5,-7,-15.25,-9.5],bath2:[7.5,20.5,-15.25,-9.5],kitchen:[-6.5,7,-15.25,-10],living:[-1.5,20.5,4,15.25],dining:[-6.5,0,-9.5,-.5],gallery:[.5,7,-9.5,3.5],entry:[-6.5,-2,0,4],parking:4,
   walls:[w([-6.75,-15.25],[-6.75,3.75],[d(2.2,3)]),w([7.25,-15.25],[7.25,3.75],[d(1.5,3.5)]),w([-20.5,-9.25],[-7,-9.25],[d(-13.75,3)]),w([7.5,-9.25],[20.5,-9.25],[d(14,3)]),w([-6.5,-9.75],[7,-9.75],[d(2.5,3.5)]),w([.25,-9.5],[.25,-.5],[d(-2.3,3.5)]),w([-20.5,3.75],[-7,3.75]),w([7.5,3.75],[20.5,3.75])]}
 };
 const L=layouts[n];
 for(const key of ['ground','first']){
  const f=FLOORS[key],upper=key==='first';
  const make=(id,name,type,rect,point,look,desc)=>room(id,name,type,...rect,desc,[feet(rect[1]-rect[0])+' × '+feet(rect[3]-rect[2])],{point,look});
  const mid=(a,b)=>(a+b)/2;
  const bedPoint=(rect)=>[mid(rect[0],rect[1]),rect[3]-1.6];
  const bedLook=rect=>[mid(rect[0],rect[1]),rect[2]+4.5];
  const bp1=bedPoint(L.bed1),bp2=n===2?[10,-4.3]:bedPoint(L.bed2);
  const bathPoint=rect=>rect[3]-rect[2]<7?[mid(rect[0],rect[1]),rect[3]-.8]:[rect[0]+1.8,rect[3]-1.2];
  const kp=n===4?[3.5,-10.9]:[L.kitchen[1]-1.1,L.kitchen[3]-1.5];
  const lp=n===2?[9,7.5]:n===3?[10,4.1]:[2.3,5.1];
  const dp=n===4?[-1.1,-1.4]:[L.dining[0]+1.1,L.dining[2]+1.4];
  f.rooms=[
   make('bed-west',upper?'Bedroom 3':'Bedroom 1','bedroom',L.bed1,bp1,bedLook(L.bed1),'A queen bedroom in a new position, with fitted storage, bedside lighting and direct access to its private bathroom.'),
   make('bed-primary',upper?'Bedroom 4 — primary':'Bedroom 2 — primary','bedroom',L.bed2,bp2,bedLook(L.bed2),'A king bedroom in a new position, with a fitted wardrobe, clear circulation and a private attached bathroom.'),
   make('bath-shared',upper?'Bedroom 3 ensuite':'Bedroom 1 ensuite','bathroom',L.bath1,bathPoint(L.bath1),[L.bath1[0]+2,L.bath1[2]+1.7],'A relocated private ensuite, entered directly from the queen bedroom. Shower, vanity and WC are arranged for this floor plan.'),
   make('bath-primary','Primary ensuite','bathroom',L.bath2,bathPoint(L.bath2),[L.bath2[0]+2,L.bath2[2]+1.7],'A relocated private ensuite, entered directly from the king bedroom. Wet areas stay stacked between the ground and first floors in this option.'),
   make('kitchen',upper?'First-floor kitchen':'Ground-floor kitchen','kitchen',L.kitchen,kp,[L.kitchen[1]-2,L.kitchen[2]+2],'An enclosed kitchen relocated for this option, with counters, sink, cooking appliances and tall storage. Final daylight, extract and service routes require architectural design.'),
   make('living','TV lounge','living',L.living,lp,[mid(L.living[0],L.living[1]),L.living[3]-3],'The TV lounge moves to a different part of the house in this floor plan. Scaled seating and a media wall show how the room can be furnished.'),
   make('family-dining','Family dining','hall',L.dining,dp,[mid(L.dining[0],L.dining[1]),mid(L.dining[2],L.dining[3])],'A dedicated four-seat dining setting serving the relocated kitchen and lounge.'),
   make('dining',n===2?'Kitchen link':'Entrance & landing','hall',L.entry,n===2?[-9,-4.2]:[-4,2.4],[-5,3],'A clear connection between the stair, rooms and main circulation.'),
   make('gallery','Wide passage','hall',L.gallery,n===2?[10,1]:[3,1],n===2?[10,-4]:[3,-5],'This option changes the route of the passage. Its short dimension is 6½ ft clear, with furniture kept out of the route.'),
   make(upper?'terrace':'parking',upper?'Covered balcony':'Car porch',upper?'balcony':'parking',[-20.5,-10,L.parking,upper?15.25:L.parking+17.5],[-11.1,13],[-15,8],upper?'The balcony adjusts to this floor plan, while retaining outdoor seating and protective rails.':'The same car entrance serves a parking bay shifted forward within the boundary for this option.'),
   JSON.parse(JSON.stringify(ORIGINAL_FLOORS[key].rooms.find(r=>r.id==='stairs')))
  ];
  const bedBottom=n===3?2.75:n===4?3.75:-2.5;
  const sideWins=n>=3?[win(n===3?-3.75:-2.75,5),win(-12.4,2.5,5.3,2.5)]:[win(-9,5)];
  const ext=[w([-20.875,-15.625],[20.875,-15.625],[],true),w([-20.875,-15.625],[-20.875,upper?bedBottom:15.625],sideWins,true),w([20.875,-15.625],[20.875,15.625],n>=3?[...sideWins,win(10,5)]:[win(-9,5),win(10,5)],true),
   w([upper?-9.75:-20.875,15.625],[20.875,15.625],[...(!upper?[{...d(-15.25,10.5),height:9.7}]:[]),win(-5.7,3.5,5.5,2.8),upper?win(2.2,3.5,3.2,4.5):d(2.2,4.5),win(7,4.5,2.4,5.8),win(15.75,8.5,2.4,5.8)],true)];
  f.walls=[...ext,...JSON.parse(JSON.stringify(L.walls))];
  if(n===2)f.walls.push(w([-9.75,-2.25],[-9.75,15.25],[d(1.3,3)]));
  f.bedPairs=[['bed-west','bath-shared'],['bed-primary','bath-primary']];
  f.furniture={custom:true,style:n,parkingStart:L.parking,beds:[
   {x:mid(L.bed1[0],L.bed1[1]),z:L.bed1[2]+4.6,king:false,angle:0},
   {x:mid(L.bed2[0],L.bed2[1]),z:L.bed2[2]+4.6,king:true,angle:0}],dining:[mid(L.dining[0],L.dining[1]),mid(L.dining[2],L.dining[3])]};
  f.subtitle=DESIGNS[n-1].name+' · relocated rooms, bathrooms, kitchen & lounge';
 }
 // The basement bathroom also changes location in the alternatives.
 const b=FLOORS.basement;
 if(n===2||n===4){const bath=b.rooms.find(r=>r.id==='bath-spa'),other=b.rooms.find(r=>r.id===(n===2?'prayer':'study')),old=bath.rect.slice();resizeRoom(bath,other.rect.slice());resizeRoom(other,old);bath.view={point:[bath.rect[0]+2,bath.rect[2]+1.5],look:[bath.rect[0]+3,bath.rect[3]-2]};other.view={point:[other.rect[0]+2,other.rect[2]+1.5],look:[other.rect[0]+3,other.rect[3]-2]};b.furniture.fitRooms=true;}
 for(const rr of b.rooms)if(rr.badges[0]?.includes('×'))rr.badges[0]=feet(rr.width)+' × '+feet(rr.depth);
 return DESIGNS[n-1];
}


function applyDesignFive(){
 applyDesign(4);
 for(const key of ['ground','first']){
  const f=FLOORS[key],find=id=>f.rooms.find(r=>r.id===id);
  resizeRoom(find('kitchen'),[-6.5,7,-15.25,-6.25]);
  find('kitchen').view={point:[-3.5,-7.6],look:[1,-12]};
  find('kitchen').description='A separate 13½ × 9 ft kitchen behind an opaque door and a turning service lobby. Guests in the shared lounge cannot look through the closed kitchen door. The lobby provides easy family access without entering either bedroom.';
  find('kitchen').badges=['13½′ × 9′','Enclosed kitchen','Solid privacy door'];
  resizeRoom(find('gallery'),[.5,7,-5.75,3.5]);
  find('gallery').view={point:[3,1],look:[3,-3]};
  find('gallery').description='A 6½-foot-wide route connects the shared room to R2 and the private kitchen lobby. R1 opens off the short stair landing to the left. Neither bedroom requires walking through the kitchen.';
  find('gallery').badges=['6½′ wide','Easy access to R1 / R2'];
  find('living').name='TV lounge + dining';
  find('living').description='One open 22 × 11¼ ft social room: family TV seating on the right and dining on the left, with no dividing wall. Guests enter this shared room directly. A clear central route leads to both side bedrooms and the screened kitchen lobby.';
  find('living').badges=['22′ × 11¼′','Merged TV + dining','Guest-friendly layout'];
  find('living').view={point:[7.7,6],look:[13,10]};
  find('bed-west').name=key==='first'?'R1 — upstairs bedroom':'R1 — bedroom';
  find('bed-primary').name=key==='first'?'R2 — upstairs bedroom':'R2 — primary bedroom';
  find('bed-west').description='The left-side queen bedroom, reached from the clear landing beside the shared lounge. Its bathroom is private and behind the bedroom. No route through the kitchen is needed.';
  find('bed-primary').description='The right-side king bedroom, reached directly from the wide central passage. Its bathroom is private and behind the bedroom. No route through the kitchen is needed.';
  find('bath-shared').name='R1 attached bathroom';find('bath-primary').name='R2 attached bathroom';
  f.rooms=f.rooms.filter(r=>r.id!=='family-dining');
  f.rooms.push(room('service-lobby','Screened kitchen lobby','hall',-6.5,0,-5.75,-.5,'A private turning lobby separates the kitchen from guest seating. Enter from the side of the wide passage, turn left, then go through the solid kitchen door.',['6½′ × 5¼′','Turning approach','Kitchen privacy'],{point:[-2.0,-2.1],look:[-3.5,-6]}));
  f.walls=f.walls.filter(wall=>!(wall.a[1]===-9.75&&wall.b[1]===-9.75)&&!(wall.a[0]===.25&&wall.b[0]===.25));
  f.walls.push({...w([-6.5,-6],[7,-6],[d(-3.5,3.5)]),privacy:true},w([.25,-5.75],[.25,-.25],[d(-2.6,3.5)]),w([-6.5,-.25],[0,-.25]));
  f.furniture.merged=true;f.furniture.style=5;f.furniture.dining=[3.6,9.6];
  f.subtitle='Design 5 · side bedrooms · merged lounge + dining · private kitchen';
 }
 FLOORS.basement.subtitle='Design 5 · retains the complete Design 4 basement arrangement';
 return DESIGNS[4];
}
