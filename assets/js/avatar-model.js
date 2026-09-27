import * as THREE from "./vendor/three.module.min.js";

// A code-built stylized 3D interpretation of the supplied photos.
// This is real geometry, distinct from the higher-detail AI illustration.
export function createAvatar(stage, status) {
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:"low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  const canvas = renderer.domElement;
  canvas.className = "avatar-canvas";
  canvas.tabIndex = 0;
  canvas.setAttribute("role","img");
  canvas.setAttribute("aria-label","Avatar 3D de Nizar. Glisser ou utiliser les flèches gauche et droite pour tourner. Les liens sous le personnage donnent accès aux sections.");
  stage.append(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32,1,.1,40);
  camera.position.set(0,1.55,5.3);
  camera.lookAt(0,1.22,0);
  scene.add(new THREE.HemisphereLight(0xfff7e6,0x66677b,2.5));
  const key = new THREE.DirectionalLight(0xffecd6,3.1);
  key.position.set(-3,5,4);scene.add(key);
  const rim = new THREE.DirectionalLight(0xa0bbff,2.2);
  rim.position.set(3,3,-2);scene.add(rim);
  const front = new THREE.DirectionalLight(0xffffff,.6);
  front.position.set(0,1,4);scene.add(front);

  function material(color,roughness=.8,metalness=0) {
    return new THREE.MeshStandardMaterial({color,roughness,metalness});
  }
  const cream=material(0xe8d9bb),rib=material(0xcbbb9a),black=material(0x191b20),trousers=material(0x202126);
  const white=material(0xf3f0e6),skin=material(0xb67c5b,.62),skinLight=material(0xc0876a,.68);
  const hair=material(0x151112,.85),shoe=material(0x17191c,.24),sole=material(0x0e1114);
  const metal=material(0xb8ad8b,.25,.7),eyeWhite=material(0xe8dccb,.45),iris=material(0x3a2418,.3);
  const pupil=material(0x0c0908,.3),lash=material(0x120d0c,.9),lip=material(0x9b5d4a,.55);
  const mouthShade=material(0x3a1715,.8),teeth=material(0xeee6d8,.4),nostril=material(0x5a3124,.8),browColor=material(0x221b19,.9);
  // A small procedural relief map, drawn once on a canvas instead of shipping an image.
  function reliefTexture(size,count,radius,repeatX,repeatY) {
    const canvas=document.createElement("canvas");canvas.width=canvas.height=size;
    const g=canvas.getContext("2d");g.fillStyle="#808080";g.fillRect(0,0,size,size);
    let seed=11;const random=()=>(seed=seed*16807%2147483647)/2147483647;
    for(let i=0;i<count;i++){
      const x=random()*size,y=random()*size,r=radius*(.6+random()*.8),tone=random()>.3?"255,255,255":"0,0,0";
      const gradient=g.createRadialGradient(x,y,0,x,y,r);
      gradient.addColorStop(0,`rgba(${tone},.5)`);gradient.addColorStop(1,`rgba(${tone},0)`);
      // Drawn on every side of the tile so the repeat has no visible seam.
      for(const ox of [-size,0,size])for(const oy of [-size,0,size]){
        if(x+ox+r<0||x+ox-r>size||y+oy+r<0||y+oy-r>size)continue;
        g.save();g.translate(ox,oy);g.fillStyle=gradient;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();g.restore();
      }
    }
    const texture=new THREE.CanvasTexture(canvas);
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(repeatX,repeatY);
    return texture;
  }
  // Sherpa relief on the whole jacket, replacing loose clumps that sank into it.
  cream.bumpMap=reliefTexture(128,300,7,7,4);cream.bumpScale=2.2;
  const avatar=new THREE.Group();scene.add(avatar);avatar.rotation.y=-.28;
  const targets={accueil:"Tête → Accueil",propos:"Veste et buste → À propos",skills:"Manches → Compétences",realisations:"Poche → Projets",experience:"Pantalon → Parcours",contact:"Chaussures → Contact"};
  const IDLE="Faites glisser pour tourner. Sélectionnez un vêtement pour explorer.";
  // Every surface of a garment is registered under the same destination, so
  // pointing at one trouser leg lights the whole pair rather than that piece.
  const groups={};
  function register(object,destination) {
    object.userData.destination=destination;
    (groups[destination]=groups[destination]||[]).push(object);
    return object;
  }
  function mesh(geometry,mat,position,scale,parent=avatar,destination) {
    const object=new THREE.Mesh(geometry,mat.clone());
    object.position.set(...position);
    if(scale)object.scale.set(...scale);
    parent.add(object);
    if(destination)register(object,destination);
    return object;
  }
  const sphere=new THREE.SphereGeometry(1,28,20);
  function oval(mat,position,scale,parent=avatar,dest){return mesh(sphere,mat,position,scale,parent,dest);}
  function tubeBetween(a,b,r1,r2,mat,dest) {
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),direction=end.clone().sub(start);
    const object=mesh(new THREE.CylinderGeometry(r2,r1,direction.length(),20),mat,start.clone().add(end).multiplyScalar(.5).toArray(),null,avatar,dest);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());return object;
  }
  function panel(points,depth,mat,z,dest) {
    const shape=new THREE.Shape();
    points.forEach((p,i)=>i?shape.lineTo(...p):shape.moveTo(...p));shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:3,steps:1,curveSegments:12});
    return mesh(geo,mat,[0,0,z],null,avatar,dest);
  }
  // A single muted blue plinth gives the character a stable ground reference.
  mesh(new THREE.CylinderGeometry(.61,.64,.035,64),material(0x566bcc),[0,.025,0],null,avatar);
  const circle=new THREE.Mesh(new THREE.TorusGeometry(.7,.005,6,100),material(0x7182c4));
  circle.rotation.x=Math.PI/2;circle.position.y=.014;avatar.add(circle);
  // Wide trousers whose legs meet on the centre line, and loafers built from a
  // single dark family, so each of the two zones highlights as one surface.
  [-1,1].forEach(sign=>{
    const x=sign*.148;
    tubeBetween([x,.2,0],[sign*.16,1.13,0],.142,.153,trousers,"experience");
    oval(trousers,[x,.25,0],[.152,.16,.134],avatar,"experience");
    oval(sole,[x,.09,.055],[.176,.062,.281],avatar,"contact");
    oval(shoe,[x,.15,.062],[.163,.104,.258],avatar,"contact");
    const strap=oval(shoe,[x,.199,.152],[.152,.027,.05],avatar,"contact");
    strap.rotation.x=-.12;
  });
  oval(trousers,[0,1.105,0],[.312,.212,.182],avatar,"experience");
  oval(trousers,[0,1.0,0],[.292,.205,.172],avatar,"experience");
  // Jacket body, cardigan and shirt, with a true open-front silhouette.
  const jacketProfile=[new THREE.Vector2(.28,0),new THREE.Vector2(.30,.07),new THREE.Vector2(.295,.30),new THREE.Vector2(.33,.55),new THREE.Vector2(.31,.65),new THREE.Vector2(.20,.70)];
  mesh(new THREE.LatheGeometry(jacketProfile,40),cream,[0,1.15,0],[1,1,.68],avatar,"propos");
  panel([[-.135,1.17],[.135,1.17],[.19,1.75],[.128,1.846],[.06,1.799],[0,1.786],[-.06,1.799],[-.128,1.846],[-.19,1.75]],.012,black,.205,"propos");
  // A simple knit collar closes the neckline; no shirt, no tie.
  const collarRing=new THREE.Mesh(new THREE.TorusGeometry(.118,.022,10,40),black.clone());
  collarRing.position.set(0,1.822,.068);collarRing.rotation.x=Math.PI/2;
  collarRing.scale.set(1,1,.86);avatar.add(collarRing);register(collarRing,"propos");
  // Standing fleece collar, open at the front like the zipped jacket.
  const collarShape=new THREE.Shape(),gap=.55;
  collarShape.absarc(0,0,.168,-Math.PI/2+gap,Math.PI*1.5-gap,false);
  collarShape.absarc(0,0,.14,Math.PI*1.5-gap,-Math.PI/2+gap,true);
  const standCollar=mesh(new THREE.ExtrudeGeometry(collarShape,{depth:.085,bevelEnabled:true,bevelThickness:.012,bevelSize:.01,bevelSegments:3,curveSegments:32}),cream,[0,1.83,.005],[1,.86,1],avatar,"propos");
  standCollar.rotation.x=-Math.PI/2;
  for(let i=0;i<4;i++)oval(material(0x38383a,.4),[.018,1.27+i*.095,.234],[.016,.016,.008],avatar,"propos");
  // Cream edges and a visible utility pocket; both remain real 3D surfaces.
  [-1,1].forEach(sign=>{
    tubeBetween([sign*.16,1.2,.235],[sign*.20,1.77,.23],.018,.018,rib,"propos");
    const collar=oval(cream,[sign*.178,1.772,.082],[.083,.108,.132],avatar,"propos");
    collar.rotation.z=sign*.46;
    oval(cream,[sign*.281,1.726,.004],[.133,.132,.124],avatar,"skills");
    tubeBetween([sign*.31,1.77,0],[sign*.42,1.43,.015],.128,.136,cream,"skills");
    oval(cream,[sign*.41,1.43,.015],[.128,.14,.13],avatar,"skills");
    tubeBetween([sign*.42,1.44,.015],[sign*.48,1.15,.07],.11,.115,cream,"skills");
    tubeBetween([sign*.48,1.16,.07],[sign*.48,1.10,.077],.103,.103,rib,"skills");
    // Palms and four subtly separate fingers.
    oval(skin,[sign*.48,1.01,.09],[.071,.105,.048],avatar,"skills");
    for(let finger=0;finger<4;finger++){
      const fx=sign*.48+(finger-1.5)*.025;
      oval(skinLight,[fx,.96-Math.sin(finger/3*Math.PI)*.015,.10],[.015,.055,.019],avatar,"skills");
    }
    const thumb=oval(skin,[sign*.425,1.032,.12],[.025,.057,.024],avatar,"skills");thumb.rotation.z=sign*.5;
  });
  // The pocket stands proud of the jacket; flush with it, it was buried inside
  // the body surface and could never be pointed at.
  panel([[.183,1.452],[.318,1.452],[.318,1.686],[.183,1.686]],.036,rib,.208,"realisations");
  tubeBetween([.187,1.659,.256],[.314,1.659,.256],.006,.006,metal,"realisations");
  oval(metal,[.204,1.638,.266],[.011,.025,.008],avatar,"realisations");
  // A soft contact shadow grounds the feet without the cost of a shadow map.
  const shadowCanvas=document.createElement("canvas");shadowCanvas.width=shadowCanvas.height=64;
  const shadowPaint=shadowCanvas.getContext("2d"),shadowGradient=shadowPaint.createRadialGradient(32,32,0,32,32,32);
  shadowGradient.addColorStop(0,"rgba(18,20,40,.62)");shadowGradient.addColorStop(.55,"rgba(18,20,40,.28)");shadowGradient.addColorStop(1,"rgba(18,20,40,0)");
  shadowPaint.fillStyle=shadowGradient;shadowPaint.fillRect(0,0,64,64);
  const contact=new THREE.Mesh(new THREE.PlaneGeometry(.9,.72),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));
  contact.rotation.x=-Math.PI/2;contact.position.set(0,.045,.03);contact.raycast=()=>{};avatar.add(contact);
  // Head, front towards positive Z. It is one sculpted surface: a sphere pushed
  // into skull, brow, eye sockets, cheekbones and chin by smooth fields, with
  // normals computed from the same function so no seam or bump shows while it
  // turns. Hair and beard are shells of that surface, so they stay attached to
  // the face from every angle and leave the back of the neck bare.
  tubeBetween([0,1.76,0],[0,2.02,0],.101,.091,skin,"accueil");
  const head=new THREE.Group();head.position.set(0,2.158,0);avatar.add(head);
  const HEAD={a:.182,b:.262,c:.198,y:.035};
  const centre=new THREE.Vector3(0,HEAD.y,0);
  const smooth=(from,to,value)=>{const t=THREE.MathUtils.clamp((value-from)/(to-from),0,1);return t*t*(3-2*t);};
  const field=(d,x,y,z,width)=>Math.exp(-((d.x-x)**2+(d.y-y)**2+(d.z-z)**2)/(width*width));
  const azimuth=d=>Math.abs(Math.atan2(d.x,d.z));
  function skull(d,out=new THREE.Vector3()) {
    const k=1+.05*field(d,0,.34,.94,.3)
      -.04*(field(d,.33,.07,.94,.17)+field(d,-.33,.07,.94,.17))
      +.035*(field(d,.6,-.14,.79,.26)+field(d,-.6,-.14,.79,.26))
      +.08*field(d,0,-.8,.6,.3)
      -.05*field(d,0,-.55,-.83,.4);
    return out.set(d.x*HEAD.a*(1-.15*smooth(-.1,-.95,d.y))*k,d.y*HEAD.b*k+HEAD.y,d.z*HEAD.c*k);
  }
  // Groomed full beard as in the profile photo: a straight cheek line from the
  // sideburn to the moustache, sideburns thinning into the fade, dense along
  // the jaw and a chin that points slightly forward. Lips stay bare.
  function beardAmount(d) {
    const s=azimuth(d),line=-.36+(THREE.MathUtils.clamp(s,.45,1.4)-.45)/.95*.5;
    // Behind the sideburn the beard only follows the jaw, under the ear.
    const back=1.46+.3*smooth(-.22,-.6,d.y);
    const sideburn=1-.5*smooth(-.1,.12,d.y)*smooth(1.1,1.35,s);
    return sideburn*smooth(line+.08,line-.07,d.y)*smooth(back+.07,back-.05,s)*smooth(.85,1.05,Math.hypot(s/.33,(d.y+.515)/.068));
  }
  // Moustache resting on the upper lip, its ends running down into the beard.
  function moustacheAmount(d) {
    const s=azimuth(d),top=-.28-.05*(s/.4)**2,bottom=-.44+.02*(Math.min(s,.3)/.3)**2-.1*smooth(.3,.45,s);
    return smooth(.5,.4,s)*smooth(top+.02,top-.03,d.y)*smooth(bottom-.02,bottom+.02,d.y);
  }
  // Curly volume on top, and a short fade on the sides and back that joins the
  // sideburns and thins out towards the ears and the nape.
  // The hairline recedes at the temples, as in the photos.
  const hairline=s=>.5-.14*smooth(.5,1.6,s)+.12*Math.exp(-(((s-.78)/.22)**2));
  function hairAmount(d) {
    const s=azimuth(d),top=hairline(s);
    const low=s<1.1?top:s<1.6?hairline(1.1)+(s-1.1)*(.14-hairline(1.1))/.5:.14-.42*smooth(1.6,2.3,s);
    return {volume:smooth(top,top+.16,d.y),fade:smooth(low-.04,low+.32,d.y)};
  }
  // Both layers sit just above the skin and fade out through their opacity, so
  // their edges stay soft instead of following the steps of the mesh.
  const around=(point,scale)=>point.sub(centre).multiplyScalar(scale).add(centre);
  const beardLift=d=>1.006+Math.max(beardAmount(d)*(.045+.1*field(d,0,-.88,.45,.3)),moustacheAmount(d)*.04);
  function hairLift(d) {
    const {volume,fade}=hairAmount(d);
    return 1.006+Math.max(volume,fade)*.04+volume*.13;
  }
  const hairSurface=(d,out=new THREE.Vector3())=>around(skull(d,out),hairLift(d));
  const UP=new THREE.Vector3(0,1,0),tangentA=new THREE.Vector3(),tangentB=new THREE.Vector3();
  const stepA=new THREE.Vector3(),stepB=new THREE.Vector3(),probe=new THREE.Vector3();
  function surfaceAt(shape,d,point,normal) {
    shape(d,point);
    tangentA.crossVectors(UP,d);if(tangentA.lengthSq()<1e-8)tangentA.set(1,0,0);tangentA.normalize();
    tangentB.crossVectors(d,tangentA).normalize();
    shape(probe.copy(d).addScaledVector(tangentA,.002).normalize(),stepA).sub(point);
    shape(probe.copy(d).addScaledVector(tangentB,.002).normalize(),stepB).sub(point);
    normal.crossVectors(stepA,stepB).normalize();
    if(normal.dot(probe.copy(point).sub(centre))<0)normal.negate();
  }
  // The skull is evaluated once per vertex; hair and beard reuse its points,
  // lifted by their thickness, and its normals.
  const grid=new THREE.SphereGeometry(1,100,70),vertexCount=grid.attributes.position.count;
  const directions=[],skullPoints=new Float32Array(vertexCount*3),skullNormals=new Float32Array(vertexCount*3);
  {
    const point=new THREE.Vector3(),normal=new THREE.Vector3();
    for(let i=0;i<vertexCount;i++){
      const d=new THREE.Vector3().fromBufferAttribute(grid.attributes.position,i).normalize();
      surfaceAt(skull,d,point,normal);directions.push(d);point.toArray(skullPoints,i*3);normal.toArray(skullNormals,i*3);
    }
  }
  // `opacity` gives each vertex's coverage; the layer's colour is set per mesh.
  function sculpt(lift,opacity) {
    const geometry=grid.clone(),position=geometry.attributes.position;
    geometry.setAttribute("normal",new THREE.BufferAttribute(skullNormals.slice(),3));
    const colors=opacity&&new Float32Array(vertexCount*4),point=new THREE.Vector3();
    for(let i=0;i<vertexCount;i++){
      point.fromArray(skullPoints,i*3);if(lift)around(point,lift(directions[i]));
      position.setXYZ(i,point.x,point.y,point.z);
      if(colors)colors.set([1,1,1,opacity(directions[i])],i*4);
    }
    if(colors){
      geometry.setAttribute("color",new THREE.BufferAttribute(colors,4));
      // Faces that are fully transparent are dropped: they would cost fill rate
      // and could catch the pointer without ever being seen.
      const index=geometry.index.array,kept=[];
      for(let i=0;i<index.length;i+=3)if(colors[index[i]*4+3]>.004||colors[index[i+1]*4+3]>.004||colors[index[i+2]*4+3]>.004)kept.push(index[i],index[i+1],index[i+2]);
      geometry.setIndex(kept);
    }
    geometry.computeBoundingSphere();
    return geometry;
  }
  function layer(color) {
    return new THREE.MeshStandardMaterial({color,roughness:.95,vertexColors:true,transparent:true,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
  }
  mesh(sculpt(),skin,[0,0,0],null,head);
  mesh(sculpt(beardLift,d=>.93*smooth(.03,.9,Math.max(beardAmount(d),moustacheAmount(d)))),layer(0x211915),[0,0,0],null,head);
  // The fade stays translucent low on the sides, like hair cut close to the skin.
  mesh(sculpt(hairLift,d=>{const {volume,fade}=hairAmount(d);return Math.max(smooth(0,.5,volume),smooth(0,.2,fade)*(.2+.8*fade**1.3));}),layer(0x141011),[0,0,0],null,head);
  const point=new THREE.Vector3(),normal=new THREE.Vector3(),FORWARD=new THREE.Vector3(0,0,1);
  const toward=(x,y)=>new THREE.Vector3(x,y,Math.sqrt(Math.max(0,1-x*x-y*y)));
  // Short tight curls on the top only, each a small ring.
  const curlSpots=[];
  for(let i=0;i<900 && curlSpots.length<190;i++){
    const d=new THREE.Vector3(),y=1-(i+.5)/900*2,r=Math.sqrt(1-y*y),a=i*2.3999632;
    d.set(Math.cos(a)*r,y,Math.sin(a)*r);
    if(hairAmount(d).volume>.55)curlSpots.push(d);
  }
  const curls=new THREE.InstancedMesh(new THREE.TorusGeometry(1,.46,5,9),hair,curlSpots.length);
  const helper=new THREE.Object3D();
  curlSpots.forEach((d,i)=>{
    surfaceAt(hairSurface,d,point,normal);
    helper.position.copy(point).addScaledVector(normal,.004);
    helper.quaternion.setFromUnitVectors(FORWARD,normal);
    helper.rotateX(Math.sin(i*3.1)*.9);helper.rotateY(Math.cos(i*1.7)*.9);
    helper.scale.setScalar(.0165+Math.abs(Math.sin(i*5.9))*.006);helper.updateMatrix();curls.setMatrixAt(i,helper.matrix);
  });
  head.add(curls);
  // Ears slightly turned forward, level with the eyes and the nose.
  [-1,1].forEach(sign=>{
    surfaceAt(skull,new THREE.Vector3(sign,-.08,.06).normalize(),point,normal);
    const ear=oval(skin,point.clone().addScaledVector(normal,.006).toArray(),[.024,.056,.04],head);ear.rotation.y=sign*.35;
    const hollow=oval(nostril,point.clone().addScaledVector(normal,.022).toArray(),[.008,.034,.022],head);hollow.rotation.y=sign*.35;
  });
  // Eyes narrowed by the smile, as in the photo: dark brown irises between an
  // upper lid lowered over them and a lifted lower lid, under thick brows.
  const upperLid=new THREE.SphereGeometry(1,24,10,0,Math.PI*2,0,1.45);
  const lowerLid=new THREE.SphereGeometry(1,24,8,0,Math.PI*2,Math.PI-1.2,1.2);
  const lashLine=new THREE.TorusGeometry(1,.075,5,20,Math.PI);
  [-1,1].forEach(sign=>{
    surfaceAt(skull,toward(sign*.33,.06).normalize(),point,normal);
    const eye=new THREE.Group();eye.position.copy(point).addScaledVector(normal,-.006);
    eye.quaternion.setFromUnitVectors(FORWARD,new THREE.Vector3(sign*.12,.02,1).normalize());head.add(eye);
    oval(eyeWhite,[0,0,0],[.031,.024,.022],eye);
    oval(iris,[0,-.002,.0185],[.0145,.0145,.005],eye);
    oval(pupil,[0,-.002,.0226],[.0068,.0068,.0015],eye);
    oval(white,[-.004,.003,.0232],[.0026,.0026,.001],eye);
    const upper=mesh(upperLid,skin,[0,0,0],[.0335,.0262,.0245],eye);upper.rotation.x=-.02;
    const edge=mesh(lashLine,lash,[0,Math.cos(1.45),0],[Math.sin(1.45)*1.02,Math.sin(1.45)*1.02,1.9],upper);edge.rotation.x=Math.PI/2;
    mesh(lowerLid,skin,[0,0,0],[.033,.026,.024],eye);
    // Brow: a tapered tube laid on the skull, thicker at the inner end.
    const path=[[.1,.27],[.22,.31],[.36,.31],[.5,.26]].map(([x,y])=>{
      surfaceAt(skull,toward(sign*x,y).normalize(),point,normal);return point.clone().addScaledVector(normal,.005);
    });
    const brow=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path),16,.0095,6);
    const ring=brow.parameters.radialSegments+1,browPoints=brow.parameters.tubularSegments;
    const browPosition=brow.attributes.position,axis=new THREE.Vector3(),vertex=new THREE.Vector3();
    for(let i=0;i<browPosition.count;i++){
      const t=Math.floor(i/ring)/browPoints;brow.parameters.path.getPointAt(t,axis);
      vertex.fromBufferAttribute(browPosition,i).sub(axis).multiplyScalar(1-.5*t*t).add(axis);
      browPosition.setXYZ(i,vertex.x,vertex.y,vertex.z);
    }
    brow.computeVertexNormals();mesh(brow,browColor,[0,0,0],null,head);
  });
  // Straight, fairly long nose with a rounded tip and marked nostrils.
  const noseRoot=new THREE.Vector3(),noseTip=new THREE.Vector3(),tipNormal=new THREE.Vector3();
  surfaceAt(skull,toward(0,.1),noseRoot,normal);noseRoot.addScaledVector(normal,-.002);
  surfaceAt(skull,toward(0,-.21),noseTip,tipNormal);noseTip.add(new THREE.Vector3(0,-.004,.047));
  const bridgeLength=noseRoot.distanceTo(noseTip);
  const bridge=mesh(new THREE.CapsuleGeometry(.0165,bridgeLength,4,10),skin,noseRoot.clone().lerp(noseTip,.5).toArray(),[.85,1,1],head);
  bridge.quaternion.setFromUnitVectors(UP,noseTip.clone().sub(noseRoot).normalize());
  oval(skinLight,noseTip.toArray(),[.029,.025,.026],head);
  [-1,1].forEach(sign=>{
    oval(skin,noseTip.clone().add(new THREE.Vector3(sign*.021,-.008,-.016)).toArray(),[.016,.014,.016],head);
    oval(nostril,noseTip.clone().add(new THREE.Vector3(sign*.011,-.019,-.006)).toArray(),[.0075,.0035,.0065],head);
  });
  // Open smile showing the upper teeth, bent to follow the face.
  surfaceAt(skull,toward(0,-.5),point,normal);
  const mouth=new THREE.Group();mouth.position.copy(point).addScaledVector(normal,.001);
  mouth.quaternion.setFromUnitVectors(FORWARD,normal);head.add(mouth);
  const halfWidth=.056,top=x=>.001+.008*(x/halfWidth)**2;
  function lipShape(depthOf) {
    const shape=new THREE.Shape(),steps=16;
    for(let i=0;i<=steps;i++){const x=-halfWidth+i/steps*halfWidth*2;i?shape.lineTo(x,top(x)):shape.moveTo(x,top(x));}
    for(let i=steps;i>=0;i--){const x=-halfWidth+i/steps*halfWidth*2;shape.lineTo(x,top(x)-depthOf(1-(x/halfWidth)**2));}
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:.004,bevelEnabled:false});
    const vertices=geometry.attributes.position;
    for(let i=0;i<vertices.count;i++)vertices.setZ(i,vertices.getZ(i)-vertices.getX(i)**2/.3);
    geometry.computeVertexNormals();return geometry;
  }
  mesh(lipShape(w=>.019*Math.pow(Math.max(w,0),.8)),mouthShade,[0,0,-.002],null,mouth);
  mesh(lipShape(w=>.0075*Math.pow(Math.max(w,0),.5)),teeth,[0,0,-.001],[.92,1,1],mouth);
  oval(lip,[0,-.021,-.004],[.034,.0065,.008],mouth);
  // The head answers on its own, separately from the jacket and the bust.
  head.traverse(object=>{if(object.isMesh||object.isInstancedMesh)register(object,"accueil");});

  let inViewport=true,auto=true,hovering=false,raf=0,lastTime=0,disposed=false,compiled=false;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const globallyPaused=()=>document.documentElement.classList.contains("motion-paused");
  function draw(){if(compiled && !disposed && inViewport && !document.hidden)renderer.render(scene,camera);}
  // Turning pauses while the pointer rests on the character, so the surface
  // under the cursor stops sliding away while it is being read.
  function turning(){return auto && !hovering && inViewport && !document.hidden && !reduced.matches && !globallyPaused();}
  function animate(time){
    raf=0;
    if(disposed || !turning())return;
    avatar.rotation.y+=Math.min((time-lastTime)/1000,.05)*.34;lastTime=time;draw();raf=requestAnimationFrame(animate);
  }
  function schedule(){if(!raf && !disposed && turning()){lastTime=performance.now();raf=requestAnimationFrame(animate);}}
  // Measured once with the character upright, so the framing stays identical
  // while it turns and adapts to whatever shape the stage ends up being.
  const restingRotation=avatar.rotation.y;
  avatar.rotation.y=0;avatar.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(avatar);
  const extent=bounds.getSize(new THREE.Vector3());
  const middleY=(bounds.min.y+bounds.max.y)/2;
  const halfHeight=extent.y/2,halfGirth=Math.max(extent.x,extent.z)/2;
  avatar.rotation.y=restingRotation;avatar.updateMatrixWorld(true);
  function frame(){
    const halfFov=THREE.MathUtils.degToRad(camera.fov)/2;
    const forHeight=halfHeight/Math.tan(halfFov);
    const forWidth=halfGirth/(Math.tan(halfFov)*camera.aspect);
    camera.position.set(0,middleY,Math.max(forHeight,forWidth)*1.06+halfGirth);
    camera.lookAt(0,middleY,0);
    camera.updateProjectionMatrix();
  }
  function resize(){const rect=stage.getBoundingClientRect();renderer.setSize(rect.width,rect.height);camera.aspect=rect.width/rect.height;frame();draw();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
  const intersection=new IntersectionObserver(entries=>{inViewport=entries[0].isIntersecting;if(inViewport){draw();schedule();}},{threshold:.01});intersection.observe(stage);
  const pauseObserver=new MutationObserver(schedule);pauseObserver.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
  document.addEventListener("visibilitychange",()=>{draw();schedule();});
  reduced.addEventListener("change",()=>{draw();schedule();});
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  let highlighted=null,gesture=null;
  // A label pinned to the pointer names the section a garment leads to.
  const tip=document.createElement("span");
  tip.className="avatar-tip";tip.hidden=true;tip.setAttribute("aria-hidden","true");
  stage.append(tip);
  function placeTip(event) {
    const rect=stage.getBoundingClientRect();
    const x=event.clientX-rect.left,y=event.clientY-rect.top;
    tip.style.setProperty("--tip-x",x+"px");
    tip.style.setProperty("--tip-y",y+"px");
    tip.classList.toggle("is-left",x>rect.width*.55);
  }
  function hit(event){
    const rect=canvas.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObject(avatar,true);
    // Only the closest visible surface may receive a clothing interaction.
    return hits[0]?.object?.userData.destination||null;
  }
  // Selection tints a garment towards a muted blue-grey rather than making one
  // piece glow, so a whole zone reads as a single selected surface.
  const TINT=new THREE.Color(0x48588c);
  function paint(destination,selected) {
    (groups[destination]||[]).forEach(object=>{
      const surface=object.material;
      if(!surface.userData.restingColor)surface.userData.restingColor=surface.color.clone();
      surface.color.copy(surface.userData.restingColor);
      if(selected){surface.color.lerp(TINT,.46);surface.emissive.setHex(0x141b2e);}
      else surface.emissive.setHex(0);
    });
  }
  function highlight(destination) {
    if(highlighted===destination)return;
    if(highlighted)paint(highlighted,false);
    highlighted=destination;
    if(destination)paint(destination,true);
    status.textContent=destination?targets[destination]:IDLE;
    if(destination){tip.textContent=targets[destination];tip.hidden=false;}
    else tip.hidden=true;
    canvas.style.cursor=destination?"pointer":"grab";draw();
  }
  function stopSpin(){auto=false;const button=stage.closest("[data-avatar]").querySelector("[data-avatar-spin]");button.textContent="Rotation auto";button.setAttribute("aria-pressed","false");}
  canvas.addEventListener("pointerdown",event=>{if(event.button!==0)return;gesture={x:event.clientX,y:event.clientY,angle:avatar.rotation.y,distance:0};canvas.setPointerCapture(event.pointerId);stopSpin();});
  canvas.addEventListener("pointermove",event=>{
    if(gesture){const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;gesture.distance=Math.hypot(dx,dy);if(Math.abs(dx)>3){avatar.rotation.y=gesture.angle+dx*.012;highlight(null);draw();}}
    else if(event.pointerType!=="touch"){placeTip(event);highlight(hit(event));}
  });
  canvas.addEventListener("pointerenter",event=>{if(event.pointerType==="touch")return;hovering=true;});
  canvas.addEventListener("pointerup",event=>{
    if(!gesture)return;const wasClick=gesture.distance<6;gesture=null;
    if(wasClick){const destination=hit(event);if(destination)window.location.hash=destination;}
  });
  canvas.addEventListener("pointercancel",()=>{gesture=null;});
  canvas.addEventListener("pointerleave",()=>{hovering=false;if(!gesture)highlight(null);schedule();});
  canvas.addEventListener("keydown",event=>{
    if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();stopSpin();avatar.rotation.y+=(event.key==="ArrowRight"?1:-1)*Math.PI/8;highlight(null);draw();}
    if(event.key==="Home"){event.preventDefault();avatar.rotation.y=-.28;draw();}
  });
  canvas.addEventListener("webglcontextlost",event=>{event.preventDefault();status.textContent="Le rendu 3D a été interrompu. Rechargez la page pour le relancer.";});
  canvas.addEventListener("webglcontextrestored",()=>{resize();schedule();});
  resize();
  // Shaders compile in parallel where the browser allows it, so building the
  // character does not freeze scrolling; the first frame follows once ready.
  if(renderer.extensions.has("KHR_parallel_shader_compile"))renderer.compileAsync(scene,camera).catch(()=>{}).then(()=>{compiled=true;draw();});
  else{compiled=true;draw();}
  schedule();
  // Replaces the loading line the caller put there before importing this module.
  status.textContent=IDLE;
  return {
    spinning(){return auto;},
    turn(direction){stopSpin();avatar.rotation.y+=direction*Math.PI/4;highlight(null);draw();},
    reset(){stopSpin();avatar.rotation.y=-.28;highlight(null);draw();},
    toggleSpin(){auto=!auto;schedule();draw();return auto;}
  };
}
