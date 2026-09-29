/* Mundo de Criaturas — datos y modelos 3D compartidos por todos los juegos.
   Requiere three.js r128 cargado antes (window.THREE). */
(function(){
  const COLORS = {1:"#FF5A5F",2:"#FF8C42",3:"#FFC23C",4:"#8AC926",5:"#1FB8A8",6:"#1982C4",7:"#6A4C93",8:"#C04CFD",9:"#FF4F9A",10:"#2D3047", x1:"#E8483C", x2:"#7FC8F0", x3:"#B08968", x4:"#FF8FC8", x5:"#FFD23F", x6:"#5B6EE8", x7:"#5FB84A", x8:"#8FD3F4", x9:"#3FB6C8", x10:"#E3C27A", x11:"#4B3F9E", x12:"#AEB6E8", x13:"#FF6A2C"};
  const EXTRA_IDS = ["x7","x8","x9","x10","x4","x11","x12","x5","x13","x6"];
  const isX = t => typeof t === "string" && t[0] === "x";
  const mixHex = (a, b, k) => { const pa = parseInt(a.slice(1),16), pb = parseInt(b.slice(1),16); const ch = sh => Math.round(((pa>>sh)&255)*(1-k) + ((pb>>sh)&255)*k); return "#" + [16,8,0].map(sh => ch(sh).toString(16).padStart(2,"0")).join(""); };
  const RB = ["#FF5A5F","#FF8C42","#FFC23C","#8AC926","#1FB8A8","#1982C4","#6A4C93"];
  const K = "#1D2356";
  const MASCOT = {
    1:{names:["Chispín","Fogatón","Volcanión"], type:"Fuego", tc:"#FF6B2C", feat:"una sola llama: ¡como la tabla del 1!"},
    2:{names:["Orejitas","Ventolín","Huracanejo"], type:"Viento", tc:"#36B5E8", feat:"2 orejas que usa para volar"},
    3:{names:["Trioji","Mentalí","Omnioji"], type:"Psíquico", tc:"#E8489A", feat:"3 ojos para ver el futuro"},
    4:{names:["Manchita","Mancharón","Reina Mancha"], type:"Bicho", tc:"#5FA31A", feat:"4 manchas de la suerte"},
    5:{names:["Estelín","Cometín","Supernova"], type:"Cósmico", tc:"#5B54E0", feat:"5 puntas brillantes"},
    6:{names:["Mielina","Panalín","Reina Colmena"], type:"Panal", tc:"#D99A00", feat:"6 lados, como las celdas del panal"},
    7:{names:["Arcoirín","Prismín","Aurora"], type:"Hada", tc:"#D05BD6", feat:"7 colores"},
    8:{names:["Pulpín","Pulpón","Krakenito"], type:"Agua", tc:"#1C7FD6", feat:"8 brazos"},
    9:{names:["Misifú","Michisombra","Nuevevidas"], type:"Sombra", tc:"#4B3F8F", feat:"9 vidas (¡y eso que dicen que los gatos tienen 7!)"},
    10:{names:["Robotín","Robotón","Titán X"], type:"Acero", tc:"#6E7A9E", feat:"10 luces"},
    x1:{names:["Brotín","Brotín","Brotín"], type:"Planta", tc:"#4FA84A", feat:"un sombrero de hongo con lunares"},
    x2:{names:["Copito","Copito","Copito"], type:"Hielo", tc:"#4AA8D8", feat:"cuernitos de cristal de hielo"},
    x3:{names:["Rocadillo","Rocadillo","Rocadillo"], type:"Tierra", tc:"#8A6A4A", feat:"una coraza de piedra que se hace bolita"},
    x4:{names:["Melodín","Melodín","Melodín"], type:"Música", tc:"#E85FA8", feat:"una cresta con forma de nota musical"},
    x5:{names:["Chispón","Chispón","Chispón"], type:"Rayo", tc:"#E0A800", feat:"tentáculos que chisporrotean"},
    x6:{names:["Dracón","Dracón","Dracón"], type:"Dragón", tc:"#4B5BD6", feat:"alas, cuernos y una corona de campeón"},
    x7:{names:["Pinchito","Pinchito","Pinchito"], type:"Planta", tc:"#4FA84A", feat:"espinas suaves y una flor en la cabeza"},
    x8:{names:["Carámbano","Carámbano","Carámbano"], type:"Hielo", tc:"#4AA8D8", feat:"cristales de hielo que giran a su alrededor"},
    x9:{names:["Caracolina","Caracolina","Caracolina"], type:"Mar", tc:"#1F9DB0", feat:"un caparazón en espiral"},
    x10:{names:["Arenón","Arenón","Arenón"], type:"Tierra", tc:"#B8914A", feat:"dos torres con banderines"},
    x11:{names:["Buholín","Buholín","Buholín"], type:"Noche", tc:"#4B3F9E", feat:"ojos enormes para ver en la oscuridad"},
    x12:{names:["Bruma","Bruma","Bruma"], type:"Niebla", tc:"#7E88C8", feat:"un farolito que nunca se apaga"},
    x13:{names:["Fenixín","Fenixín","Fenixín"], type:"Fuego", tc:"#FF6B2C", feat:"alas de fuego que renacen"}
  };
  const T3 = window.THREE;
  const HAS3D = (() => { try { if(!T3) return false; const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch(e){ return false; } })();
  const INKHEX = "#1D2356";
  let G3 = null;
  function g3(){
    if(G3) return G3;
    const radTex = (inner, outer) => { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); const gr = x.createRadialGradient(64,64,0,64,64,64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); x.fillStyle = gr; x.fillRect(0,0,128,128); return new T3.CanvasTexture(c); };
    const mats = {};
    G3 = {
      SPH: new T3.SphereGeometry(1, 32, 24),
      TORH: new T3.TorusGeometry(1, .22, 8, 24, Math.PI),
      HALFD: new T3.CircleGeometry(1, 24, Math.PI, Math.PI),
      CONE: new T3.ConeGeometry(1, 1, 24),
      CYL: new T3.CylinderGeometry(1, 1, 1, 28),
      OCT: new T3.OctahedronGeometry(1, 0),
      BOX: new T3.BoxGeometry(1, 1, 1),
      PLANE: new T3.PlaneGeometry(1, 1),
      ink: new T3.MeshBasicMaterial({color: INKHEX, side: T3.BackSide}),
      white: new T3.MeshBasicMaterial({color: 0xffffff}),
      shadowMat: new T3.MeshBasicMaterial({map: radTex("rgba(20,24,60,.42)","rgba(20,24,60,0)"), transparent:true, depthWrite:false}),
      glowMat: new T3.MeshBasicMaterial({map: radTex("rgba(255,226,122,.85)","rgba(255,216,77,0)"), transparent:true, depthWrite:false}),
      M: (hex, o={}) => { const k = hex + JSON.stringify(o); if(!mats[k]){ const p = Object.assign({roughness:.42, metalness:0}, o); if(typeof p.emissive === "string") p.emissive = new T3.Color(p.emissive); p.color = new T3.Color(hex); mats[k] = new T3.MeshStandardMaterial(p); } return mats[k]; }
    };
    return G3;
  }
  function addLights(scene){
    scene.add(new T3.HemisphereLight(0xffffff, 0x7b84b8, .8));
    const k = new T3.DirectionalLight(0xffffff, .8); k.position.set(3, 5, 6); scene.add(k);
    const r = new T3.DirectionalLight(0xcfe0ff, .6); r.position.set(-5, 3, -4); scene.add(r);
    const f = new T3.DirectionalLight(0xffffff, .22); f.position.set(0, -2, 5); scene.add(f);
  }

  function build3D(t, stg, mood){
    const {SPH, TORH, HALFD, CONE, CYL, OCT, BOX, PLANE, ink, M} = g3();
    const root = new T3.Group(), g = new T3.Group(); root.add(g);
    const own = [], anim = {spin:[], wave:[], flick:[], bob:[], blink:[]};
    const O = geo => { own.push(geo); return geo; };
    const C = COLORS[t];
    const add = (parent, geo, mat, pos=[0,0,0], scl=[1,1,1], rot=[0,0,0], ol=.045) => {
      const m = new T3.Mesh(geo, mat); m.position.set(...pos); m.scale.set(...scl); m.rotation.set(...rot); parent.add(m);
      if(ol){ if(!geo.boundingSphere) geo.computeBoundingSphere(); const gr = geo.boundingSphere.radius || 1; const o = new T3.Mesh(geo, ink); o.scale.set(1+ol/(Math.abs(scl[0])*gr), 1+ol/(Math.abs(scl[1])*gr), 1+ol/(Math.abs(scl[2])*gr)); m.add(o); }
      return m;
    };
    const sph = (parent, col, pos, scl, o={}) => add(parent, SPH, M(col, o.m||{}), pos, scl, o.rot||[0,0,0], o.ol===undefined ? .045 : o.ol);
    const glass = (col, op=.6) => ({m:{transparent:true, opacity:op, roughness:.15}});
    const tube = (parent, pts, r, col, o={}) => {
      const curve = new T3.CatmullRomCurve3(pts.map(p => new T3.Vector3(...p)));
      const m = new T3.Mesh(O(new T3.TubeGeometry(curve, 28, r, 10, false)), M(col, o.m||{})); parent.add(m);
      if(o.ol !== 0) parent.add(new T3.Mesh(O(new T3.TubeGeometry(curve, 28, r+.04, 10, false)), ink));
      sph(parent, col, pts[pts.length-1], [r,r,r], {m:o.m}); sph(parent, col, pts[0], [r,r,r], {m:o.m});
      return m;
    };
    const lathe = (parent, prof, col, pos, scl, o={}) => { const geo = O(new T3.LatheGeometry(prof.map(([r,y]) => new T3.Vector2(r,y)), 28)); geo.center(); return add(parent, geo, M(col, o.m||{}), pos, scl, o.rot||[0,0,0], o.ol===undefined ? .04 : o.ol); };
    const FLAME = [[0,0],[.3,.06],[.44,.3],[.4,.62],[.24,.95],[.08,1.2],[0,1.32]];
    const flame = (parent, pos, s, rot=[0,0,0]) => {
      const f = lathe(parent, FLAME, "#FF5A1F", pos, [s,s,s], {rot, m:{emissive:"#FF3A00", emissiveIntensity:.25}});
      lathe(parent, FLAME, "#FFD84D", [pos[0], pos[1]-.2*s, pos[2]+.26*s], [s*.42,s*.45,s*.42], {rot, ol:0, m:{emissive:"#FFC400", emissiveIntensity:.6}});
      f.userData.sy = s; anim.flick.push(f); return f;
    };
    const extr = (parent, shape, depth, col, pos, scl=[1,1,1], rot=[0,0,0], o={}) => { const geo = O(new T3.ExtrudeGeometry(shape, {depth, bevelEnabled:true, bevelThickness:o.bt||.1, bevelSize:o.bs||.08, bevelSegments:4, curveSegments:10})); geo.center(); return add(parent, geo, M(col, o.m||{}), pos, scl, rot, o.ol===undefined ? .045 : o.ol); };
    const starShape = (ro, ri) => { const s = new T3.Shape(); for(let i=0;i<10;i++){ const a = Math.PI/2 + i*Math.PI/5, r = i%2 ? ri : ro; const x = r*Math.cos(a), y = r*Math.sin(a); if(i) s.lineTo(x,y); else s.moveTo(x,y); } s.closePath(); return s; };
    const hexShape = r => { const s = new T3.Shape(); for(let i=0;i<6;i++){ const a = Math.PI/6 + i*Math.PI/3, x = r*Math.cos(a), y = r*Math.sin(a); if(i) s.lineTo(x,y); else s.moveTo(x,y); } s.closePath(); return s; };
    const rrShape = (w,h,r) => { const s = new T3.Shape(), x = -w/2, y = -h/2; s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r); s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h); s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r); s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y); return s; };
    const rbox = (parent, w, h, d, col, pos, o={}) => { const bt = Math.min(.1, d*.3); return extr(parent, rrShape(w, h, Math.min(w,h)*.22), Math.max(.01, d-2*bt), col, pos, [1,1,1], o.rot||[0,0,0], Object.assign({bt, bs:Math.min(.08, bt*.9)}, o)); };
    const onBody = (body, x, y, lift=.02, parent=g) => {
      const n = new T3.Vector3(); let z;
      if(body.flat !== undefined){ z = body.flat; n.set(0,0,1); }
      else if(body.cyl){ const {cy, h, top, bot} = body.cyl; const f = Math.min(1, Math.max(0, (y - cy + h/2)/h)); const rad = bot + (top-bot)*f; z = Math.sqrt(Math.max(.01, rad*rad - x*x)); n.set(x, (bot-top)/h*rad, z).normalize(); }
      else { const [cx,cy,cz] = body.c, [a,b,c] = body.r; const u = (x-cx)/a, v = (y-cy)/b; z = cz + c*Math.sqrt(Math.max(.03, 1-u*u-v*v)); n.set((x-cx)/(a*a), (y-cy)/(b*b), (z-cz)/(c*c)).normalize(); }
      const p = new T3.Group(); p.position.set(x, y, z).addScaledVector(n, lift); p.lookAt(p.position.clone().add(n)); parent.add(p); return p;
    };
    const face = (body, o={}) => {
      const {y=0, x0=0, s=1, eyes=2, spread=.34, brows=false} = o;
      const k = eyes===3 ? .82 : 1;
      const E = eyes===3 ? [[-.42,-.02],[0,.2],[.42,-.02]] : [[-spread,0],[spread,0]];
      const ink = M(INKHEX);
      const openEye = (p, big=1) => {
        const eg = new T3.Group(); p.add(eg);
        add(eg, SPH, M(INKHEX,{roughness:.12}), [0,0,0], [.12*s*k*big,.155*s*k*big,.05*s], [0,0,0], 0);
        add(eg, SPH, M("#ffffff",{roughness:.1, emissive:"#ffffff", emissiveIntensity:.6}), [.045*s*k*big,.06*s*k*big,.045*s], [.045*s*k*big,.045*s*k*big,.02*s], [0,0,0], 0);
        add(eg, SPH, M("#ffffff",{roughness:.1, emissive:"#ffffff", emissiveIntensity:.6}), [-.04*s*k*big,-.06*s*k*big,.045*s], [.022*s*k,.022*s*k,.01*s], [0,0,0], 0);
        anim.blink.push(eg);
      };
      const arcUp = p => add(p, TORH, ink, [0,-.02*s,0], [.12*s*k,.12*s*k,.12*s*k], [0,0,0], 0);
      const arcDown = p => add(p, TORH, ink, [0,.03*s,0], [.11*s*k,.08*s*k,.1*s*k], [0,0,Math.PI], 0);
      const heartEye = p => { const hm = M("#FF4F7B",{roughness:.2, emissive:"#FF2A5F", emissiveIntensity:.25}); add(p, SPH, hm, [-.045*s*k,.03*s*k,0], [.065*s*k,.065*s*k,.035*s], [0,0,0], 0); add(p, SPH, hm, [.045*s*k,.03*s*k,0], [.065*s*k,.065*s*k,.035*s], [0,0,0], 0); add(p, CONE, hm, [0,-.045*s*k,0], [.095*s*k,.1*s*k,.035*s], [0,0,Math.PI], 0); };
      E.forEach(([ex,ey], i) => {
        const p = onBody(body, x0+ex*s, y+ey*s);
        if(mood==="joy") arcUp(p);
        else if(mood==="love") heartEye(p);
        else if(mood==="sleep") arcDown(p);
        else if(mood==="wink" && i===0) arcUp(p);
        else openEye(p, mood==="surprise" ? 1.28 : 1);
        if(eyes===2 && (brows || mood==="oops" || mood==="surprise")){ const bp = onBody(body, x0+ex*s, y+(mood==="surprise" ? .34 : .27)*s); const tilt = (ex<0 ? 1 : -1) * (mood==="oops" ? .4 : mood==="surprise" ? -.15 : -.4); add(bp, BOX, ink, [0,0,0], [.2*s,.045*s,.03*s], [0,0,tilt], 0); }
      });
      const blush = mood==="love" || mood==="wink" ? 1.35 : 1;
      [-1,1].forEach(sg => { const p = onBody(body, x0 + sg*(eyes===3 ? .62 : .56)*s, y-.2*s); add(p, SPH, M("#FF8FA3",{transparent:true, opacity:.85}), [0,0,0], [.1*s*blush,.065*s*blush,.02*s], [0,0,0], 0); });
      const mp = onBody(body, x0, y-.26*s);
      const openMouth = (w) => { add(mp, HALFD, M("#2A1030",{side:T3.DoubleSide}), [0,0,0], [w*s,w*s,1], [0,0,0], 0); add(mp, HALFD, M("#FF6B81",{side:T3.DoubleSide}), [0,-w*.5*s,.006], [w*.5*s,w*.36*s,1], [0,0,0], 0); };
      if(mood==="joy" || mood==="love") openMouth(.14);
      else if(mood==="wink") openMouth(.1);
      else if(mood==="surprise") add(mp, O(new T3.TorusGeometry(1,.32,8,20)), M("#2A1030"), [0,-.04*s,0], [.065*s,.08*s,.06*s], [0,0,0], 0);
      else if(mood==="sleep") add(mp, SPH, M("#2A1030"), [0,-.02*s,0], [.04*s,.035*s,.015*s], [0,0,0], 0);
      else if(mood==="oops"){ add(mp, TORH, ink, [0,-.03*s,0], [.07*s,.07*s,.07*s], [0,0,0], 0); const sp = onBody(body, x0+.64*s, y+.3*s); add(sp, SPH, M("#8FD8FF",{roughness:.1}), [0,0,0], [.05*s,.08*s,.04*s], [0,0,0], .02); }
      else { add(mp, TORH, ink, [-.07*s,.02*s,0], [.07*s,.07*s,.07*s], [0,0,Math.PI], 0); add(mp, TORH, ink, [.07*s,.02*s,0], [.07*s,.07*s,.07*s], [0,0,Math.PI], 0); }
    };
    const feet = (col, y=-1.12, x=.4, z=.12, s=1) => { sph(g, col, [-x,y,z], [.28*s,.15*s,.34*s]); sph(g, col, [x,y,z], [.28*s,.15*s,.34*s]); };
    const arms = (col, y=-.2, x=.95, z=.05, s=1) => { sph(g, col, [-x,y,z], [.16*s,.28*s,.16*s], {rot:[0,0,.6]}); sph(g, col, [x,y,z], [.16*s,.28*s,.16*s], {rot:[0,0,-.6]}); };
    const spot = (body, x, y, r, col=INKHEX) => { const p = onBody(body, x, y, .005); add(p, SPH, M(col,{roughness:.3}), [0,0,0], [r,r,r*.25], [0,0,0], 0); };
    const twinkle = (parent, pos, s=.12) => { const m = add(parent, OCT, M("#FFD84D",{emissive:"#FFB703", emissiveIntensity:.5, roughness:.2}), pos, [s*.7,s*1.3,s*.35], [0,0,0], .02); m.userData.spin = 2; anim.spin.push(m); return m; };
    const crown = (pos, s=1, parent=g) => {
      const cg = new T3.Group(); cg.position.set(...pos); cg.scale.setScalar(s); parent.add(cg);
      const gold = M("#FFD84D",{metalness:.4, roughness:.28});
      add(cg, CYL, gold, [0,0,0], [.32,.16,.32]);
      for(let i=0;i<5;i++){ const a = i/5*Math.PI*2; add(cg, CONE, gold, [Math.sin(a)*.27, .2, Math.cos(a)*.27], [.09,.24,.09], [0,0,0], .03); }
      add(cg, SPH, M("#FF5A5F",{roughness:.15}), [0,.02,.33], [.07,.07,.05], [0,0,0], .02);
      return cg;
    };
    const orbit = (y, spin, tilt=0) => { const o = new T3.Group(); o.position.y = y; o.rotation.x = tilt; const inner = new T3.Group(); o.add(inner); inner.userData.spin = spin; anim.spin.push(inner); g.add(o); return inner; };
    const bubble = (pos, r) => { const b = sph(g, "#BDEBFF", pos, [r,r,r], {m:{transparent:true, opacity:.75, roughness:.05}, ol:.02}); b.userData.y0 = pos[1]; b.userData.ph = pos[0]*3; anim.bob.push(b); return b; };
    const cloud = (list) => list.forEach(([x,y,z,r]) => sph(g, "#FFFFFF", [x,y,z], [r,r,r*.92], {m:{roughness:.6}}));
    let body;

    if(stg===0){
      const prof = []; for(let i=0;i<=24;i++){ const a = i/24*Math.PI, yy = -Math.cos(a)*1.25; prof.push([Math.max(0, Math.sin(a)*(0.95-0.12*(yy/1.25))), yy]); }
      lathe(g, prof, "#FFF8E7", [0,0,0], [1,1,1], {m:{roughness:.35}, ol:.045});
      const radAt = yy => { const a = Math.acos(Math.max(-1, Math.min(1, -yy/1.25))); return Math.sin(a)*(0.95-0.12*(yy/1.25)); };
      [[.25,.55,.17],[1.3,.1,.21],[2.5,.72,.13],[3.5,-.3,.19],[4.7,-.62,.15],[5.6,.25,.18],[.8,-.75,.14],[.1,-.15,.1]].forEach(([ang,yy,r]) => { const rad = radAt(yy)+.005; const x = Math.sin(ang)*rad, z = Math.cos(ang)*rad; const m = add(g, SPH, M(C,{roughness:.35}), [x,yy,z], [r,r,r*.25], [0,0,0], 0); m.lookAt(x*3, yy*1.1, z*3); });
      sph(g, "#FFFFFF", [-.38,.62,.62], [.1,.2,.05], {m:{transparent:true, opacity:.75}, ol:0, rot:[0,-.5,.4]});
      g.userData.egg = true;
    }
    else {
    const dk = (c, k=.3) => mixHex(c, "#000000", k), lt = (c, k=.4) => mixHex(c, "#ffffff", k);
    const fan = (base, sgn, n, len, cols, a0, a1, zStep=0, w=.1) => { for(let i=0;i<n;i++){ const ang = (a0 + (a1-a0)*i/(n-1))*Math.PI/180; const L = len*(.72 + .28*Math.sin(Math.PI*i/(n-1))); const dx = Math.cos(ang)*sgn, dy = Math.sin(ang); sph(g, cols[i%cols.length], [base[0]+dx*L*.5, base[1]+dy*L*.5, base[2]+zStep*i], [w, L*.5, .05], {ol:.02, rot:[0,0,Math.atan2(dy,dx)-Math.PI/2]}); } };
    const sideWing = (base, len, cols, n=6) => { for(let i=0;i<n;i++){ const ang = (55 + i*(95/(n-1)))*Math.PI/180; const L = len*(.7 + .3*Math.sin(Math.PI*i/(n-1))); const dx = Math.cos(ang), dy = Math.sin(ang); const m = sph(g, cols[i%cols.length], [base[0]+dx*L*.5, base[1]+dy*L*.5, base[2]], [.11, L*.5, .05], {ol:.02, rot:[0,0,Math.atan2(dy,dx)-Math.PI/2]}); m.rotation.y = base[2] > 0 ? .25 : -.25; } };
    const legs2 = (col, x=.3, top=-.6, bot=-1.12, r=.12, footCol=col) => [-1,1].forEach(sg => { tube(g, [[sg*x,top,0],[sg*x*1.05,(top+bot)/2,.04],[sg*x*1.08,bot,.06]], r, col); sph(g, footCol, [sg*x*1.08, bot-.12, .16], [r*1.9, r*1.1, r*2.6]); });
    const legs4 = (col, xs=[.6,-.6], zs=[.28,-.28], top=-.55, bot=-1.1, r=.12, pawCol=col) => xs.forEach(x => zs.forEach(z => { tube(g, [[x,top,z],[x+.03,(top+bot)/2,z],[x+.05,bot,z]], r, col); sph(g, pawCol, [x+.07, bot-.08, z], [r*1.6, r*.9, r*1.6]); }));
    const armT = (col, sh, hand, r=.09, handCol=col, handR=r*1.5) => [-1,1].forEach(sg => { tube(g, [[sg*sh[0],sh[1],sh[2]],[sg*(sh[0]+hand[0])/2*1.08,(sh[1]+hand[1])/2-.05,(sh[2]+hand[2])/2],[sg*hand[0],hand[1],hand[2]]], r, col); sph(g, handCol, [sg*hand[0], hand[1], hand[2]], [handR,handR,handR]); });
    const glassM = {m:{transparent:true, opacity:.55, roughness:.08}};
    const gold = "#FFD84D", goldM = {m:{metalness:.45, roughness:.25}};
    const gem = (parent, col, pos, s, rot=[0,0,0]) => add(parent, OCT, M(col,{emissive:col, emissiveIntensity:.35, roughness:.12}), pos, s, rot, .025);

    /* criaturas extra de la arena */
    if(isX(t)){
      if(t==="x7"){
        feet("#3E8A3A",-1.15,.3); 
        body = {c:[0,-.2,0], r:[.68,.98,.62]}; sph(g,C,body.c,body.r);
        [-1,1].forEach(sg => { tube(g,[[sg*.6,-.25,0],[sg*1.0,-.25,0],[sg*1.05,.25,0]],.17,C); });
        [[.0,.62,.45],[.35,.35,.5],[-.35,.35,.5],[.55,-.1,.35],[-.55,-.1,.35],[.3,-.65,.5],[-.3,-.65,.5],[0,-.2,-.62],[.45,.4,-.4],[-.45,.4,-.4]].forEach(([x,y,z]) => { const m = add(g, CONE, M("#F4FFE8"), [x,y,z], [.035,.12,.035], [0,0,0], 0); m.lookAt(x*3, y*1.2+.5, z*3); m.rotateX(Math.PI/2); });
        for(let i=0;i<5;i++){ const a = i/5*Math.PI*2; sph(g,"#FF7FB0",[Math.cos(a)*.2,.86,Math.sin(a)*.2],[.16,.08,.16],{ol:.02}); } sph(g,"#FFD84D",[0,.9,0],[.12,.08,.12],{ol:.02});
        face(body,{y:-.05, s:.78});
      } else if(t==="x8"){
        const o = orbit(0, 1.2, .3); for(let i=0;i<4;i++){ const a = i/4*Math.PI*2; gem(o,"#BDEBFF",[Math.cos(a)*1.35,Math.sin(a*2)*.2,Math.sin(a)*1.35],[.12,.3,.12]); }
        body = {c:[0,0,0], r:[.82,.82,.78]}; sph(g,C,body.c,body.r,{m:{roughness:.15, metalness:.1}});
        [[-.45,.72,0,-.5,.4],[0,.92,0,0,.55],[.45,.72,0,.5,.4],[-.8,.1,0,-1.2,.3],[.8,.1,0,1.2,.3]].forEach(([x,y,z,rz,h]) => gem(g,"#E6F7FF",[x,y,z],[.13,h,.13],[0,0,rz]));
        sph(g,"#FFFFFF",[-.35,.35,.62],[.14,.09,.04],{m:{transparent:true, opacity:.7}, ol:0, rot:[0,-.4,.5]});
        face(body,{y:-.05, s:.8}); g.userData.float = 1;
      } else if(t==="x9"){
        sph(g,C,[.1,-.95,0],[1.05,.32,.42]);
        const shell = "#FF9EC4"; sph(g,shell,[-.3,.0,-.05],[.78,.8,.52]);
        const pts = []; for(let i=0;i<=40;i++){ const a = i/40*Math.PI*5, r = .7*(1 - i/46); pts.push([-.3 + Math.cos(a)*r, Math.sin(a)*r*.95, .5 + (1-i/40)*.02]); }
        tube(g, pts, .035, "#C2477F", {ol:0});
        [-1,1].forEach(sg => { tube(g,[[.85+sg*.12,-.05,.12],[.9+sg*.2,.35,.1],[.95+sg*.25,.6,.05]],.04,C,{ol:0}); sph(g,"#FFD84D",[.95+sg*.25,.64,.05],[.08,.08,.08]); });
        body = {c:[.85,-.4,.12], r:[.42,.4,.38]}; sph(g,C,body.c,body.r);
        face(body,{x0:.85, y:-.4, s:.58});
      } else if(t==="x10"){
        feet("#B8914A",-1.15,.4);
        rbox(g,1.6,1.05,1.0,C,[0,-.55,0]);
        [-1,1].forEach(sg => { add(g, CYL, M(C), [sg*.62,.22,0], [.3,.95,.3]); for(let i=0;i<4;i++){ const a = i/4*Math.PI*2 + .4; add(g, BOX, M(C), [sg*.62+Math.cos(a)*.24,.75,Math.sin(a)*.24], [.12,.14,.12], [0,-a,0], .02); } add(g, CYL, M(INKHEX), [sg*.62,1.0,0], [.02,.5,.02], [0,0,0], 0); add(g, CONE, M(sg<0 ? "#FF5A5F" : "#1982C4"), [sg*.62+.12,1.15,0], [.08,.22,.02], [0,0,-Math.PI/2], .02); });
        for(let i=0;i<5;i++) add(g, BOX, M(C), [-.64+i*.32,0,0], [.16,.16,.5], [0,0,0], .02);
        [[-.5,-.9],[.45,-.3],[.2,-.95],[-.3,-.35]].forEach(([x,y]) => sph(g,"#FFE8B0",[x,y,.51],[.05,.05,.02],{ol:0}));
        face({flat:.52},{y:-.5, s:.72});
      } else if(t==="x11"){
        feet("#FFB703",-1.12,.28,.15,.8);
        [-1,1].forEach(sg => { sph(g,mixHex(C,"#000",.2),[sg*.82,-.15,-.05],[.25,.6,.2],{rot:[0,0,sg*.2]}); add(g, CONE, M(C), [sg*.45,.95,0], [.14,.35,.12], [0,0,-sg*.35]); });
        body = {c:[0,-.05,0], r:[.85,1.0,.8]}; sph(g,C,body.c,body.r);
        sph(g,"#D8D0FF",[0,-.45,.5],[.5,.5,.28],{ol:0});
        [-1,1].forEach(sg => { const p = onBody(body, sg*.3, .2, .01); add(p, SPH, M("#FFFFFF"), [0,0,0], [.25,.25,.04], [0,0,0], .025); });
        const bp = onBody(body, 0, .05); add(bp, CONE, M("#FFB703"), [0,0,.04], [.07,.12,.07], [Math.PI,0,0], .02);
        const mp = onBody(body, 0, -.45); add(mp, O(new T3.TorusGeometry(.12,.035,8,18,Math.PI*1.3)), M("#FFD84D",{emissive:"#FFB703", emissiveIntensity:.4}), [0,0,.02], [1,1,1], [0,0,-.6], .02);
        face(body,{y:.2, s:.82, spread:.37});
      } else if(t==="x12"){
        const mist = {m:{transparent:true, opacity:.88, roughness:.5}};
        body = {c:[0,.1,0], r:[.8,.95,.75]}; sph(g,C,body.c,body.r,mist);
        for(let i=0;i<6;i++){ const a = i/6*Math.PI*2; sph(g,C,[Math.cos(a)*.55,-.72,Math.sin(a)*.5],[.28,.34,.28],mist); }
        tube(g,[[.65,-.1,.25],[1.05,-.05,.35],[1.15,-.35,.4]],.07,C,mist);
        add(g, CYL, M(INKHEX), [1.15,-.52,.4], [.02,.25,.02], [0,0,0], 0); add(g, CYL, M("#8A6A4A"), [1.15,-.66,.4], [.16,.06,.16]); sph(g,"#FFE27A",[1.15,-.82,.4],[.14,.18,.14],{m:{emissive:"#FFC400", emissiveIntensity:.9}});
        const o = orbit(-.2, .6, .2); for(let i=0;i<5;i++){ const a = i/5*Math.PI*2; sph(o,"#FFFFFF",[Math.cos(a)*1.4,Math.sin(a*3)*.15,Math.sin(a)*1.4],[.18,.12,.18],{m:{transparent:true, opacity:.5}, ol:0}); }
        face(body,{y:.15, s:.85}); g.userData.float = 1;
      } else if(t==="x13"){
        const warm = ["#FF6A2C","#FFB703","#FF4F5A"];
        fan([-.4,.1,-.3],-1,6,1.4,warm,60,170,-.01,.12); fan([.4,.1,-.3],1,6,1.4,warm,60,170,-.01,.12);
        [["#FFB703",-.25],["#FF6A2C",0],["#FF4F5A",.25]].forEach(([col,dx]) => tube(g,[[dx*.5,-.6,-.35],[dx,-1.0,-.7],[dx*1.6,-1.3,-.9]],.08,col,{m:{emissive:col, emissiveIntensity:.25}}));
        [-1,1].forEach(sg => { tube(g,[[sg*.22,-.6,0],[sg*.24,-.95,.05],[sg*.25,-1.18,.1]],.05,"#FFB703"); });
        sph(g,C,[0,-.25,0],[.62,.62,.55]); sph(g,"#FFD8A8",[0,-.3,.34],[.38,.42,.22],{ol:0});
        body = {c:[0,.55,.1], r:[.46,.44,.44]}; sph(g,C,body.c,body.r);
        flame(g,[0,1.1,0],.35); flame(g,[-.18,1.02,-.05],.25,[0,0,.4]); flame(g,[.18,1.02,-.05],.25,[0,0,-.4]);
        const bp = onBody(body, 0, .5); add(bp, CONE, M("#FFD84D"), [0,0,.05], [.07,.14,.07], [Math.PI,0,0], .02);
        face(body,{y:.62, s:.62, spread:.38});
      } else if(t==="x1"){
        feet("#F4E6CF",-1.1,.34); arms("#F4E6CF",-.45,.7,.05,.85);
        body = {c:[0,-.45,0], r:[.62,.62,.58]}; sph(g,"#F4E6CF",body.c,body.r);
        sph(g,C,[0,.35,0],[1.15,.62,1.1]); sph(g,"#F4E6CF",[0,.05,0],[.95,.12,.9],{ol:.02});
        [[-.55,.62,.55,.16],[.35,.78,.62,.13],[.8,.45,.3,.14],[-.2,.9,.1,.12],[.05,.55,.95,.12],[-.9,.4,.1,.12]].forEach(([x,y,z,r]) => sph(g,"#FFFFFF",[x,y,z],[r,r*.7,r],{ol:0}));
        tube(g,[[0,.92,0],[.1,1.2,0],[.25,1.35,0]],.05,"#4FA84A",{ol:0}); sph(g,"#7BC96F",[.4,1.4,0],[.22,.1,.14],{rot:[0,0,.4]});
        face(body,{y:-.42, s:.72});
      } else if(t==="x2"){
        feet("#FFFFFF",-1.12,.38); arms("#FFFFFF",-.3,.92);
        cloud([[0,-.25,0,.95],[-.55,.2,-.05,.55],[.55,.2,-.05,.55],[0,.45,-.1,.6]]);
        body = {c:[0,-.25,0], r:[.95,.95,.95*.92]};
        [[-.45,.95,0,-.4,.45],[.45,.95,0,.4,.45],[0,1.1,-.1,0,.55]].forEach(([x,y,z,rz,h]) => gem(g,"#BDEBFF",[x,y,z],[.12,h,.12],[0,0,rz]));
        twinkle(g,[1.2,.9,0],.1);
        sph(g,C,[0,-.26,.9],[.08,.06,.05],{ol:.02}); face(body,{y:-.1, s:.8});
      } else if(t==="x3"){
        legs4("#8A6A4A",[.55,-.5],[.25,-.25],-.45,-1.05,.12,"#6B4F35");
        for(let i=0;i<4;i++) sph(g, i%2 ? C : "#9C7A58", [-.55+i*.32,-.1+Math.sin(i*.9)*.08,0],[.34,.62,.72],{rot:[0,0,-.25+i*.12]});
        tube(g,[[-1.0,-.35,0],[-1.35,-.55,0],[-1.5,-.8,0]],.1,"#8A6A4A");
        body = {c:[.95,.02,.12], r:[.45,.4,.42]}; sph(g,"#D8BC98",body.c,body.r);
        [-1,1].forEach(sg => sph(g,"#D8BC98",[.88+sg*.12,.42,.12+sg*.22],[.1,.2,.06],{rot:[0,0,-.3]}));
        face(body,{x0:.95, y:.04, s:.6});
      } else if(t==="x4"){
        feet("#FFB703",-1.12,.28,.15,.8);
        [-1,1].forEach(sg => sph(g,mixHex(C,"#000",.15),[sg*.85,-.2,-.05],[.22,.42,.14],{rot:[0,0,sg*.6]}));
        body = {c:[0,-.1,0], r:[.9,.92,.85]}; sph(g,C,body.c,body.r);
        sph(g,"#FFE3F1",[0,-.4,.45],[.5,.45,.32],{ol:0});
        add(g, CONE, M("#FFB703"), [0,-.05,.95], [.12,.22,.12], [Math.PI/2,0,0], .03);
        add(g, CYL, M(INKHEX), [.12,1.25,0], [.05,.6,.05], [0,0,0], 0); sph(g,INKHEX,[-.02,.96,0],[.2,.15,.15],{ol:0}); sph(g,INKHEX,[.26,1.5,0],[.18,.09,.06],{ol:0, rot:[0,0,-.4]});
        face(body,{y:.25, s:.85});
      } else if(t==="x5"){
        for(let i=0;i<6;i++){ const a = i/6*Math.PI*2; const x0 = Math.cos(a)*.55, z0 = Math.sin(a)*.45; tube(g,[[x0,-.4,z0],[x0*1.2+.12,-.75,z0],[x0*1.1-.12,-1.0,z0],[x0*1.25,-1.3,z0]],.06,"#8FD8FF",{m:{emissive:"#36B5E8", emissiveIntensity:.35}}); }
        body = {c:[0,.1,0], r:[1.0,.8,.95]}; sph(g,C,body.c,body.r,{m:{transparent:true, opacity:.92, roughness:.2, emissive:"#FFB703", emissiveIntensity:.15}});
        sph(g,"#FFF3B0",[0,-.35,0],[.9,.15,.85],{ol:.03});
        const bolt = new T3.Shape(); bolt.moveTo(.05,.45); bolt.lineTo(-.25,0); bolt.lineTo(-.02,0); bolt.lineTo(-.12,-.4); bolt.lineTo(.25,.08); bolt.lineTo(.02,.08); bolt.closePath();
        extr(g, bolt, .08, "#FFFFFF", [0,1.05,0], [1,1,1], [0,0,0], {m:{emissive:"#FFF3B0", emissiveIntensity:.6}});
        face(body,{y:.15, s:.9}); g.userData.float = 1;
      } else {
        const belly = "#BFD0FF", wingC = mixHex(C,"#000",.2);
        [-1,1].forEach(sg => { sph(g,wingC,[sg*.95,.35,-.45],[.75,.45,.05],{m:{transparent:true, opacity:.9}, rot:[0,sg*.3,sg*.55]}); });
        tube(g,[[-.35,-.8,-.4],[-.95,-.95,-.7],[-1.45,-.7,-.8],[-1.65,-.35,-.8]],.14,C); add(g, CONE, M(wingC), [-1.72,-.12,-.8], [.2,.3,.08], [0,0,.4], .03);
        legs2(C,.34,-.72,-1.18,.15,wingC);
        sph(g,C,[0,-.35,0],[.7,.72,.6]); sph(g,belly,[0,-.38,.36],[.46,.55,.28],{ol:0});
        armT(C,[.6,-.15,0],[.95,-.5,.3],.11,wingC,.14);
        body = {c:[0,.62,.12], r:[.58,.52,.52]}; sph(g,C,body.c,body.r);
        [-1,1].forEach(sg => add(g, CONE, M("#FFE9A8"), [sg*.32,1.12,0], [.09,.32,.09], [-.3,0,-sg*.4], .03));
        crown([0,1.18,.05],.7);
        face(body,{y:.66, s:.66, brows:true});
      }
    }
    /* 1 · Fuego — ascua → niño de roca → titán volcánico */
    else if(t===1){
      if(stg===1){ feet(C); arms(C,-.15,.95); body = {c:[0,-.05,0], r:[1,1.05,.95]}; sph(g,C,body.c,body.r); flame(g,[0,1.12,0],.5); face(body,{y:.05}); }
      else if(stg===2){
        const rock = "#6B3A33";
        legs2(rock,.34,-.75,-1.15,.16,rock);
        sph(g,C,[0,-.38,0],[.72,.68,.6]); sph(g,"#FFB703",[0,-.42,.4],[.4,.42,.2],{m:{emissive:"#FF8C1A", emissiveIntensity:.45}, ol:.03});
        [-1,1].forEach(sg => sph(g,rock,[sg*.6,-.08,0],[.34,.26,.34],{rot:[0,0,sg*-.3]}));
        armT(C,[.62,-.15,0],[1.0,-.62,.3],.16,rock,.23);
        body = {c:[0,.5,.05], r:[.62,.56,.56]}; sph(g,C,body.c,body.r);
        [-1,1].forEach(sg => add(g, CONE, M(rock), [sg*.4,.98,0], [.1,.3,.1], [0,0,-sg*.45]));
        flame(g,[0,1.25,-.05],.62);
        face(body,{y:.5, s:.8, brows:true});
      } else {
        const rock = "#4E2420";
        legs2(rock,.55,-.7,-1.2,.26,rock);
        sph(g,C,[0,-.15,0],[1.0,.92,.82]);
        tube(g,[[-.35,.35,.76],[-.12,.02,.82],[-.3,-.38,.76]],.035,"#FFD84D",{ol:0, m:{emissive:"#FFB703", emissiveIntensity:.8}});
        tube(g,[[.3,.3,.77],[.15,-.08,.82],[.36,-.45,.72]],.035,"#FFD84D",{ol:0, m:{emissive:"#FFB703", emissiveIntensity:.8}});
        sph(g,"#FF7A00",[0,-.05,.82],[.17,.17,.1],{m:{emissive:"#FF5A00", emissiveIntensity:.8}});
        [-1,1].forEach(sg => { add(g, O(new T3.CylinderGeometry(.2,.42,.55,20)), M(rock), [sg*.95,.5,-.1], [1,1,1], [0,0,sg*-.25]); flame(g,[sg*1.02,.95,-.1],.32); });
        armT(C,[.92,.15,0],[1.35,-.72,.4],.25,rock,.34);
        body = {c:[0,.72,.28], r:[.48,.44,.44]}; sph(g,C,body.c,body.r);
        sph(g,rock,[0,.98,.12],[.52,.2,.42],{rot:[.3,0,0]});
        flame(g,[0,1.55,-.12],1.15);
        face(body,{y:.7, s:.6, brows:true});
      }
    }
    /* 2 · Viento — conejito → conejo alado → grifo-conejo del cielo */
    else if(t===2){
      const ear = (x,y,z,rz,rx,sc=1,tip) => { const e = sph(g,C,[x,y,z],[.26*sc,.75*sc,.2*sc],{rot:[rx,0,rz]}); add(e, SPH, M(tip||"#FFB3C1"), [0,-.05,.78], [.5,.75,.3], [0,0,0], 0); return e; };
      if(stg===1){ feet(C); arms(C,-.35,.9); ear(-.4,.95,0,.2,0); ear(.4,.95,0,-.2,0); body = {c:[0,-.2,0], r:[1,.88,.9]}; sph(g,C,body.c,body.r); face(body,{y:-.1}); }
      else if(stg===2){
        [-1,1].forEach(sg => { sph(g,C,[sg*.28,-.95,0],[.2,.34,.22]); sph(g,C,[sg*.3,-1.22,.15],[.2,.11,.4]); });
        sph(g,"#FFFFFF",[0,-.62,-.48],[.24,.24,.24]);
        fan([-.38,-.1,-.35],-1,5,.85,["#FFFFFF","#8FD8FF"],70,160,-.01); fan([.38,-.1,-.35],1,5,.85,["#FFFFFF","#8FD8FF"],70,160,-.01);
        sph(g,C,[0,-.42,0],[.52,.6,.48]); sph(g,"#FFF1E0",[0,-.45,.3],[.36,.42,.24],{ol:0});
        armT(C,[.42,-.2,0],[.72,-.5,.25],.09);
        add(g, O(new T3.TorusGeometry(.4,.1,10,30)), M("#36B5E8"), [0,-.06,0], [1,1,1], [Math.PI/2,0,0], .03);
        sph(g,"#36B5E8",[.5,-.2,.35],[.28,.1,.07],{rot:[0,0,-.7]});
        ear(-.32,1.18,-.1,.3,-.2,1.05,"#8FD8FF"); ear(.32,1.18,-.1,-.3,-.2,1.05,"#8FD8FF");
        body = {c:[0,.38,.05], r:[.58,.54,.54]}; sph(g,C,body.c,body.r);
        face(body,{y:.36, s:.8});
      } else {
        const mane = "#FFFFFF";
        sideWing([-.05,.05,.5],1.9,["#FFFFFF","#BDEBFF","#8FD8FF"],7); sideWing([-.05,.05,-.5],1.9,["#FFFFFF","#BDEBFF","#8FD8FF"],7);
        legs4(C,[.62,-.58],[.26,-.26],-.5,-1.12,.12,"#FFFFFF");
        [-1,1].forEach(sg => sph(g,C,[-.6,-.42,sg*.32],[.34,.4,.22]));
        sph(g,C,[0,-.25,0],[1.05,.52,.52]);
        [[-1.15,-.15,0,.3],[-1.4,-.05,.1,.22],[-1.35,-.3,-.1,.2]].forEach(([x,y,z,r]) => sph(g,mane,[x,y,z],[r,r,r]));
        sph(g,mane,[.78,-.02,.05],[.42,.46,.46]);
        ear(.85,1.12,-.05,.55,-.1,.95,"#8FD8FF"); ear(1.18,1.1,.28,.2,-.1,.95,"#8FD8FF");
        body = {c:[1.02,.46,.18], r:[.5,.46,.46]}; sph(g,C,body.c,body.r);
        const o = orbit(-.1,1.2,.3); add(o, O(new T3.TorusGeometry(1.7,.03,8,64,Math.PI*1.2)), M("#8FD8FF",{emissive:"#36B5E8", emissiveIntensity:.4}), [0,0,0], [1,1,1], [Math.PI/2,0,0], 0);
        face(body,{x0:1.02, y:.46, s:.7});
      }
    }
    /* 3 · Psíquico — marcianito → mentalista flotante → ser cósmico */
    else if(t===3){
      const ant = (y0, col, sp=.35) => [-1,1].forEach(sg => { tube(g,[[sg*sp,y0,0],[sg*(sp+.18),y0+.4,0],[sg*(sp+.3),y0+.62,0]],.045,INKHEX,{ol:0}); sph(g,col,[sg*(sp+.3),y0+.66,0],[.14,.14,.14]); });
      const pink = "#FF6FB5";
      if(stg===1){ ant(.7,"#8AC926"); feet(C); arms(C,-.3,.9); body = {c:[0,-.1,0], r:[.95,.95,.9]}; sph(g,C,body.c,body.r); face(body,{y:.05, eyes:3}); }
      else if(stg===2){
        add(g, CONE, M(C), [0,-.92,0], [.42,.78,.42], [Math.PI,0,0]);
        sph(g,C,[0,-.32,0],[.48,.5,.4]); gem(g,pink,[0,-.28,.42],[.1,.16,.06]);
        armT(C,[.42,-.12,0],[1.0,-.05,.35],.075,C,.1);
        [-1,1].forEach(sg => sph(g,pink,[sg*1.02,.2,.38],[.13,.13,.13],{m:{emissive:"#E8489A", emissiveIntensity:.6}}));
        ant(1.05,pink,.3);
        body = {c:[0,.55,0], r:[.8,.66,.66]}; sph(g,C,body.c,body.r);
        const o = orbit(-.2,1.1,.2); [0,1,2].forEach(i => { const a = i/3*Math.PI*2; gem(o,pink,[Math.cos(a)*1.25,0,Math.sin(a)*1.25],[.1,.22,.1]); });
        face(body,{y:.55, eyes:3, s:.85}); g.userData.float = 1;
      } else {
        add(g, O(new T3.TorusGeometry(.95,.05,8,48)), M(pink,{emissive:"#E8489A", emissiveIntensity:.55}), [0,.95,-.45], [1,1,1], [0,0,0], 0);
        add(g, O(new T3.ConeGeometry(.95,1.45,28,1,true)), M("#9B2F74",{side:T3.DoubleSide}), [0,-.72,-.05], [1,1,1], [0,0,0], .03);
        sph(g,C,[0,-.05,0],[.62,.6,.5]); gem(g,pink,[0,-.05,.46],[.22,.3,.1]);
        [-1,1].forEach(sg => gem(g,pink,[sg*.62,.32,0],[.18,.34,.18],[0,0,sg*-.45]));
        armT(C,[.55,.08,0],[1.15,.72,.28],.085,C,.1);
        [-1,1].forEach(sg => sph(g,pink,[sg*1.2,.92,.3],[.17,.17,.17],{m:{emissive:"#E8489A", emissiveIntensity:.7}}));
        body = {c:[0,.9,0], r:[.68,.58,.58]}; sph(g,C,body.c,body.r);
        [[-.36,1.36,0,.25],[0,1.52,0,.34],[.36,1.36,0,.25]].forEach(([x,y,z,h]) => gem(g,pink,[x,y,z],[.09,h,.09]));
        const o = orbit(-.2,.8,.35); [0,1,2].forEach(i => { const a = i/3*Math.PI*2; gem(o,pink,[Math.cos(a)*1.7,0,Math.sin(a)*1.7],[.17,.45,.17]); });
        face(body,{y:.9, eyes:3, s:.78}); g.userData.float = 1;
      }
    }
    /* 4 · Bicho — vaquita → escarabajo con cuerno → reina guerrera */
    else if(t===4){
      const ant = (y0, tip, sp=.3) => [-1,1].forEach(sg => { tube(g,[[sg*sp,y0,.05],[sg*(sp+.15),y0+.35,.05],[sg*(sp+.3),y0+.55,0]],.04,INKHEX,{ol:0}); sph(g,tip,[sg*(sp+.3),y0+.58,0],[.11,.11,.11]); });
      const shell = (x,y,z,sx,sy,rz,ry) => { const sh = sph(g,C,[x,y,z],[sx,sy,.3],{rot:[0,ry,rz]}); add(sh, SPH, M(INKHEX,{roughness:.3}), [0,.35,.86], [.3,.18,.2], [0,0,0], 0); add(sh, SPH, M(INKHEX,{roughness:.3}), [0,-.35,.86], [.3,.18,.2], [0,0,0], 0); };
      if(stg===1){ ant(.72,INKHEX); feet(INKHEX); arms(INKHEX,-.2,.95); body = {c:[0,-.1,0], r:[1,.95,.95]}; sph(g,C,body.c,body.r); spot(body,-.64,.36,.17); spot(body,.64,.36,.17); spot(body,-.6,-.48,.17); spot(body,.6,-.48,.17); face(body,{y:-.02}); }
      else if(stg===2){
        legs2(INKHEX,.3,-.72,-1.15,.09,INKHEX);
        [-1,1].forEach(sg => shell(sg*.34,-.25,-.4,.42,.72,0,sg*.3));
        sph(g,C,[0,-.35,-.05],[.6,.68,.52]); sph(g,"#FFF4D6",[0,-.36,.32],[.4,.52,.22],{ol:0});
        armT(INKHEX,[.5,-.15,.05],[.85,-.45,.28],.07,INKHEX,.1);
        body = {c:[0,.5,.1], r:[.5,.45,.45]}; sph(g,C,body.c,body.r);
        add(g, CONE, M(dk(C,.45)), [0,1.08,.28], [.13,.5,.13], [.45,0,0]);
        ant(.85,INKHEX,.22);
        face(body,{y:.46, s:.66});
      } else {
        [-1,1].forEach(sg => sph(g,"#E9FBFF",[sg*1.1,.55,-.6],[.35,1.05,.04],{m:glassM.m, ol:.02, rot:[0,0,sg*.9]}));
        [-1,1].forEach(sg => shell(sg*.78,.25,-.42,.45,.9,sg*.6,sg*.45));
        legs2(dk(C,.45),.36,-.7,-1.2,.13,INKHEX);
        [-1,1].forEach(sg => sph(g,gold,[sg*.38,-.92,.12],[.14,.14,.14],goldM));
        sph(g,C,[0,-.18,0],[.7,.78,.58]); sph(g,dk(C,.35),[0,-.1,.35],[.5,.55,.26]); gem(g,gold,[0,-.05,.6],[.12,.16,.06]);
        armT(dk(C,.45),[.6,.1,.05],[1.0,-.35,.35],.11,INKHEX,.15);
        add(g, CYL, M(gold,goldM.m), [1.02,.1,.4], [.05,2.3,.05], [0,0,.12]); add(g, CONE, M("#E9FBFF",{metalness:.5, roughness:.2}), [.88,1.3,.4], [.1,.35,.1], [0,0,.12]);
        body = {c:[0,.72,.12], r:[.44,.42,.42]}; sph(g,C,body.c,body.r);
        add(g, CONE, M(dk(C,.5)), [0,1.3,.38], [.15,.62,.15], [.5,0,0]);
        [-1,1].forEach(sg => add(g, CONE, M(dk(C,.5)), [sg*.3,1.05,.22], [.07,.25,.07], [.3,0,-sg*.6]));
        crown([0,1.12,-.12],.6);
        face(body,{y:.68, s:.6, brows:true});
      }
    }
    /* 5 · Cósmico — estrellita → cometa caminante → caballero estelar */
    else if(t===5){
      const suit = "#3A3F9E";
      if(stg===1){ extr(g, starShape(1.2,.56), .3, C, [0,0,0]); twinkle(g,[1.3,1.05,0]); twinkle(g,[-1.3,.8,0],.09); face({flat:.27},{y:-.02, s:.85}); }
      else if(stg===2){
        [["#FFD84D",.0],["#FF8FA3",.18],["#8AF0E4",-.18]].forEach(([col,dz]) => tube(g,[[0,.55,-.2+dz*.3],[-.5,.35,-.6+dz],[-1.1,-.05,-.8+dz],[-1.55,-.5,-.7+dz]],.09,col,{m:{emissive:col, emissiveIntensity:.25}}));
        legs2(suit,.26,-.72,-1.15,.1,gold);
        sph(g,suit,[0,-.45,0],[.42,.45,.36]); extr(g, starShape(.18,.08), .05, gold, [0,-.4,.38], [1,1,1], [0,0,0], {ol:.02});
        armT(suit,[.38,-.3,0],[.72,-.62,.25],.08,gold,.12);
        extr(g, starShape(.95,.45), .28, C, [0,.48,0]);
        twinkle(g,[1.1,1.0,0],.1); twinkle(g,[-.9,1.2,.2],.08);
        face({flat:.62},{y:.44, s:.72});
      } else {
        const r = orbit(.3,.5,.4); add(r, O(new T3.TorusGeometry(1.75,.025,8,80)), M(gold,{emissive:"#FFB703", emissiveIntensity:.5}), [0,0,0], [1,1,1], [Math.PI/2,0,0], 0);
        sph(r,"#FF8C42",[1.75,0,0],[.2,.2,.2]); sph(r,"#8AF0E4",[-1.75,0,0],[.14,.14,.14]);
        add(g, O(new T3.ConeGeometry(.95,1.8,28,1,true)), M("#2A1F66",{side:T3.DoubleSide, emissive:"#3A2A9A", emissiveIntensity:.2}), [0,-.35,-.32], [1,1,.6], [0,0,0], .03);
        legs2(suit,.32,-.72,-1.2,.13,gold);
        sph(g,suit,[0,-.28,0],[.6,.62,.46]); extr(g, starShape(.28,.13), .06, gold, [0,-.2,.46], [1,1,1], [0,0,0], {ol:.02});
        [-1,1].forEach(sg => sph(g,gold,[sg*.6,.18,0],[.28,.2,.28],goldM));
        armT(suit,[.62,.05,0],[.95,-.5,.35],.1,gold,.14);
        extr(g, starShape(.55,.26), .12, gold, [-1.0,-.35,.45], [1,1,1], [0,.45,0], {m:goldM.m});
        add(g, O(new T3.TorusGeometry(1.15,.045,8,56)), M(gold,{emissive:"#FFB703", emissiveIntensity:.5}), [0,.9,-.3], [1,1,1], [0,0,0], 0);
        extr(g, starShape(1.02,.48), .3, C, [0,.9,0]);
        face({flat:.3},{y:.86, s:.78});
      }
    }
    /* 6 · Panal — abejita hexagonal → abeja guardiana → reina de la colmena */
    else if(t===6){
      const wing = (x,y,sx,sy,rz) => sph(g,"#EAF8FF",[x,y,-.4],[sx,sy,.05],{m:glassM.m, ol:.02, rot:[0,0,rz]});
      const ant = (y0, tip, sp=.2) => [-1,1].forEach(sg => { tube(g,[[sg*sp,y0,.05],[sg*(sp+.12),y0+.3,0],[sg*(sp+.28),y0+.5,-.05]],.04,INKHEX,{ol:0}); sph(g,tip,[sg*(sp+.28),y0+.53,-.05],[.11,.11,.11]); });
      const abdomen = (pos, s, rings) => { sph(g,"#FFB703",pos,[.5*s,.52*s,.62*s]); rings.forEach(z => add(g, O(new T3.TorusGeometry(.47*s,.06*s,8,28)), M(INKHEX), [pos[0],pos[1],pos[2]+z*s], [1,1,.7], [0,0,0], 0)); add(g, CONE, M(INKHEX), [pos[0],pos[1]-.05*s,pos[2]-.66*s], [.1*s,.3*s,.1*s], [-Math.PI/2,0,0], 0); };
      if(stg===1){ feet(C,-1.12,.35); [-1,1].forEach(sg => wing(sg*.72,1.0,.55,.28,sg*-.45)); ant(.85,"#FFB703",.25); arms(C,-.1,1.0); extr(g, hexShape(1.0), .45, C, [0,-.05,0]); add(g, BOX, M("#FFB703",{roughness:.3}), [0,-.55,.335], [.95,.13,.03], [0,0,0], .02); face({flat:.33},{y:.08, s:.95}); }
      else if(stg===2){
        abdomen([0,-.55,-.45],1,[.08,-.18]);
        [-1,1].forEach(sg => { wing(sg*.6,.5,.62,.3,sg*-.5); wing(sg*.55,.12,.42,.2,sg*-.15); });
        legs2(INKHEX,.25,-.78,-1.15,.08,C);
        extr(g, hexShape(.62), .4, C, [0,-.25,0]); add(g, BOX, M("#FFB703",{roughness:.3}), [0,-.45,.33], [.62,.1,.03], [0,0,0], .02);
        armT(INKHEX,[.5,-.12,0],[.82,-.45,.25],.07,C,.12);
        extr(g, hexShape(.3), .12, "#FFB703", [-.95,-.45,.32], [1,1,1], [0,.35,0], {ol:.03});
        ant(.95,"#FFB703");
        body = {c:[0,.62,.05], r:[.48,.44,.44]}; sph(g,C,body.c,body.r);
        face(body,{y:.6, s:.66});
      } else {
        const o = orbit(0,.6,.25); for(let i=0;i<6;i++){ const a = i/6*Math.PI*2; extr(o, hexShape(.18), .08, "#FFB703", [Math.cos(a)*1.75, Math.sin(a*2)*.25, Math.sin(a)*1.75], [1,1,1], [0,0,0], {ol:.02}); }
        abdomen([0,-.55,-.55],1.35,[.1,-.15,-.4]);
        [-1,1].forEach(sg => { wing(sg*.85,.72,.85,.38,sg*-.55); wing(sg*.78,.18,.6,.26,sg*-.15); });
        legs2(INKHEX,.3,-.72,-1.2,.1,gold);
        extr(g, hexShape(.78), .45, C, [0,-.2,0]); extr(g, hexShape(.26), .08, "#FFB703", [0,-.18,.36], [1,1,1], [0,0,0], {ol:.02});
        add(g, O(new T3.TorusGeometry(.42,.09,10,30)), M(gold,goldM.m), [0,.45,0], [1,1,1], [Math.PI/2,0,0], .02);
        armT(INKHEX,[.62,.0,0],[1.02,-.4,.3],.08,C,.12);
        add(g, CYL, M(gold,goldM.m), [1.05,.05,.32], [.045,1.9,.045]); extr(g, hexShape(.2), .1, "#FFB703", [1.05,1.05,.32], [1,1,1], [0,0,0], {ol:.02, m:{emissive:"#FFB703", emissiveIntensity:.35}});
        ant(1.12,gold,.18);
        body = {c:[0,.8,.05], r:[.46,.42,.42]}; sph(g,C,body.c,body.r);
        crown([0,1.25,0],1.05);
        face(body,{y:.78, s:.62});
      }
    }
    /* 7 · Hada — nubecita arcoíris → potrillo de nube → pegaso aurora */
    else if(t===7){
      const rainbow = (c, r0, step, tb) => RB.forEach((col,i) => add(g, O(new T3.TorusGeometry(r0 - i*step, tb, 10, 48, Math.PI)), M(col,{roughness:.35}), c, [1,1,1], [0,0,0], i===0 ? .03 : 0));
      const rbTail = (base, len, up=0) => RB.forEach((col,i) => { const dz = (i-3)*.045; tube(g,[[base[0],base[1],base[2]+dz],[base[0]-len*.45,base[1]+.15+up-i*.03,base[2]+dz*2],[base[0]-len,base[1]-.35-i*.05,base[2]+dz*3]],.045,col,{ol:0}); });
      if(stg===1){ rainbow([0,-.35,-.35],1.3,.11,.06); feet("#FFFFFF",-1.12,.3,.1,.8); cloud([[-.62,-.5,0,.5],[0,-.3,.05,.68],[.62,-.5,0,.5],[0,-.72,.15,.5]]); twinkle(g,[1.35,.9,0],.1); face({c:[0,-.3,.05], r:[.68,.68,.68*.92]},{y:-.28, s:.8}); }
      else if(stg===2){
        rbTail([-.75,-.2,0],.8,.1);
        legs4("#FFFFFF",[.45,-.45],[.2,-.2],-.55,-1.1,.085,C);
        cloud([[-.42,-.28,0,.42],[.05,-.22,0,.48],[.48,-.28,0,.4],[0,-.02,-.1,.34]]);
        [[.55,.28,-.15,.2],[.35,.42,-.2,.18],[.7,.52,-.1,.16]].forEach(([x,y,z,r]) => sph(g,"#FFFFFF",[x,y,z],[r,r,r]));
        rainbow([.62,.58,-.12],.38,.035,.022);
        body = {c:[.78,.3,.22], r:[.42,.4,.4]}; sph(g,"#FFFFFF",body.c,body.r);
        [-1,1].forEach(sg => sph(g,"#FFFFFF",[.78+sg*.24,.66,.12],[.07,.16,.06],{rot:[0,0,-sg*.35]}));
        face(body,{x0:.78, y:.3, s:.58});
      } else {
        const coat = "#F7F2FF";
        sideWing([-.05,.15,.46],2.0,RB,7); sideWing([-.05,.15,-.46],2.0,RB,7);
        rbTail([-.95,-.1,0],1.0,.2);
        legs4(coat,[.62,-.62],[.22,-.22],-.45,-1.12,.1,gold);
        sph(g,coat,[0,-.2,0],[.98,.46,.44]);
        tube(g,[[.62,-.08,0],[.85,.25,.05],[.98,.52,.1]],.22,coat);
        RB.forEach((col,i) => sph(g,col,[.7+i*.05,.02+i*.08,-.18],[.08,.18,.06],{ol:.015, rot:[0,0,.6]}));
        body = {c:[1.05,.66,.22], r:[.38,.36,.36]}; sph(g,coat,body.c,body.r);
        add(g, CONE, M(gold,{metalness:.4, roughness:.2, emissive:"#FFB703", emissiveIntensity:.2}), [1.05,1.1,.32], [.07,.34,.07], [.35,0,0], .03);
        [-1,1].forEach(sg => sph(g,coat,[1.05+sg*.24,.98,.12],[.07,.15,.05],{rot:[0,0,-sg*.35]}));
        add(g, O(new T3.TorusGeometry(.3,.04,8,28)), M(gold,{emissive:"#FFB703", emissiveIntensity:.6}), [1.05,1.45,.2], [1,1,1], [Math.PI/2,0,0], .02);
        face(body,{x0:1.05, y:.64, s:.56});
      }
    }
    /* 8 · Agua — pulpito → marinero de 8 brazos → kraken rey */
    else if(t===8){
      const tentacles = (baseR, y, len, r, n=8, a0=Math.PI/8) => { for(let i=0;i<n;i++){ const a = i/n*Math.PI*2 + a0; const pv = new T3.Group(); pv.position.set(Math.cos(a)*baseR, y, Math.sin(a)*baseR); pv.rotation.y = -a; g.add(pv); tube(pv, [[0,0,0],[.3*len,-.35*len,0],[.5*len,-.78*len,0],[.42*len,-1.02*len,0],[.26*len,-.98*len,0]], r, C); pv.userData.wave = i; anim.wave.push(pv); } };
      if(stg===1){ tentacles(.55,-.4,1,.13); body = {c:[0,.3,0], r:[1,.95,.95]}; sph(g,C,body.c,body.r); sph(g,"#FFFFFF",[-.42,.85,.5],[.16,.1,.05],{m:{transparent:true, opacity:.6}, ol:0, rot:[0,-.4,.5]}); bubble([1.2,1.1,0],.12); bubble([1.35,1.45,0],.07); face(body,{y:.28}); }
      else if(stg===2){
        tentacles(.35,-.55,.85,.13,4,Math.PI/4);
        [-1,1].forEach(sg => { tube(g,[[sg*.62,-.05,.1],[sg*1.0,-.28,.3],[sg*1.18,.05,.35],[sg*1.05,.28,.3]],.11,C); tube(g,[[sg*.55,-.32,.2],[sg*.9,-.62,.38],[sg*.82,-.88,.48]],.1,C); });
        body = {c:[0,.4,0], r:[.82,.95,.78]}; sph(g,C,body.c,body.r);
        [-1,1].forEach(sg => sph(g,C,[sg*.8,.7,-.1],[.18,.32,.1],{rot:[0,0,sg*-.6]}));
        add(g, CYL, M("#FFFFFF"), [0,1.42,0], [.5,.22,.5]); add(g, CYL, M("#1C7FD6"), [0,1.34,0], [.52,.07,.52], [0,0,0], 0); add(g, CYL, M("#FFFFFF"), [0,1.26,0], [.66,.05,.66]);
        const iron = M("#8A93B8",{metalness:.6, roughness:.3});
        add(g, CYL, iron, [1.08,-.15,.4], [.05,.8,.05]); add(g, O(new T3.TorusGeometry(.26,.05,8,20,Math.PI)), iron, [1.08,-.45,.4], [1,1,1], [0,0,Math.PI], .02); add(g, BOX, iron, [1.08,.12,.4], [.3,.06,.06]); add(g, O(new T3.TorusGeometry(.07,.025,8,16)), iron, [1.08,.3,.4]);
        bubble([-1.1,1.1,0],.1);
        face(body,{y:.35, s:.9});
      } else {
        const tent = (a, up, len, r) => { const pv = new T3.Group(); pv.position.set(Math.cos(a)*.62, -.3, Math.sin(a)*.62); pv.rotation.y = -a; g.add(pv); const pts = up ? [[0,0,0],[.5*len,.2*len,0],[.9*len,.7*len,0],[.8*len,1.1*len,0],[.55*len,1.05*len,0]] : [[0,0,0],[.45*len,-.35*len,0],[.85*len,-.6*len,0],[1.05*len,-.45*len,0],[.95*len,-.28*len,0]]; tube(pv, pts, r, C); pv.userData.wave = a*3; anim.wave.push(pv); };
        for(let i=0;i<8;i++){ const a = i/8*Math.PI*2 + Math.PI/8; const back = Math.sin(a) < -.2; tent(a, back, back ? 1.0 : 1.05, .16); }
        body = {c:[0,.62,-.05], r:[.9,1.1,.85]}; sph(g,C,body.c,body.r);
        [-1,1].forEach(sg => sph(g,C,[sg*.75,1.3,-.15],[.35,.25,.08],{rot:[0,0,sg*-.5]}));
        crown([0,1.72,-.05],1.05);
        const gd = M(gold,goldM.m);
        add(g, CYL, gd, [1.45,-.05,.45], [.055,2.5,.055]); add(g, BOX, gd, [1.45,1.0,.45], [.5,.07,.07]); [-.22,0,.22].forEach(dx => add(g, CONE, gd, [1.45+dx, dx===0?1.28:1.16, .45], [.06,.26,.06], [0,0,0], .03));
        const sw = orbit(-.6,1.5,.15); add(sw, O(new T3.TorusGeometry(1.75,.05,8,64,Math.PI*1.4)), M("#8FD8FF",{transparent:true, opacity:.8, emissive:"#36B5E8", emissiveIntensity:.3}), [0,0,0], [1,1,1], [Math.PI/2,0,0], 0);
        bubble([-1.3,1.3,0],.12); bubble([-1.5,1.7,0],.08);
        face(body,{y:.6, s:1.0, brows:true});
      }
    }
    /* 9 · Sombra — gatito → gato mago → pantera de las 9 vidas */
    else if(t===9){
      const ears = (x0, y, sp, sc=1, z=0) => [-1,1].forEach(sg => { add(g, CONE, M(C), [x0+sg*sp,y,z], [.3*sc,.6*sc,.24*sc], [0,0,-sg*.35]); add(g, CONE, M("#FFB3C1"), [x0+sg*sp*.98,y-.05*sc,z+.11], [.16*sc,.36*sc,.07], [0,0,-sg*.35], 0); });
      const whisk = (b, x0, y, s=1) => [-1,1].forEach(sg => [0,1].forEach(j => { const p = onBody(b, x0+sg*.4*s, y - j*.08*s); add(p, CYL, M(INKHEX), [sg*.16*s,0,0], [.01,.36*s,.01], [0,0,Math.PI/2 + sg*(j?-.12:.12)], 0); }));
      if(stg===1){ tube(g,[[.6,-.6,-.6],[1.3,-.5,-.7],[1.5,.1,-.5],[1.3,.45,-.4]],.12,C); feet(C); ears(0,.78,.55); body = {c:[0,-.1,0], r:[1,.9,.9]}; sph(g,C,body.c,body.r); face(body,{y:-.05}); [-1,1].forEach(sg => [0,1].forEach(j => { const p = onBody(body, sg*.62, -.2 - j*.12); add(p, CYL, M(INKHEX), [sg*.18,0,0], [.012,.42,.012], [0,0,Math.PI/2 + sg*(j?-.12:.12)], 0); })); }
      else if(stg===2){
        const purple = "#4B3F8F";
        add(g, O(new T3.ConeGeometry(.8,1.5,28,1,true)), M(purple,{side:T3.DoubleSide}), [0,-.45,-.22], [1,1,.8], [0,0,0], .03);
        tube(g,[[.3,-.75,-.4],[.9,-.85,-.7],[1.2,-.3,-.7],[1.0,.1,-.6]],.08,C);
        legs2(C,.24,-.8,-1.15,.1);
        sph(g,C,[0,-.42,0],[.45,.52,.4]);
        armT(C,[.4,-.2,0],[.78,-.5,.28],.08);
        const wood = M("#6B4A2B",{roughness:.7});
        add(g, CYL, wood, [.82,-.2,.3], [.045,1.9,.045]); const mp = new T3.Group(); mp.position.set(.82,.85,.3); g.add(mp); add(mp, O(new T3.TorusGeometry(.2,.06,8,20,Math.PI*1.35)), M(gold,{emissive:"#FFB703", emissiveIntensity:.45}), [0,0,0], [1,1,1], [0,0,-.4], .02);
        ears(0,.8,.36,.8);
        body = {c:[0,.4,.05], r:[.56,.5,.5]}; sph(g,C,body.c,body.r);
        add(g, CONE, M(purple), [.1,1.3,-.02], [.45,.85,.45], [0,0,-.25]); add(g, CYL, M(purple), [.04,.86,0], [.68,.04,.68], [0,0,-.2]); twinkle(g,[.3,1.72,0],.09);
        face(body,{y:.38, s:.72}); whisk(body,0,.25,.9);
      } else {
        const fur = mixHex(C,"#4B3F8F",.45), purple = "#2E2663";
        const o = orbit(.45,.7,.35); for(let i=0;i<9;i++){ const a = i/9*Math.PI*2; sph(o,"#D6C8FF",[Math.cos(a)*1.75,0,Math.sin(a)*1.75],[.12,.12,.12],{m:{emissive:"#8E7CFF", emissiveIntensity:.7, roughness:.2}, ol:.025}); }
        tube(g,[[-1.0,-.1,0],[-1.5,.1,-.1],[-1.6,.6,-.1],[-1.35,.9,-.05]],.09,fur); sph(g,"#D6C8FF",[-1.35,.95,-.05],[.13,.13,.13],{m:{emissive:"#8E7CFF", emissiveIntensity:.7}});
        legs4(fur,[.65,-.62],[.24,-.24],-.45,-1.12,.12,purple);
        sph(g,fur,[0,-.2,0],[1.1,.5,.48]);
        [[.72,.05,0,.3],[.66,-.15,.14,.26],[.66,-.15,-.14,.26]].forEach(([x,y,z,r]) => sph(g,"#8E7CFF",[x,y,z],[r,r,r],{m:{roughness:.7}}));
        add(g, O(new T3.TorusGeometry(.36,.06,8,28)), M(gold,goldM.m), [.85,.1,.05], [1,1,1], [Math.PI/2,.4,0], .02);
        ears(1.12,.88,.26,1.0,.1);
        body = {c:[1.12,.35,.15], r:[.46,.42,.42]}; sph(g,fur,body.c,body.r);
        const mp = onBody(body, 1.12, .66); add(mp, O(new T3.TorusGeometry(.1,.035,8,18,Math.PI*1.3)), M(gold,{emissive:"#FFB703", emissiveIntensity:.5}), [0,0,.02], [1,1,1], [0,0,-.6], .02);
        face(body,{x0:1.12, y:.33, s:.62, brows:true}); whisk(body,1.12,.2,.8);
      }
    }
    /* 10 · Acero — robotito → androide volador → mecha titán */
    else {
      const bodyM = {m:{metalness:.35, roughness:.35}}, metal = "#A9B0DA", mo = {m:{metalness:.55, roughness:.3}};
      const screenO = {m:{emissive:"#7FE3FF", emissiveIntensity:.3, roughness:.2}, ol:.03};
      const lights = (pts) => pts.forEach(([x,y,z],i) => add(g, SPH, M(i%3 ? "#FFC23C" : "#3DE0C8",{emissive:i%3 ? "#FFB703" : "#1FD1B5", emissiveIntensity:.8}), [x,y,z], [.05,.05,.03], [0,0,0], .015));
      const jet = (x, y, s, z=0) => { const f = lathe(g, FLAME, "#FF8C1A", [x,y,z], [s,s,s], {rot:[Math.PI,0,0], m:{emissive:"#FF5A00", emissiveIntensity:.5}, ol:.03}); f.userData.sy = s; anim.flick.push(f); };
      if(stg===1){
        [-1,1].forEach(sg => rbox(g,.36,.2,.42,metal,[sg*.35,-1.3,.05],mo));
        rbox(g,1.1,.62,.8,C,[0,-.86,0],bodyM);
        const L=[]; for(let i=0;i<10;i++) L.push([-.36+(i%5)*.18, i<5?-.78:-.95, .42]); lights(L);
        [-1,1].forEach(sg => add(g, CYL, M(metal,{metalness:.55, roughness:.3}), [sg*.95,.3,0], [.18,.12,.18], [0,0,Math.PI/2]));
        rbox(g,1.75,1.35,1.1,C,[0,.3,0],bodyM); rbox(g,1.35,.95,.12,"#CFF4FF",[0,.3,.53],screenO);
        add(g, CYL, M(INKHEX), [0,1.15,0], [.035,.35,.035], [0,0,0], 0); sph(g,"#FF5A5F",[0,1.36,0],[.12,.12,.12],{m:{emissive:"#FF2A2A", emissiveIntensity:.3}});
        face({flat:.6},{y:.35, s:.82});
      } else if(stg===2){
        rbox(g,.7,.8,.35,metal,[0,-.25,-.52],mo); jet(-.2,-.82,.2,-.52); jet(.2,-.82,.2,-.52);
        [-1,1].forEach(sg => { rbox(g,.28,.62,.32,metal,[sg*.28,-.98,0],mo); rbox(g,.36,.18,.5,C,[sg*.3,-1.34,.08],bodyM); });
        rbox(g,1.05,.85,.7,C,[0,-.25,0],bodyM);
        const L=[]; for(let i=0;i<10;i++) L.push([-.4+i*.089,-.4,.36]); lights(L);
        [-1,1].forEach(sg => { sph(g,metal,[sg*.66,.08,0],[.2,.2,.2],mo); rbox(g,.24,.62,.28,metal,[sg*.75,-.35,.02],mo); sph(g,C,[sg*.76,-.72,.05],[.15,.13,.15],bodyM); });
        rbox(g,.82,.66,.62,C,[0,.55,0],bodyM); rbox(g,.62,.4,.08,"#CFF4FF",[0,.56,.31],screenO);
        [[-1,"#FF5A5F"],[1,"#FFC23C"]].forEach(([sg,col]) => { add(g, CYL, M(INKHEX), [sg*.28,1.0,0], [.025,.25,.025], [0,0,-sg*.3], 0); sph(g,col,[sg*.33,1.14,0],[.08,.08,.08]); });
        face({flat:.36},{y:.57, s:.58});
      } else {
        jet(-.42,-1.78,.4); jet(.42,-1.78,.4);
        [-1,1].forEach(sg => { rbox(g,.5,.18,.95,"#8A93B8",[sg*.9,.55,-.55],{rot:[0,0,sg*-.5], m:mo.m}); rbox(g,.42,.82,.46,metal,[sg*.42,-1.1,0],mo); sph(g,gold,[sg*.42,-.9,.26],[.14,.14,.1],goldM); rbox(g,.5,.22,.62,C,[sg*.44,-1.55,.1],bodyM); });
        rbox(g,1.5,1.05,.9,C,[0,-.25,0],bodyM);
        [-1,1].forEach(sg => rbox(g,.5,.38,.12,gold,[sg*.38,-.02,.46],goldM));
        sph(g,"#3DE0C8",[0,-.38,.48],[.17,.17,.08],{m:{emissive:"#1FD1B5", emissiveIntensity:.9}});
        const L=[]; for(let i=0;i<10;i++){ const a = -Math.PI/2 + i/10*Math.PI*2; L.push([Math.cos(a)*.32, -.38+Math.sin(a)*.32, .49]); } lights(L);
        [-1,1].forEach(sg => { rbox(g,.62,.36,.72,gold,[sg*.95,.36,0],goldM); rbox(g,.36,.85,.42,metal,[sg*1.02,-.35,0],mo); rbox(g,.42,.34,.46,C,[sg*1.02,-.9,.04],bodyM); });
        rbox(g,.72,.58,.62,C,[0,.62,.05],bodyM); rbox(g,.54,.3,.08,"#CFF4FF",[0,.6,.37],screenO);
        [-1,1].forEach(sg => add(g, CONE, M(gold,goldM.m), [sg*.22,1.05,.2], [.07,.38,.05], [0,0,-sg*.75], .025));
        sph(g,"#FF5A5F",[0,.92,.33],[.06,.06,.04],{m:{emissive:"#FF2A2A", emissiveIntensity:.5}});
        face({flat:.42},{y:.61, s:.5});
      }
    }

    }
    // normalize size & position
    const box = new T3.Box3().setFromObject(g), size = box.getSize(new T3.Vector3()), ctr = box.getCenter(new T3.Vector3());
    const target = isX(t) ? (t==="x6" || t==="x13" ? 2.95 : 2.5) : [2.15, 1.95, 2.55, 3.05][stg];
    const k = Math.min(target/size.y, (stg===3 ? 3.4 : 3.1)/Math.max(size.x, size.z*.8));
    const rz = g.rotation.z;
    g.scale.setScalar(k); g.position.set(-ctr.x*k, -box.min.y*k - 1.42, -ctr.z*k);
    g.rotation.z = rz;
    const {shadowMat, glowMat} = g3();
    const shadow = new T3.Mesh(PLANE, shadowMat); shadow.rotation.x = -Math.PI/2; shadow.position.y = -1.44; shadow.scale.set(Math.min(3, size.x*k*.9), Math.min(1.6, size.z*k*.9 + .4), 1); root.add(shadow);
    if(stg===3){
      const glow = new T3.Mesh(PLANE, glowMat); glow.position.set(0, .1, -1.6); glow.scale.set(3.7, 3.7, 1); root.add(glow);
      const o = new T3.Group(); o.userData.spin = .9; anim.spin.push(o); root.add(o);
      [[1.75,.9,0],[-1.8,.5,.3],[1.6,-.8,-.4],[-1.5,-1.0,.2]].forEach(p => twinkle(o, p, .13));
    }
    return {root, g, shadow, own, anim};
  }

  /* thumbnails (one offscreen renderer) */
  let TR = null; const THUMBS = {};
  function thumb(t, stg, mood, size=260){
    const key = `${t}-${stg}-${mood}-${size}`; if(THUMBS[key]) return THUMBS[key];
    if(!TR){ const r = new T3.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer:true}); r.setPixelRatio(1); r.setSize(260,260,false); const sc = new T3.Scene(); addLights(sc); const cam = new T3.PerspectiveCamera(30,1,.1,100); cam.position.set(0,.35,6.7); cam.lookAt(0,.05,0); TR = {r, sc, cam}; }
    TR.r.setSize(size, size, false);
    const b = build3D(t, stg, mood); b.root.rotation.y = -.42; TR.sc.add(b.root); TR.r.render(TR.sc, TR.cam);
    const url = TR.r.domElement.toDataURL("image/png"); TR.sc.remove(b.root); b.own.forEach(x => x.dispose());
    THUMBS[key] = url; return url;
  }

  /* live creature (one shared canvas) */

  /* ---------- progreso compartido ---------- */
  const TABLAS_KEY = "misionTablas.v1", MUNDO_KEY = "mundoCriaturas.v1";
  const readJSON = k => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e){ return null; } };
  function tablas(){
    const S = readJSON(TABLAS_KEY) || {};
    const t = {}; for(let i=1;i<=10;i++){ const d = (S.t && S.t[i]) || {}; t[i] = {s: Array.isArray(d.s) ? d.s.map(n => +n || 0) : [0,0,0,0], dip: d.dip || null, best: d.best || 0}; }
    return {name: S.name || "", t, x: S.x || {}, medals: S.medals || 0, sound: S.sound !== false};
  }
  function stage(t, S){ S = S || tablas(); if(isX(t)) return S.x[t] ? 1 : 0; const d = S.t[t]; return d.dip ? 3 : d.s[2]>0 && d.s[0]>0 ? 2 : d.s[0]>0 ? 1 : 0; }
  function owned(S){ S = S || tablas(); const out = []; for(let t=1;t<=10;t++){ const k = stage(t,S); if(k) out.push({t, stg:k, name:MASCOT[t].names[k-1]}); } EXTRA_IDS.forEach(t => { if(S.x[t]) out.push({t, stg:1, name:MASCOT[t].names[0]}); }); return out; }

  /* Monedas: cada estrella = 1, cada diploma = 5, cada medalla de la arena = 3.
     Para sumar un juego nuevo, agregá una fuente a SOURCES. */
  const SOURCES = [
    {id:"tablas", name:"Misión Tablas", calc(){ const S = tablas(); let n = 0; for(let i=1;i<=10;i++){ n += S.t[i].s.reduce((a,b)=>a+Math.min(3,b),0) + (S.t[i].dip ? 5 : 0); } return n + EXTRA_IDS.filter(t => S.x[t]).length*3; }}
  ];
  const TEACHER = !!window.__DOCENTE || /(^|[#&])docente\b/.test(location.hash);
  function mundo(){ const m = readJSON(MUNDO_KEY) || {}; return Object.assign({spent:0, best:{}, runs:0, fav:null}, m); }
  function saveMundo(m){ try { localStorage.setItem(MUNDO_KEY, JSON.stringify(m)); } catch(e){} }
  function earned(){ return SOURCES.reduce((a, s) => a + (s.calc() || 0), 0); }
  function coins(){ return TEACHER ? 99 : Math.max(0, earned() - mundo().spent); }
  function spend(n=1){ if(TEACHER) return true; if(coins() < n) return false; const m = mundo(); m.spent += n; saveMundo(m); return true; }

  /* animación básica: parpadeo y partes que se mueven */
  function animate(c, time, dt){
    if(!c.nextBlink) c.nextBlink = time + 1 + Math.random()*2;
    if(time >= c.nextBlink){ c.blinkT0 = time; c.nextBlink = time + (Math.random() < .25 ? .3 : 2.2 + Math.random()*3.2); }
    const bp = c.blinkT0 ? (time - c.blinkT0)/.16 : 2; const bs = bp < 1 ? 1 - Math.sin(bp*Math.PI)*.92 : 1;
    c.anim.blink.forEach(o => o.scale.y = bs);
    c.anim.spin.forEach(o => o.rotation.y += dt*(o.userData.spin||1));
    c.anim.wave.forEach(o => o.rotation.z = Math.sin(time*2.4 + o.userData.wave)*.14);
    c.anim.flick.forEach(o => o.scale.y = o.userData.sy*(1 + Math.sin(time*11 + o.id)*.08));
    c.anim.bob.forEach(o => o.position.y = o.userData.y0 + Math.sin(time*1.5 + o.userData.ph)*.1);
  }

  window.Criaturas = {HAS3D, COLORS, MASCOT, EXTRA_IDS, isX, mixHex, build3D, addLights, thumb, animate, g3,
    tablas, stage, owned, SOURCES, earned, coins, spend, mundo, saveMundo, TEACHER,
    STAGE_LABEL:["Huevo","Bebé","Evolución","Súper evolución"]};
})();
