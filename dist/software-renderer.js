import * as THREE from 'three';

// A small, genuine 3D triangle rasterizer for browsers where WebGL is disabled.
// It renders the same geometry, camera, depth and materials as the GPU path.
export class SoftwareRenderer {
  constructor(){
    this.domElement=document.createElement('canvas');
    this.domElement.setAttribute('aria-label','Software-rendered interactive 3D home');
    this.ctx=this.domElement.getContext('2d',{alpha:false});
    this.shadowMap={enabled:false,type:null};this.toneMappingExposure=1;this.outputColorSpace=null;
    this.geometryCache=new WeakMap();this.textureCache=new WeakMap();this.colorCache=new WeakMap();
    this.mvp=new THREE.Matrix4();this.normal=new THREE.Matrix3();this.light=new THREE.Vector3(-.55,.8,.4).normalize();
    this.needsRender=true;this.lastKey='';this.width=1;this.height=1;this.lastRender=0;this.info={render:{calls:0,triangles:0},software:true};
    this.ctx.imageSmoothingEnabled=true;
  }
  setPixelRatio(){}
  setSize(w,h){const ratio=Math.min(1,Math.sqrt(480000/(w*h)));this.needsRender=true;this.width=Math.max(1,Math.round(w*ratio));this.height=Math.max(1,Math.round(h*ratio));this.domElement.width=this.width;this.domElement.height=this.height;this.domElement.style.width=w+'px';this.domElement.style.height=h+'px';this.image=this.ctx.createImageData(this.width,this.height);this.pixels=this.image.data;this.zbuffer=new Float32Array(this.width*this.height);}
  setAnimationLoop(callback){let last=0;const loop=now=>{requestAnimationFrame(loop);if(now-last<70)return;last=now;callback(now);};requestAnimationFrame(loop);}
  texture(map){if(!map?.image)return null;if(this.textureCache.has(map))return this.textureCache.get(map);try{const c=document.createElement('canvas');c.width=c.height=64;const context=c.getContext('2d',{willReadFrequently:true});context.drawImage(map.image,0,0,64,64);const t={data:context.getImageData(0,0,64,64).data,width:64,height:64,rx:map.repeat?.x||1,ry:map.repeat?.y||1};this.textureCache.set(map,t);return t;}catch{return null;}}
  color(material){if(this.colorCache.has(material))return this.colorCache.get(material);const color=material.color?.clone().convertLinearToSRGB()||new THREE.Color(1,1,1);const c=[color.r*255,color.g*255,color.b*255];this.colorCache.set(material,c);return c;}
  geometry(geo){if(this.geometryCache.has(geo))return this.geometryCache.get(geo);const data={pos:geo.attributes.position.array,norm:geo.attributes.normal?.array,uv:geo.attributes.uv?.array,indices:geo.index?.array,groups:geo.groups};this.geometryCache.set(geo,data);return data;}
  render(scene,camera){
    if(!this.image)return;const key=[camera.position.x,camera.position.y,camera.position.z,camera.rotation.x,camera.rotation.y,camera.rotation.z,camera.fov].map(v=>v.toFixed(5)).join('|');if(!this.needsRender&&this.lastKey===key)return;this.lastKey=key;this.needsRender=false;
    this.evening=scene.children.some(o=>o.isDirectionalLight&&o.intensity<2);scene.updateMatrixWorld();camera.updateMatrixWorld();camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const bg=scene.background?.clone().convertLinearToSRGB()||new THREE.Color('#e9e7df');const pixels=this.pixels;const r=bg.r*255,g=bg.g*255,b=bg.b*255;
    for(let i=0;i<pixels.length;i+=4){pixels[i]=r;pixels[i+1]=g;pixels[i+2]=b;pixels[i+3]=255;}
    this.zbuffer.fill(Infinity);this.info.render.calls=0;this.info.render.triangles=0;
    const meshes=[];scene.traverseVisible(o=>{if(o.isMesh&&o.geometry?.attributes?.position)meshes.push(o);});
    const opaque=meshes.filter(o=>!o.material?.transparent),trans=meshes.filter(o=>o.material?.transparent);
    trans.sort((a,b)=>b.getWorldPosition(new THREE.Vector3()).distanceToSquared(camera.position)-a.getWorldPosition(new THREE.Vector3()).distanceToSquared(camera.position));
    for(const mesh of [...opaque,...trans])this.drawMesh(mesh,camera);
    this.ctx.putImageData(this.image,0,0);
  }
  drawMesh(mesh,camera){
    const geo=this.geometry(mesh.geometry),{pos,norm,uv,indices}=geo;let material=Array.isArray(mesh.material)?mesh.material[0]:mesh.material;if(!material||material.visible===false||material.opacity<=0)return;
    this.mvp.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).multiply(mesh.matrixWorld);this.normal.getNormalMatrix(mesh.matrixWorld);
    const m=this.mvp.elements,n=this.normal.elements,count=pos.length/3,v=new Float32Array(count*7),col=this.color(material),tex=this.texture(material.map),double=material.side===THREE.DoubleSide,alpha=material.transparent?material.opacity:1;
    for(let i=0;i<count;i++){const j=i*3,k=i*7,x=pos[j],y=pos[j+1],z=pos[j+2];v[k]=m[0]*x+m[4]*y+m[8]*z+m[12];v[k+1]=m[1]*x+m[5]*y+m[9]*z+m[13];v[k+2]=m[2]*x+m[6]*y+m[10]*z+m[14];v[k+3]=m[3]*x+m[7]*y+m[11]*z+m[15];v[k+4]=uv?uv[i*2]:0;v[k+5]=uv?uv[i*2+1]:0;v[k+6]=v[k+2]+v[k+3];}
    const total=indices?indices.length:count;
    for(let i=0;i<total;i+=3){const ia=indices?indices[i]:i,ib=indices?indices[i+1]:i+1,ic=indices?indices[i+2]:i+2;const a=ia*7,b=ib*7,c=ic*7;
      if(v[a+6]<0&&v[b+6]<0&&v[c+6]<0)continue;
      if((v[a]>v[a+3]&&v[b]>v[b+3]&&v[c]>v[c+3])||(v[a]<-v[a+3]&&v[b]<-v[b+3]&&v[c]<-v[c+3])||(v[a+1]>v[a+3]&&v[b+1]>v[b+3]&&v[c+1]>v[c+3])||(v[a+1]<-v[a+3]&&v[b+1]<-v[b+3]&&v[c+1]<-v[c+3]))continue;
      let nx,ny,nz;
      if(norm){nx=(norm[ia*3]+norm[ib*3]+norm[ic*3])/3;ny=(norm[ia*3+1]+norm[ib*3+1]+norm[ic*3+1])/3;nz=(norm[ia*3+2]+norm[ib*3+2]+norm[ic*3+2])/3;}else{const e1x=pos[ib*3]-pos[ia*3],e1y=pos[ib*3+1]-pos[ia*3+1],e1z=pos[ib*3+2]-pos[ia*3+2],e2x=pos[ic*3]-pos[ia*3],e2y=pos[ic*3+1]-pos[ia*3+1],e2z=pos[ic*3+2]-pos[ia*3+2];nx=e1y*e2z-e1z*e2y;ny=e1z*e2x-e1x*e2z;nz=e1x*e2y-e1y*e2x;}
      const wx=n[0]*nx+n[3]*ny+n[6]*nz,wy=n[1]*nx+n[4]*ny+n[7]*nz,wz=n[2]*nx+n[5]*ny+n[8]*nz,len=Math.hypot(wx,wy,wz)||1;
      let shade=.64+.35*Math.max(0,(wx*this.light.x+wy*this.light.y+wz*this.light.z)/len);if(material.isMeshBasicMaterial)shade=1;if(material.emissiveIntensity>0&&material.emissive?.getHex()>0)shade=Math.min(1.1,shade+material.emissiveIntensity*.25);
      const night=this.evening&&!(material.emissiveIntensity>0&&material.emissive?.getHex()>0);const color=[col[0]*shade*(night?.88:1),col[1]*shade*(night?.83:1),col[2]*shade*(night?.73:1)];
      let triangle=[Array.from(v.subarray(a,a+7)),Array.from(v.subarray(b,b+7)),Array.from(v.subarray(c,c+7))];
      if(v[a+6]<0||v[b+6]<0||v[c+6]<0){const clipped=[];for(let q=0;q<3;q++){const p=triangle[q],qv=triangle[(q+1)%3],inside=p[6]>=0,nextIn=qv[6]>=0;if(inside)clipped.push(p);if(inside!==nextIn){const t=p[6]/(p[6]-qv[6]);clipped.push(p.map((value,k)=>value+(qv[k]-value)*t));}}triangle=clipped;}
      for(let q=1;q<triangle.length-1;q++){this.triangle(triangle[0],triangle[q],triangle[q+1],color,tex,alpha,double);this.info.render.triangles++;}
    }
    this.info.render.calls++;
  }
  triangle(a,b,c,color,tex,alpha,double){
    const W=this.width,H=this.height,ai=1/a[3],bi=1/b[3],ci=1/c[3];
    const ax=(a[0]*ai*.5+.5)*W,ay=(-a[1]*ai*.5+.5)*H,az=a[2]*ai,bx=(b[0]*bi*.5+.5)*W,by=(-b[1]*bi*.5+.5)*H,bz=b[2]*bi,cx=(c[0]*ci*.5+.5)*W,cy=(-c[1]*ci*.5+.5)*H,cz=c[2]*ci;
    const area=(bx-ax)*(cy-ay)-(by-ay)*(cx-ax);if(Math.abs(area)<.008||(!double&&area>=0))return;
    const xmin=Math.max(0,Math.floor(Math.min(ax,bx,cx))),xmax=Math.min(W-1,Math.ceil(Math.max(ax,bx,cx))),ymin=Math.max(0,Math.floor(Math.min(ay,by,cy))),ymax=Math.min(H-1,Math.ceil(Math.max(ay,by,cy)));if(xmin>xmax||ymin>ymax)return;
    const inv=1/area,d0x=(by-cy)*inv,d0y=(cx-bx)*inv,d1x=(cy-ay)*inv,d1y=(ax-cx)*inv;
    let row0=((bx-xmin-.5)*(cy-ymin-.5)-(by-ymin-.5)*(cx-xmin-.5))*inv,row1=((cx-xmin-.5)*(ay-ymin-.5)-(cy-ymin-.5)*(ax-xmin-.5))*inv;
    const zbuf=this.zbuffer,pixels=this.pixels,au=a[4]*ai,av=a[5]*ai,bu=b[4]*bi,bv=b[5]*bi,cu=c[4]*ci,cv=c[5]*ci;
    for(let y=ymin;y<=ymax;y++){let w0=row0,w1=row1;let ind=y*W+xmin;for(let x=xmin;x<=xmax;x++,ind++){const w2=1-w0-w1;if(w0>=-.00001&&w1>=-.00001&&w2>=-.00001){const depth=w0*az+w1*bz+w2*cz;if(depth<zbuf[ind]&&depth>=-1){let r=color[0],g=color[1],b=color[2];if(tex){const den=w0*ai+w1*bi+w2*ci;let u=(w0*au+w1*bu+w2*cu)/den*tex.rx,v=(w0*av+w1*bv+w2*cv)/den*tex.ry;u-=Math.floor(u);v-=Math.floor(v);const ti=((Math.min(63,(1-v)*64|0))*64+(u*64|0))*4;r*=tex.data[ti]/255;g*=tex.data[ti+1]/255;b*=tex.data[ti+2]/255;}const pi=ind*4;if(alpha<1){pixels[pi]=pixels[pi]*(1-alpha)+r*alpha;pixels[pi+1]=pixels[pi+1]*(1-alpha)+g*alpha;pixels[pi+2]=pixels[pi+2]*(1-alpha)+b*alpha;}else{pixels[pi]=r;pixels[pi+1]=g;pixels[pi+2]=b;zbuf[ind]=depth;}}}w0+=d0x;w1+=d1x;}row0+=d0y;row1+=d1y;}
  }
}
