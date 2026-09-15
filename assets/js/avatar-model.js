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
  const white=material(0xf3f0e6),skin=material(0xb97f59,.65),skinLight=material(0xc48e68,.7);
  const hair=material(0x171416),beard=material(0x292020),shoe=material(0x17191c,.24),sole=material(0x0e1114);
  const metal=material(0xb8ad8b,.25,.7),eyeWhite=material(0xe5d4ba,.55),iris=material(0x38231b,.35);
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
  // Tiny fleece clumps, instanced to keep the cream jacket inexpensive to render.
  const clumps=[];
  for(let i=0;i<370;i++){
    const angle=i*2.3999632, y=1.18+(i%37)/37*.62;
    const x=Math.cos(angle)*.302,z=Math.sin(angle)*.205;
    if(z>.13 && Math.abs(x)<.185)continue;
    clumps.push([x,y,z]);
  }
  const fleece=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.014,0),cream,clumps.length);
  const helper=new THREE.Object3D();
  clumps.forEach((p,i)=>{helper.position.set(...p);helper.scale.set(1,1,.7);helper.updateMatrix();fleece.setMatrixAt(i,helper.matrix);});
  avatar.add(fleece);register(fleece,"propos");
  // Stylized head shaped from volumes; front points towards positive Z.
  tubeBetween([0,1.76,0],[0,2.02,0],.101,.091,skin,"accueil");
  const head=new THREE.Group();head.position.set(0,2.158,0);avatar.add(head);
  oval(skin,[0,.05,0],[.205,.265,.19],head);
  oval(skin,[0,-.09,.025],[.168,.16,.15],head);
  oval(skinLight,[0,.005,.095],[.177,.177,.119],head);
  [-1,1].forEach(sign=>{
    oval(skin,[sign*.197,.025,0],[.047,.078,.039],head);
    oval(material(0x9e6549),[sign*.208,.025,.024],[.017,.048,.014],head);
    oval(skin,[sign*.105,-.035,.139],[.066,.058,.05],head);
  });
  // Cropped curly hair, faded sides and individually instanced curls.
  const cap=mesh(new THREE.SphereGeometry(1,32,20,0,Math.PI*2,0,Math.PI*.53),hair,[0,.093,-.015],[.213,.225,.185],head);
  const curls=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),hair,105);
  for(let i=0;i<105;i++){
    const azimuth=i*2.3999632, height=(i+.5)/105;
    const theta=Math.acos(height*.86+.10);
    helper.position.set(Math.sin(theta)*Math.cos(azimuth)*.202,.11+Math.cos(theta)*.217,Math.sin(theta)*Math.sin(azimuth)*.18-.015);
    helper.scale.setScalar(.027+Math.sin(i*5.9)*.004);helper.rotation.set(i*.3,i*.5,i*.7);helper.updateMatrix();curls.setMatrixAt(i,helper.matrix);
  }head.add(curls);
  // A full beard: a band closed all the way round the jaw, joined to the hair
  // by sideburns, rather than a patch covering only the front of the face.
  const beardBand=new THREE.SphereGeometry(1,36,24,0,Math.PI*2,Math.PI*.29,Math.PI*.71);
  mesh(beardBand,beard,[0,-.048,.014],[.193,.203,.179],head);
  oval(beard,[0,-.163,.096],[.108,.064,.073],head);
  const beardTufts=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),beard,96);
  for(let i=0;i<96;i++){
    const azimuth=i*2.3999632,band=(i+.5)/96;
    const theta=Math.PI*(.42+band*.46);
    helper.position.set(Math.sin(theta)*Math.cos(azimuth)*.196,-.048+Math.cos(theta)*.206,Math.sin(theta)*Math.sin(azimuth)*.182+.014);
    helper.scale.setScalar(.019+Math.sin(i*4.7)*.003);helper.rotation.set(i*.4,i*.6,i*.2);helper.updateMatrix();beardTufts.setMatrixAt(i,helper.matrix);
  }head.add(beardTufts);
  [-1,1].forEach(sign=>{
    const sideburn=oval(beard,[sign*.172,-.004,.038],[.034,.115,.086],head);sideburn.rotation.z=sign*.08;
    // Almond-shaped eyes and eyelids.
    oval(eyeWhite,[sign*.080,.049,.182],[.042,.020,.016],head);
    oval(iris,[sign*.078,.049,.197],[.017,.016,.005],head);
    oval(hair,[sign*.078,.049,.201],[.008,.012,.003],head);
    oval(white,[sign*.074,.055,.204],[.0035,.004,.002],head);
    const brow=oval(hair,[sign*.080,.092,.186],[.053,.0085,.015],head);brow.rotation.z=sign*-.12;
  });
  // Nose bridge, nostrils, moustache and understated smile.
  oval(skin,[0,.01,.197],[.027,.064,.044],head);
  oval(skinLight,[0,-.022,.232],[.035,.027,.026],head);
  oval(skin,[-.029,-.031,.215],[.019,.017,.025],head);oval(skin,[.029,-.031,.215],[.019,.017,.025],head);
  [-1,1].forEach(sign=>{const moustache=oval(beard,[sign*.040,-.056,.192],[.046,.0135,.019],head);moustache.rotation.z=sign*.17;});
  oval(material(0x8c5140),[0,-.087,.198],[.055,.010,.009],head);
  oval(skin,[0,-.10,.191],[.050,.014,.014],head);
  // The head answers on its own, separately from the jacket and the bust.
  head.traverse(object=>{if(object.isMesh||object.isInstancedMesh)register(object,"accueil");});

  let inViewport=true,auto=true,hovering=false,raf=0,lastTime=0,disposed=false;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const globallyPaused=()=>document.documentElement.classList.contains("motion-paused");
  function draw(){if(!disposed && inViewport && !document.hidden)renderer.render(scene,camera);}
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
