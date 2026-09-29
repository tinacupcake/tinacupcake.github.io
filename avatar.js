/* Mundo de Criaturas — Guardián/a (avatar 3D estilo dibujo animado) compartido por todos los juegos.
   Requiere three.js r128 (window.THREE). Pies en y = 0, mirando hacia +z. */
(function(){
  const T = window.THREE; if(!T) return;
  const INK = "#1D2356";
  const MUNDO_KEY = "mundoCriaturas.v1", TABLAS_KEY = "misionTablas.v1";
  const COLS = ["#FF5A5F","#FF8C42","#FFC23C","#8AC926","#1FB8A8","#4F7BE8","#6A4C93","#FF7EB6","#F4F6FF","#2D3047"];
  const o = (id, label) => ({id, label});

  const OPTS = {
    skin: ["#FFE6D2","#FFD8BC","#F8CBA6","#EDB78F","#E4AE84","#D39A6E","#C98D62","#AE744D","#9C6242","#7E4E33","#6B4128","#4E2F1E"],
    hair: [o("corto","Corto"),o("puntas","Despeinado"),o("ladeado","De costado"),o("jopo","Jopo"),o("flequillo","Cerquillo"),o("cresta","Cresta"),o("rulos","Rulos cortos"),o("afroCorto","Afro corto"),o("rapado","Rapado"),
           o("largo","Largo"),o("largoFlequillo","Largo con flequillo"),o("bob","Melena"),o("cola","Cola de caballo"),o("colitas","Colitas"),o("trenzas","Trenzas"),o("rodete","Rodete"),o("rulosLargos","Rulos largos"),o("afro","Afro")],
    hairC: ["#1E1826","#3B2A20","#5A3A24","#7A4E2D","#A0673A","#E3B04B","#F2D27A","#D9622B","#B93A32","#9AA3B5","#5B6EE8","#FF7EB6","#A2E3D0","#9B6CF0"],
    eyes: [o("redondos","Redondos"),o("grandes","Brillantes"),o("pestanas","Pestañas largas"),o("dormilon","Dormilones"),o("felices","Felices"),o("guino","Guiño")],
    brows: [o("normales","Normales"),o("gruesas","Gruesas"),o("finitas","Finitas"),o("arco","Sorprendidas")],
    mouth: [o("sonrisa","Sonrisa"),o("abierta","Riendo"),o("dientito","Con dientito"),o("lengua","Lengua afuera"),o("sorpresa","Sorpresa")],
    freckles: [o("nada","Nada"),o("nariz","Pecas en la nariz"),o("mejillas","Pecas en las mejillas"),o("lunar","Lunar")],
    mark: [o("nada","Nada"),o("curita","Curita"),o("cicatriz","Cicatriz"),o("estrella","Tatuaje de estrella"),o("corazon","Tatuaje de corazón"),o("rayo","Rayo pintado"),o("pintura","Pintura de campeón")],
    glasses: [o("nada","Nada"),o("redondos","Redondos"),o("cuadrados","Cuadrados"),o("sol","De sol"),o("estrella","De estrella")],
    earrings: [o("nada","Nada"),o("aritos","Aritos"),o("argollas","Argollas"),o("perlas","Perlas"),o("estrellas","Estrellitas")],
    tattoo: [o("nada","Nada"),o("estrella","Estrella"),o("corazon","Corazón"),o("rayo","Rayo"),o("ancla","Ancla"),o("flor","Flor")],
    top: [o("camisa","Camisa abierta"),o("remera","Remera"),o("chomba","Chomba"),o("blusa","Blusa con cuellito"),o("buzo","Buzo con capucha"),o("campera","Campera"),o("jardinero","Jardinero"),o("jumper","Jumper"),o("vestido","Vestido")],
    pattern: [o("liso","Liso"),o("rayas","Rayas"),o("cuadros","Cuadros"),o("lunares","Lunares"),o("estrellas","Estrellas"),o("corazones","Corazones")],
    topC: COLS,
    bottom: [o("short","Short"),o("bermuda","Bermuda"),o("pantalon","Pantalón"),o("pollera","Pollera"),o("calzas","Calzas")],
    bottomC: ["#35418F","#4F7BE8","#8A5A3B","#2D3047","#1FB8A8","#FF7EB6","#C9B79C","#6A4C93","#8AC926","#FF5A5F"],
    shoe: [o("zapatillas","Zapatillas"),o("botitas","Botitas"),o("guillerminas","Guillerminas")],
    shoeC: ["#4F7BE8","#FF5A5F","#FFC23C","#8AC926","#FF7EB6","#F4F6FF","#2D3047","#6A4C93"],
    hat: [o("nada","Nada"),o("gorra","Gorra"),o("gorraAtras","Gorra para atrás"),o("lana","Gorro de lana"),o("pescador","Piluso"),o("boina","Boina"),o("vincha","Vincha deportiva"),o("mono","Moño"),o("vinchaMono","Vincha con moño"),o("hebillas","Hebillas"),o("tiara","Tiara"),o("flores","Corona de flores"),o("orejas","Vincha de orejitas"),o("antenas","Antenitas"),o("brote","Brote"),o("corona","Corona"),o("mago","Gorro de mago"),o("casco","Casco de explorador"),o("auris","Auriculares")],
    hatC: COLS,
    neck: [o("nada","Nada"),o("bufanda","Bufanda"),o("panuelo","Pañuelo"),o("medalla","Medalla"),o("collar","Collar de perlas")],
    back: [o("nada","Nada"),o("mochila","Mochila"),o("capa","Capa"),o("alas","Alitas")],
    accC: COLS
  };
  // qué opciones tiene cada uno: Guardián (nene) y Guardiana (nena)
  const SETS = {
    nene: {hair:["corto","puntas","ladeado","jopo","flequillo","cresta","rulos","afroCorto","rapado"], eyes:["redondos","grandes","dormilon","felices","guino"], earrings:["nada"],
      top:["camisa","remera","chomba","buzo","campera","jardinero"], pattern:["liso","rayas","cuadros","estrellas"], bottom:["short","bermuda","pantalon"], shoe:["zapatillas","botitas"],
      hat:["nada","gorra","gorraAtras","lana","pescador","vincha","casco","mago","corona","antenas","brote","auris"], neck:["nada","bufanda","panuelo","medalla"], back:["nada","mochila","capa"]},
    nena: {hair:["largo","largoFlequillo","bob","cola","colitas","trenzas","rodete","rulosLargos","afro"], eyes:["redondos","grandes","pestanas","dormilon","felices","guino"],
      top:["blusa","remera","vestido","jumper","buzo","campera"], pattern:["liso","rayas","lunares","estrellas","corazones"], bottom:["pollera","short","calzas","pantalon"], shoe:["guillerminas","zapatillas","botitas"],
      hat:["nada","mono","vinchaMono","hebillas","tiara","flores","orejas","lana","pescador","boina","antenas","brote","auris"], back:["nada","mochila","capa","alas"]}
  };
  const genderOf = title => title === "Guardiana" ? "nena" : "nene";
  const optsFor = (gen, key) => { const ids = (SETS[gen] || {})[key]; const all = OPTS[key]; if(!ids || typeof all[0] === "string") return all; return ids.map(id => all.find(x => x.id === id)).filter(Boolean); };
  const BASE = {skin:"#F8CBA6", hairC:"#5A3A24", brows:"normales", mouth:"sonrisa", freckles:"nada", mark:"nada", glasses:"nada", earrings:"nada", tattoo:"nada", pattern:"liso", hatC:"#FFC23C", neck:"nada", back:"nada", accC:"#FF5A5F"};
  const DEFAULTS = {
    nene: Object.assign({}, BASE, {g:"nene", hair:"puntas", eyes:"redondos", top:"camisa", topC:"#4F7BE8", bottom:"short", bottomC:"#35418F", shoe:"zapatillas", shoeC:"#4F7BE8", hat:"nada"}),
    nena: Object.assign({}, BASE, {g:"nena", hair:"colitas", eyes:"pestanas", top:"blusa", topC:"#FF7EB6", bottom:"pollera", bottomC:"#6A4C93", shoe:"guillerminas", shoeC:"#FF5A5F", hat:"nada", earrings:"aritos", accC:"#FF5A5F"})
  };
  const DEFAULT = DEFAULTS.nene;
  const pick = a => a[Math.random()*a.length|0];
  function random(gen="nene"){
    const L = k => optsFor(gen, k), P = k => pick(L(k)), id = k => P(k).id;
    const maybe = (k, p) => { const l = L(k); return l.length > 1 && Math.random() < p ? pick(l.slice(1)).id : l[0].id; };
    return {g:gen, skin:P("skin"), hair:id("hair"), hairC:P("hairC"), eyes:id("eyes"), brows:id("brows"), mouth:id("mouth"), freckles:maybe("freckles",.35), mark:maybe("mark",.2), glasses:maybe("glasses",.2),
      earrings: gen === "nena" ? maybe("earrings",.6) : "nada", tattoo:maybe("tattoo",.15), top:id("top"), pattern:maybe("pattern",.45), topC:P("topC"), bottom:id("bottom"), bottomC:P("bottomC"),
      shoe:id("shoe"), shoeC:P("shoeC"), hat:maybe("hat",.5), hatC:P("hatC"), neck:maybe("neck",.25), back:maybe("back",.2), accC:P("accC")};
  }
  // completa lo que falte y corrige lo que no corresponde (también para personajes guardados antes)
  function normalize(c, gen){
    c = Object.assign({}, c || {});
    if(c.extra){ if(c.extra === "pecas") c.freckles = "nariz"; if(c.extra === "anteojos") c.glasses = "redondos"; if(c.extra === "curita") c.mark = "curita"; delete c.extra; }
    if(c.top === "rayada"){ c.top = "remera"; c.pattern = "rayas"; }
    const g0 = gen || c.g || "nene";
    const out = Object.assign({}, DEFAULTS[g0], c, {g:g0});
    Object.keys(SETS[g0]).forEach(k => { if(!optsFor(g0, k).some(x => x.id === out[k])) out[k] = DEFAULTS[g0][k]; });
    return out;
  }
  const mix = (a, b, k) => { const pa = parseInt(a.slice(1),16), pb = parseInt(b.slice(1),16); const ch = s => Math.round(((pa>>s)&255)*(1-k) + ((pb>>s)&255)*k); return "#" + [16,8,0].map(s => ch(s).toString(16).padStart(2,"0")).join(""); };
  const lum = h => { const n = parseInt(h.slice(1),16); return ((n>>16&255)*.3 + (n>>8&255)*.59 + (n&255)*.11)/255; };

  /* ---------- geometrías, texturas y materiales (sombreado de dibujo animado) ---------- */
  let G = null;
  function g(){
    if(G) return G;
    const mats = {};
    const grad = new T.DataTexture(new Uint8Array([150,150,150,255, 225,225,225,255, 255,255,255,255]), 3, 1, T.RGBAFormat);
    grad.minFilter = grad.magFilter = T.NearestFilter; grad.generateMipmaps = false; grad.needsUpdate = true;
    const canvas = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; return t; };
    const radTex = (inner, outer) => canvas(128, 128, (x) => { const gr = x.createRadialGradient(64,64,0,64,64,64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); x.fillStyle = gr; x.fillRect(0,0,128,128); });
    const starPath = (x, cx, cy, r) => { x.beginPath(); for(let i=0;i<10;i++){ const a = -Math.PI/2 + i*Math.PI/5, rr = i%2 ? r*.45 : r; x.lineTo(cx + Math.cos(a)*rr, cy + Math.sin(a)*rr); } x.closePath(); };
    const shape = pts => { const s = new T.Shape(); pts.forEach(([x,y],i) => i ? s.lineTo(x,y) : s.moveTo(x,y)); s.closePath(); return new T.ShapeGeometry(s); };
    const starG = (() => { const p = []; for(let i=0;i<10;i++){ const a = Math.PI/2 + i*Math.PI/5, r = i%2 ? .42 : 1; p.push([Math.cos(a)*r, Math.sin(a)*r]); } return shape(p); })();
    const heartG = (() => { const s = new T.Shape(); s.moveTo(0,-.9); s.bezierCurveTo(-.2,-.6,-1,-.2,-1,.3); s.bezierCurveTo(-1,.8,-.4,1,0,.55); s.bezierCurveTo(.4,1,1,.8,1,.3); s.bezierCurveTo(1,-.2,.2,-.6,0,-.9); return new T.ShapeGeometry(s); })();
    const boltG = shape([[-.2,1],[.55,1],[.1,.2],[.55,.2],[-.4,-1],[-.05,-.1],[-.5,-.1]]);
    const anchorG = shape([[-.1,1],[.1,1],[.1,-.55],[.6,-.3],[.7,-.45],[0,-1],[-.7,-.45],[-.6,-.3],[-.1,-.55]]);
    G = {
      grad,
      SPH: new T.SphereGeometry(1, 32, 24),
      CAP: new T.SphereGeometry(1, 32, 16, 0, Math.PI*2, 0, Math.PI*.6),
      DOME: new T.SphereGeometry(1, 32, 12, 0, Math.PI*2, 0, Math.PI*.5),
      CYL: new T.CylinderGeometry(1, 1, 1, 24),
      LIMB: new T.CylinderGeometry(1, .88, 1, 20),
      TORSO: new T.CylinderGeometry(.28, .36, .56, 32),
      SHIRT: new T.CylinderGeometry(.305, .385, .5, 32, 1, true, .55, Math.PI*2 - 1.1),
      SKIRT: new T.CylinderGeometry(.33, .52, .34, 28, 1, true),
      SHORTS: new T.CylinderGeometry(.35, .38, .22, 28),
      CAPE: new T.CylinderGeometry(.34, .6, .85, 28, 1, true, Math.PI*.55, Math.PI*.9),
      BRIM: new T.CylinderGeometry(.66, .86, .1, 32, 1, true),
      CONE: new T.ConeGeometry(1, 1, 16),
      BOX: new T.BoxGeometry(1, 1, 1),
      ARC: new T.TorusGeometry(1, .2, 8, 20, Math.PI),
      RING: new T.TorusGeometry(1, .12, 8, 28),
      BAND: new T.TorusGeometry(1, .08, 8, 28, Math.PI),
      FAT: new T.TorusGeometry(1, .32, 12, 32),
      HALF: new T.CircleGeometry(1, 24, Math.PI, Math.PI),
      DISC: new T.CircleGeometry(1, 24),
      PLANE: new T.PlaneGeometry(1, 1),
      STAR: starG, HEART: heartG, BOLT: boltG, ANCHOR: anchorG,
      ink: new T.MeshBasicMaterial({color: INK, side: T.BackSide}),
      inkF: new T.MeshBasicMaterial({color: INK}),
      inkD: new T.MeshBasicMaterial({color: INK, side: T.DoubleSide}),
      white: new T.MeshBasicMaterial({color: 0xffffff}),
      shadowMat: new T.MeshBasicMaterial({map: radTex("rgba(20,24,60,.42)","rgba(20,24,60,0)"), transparent:true, depthWrite:false}),
      M: (hex, op={}, tone=1) => { const k = hex + JSON.stringify(op) + tone; if(!mats[k]){ const p = Object.assign({gradientMap:grad}, op); if(typeof p.emissive === "string") p.emissive = new T.Color(p.emissive); p.color = new T.Color(hex).multiplyScalar(tone); mats[k] = new T.MeshToonMaterial(p); } return mats[k]; },
      // telas con estampado
      fabric: (kind, base, tone=1, side) => {
        const k = "f" + kind + base + tone + (side||""); if(mats[k]) return mats[k];
        const light = lum(base) > .8, dk = mix(base, "#000000", .22);
        const acc = light ? "#4F7BE8" : mix(base, "#FFFFFF", .85);
        let rep = [1,1];
        const t = canvas(64, 64, (x, w, h) => {
          x.fillStyle = base; x.fillRect(0,0,w,h);
          if(kind === "rayas"){ x.fillStyle = light ? "#FF5A5F" : "#FFFFFF"; x.fillRect(0,0,w,16); x.fillRect(0,32,w,16); rep = [1,2]; }
          if(kind === "cuadros"){ x.globalAlpha = .45; x.fillStyle = dk; x.fillRect(0,0,w,22); x.fillRect(0,0,22,h); x.globalAlpha = .6; x.fillStyle = light ? "#4F7BE8" : "#FFFFFF"; x.fillRect(0,38,w,3); x.fillRect(38,0,3,h); x.globalAlpha = 1; rep = [6,2]; }
          if(kind === "lunares"){ x.fillStyle = acc; [[16,16],[48,48]].forEach(([a,b]) => { x.beginPath(); x.arc(a,b,6,0,7); x.fill(); }); rep = [7,3]; }
          if(kind === "estrellas"){ x.fillStyle = "#FFD84D"; starPath(x,16,18,9); x.fill(); x.fillStyle = acc; starPath(x,48,48,7); x.fill(); rep = [7,3]; }
          if(kind === "corazones"){ const hp = (cx, cy, r, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(cx, cy + r*.9); x.bezierCurveTo(cx - r*1.4, cy, cx - r*.7, cy - r*1.1, cx, cy - r*.35); x.bezierCurveTo(cx + r*.7, cy - r*1.1, cx + r*1.4, cy, cx, cy + r*.9); x.fill(); }; hp(16,18,9,acc); hp(48,48,8, light ? "#FF5A5F" : "#FFD84D"); rep = [7,3]; }
          if(kind === "jean"){ x.strokeStyle = mix(base, "#FFFFFF", .15); x.globalAlpha = .5; x.lineWidth = 1; for(let i=-64;i<64;i+=4){ x.beginPath(); x.moveTo(i,0); x.lineTo(i+64,64); x.stroke(); } x.globalAlpha = 1; rep = [3,2]; }
          if(kind === "tejido"){ x.fillStyle = dk; x.globalAlpha = .35; for(let i=0;i<w;i+=8) x.fillRect(i,0,3,h); x.globalAlpha = 1; rep = [10,1]; }
        });
        t.repeat.set(...rep);
        const p = {map:t, gradientMap:grad, color:new T.Color(tone, tone, tone)}; if(side) p.side = side;
        return mats[k] = new T.MeshToonMaterial(p);
      }
    };
    return G;
  }

  /* ---------- armado ---------- */
  /* tone: 1 con las luces del avatar; ~.6 en escenas con luces más fuertes (las de las criaturas) */
  function build(cfgIn, tone=1){
    const cfg = normalize(cfgIn);
    const girl = cfg.g === "nena";
    const G0 = g(), {SPH, CAP, DOME, CYL, LIMB, TORSO, SHIRT, SKIRT, SHORTS, CAPE, BRIM, CONE, BOX, ARC, RING, BAND, FAT, HALF, DISC, PLANE, STAR, HEART, BOLT, ANCHOR, ink, inkF, inkD, white} = G0;
    const M = (hex, op={}) => G0.M(hex, op, tone), FAB = (kind, base, side) => kind === "liso" ? M(base, side ? {side} : {}) : G0.fabric(kind, base, tone, side);
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const anim = {spin:[], wave:[], flick:[], bob:[], blink:[], flap:[]};
    // pieza con contorno oscuro (grosor ~w en unidades del mundo)
    const add = (parent, geo, mat, pos=[0,0,0], scl=[1,1,1], rot=[0,0,0], w=.04) => {
      const grp = new T.Group(); grp.position.set(...pos); grp.rotation.set(...rot); parent.add(grp);
      const m = new T.Mesh(geo, mat); m.scale.set(...scl); grp.add(m);
      if(w){ const ol = new T.Mesh(geo, ink); ol.scale.set(scl[0] + w, scl[1] + w, scl[2] + w); grp.add(ol); }
      return grp;
    };
    // figura plana con borde, apoyada sobre una superficie (normal n). Devuelve {grp, inner, mesh}
    const decal = (parent, geo, mat, pos, size, n=[0,0,1], rot=0, border=.18) => {
      const grp = new T.Group(); grp.position.set(...pos); grp.quaternion.setFromUnitVectors(new T.Vector3(0,0,1), new T.Vector3(...n).normalize()); parent.add(grp);
      const inner = new T.Group(); inner.rotation.z = rot; grp.add(inner);
      if(border){ const b = new T.Mesh(geo, inkD); b.scale.setScalar(size*(1 + border)); b.position.z = -.002; inner.add(b); }
      const mesh = new T.Mesh(geo, mat); mesh.scale.setScalar(size); inner.add(mesh);
      return {grp, inner, mesh};
    };
    // punto sobre la cara (elipsoide de la cabeza) y su normal
    const HR = [.64,.58,.58];
    const onHead = (x, y, lift=.006) => { const z = Math.sqrt(Math.max(.02, 1 - (x/HR[0])**2 - (y/HR[1])**2))*HR[2]; return {p:[x, y, z + lift], n:[x/HR[0]**2, y/HR[1]**2, z/HR[2]**2]}; };

    const skin = M(cfg.skin), skinDk = M(mix(cfg.skin, "#8A3B2B", .22)), skinShade = mix(cfg.skin, "#8A3B2B", .4);
    const topM = FAB(cfg.pattern, cfg.topC), topDk = M(mix(cfg.topC, "#000000", .2)), topLt = M(mix(cfg.topC, "#FFFFFF", .4)), topPlain = M(cfg.topC);
    const hairM = M(cfg.hairC), hairDk = M(mix(cfg.hairC, "#000000", .25)), hairLt = M(mix(cfg.hairC, "#FFFFFF", .22)), shine = M(mix(cfg.hairC, "#FFFFFF", .55));
    const dress = cfg.top === "vestido", overall = cfg.top === "jardinero", jumper = cfg.top === "jumper";
    const bottom = dress ? "vestido" : overall ? "pantalon" : jumper ? "jumper" : cfg.bottom;
    const botHex = overall ? cfg.topC : cfg.bottomC, botM = FAB(overall ? "liso" : "jean", botHex);
    const shoeM = M(cfg.shoeC), soleM = M("#FFFFFF");
    const accM = M(cfg.accC), accDk = M(mix(cfg.accC, "#000000", .2)), gold = M("#FFC83D"), goldDk = M("#E09A1E");
    const shortSleeve = ["remera","camisa","vestido","jardinero","chomba","blusa","jumper"].includes(cfg.top);
    const TW = girl ? .94 : 1.06;   // ancho del torso: más angosto en nenas, más ancho en nenes

    // piernas (pivote en la cadera)
    const legs = [-1, 1].map(s => {
      const L = new T.Group(); L.position.set(s*.15, .47, 0); body.add(L);
      if(bottom === "pantalon") add(L, LIMB, botM, [0,-.16,0], [.115,.33,.115]);
      else if(bottom === "calzas") add(L, LIMB, M(cfg.bottomC), [0,-.17,0], [.096,.32,.096]);
      else { add(L, LIMB, skin, [0,-.17,0], [.092,.32,.092]); if(bottom === "short") add(L, LIMB, botM, [0,-.05,0], [.13,.14,.13]); if(bottom === "bermuda") add(L, LIMB, botM, [0,-.1,0], [.13,.24,.13]); }
      if(girl && (bottom === "pollera" || bottom === "vestido" || bottom === "jumper")) add(L, LIMB, M("#FFFFFF"), [0,-.3,0], [.098,.1,.098], [0,0,0], .025);
      const sh = new T.Group(); sh.position.set(0,-.38,.05); L.add(sh);
      if(cfg.shoe === "guillerminas"){
        add(sh, SPH, shoeM, [0,0,.01], [.14,.08,.2]); add(sh, SPH, soleM, [0,-.045,.005], [.145,.035,.205], [0,0,0], .025);
        add(sh, BOX, M(mix(cfg.shoeC, "#000000", .25)), [0,.07,.02], [.2,.025,.04], [0,0,0], .012); add(sh, SPH, gold, [s*.09,.07,.02], [.02,.02,.02], [0,0,0], 0);
      } else {
        if(cfg.shoe === "botitas") add(sh, LIMB, shoeM, [0,.12,-.02], [.12,.18,.12]);
        add(sh, SPH, shoeM, [0,.02,0], [.15,.11,.21]);
        add(sh, SPH, soleM, [0,-.045,.005], [.155,.055,.215], [0,0,0], .03);
        add(sh, BOX, white, [0,.08,.09], [.1,.018,.06], [-.35,0,0], 0);
        add(sh, BOX, white, [s*.15,.02,-.02], [.01,.05,.12], [0,0,0], 0);
      }
      return L;
    });
    // torso y ropa
    if(cfg.top === "camisa"){
      add(body, TORSO, G0.fabric("rayas", "#FFC23C", tone), [0,.78,0], [1,1,.86]);
      const sh = new T.Group(); sh.position.set(0,.8,0); sh.scale.set(1,1,.88); body.add(sh);
      sh.add(new T.Mesh(SHIRT, FAB(cfg.pattern, cfg.topC, T.DoubleSide)));
      const sho = new T.Mesh(SHIRT, ink); sho.scale.set(1.1,1.02,1.1); sh.add(sho);
      [-1,1].forEach(s => add(body, BOX, topDk, [s*.13,1.0,.24], [.1,.2,.03], [.3,0,s*.45], .02));
      [.72,.86].forEach(y => add(body, SPH, M("#FFFFFF"), [.2,y,.3], [.022,.022,.012], [0,0,0], .01));
    }
    else add(body, TORSO, overall || jumper || cfg.top === "blusa" ? M(cfg.top === "blusa" ? cfg.topC : "#FFFFFF") : topM, [0,.78,0], [TW,1,.86]);
    if(bottom === "short" || bottom === "pantalon" || bottom === "bermuda") add(body, SHORTS, botM, [0,.5,0], [TW,1,.86]);
    if(bottom === "calzas") add(body, SHORTS, M(cfg.bottomC), [0,.5,0], [TW,1,.86]);
    if(bottom === "pollera" || dress || jumper){
      const c = dress || jumper ? cfg.topC : cfg.bottomC;
      const sk = add(body, SKIRT, dress || jumper ? FAB(cfg.pattern, c, T.DoubleSide) : M(c, {side:T.DoubleSide}), [0,.45,0], [TW,1,.9], [0,0,0], 0); const ol = new T.Mesh(SKIRT, ink); ol.scale.set(TW + .06,1.03,.96); sk.add(ol);
      add(body, SHORTS, M(c), [0,.53,0], [.95*TW,.7,.85], [0,0,0], 0);
      if(dress) add(body, RING, topLt, [0,.6,0], [.3,.3,.27], [Math.PI/2,0,0], 0);
    }
    if(jumper){ add(body, BOX, FAB(cfg.pattern, cfg.topC), [0,.74,.25], [.34,.3,.1], [-.1,0,0], .025); [-1,1].forEach(s => add(body, BOX, topPlain, [s*.14,.97,.08], [.07,.3,.42], [0,0,0], .02)); [-1,1].forEach(s => add(body, SPH, M("#FFFFFF"), [s*.1,.84,.31], [.03,.03,.02], [0,0,0], .01)); }
    if(cfg.top === "blusa"){ [-1,1].forEach(s => add(body, SPH, M("#FFFFFF"), [s*.1,1.04,.2], [.13,.05,.1], [.4,0,-s*.35], .02)); add(body, SPH, M(mix(cfg.topC, "#FFFFFF", .6)), [0,.66,.27], [.08,.05,.03], [0,0,0], .015); [.8,.92].forEach(y => add(body, SPH, M("#FFFFFF"), [0,y,.3], [.02,.02,.012], [0,0,0], .01)); }
    if(cfg.top === "chomba"){ [-1,1].forEach(s => add(body, BOX, M(mix(cfg.topC, "#FFFFFF", .7)), [s*.09,1.04,.22], [.13,.06,.12], [.5,0,-s*.5], .02)); add(body, BOX, topDk, [0,.95,.29], [.05,.16,.02], [-.2,0,0], .01); [.99,.91].forEach(y => add(body, SPH, M("#FFFFFF"), [0,y,.31], [.018,.018,.01], [0,0,0], .008)); decal(body, STAR, M("#FFFFFF"), [-.13,.88,.27], .035, [0,.15,1], 0, .25); }
    if(cfg.top === "buzo"){ add(body, SPH, topPlain, [0,1.08,-.2], [.36,.2,.2]); add(body, BOX, topDk, [0,.66,.29], [.3,.16,.05], [-.12,0,0], .02); add(body, CYL, white, [-.07,.92,.3], [.013,.16,.013], [.2,0,0], 0); add(body, CYL, white, [.07,.92,.3], [.013,.16,.013], [.2,0,0], 0); }
    if(cfg.top === "campera"){ add(body, BOX, M("#E9ECF5"), [0,.78,.3], [.03,.52,.03], [-.14,0,0], 0); add(body, RING, topDk, [0,1.06,0], [.27,.27,.22], [Math.PI/2,0,0], .02); add(body, BOX, topDk, [-.17,.62,.27], [.12,.1,.04], [-.2,.3,0], 0); add(body, BOX, topDk, [.17,.62,.27], [.12,.1,.04], [-.2,-.3,0], 0); }
    if(overall){ add(body, BOX, FAB(cfg.pattern, cfg.topC), [0,.72,.26], [.36,.34,.1], [-.1,0,0], .025); [-1,1].forEach(s => add(body, BOX, topPlain, [s*.15,.97,.08], [.07,.3,.42], [0,0,0], .02)); add(body, SPH, gold, [-.11,.84,.32], [.035,.035,.02], [0,0,0], 0); add(body, SPH, gold, [.11,.84,.32], [.035,.035,.02], [0,0,0], 0); }
    if(cfg.top === "remera" && cfg.pattern === "liso") decal(body, girl ? HEART : STAR, topLt, [.1,.84,.265], .07, [0,.15,1], 0, .25);
    // brazos (pivote en el hombro)
    const sleeveM = overall || jumper ? M("#FFFFFF") : cfg.top === "blusa" ? topPlain : topM;
    const arms = [-1, 1].map(s => {
      const A = new T.Group(); A.position.set(s*(girl ? .32 : .36), 1.0, 0); body.add(A);
      const inner = new T.Group(); inner.rotation.z = s*.28; A.add(inner);
      if(cfg.top === "blusa"){ add(inner, SPH, sleeveM, [0,-.06,0], [.15,.14,.15]); add(inner, LIMB, skin, [0,-.25,0], [.08,.24,.08]); }
      else if(shortSleeve){ add(inner, LIMB, sleeveM, [0,-.08,0], [.12,.18,.12]); add(inner, LIMB, skin, [0,-.26,0], [.082,.22,.082]); }
      else add(inner, LIMB, sleeveM, [0,-.17,0], [.105,.37,.105]);
      add(inner, SPH, skin, [0,-.4,0], [.11,.12,.1]);
      // tatuaje en el antebrazo (se ve con manga corta)
      if(s < 0 && shortSleeve && cfg.tattoo !== "nada"){
        const TG = {estrella:STAR, corazon:HEART, rayo:BOLT, ancla:ANCHOR, flor:null}[cfg.tattoo];
        const tc = cfg.tattoo === "ancla" ? M("#35418F") : cfg.tattoo === "corazon" ? M("#E8485A") : cfg.tattoo === "flor" ? M("#FF7EB6") : M("#4F7BE8");
        if(TG) decal(inner, TG, tc, [0,-.27,.083], .045, [0,0,1], 0, 0);
        else { for(let i=0;i<5;i++){ const a = i*Math.PI*2/5; const pt = new T.Mesh(DISC, tc); pt.position.set(Math.cos(a)*.025, -.27 + Math.sin(a)*.025, .084); pt.scale.setScalar(.018); inner.add(pt); } const c0 = new T.Mesh(DISC, M("#FFC23C")); c0.position.set(0,-.27,.086); c0.scale.setScalar(.014); inner.add(c0); }
      }
      return A;
    });
    // espalda
    if(cfg.back === "mochila"){ add(body, SPH, accM, [0,.8,-.36], [.25,.28,.14]); add(body, SPH, accDk, [0,.7,-.48], [.15,.12,.06], [0,0,0], .025); [-1,1].forEach(s => add(body, BOX, accDk, [s*.17,.92,.2], [.05,.36,.03], [-.15,0,0], .015)); }
    if(cfg.back === "capa"){ const c = new T.Group(); c.position.set(0,.66,0); body.add(c); c.add(new T.Mesh(CAPE, M(cfg.accC, {side:T.DoubleSide}))); const ol = new T.Mesh(CAPE, ink); ol.scale.set(1.05,1.01,1.05); c.add(ol); add(body, RING, gold, [0,1.06,0], [.28,.28,.24], [Math.PI/2,0,0], 0); anim.wave.push(c); }
    if(cfg.back === "alas") [-1,1].forEach(s => { const w = new T.Group(); w.position.set(s*.12, .95, -.3); body.add(w); add(w, SPH, M(mix(cfg.accC, "#FFFFFF", .55)), [s*.22,.1,0], [.26,.16,.04], [0,s*.3,s*.5], .03); add(w, SPH, M(mix(cfg.accC, "#FFFFFF", .3)), [s*.18,-.08,0], [.17,.1,.035], [0,s*.3,-s*.3], .025); w.userData.s = s; anim.flap.push(w); });
    // cuello
    if(cfg.neck === "bufanda"){ add(body, FAT, accM, [0,1.08,0], [.29,.29,.3], [Math.PI/2,0,0], .03); add(body, BOX, accM, [.14,.86,.27], [.1,.3,.05], [-.1,0,.15], .025); [0,1,2].forEach(i => add(body, BOX, accDk, [.14 + (i-1)*.03,.7,.28], [.018,.04,.04], [0,0,.15], 0)); }
    if(cfg.neck === "panuelo"){ add(body, RING, accM, [0,1.06,0], [.27,.27,.24], [Math.PI/2,0,0], .02); add(body, CONE, accM, [0,.93,.27], [.14,.22,.03], [-.2,0,Math.PI], .025); }
    if(cfg.neck === "medalla"){ add(body, RING, accM, [0,.98,.06], [.23,.26,.2], [Math.PI/2 - .5,0,0], 0); add(body, CYL, gold, [0,.8,.31], [.08,.02,.08], [Math.PI/2 - .15,0,0], .025); decal(body, STAR, goldDk, [0,.8,.335], .045, [0,.15,1], 0, 0); }
    if(cfg.neck === "collar"){ for(let i=0;i<12;i++){ const a = -Math.PI*.8 + i*(Math.PI*1.6/11); add(body, SPH, M("#FFFFFF"), [Math.sin(a)*.26, 1.03 - Math.cos(a)*.04 - (1 - Math.abs(a)/2.5)*.06, Math.cos(a)*.24], [.035,.035,.035], [0,0,0], .012); } }
    // cabeza
    const head = new T.Group(); head.position.set(0, 1.58, 0); body.add(head);
    add(head, SPH, skin, [0,0,0], HR, [0,0,0], .05);
    const earsOn = ["corto","puntas","rapado","rodete","flequillo","cresta","ladeado","cola","jopo","rulos","afroCorto"].includes(cfg.hair);
    if(earsOn) [-1,1].forEach(s => { add(head, SPH, skin, [s*.62,-.05,.02], [.09,.13,.07], [0,0,0], .035); add(head, SPH, skinDk, [s*.64,-.05,.06], [.04,.07,.02], [0,0,0], 0); });
    // aros
    if(cfg.earrings !== "nada") [-1,1].forEach(s => {
      const p = [s*.655, -.19, .05];
      if(cfg.earrings === "aritos") add(head, SPH, gold, p, [.03,.03,.03], [0,0,0], .012);
      if(cfg.earrings === "perlas") add(head, SPH, M("#FFFFFF"), [p[0], p[1]-.03, p[2]], [.045,.045,.045], [0,0,0], .015);
      if(cfg.earrings === "argollas") add(head, RING, gold, [p[0], p[1]-.06, p[2]], [.06,.06,.06], [0,Math.PI/2,0], .015);
      if(cfg.earrings === "estrellas") decal(head, STAR, gold, [p[0] + s*.01, p[1]-.05, p[2]], .05, [s,0,.4], 0, .2);
    });
    // ojos
    const ez = .52, ey = -.03, ex = .22;
    const eyes = new T.Group(); head.add(eyes);
    const eyeOpen = (s, big=1, sleepy=false) => {
      const e = new T.Group(); e.position.set(s*ex, ey, ez); eyes.add(e); anim.blink.push(e);
      const b = new T.Mesh(SPH, inkF); b.scale.set(.085*big, .115*big*(sleepy ? .55 : 1), .045); e.add(b);
      const h = new T.Mesh(SPH, white); h.position.set(.025*big, (sleepy ? .015 : .04)*big, .035); h.scale.setScalar(.03*big); e.add(h);
      if(!sleepy){ const h2 = new T.Mesh(SPH, white); h2.position.set(-.025*big, -.045*big, .035); h2.scale.setScalar(.016*big); e.add(h2); }
      if(sleepy){ const lid = new T.Mesh(BOX, inkF); lid.position.set(0, .07, .02); lid.scale.set(.2, .022, .03); e.add(lid); }
      if(girl && cfg.eyes !== "pestanas") [0,1].forEach(i => { const l = new T.Mesh(BOX, inkF); l.position.set(s*(.075 + i*.02), .07*big - i*.028, .02); l.rotation.z = s*(-.55 - i*.4); l.scale.set(.04,.014,.02); e.add(l); });
      if(cfg.eyes === "pestanas") [0,1,2].forEach(i => { const l = new T.Mesh(BOX, inkF); l.position.set(s*(.07 + i*.022), .085 - i*.03, .02); l.rotation.z = s*(-.5 - i*.35); l.scale.set(.05,.016,.02); e.add(l); });
    };
    const eyeArc = s => { const a = new T.Mesh(ARC, inkF); a.position.set(s*ex, ey-.04, ez+.02); a.scale.set(.08,.08,.06); eyes.add(a); };
    if(cfg.eyes === "felices") [-1,1].forEach(eyeArc);
    else if(cfg.eyes === "guino"){ eyeOpen(-1, 1.1); eyeArc(1); }
    else [-1,1].forEach(s => eyeOpen(s, (cfg.eyes === "grandes" ? 1.22 : 1)*(girl ? 1.06 : .97), cfg.eyes === "dormilon"));
    // cejas
    const browM = M(mix(cfg.hairC, "#1D2356", .45));
    [-1,1].forEach(s => {
      if(cfg.brows === "arco"){ const b = new T.Mesh(ARC, browM); b.position.set(s*.22, .2, .5); b.scale.set(.08,.06,.04); head.add(b); return; }
      const th = (cfg.brows === "gruesas" ? .05 : cfg.brows === "finitas" ? .016 : .028)*(girl ? .8 : 1.25);
      const b = new T.Mesh(BOX, browM); b.position.set(s*.22, .17, .52); b.rotation.set(-.3, s*.3, s*-.12); b.scale.set(.13, th, .03); head.add(b);
    });
    // cachetes
    [-1,1].forEach(s => { const c = new T.Mesh(SPH, M("#FF8FA3")); c.position.set(s*.36, -.16, .44); c.scale.set(.1,.06,.035); c.lookAt(c.position.clone().multiplyScalar(2)); head.add(c); });
    // boca
    if(cfg.mouth === "sonrisa" || cfg.mouth === "lengua"){
      const m = new T.Mesh(ARC, inkF); m.position.set(0, -.21, .552); m.rotation.z = Math.PI; m.scale.set(.085,.075,.05); head.add(m);
      if(cfg.mouth === "lengua") add(head, SPH, M("#FF7A8A"), [.05,-.28,.51], [.045,.055,.03], [-.3,0,.3], .015);
    }
    if(cfg.mouth === "abierta" || cfg.mouth === "dientito"){
      const q = onHead(0, -.2, .004); const d = decal(head, HALF, inkF, q.p, .1, q.n, 0, 0);
      d.mesh.scale.set(.1,.09,1);
      const inside = new T.Mesh(HALF, M("#8E2F3C")); inside.scale.set(.082,.072,1); inside.position.z = .002; d.inner.add(inside);
      const tg = new T.Mesh(DISC, M("#FF7A8A")); tg.scale.set(.042,.026,1); tg.position.set(0,-.05,.004); d.inner.add(tg);
      if(cfg.mouth === "dientito"){ const tt = new T.Mesh(PLANE, white); tt.scale.set(.035,.026,1); tt.position.set(-.022,-.014,.005); d.inner.add(tt); }
    }
    if(cfg.mouth === "sorpresa"){ const q = onHead(0, -.22, .004); const d = decal(head, DISC, M("#8E2F3C"), q.p, .04, q.n, 0, .3); d.mesh.scale.set(.036,.046,1); d.inner.children[0].scale.set(.05,.06,1); }
    const nose = new T.Mesh(SPH, skinDk); nose.position.set(0, -.11, .575); nose.scale.set(.03,.022,.02); head.add(nose);
    // pecas y lunar
    const dot = (x, y, r, col) => { const q = onHead(x, y, .004); decal(head, DISC, M(col), q.p, r, q.n, 0, 0); };
    if(cfg.freckles === "nariz") [[-.1,-.1],[-.06,-.13],[.06,-.13],[.1,-.1],[-.2,-.11],[.2,-.11]].forEach(([x,y]) => dot(x, y, .012, "#B06A3B"));
    if(cfg.freckles === "mejillas") [[-.3,-.08],[-.26,-.13],[-.36,-.13],[-.32,-.19],[.3,-.08],[.26,-.13],[.36,-.13],[.32,-.19]].forEach(([x,y]) => dot(x, y, .014, "#B06A3B"));
    if(cfg.freckles === "lunar") dot(.17, -.26, .016, "#4A2A1C");
    // marcas de la cara
    if(cfg.mark === "curita"){ const q = onHead(.3, .12, .01); const d = decal(head, PLANE, M("#F7D7B0"), q.p, 1, q.n, .5, 0); d.mesh.scale.set(.17,.065,1); const ol = new T.Mesh(PLANE, inkD); ol.scale.set(.185,.08,1); ol.position.z = -.002; d.inner.add(ol); [-.035,.035].forEach(x => { const c = new T.Mesh(DISC, M("#E4B98C")); c.position.set(x,0,.002); c.scale.setScalar(.008); d.inner.add(c); }); }
    if(cfg.mark === "cicatriz"){ const q = onHead(-.3, .09, .006); const d = decal(head, PLANE, M(skinShade), q.p, 1, q.n, -.9, 0); d.mesh.scale.set(.15,.016,1); [-.04,0,.04].forEach(x => { const st = new T.Mesh(PLANE, M(skinShade)); st.position.set(x,0,.001); st.scale.set(.012,.05,1); d.inner.add(st); }); }
    if(cfg.mark === "estrella"){ const q = onHead(.34, -.06); decal(head, STAR, M("#4F7BE8"), q.p, .05, q.n, .2, .22); }
    if(cfg.mark === "corazon"){ const q = onHead(.34, -.06); decal(head, HEART, M("#E8485A"), q.p, .045, q.n, -.2, .22); }
    if(cfg.mark === "rayo"){ const q = onHead(.33, -.05); decal(head, BOLT, M("#FFC23C"), q.p, .07, q.n, .15, .2); }
    if(cfg.mark === "pintura") [-1,1].forEach(s => [0,1].forEach(i => { const q = onHead(s*(.22 + i*.02), -.14 - i*.05, .006); const d = decal(head, PLANE, M(cfg.accC), q.p, 1, q.n, s*.15, 0); d.mesh.scale.set(.12,.022,1); }));
    // anteojos
    if(cfg.glasses !== "nada"){
      const fr = cfg.glasses === "estrella" ? M(cfg.accC) : M("#2D3047");
      [-1,1].forEach(s => {
        const p = [s*ex, ey, ez+.07];
        if(cfg.glasses === "redondos" || cfg.glasses === "sol"){ const r = new T.Mesh(RING, fr); r.position.set(...p); r.scale.set(.135,.135,.14); head.add(r); }
        if(cfg.glasses === "cuadrados") [[0,.12,.28,.025],[0,-.1,.28,.025],[-.14,.01,.025,.24],[.14,.01,.025,.24]].forEach(([x,y,w,h]) => { const b = new T.Mesh(BOX, fr); b.position.set(p[0]+x, p[1]+y, p[2]); b.scale.set(w,h,.03); head.add(b); });
        if(cfg.glasses === "estrella") decal(head, STAR, new T.MeshBasicMaterial({color:new T.Color(cfg.accC), transparent:true, opacity:.55, side:T.DoubleSide}), p, .17, [s*.15,0,1], 0, .14);
        else { const lens = new T.Mesh(cfg.glasses === "cuadrados" ? PLANE : DISC, new T.MeshBasicMaterial({color: cfg.glasses === "sol" ? 0x1D2356 : 0xDFF3FF, transparent:true, opacity: cfg.glasses === "sol" ? .92 : .25})); lens.position.set(...p); lens.scale.setScalar(cfg.glasses === "cuadrados" ? .26 : .13); head.add(lens);
          if(cfg.glasses === "sol"){ const sh = new T.Mesh(PLANE, white); sh.position.set(p[0]-.04, p[1]+.04, p[2]+.002); sh.rotation.z = .6; sh.scale.set(.09,.018,1); head.add(sh); } }
      });
      const br = new T.Mesh(CYL, fr); br.position.set(0, ey+.02, ez+.09); br.rotation.z = Math.PI/2; br.scale.set(.014,.12,.014); head.add(br);
      [-1,1].forEach(s => { const arm = new T.Mesh(BOX, fr); arm.position.set(s*.46, ey+.02, .3); arm.rotation.y = s*1.0; arm.scale.set(.35,.02,.02); head.add(arm); });
    }
    // pelo: base + mechones con punta
    const bigHat = ["gorra","gorraAtras","lana","pescador","boina","casco","mago","corona"].includes(cfg.hat);
    const capS = ["rapado","cresta"].includes(cfg.hair) ? [.655,.6,.6] : cfg.hair === "afroCorto" ? [.72,.67,.67] : [.69,.645,.645];
    if(cfg.hair !== "afro") add(head, CAP, hairM, [0,.02,-.03], capS, [-.62,0,0], .045);
    const lock = (pos, scl, rot, m=hairM) => add(head, CONE, m, pos, scl, rot, .035);
    const frontLocks = (size=.2) => [[-.28,.3,.43,.35],[0,.34,.48,0],[.28,.3,.43,-.35]].forEach(([x,y,z,rz]) => lock([x,y,z], [size,.26,.08], [-.95,0,rz + Math.PI]));
    const hairStyle = bigHat && ["puntas","jopo","cresta","afroCorto"].includes(cfg.hair) ? "corto" : cfg.hair;
    switch(hairStyle){
      case "corto": case "puntas":
        [[-.36,.26,.4,.5],[-.14,.3,.47,.15],[.1,.31,.47,-.15],[.32,.27,.41,-.45]].forEach(([x,y,z,rz],i) => lock([x,y,z], [.15,.3,.08], [-.9,0,rz + Math.PI], i%2 ? hairLt : hairM));
        if(hairStyle === "puntas") [[-.35,.56,-.05,.6],[-.1,.66,-.1,.15],[.18,.64,-.12,-.3],[.4,.5,-.1,-.75],[0,.5,-.45,0]].forEach(([x,y,z,rz]) => lock([x,y,z], [.13,.34,.1], [-.35,0,rz]));
        else [[-.3,.55,-.05,.4],[0,.62,-.1,0],[.3,.55,-.05,-.4]].forEach(([x,y,z,rz]) => lock([x,y,z], [.14,.2,.1], [-.3,0,rz]));
        [-1,1].forEach(s => lock([s*.6,-.08,.1], [.08,.22,.06], [0,0,Math.PI + s*.1], hairDk));
        break;
      case "ladeado":
        add(head, SPH, hairM, [-.1,.3,.42], [.46,.15,.14], [.35,0,.35], .035); lock([.2,.14,.47], [.1,.22,.06], [-.6,0,Math.PI + .9]); lock([-.42,.36,.3], [.12,.2,.08], [-.4,0,1.2], hairLt);
        [-1,1].forEach(s => lock([s*.6,-.08,.1], [.08,.2,.06], [0,0,Math.PI + s*.1], hairDk));
        break;
      case "flequillo": add(head, SPH, hairM, [0,.24,.36], [.56,.2,.26], [.35,0,0], .035); [-1,1].forEach(s => lock([s*.58,-.12,.1], [.1,.3,.08], [0,0,Math.PI + s*.08])); break;
      case "cresta": for(let i=0;i<6;i++){ const a = .35 - i*.36; add(head, CONE, i%2 ? hairLt : hairM, [0, Math.cos(a)*.62 + .08, Math.sin(a)*.6], [.11,.42,.2], [a,0,0], .035); } break;
      case "bob":
        add(head, SPH, hairM, [0,.24,.36], [.58,.2,.26], [.3,0,0], .035);
        [-1,1].forEach(s => add(head, SPH, hairM, [s*.52,-.14,.02], [.2,.44,.46], [0,0,s*.08], .04)); add(head, SPH, hairM, [0,-.12,-.26], [.62,.46,.36], [0,0,0], .04);
        break;
      case "largo": frontLocks(); add(head, SPH, hairM, [0,-.34,-.3], [.62,.66,.3], [0,0,0], .04); [-1,1].forEach(s => { add(head, SPH, hairM, [s*.56,-.32,.06], [.15,.45,.2], [0,0,0], .035); lock([s*.55,-.78,.05], [.12,.2,.1], [0,0,Math.PI]); }); break;
      case "cola": { frontLocks(.18); add(head, SPH, M(cfg.accC), [0,.2,-.6], [.08,.08,.08], [0,0,0], .02); const tail = new T.Group(); tail.position.set(0,.2,-.62); head.add(tail); add(tail, SPH, hairM, [0,-.32,-.16], [.17,.36,.17], [.5,0,0], .035); lock([0,-.7,-.2], [.12,.22,.1], [Math.PI - .4,0,0]); anim.wave.push(tail); break; }
      case "colitas": frontLocks(); [-1,1].forEach(s => { add(head, SPH, hairM, [s*.76,-.14,-.12], [.2,.28,.2], [0,0,s*.4]); lock([s*.86,-.42,-.12], [.13,.2,.12], [0,0,Math.PI + s*.3]); add(head, SPH, M(cfg.accC), [s*.63,.02,-.1], [.075,.075,.075], [0,0,0], .02); }); break;
      case "trenzas": frontLocks(); [-1,1].forEach(s => { for(let i=0;i<5;i++) add(head, SPH, i%2 ? hairLt : hairM, [s*(.5 + i*.02), -.28 - i*.15, -.12 + i*.02], [.11,.1,.11], [0,0,0], .03); add(head, SPH, M(cfg.accC), [s*.6,-1.03,-.04], [.06,.05,.06], [0,0,0], .02); lock([s*.6,-1.13,-.04], [.07,.1,.07], [0,0,Math.PI]); }); break;
      case "rodete": frontLocks(); add(head, SPH, hairM, [0,.66,-.2], [.25,.23,.25]); add(head, RING, M(cfg.accC), [0,.52,-.16], [.15,.15,.15], [Math.PI/2 - .4,0,0], 0); break;
      case "jopo":
        add(head, SPH, hairM, [0,.44,.3], [.4,.22,.3], [-.5,0,0], .04); lock([0,.62,.3], [.2,.3,.12], [-.2,0,0], hairLt); lock([-.2,.56,.22], [.14,.24,.1], [-.35,0,.35]); lock([.2,.56,.22], [.14,.24,.1], [-.35,0,-.35]);
        [-1,1].forEach(s => lock([s*.6,-.08,.1], [.08,.2,.06], [0,0,Math.PI + s*.1], hairDk));
        break;
      case "afroCorto": for(let i=0;i<18;i++){ const a = i/18*Math.PI*2; const r = .58; add(head, SPH, i%2 ? hairLt : hairM, [Math.cos(a)*r*.95, .32 + Math.sin(a)*.26 + (i%3)*.03, Math.sin(a)*.3 - .12], [.16,.16,.16], [0,0,0], .025); } add(head, SPH, hairM, [0,.5,-.05], [.52,.2,.44], [0,0,0], .03); break;
      case "largoFlequillo": add(head, SPH, hairM, [0,.25,.36], [.58,.2,.26], [.33,0,0], .035); add(head, SPH, hairM, [0,-.34,-.3], [.64,.7,.3], [0,0,0], .04); [-1,1].forEach(s => { add(head, SPH, hairM, [s*.56,-.34,.06], [.15,.5,.2], [0,0,0], .035); lock([s*.55,-.85,.05], [.12,.2,.1], [0,0,Math.PI]); }); break;
      case "rulosLargos": frontLocks(); for(let i=0;i<14;i++){ const a = i/14*Math.PI*2, r = .5; add(head, SPH, i%3 ? hairM : hairLt, [Math.cos(a)*r, .3 + (i%3)*.08, Math.sin(a)*r*.9 - .1], [.18,.18,.18], [0,0,0], .03); }
        [-1,1].forEach(s => { for(let k=0;k<4;k++) add(head, SPH, k%2 ? hairLt : hairM, [s*(.5 + (k%2)*.06), -.12 - k*.2, -.02 - k*.03], [.16,.15,.16], [0,0,0], .03); }); for(let k=0;k<3;k++) add(head, SPH, hairM, [(k-1)*.3, -.4, -.34], [.2,.4,.18], [0,0,0], .03); break;
      case "rulos": for(let i=0;i<16;i++){ const a = i/16*Math.PI*2, r = i%2 ? .52 : .46; const y = .25 + (i%3)*.1; add(head, SPH, i%3 ? hairM : hairLt, [Math.cos(a)*r, y, Math.sin(a)*r*.9 - .08], [.18,.18,.18], [0,0,0], .03); } add(head, SPH, hairM, [0,.56,-.05], [.3,.21,.3]); break;
      case "afro":
        add(head, SPH, hairM, [0,.38,-.26], [.86,.72,.72], [0,0,0], .05);
        for(let i=0;i<14;i++){ const a = i/14*Math.PI*2; if(Math.sin(a) < -.55) continue; add(head, SPH, i%2 ? hairLt : hairM, [Math.cos(a)*.8, .38 + Math.sin(a)*.62, -.28 + (i%3 - 1)*.1], [.21,.21,.21], [0,0,0], .03); }
        add(head, SPH, hairM, [0,.33,.3], [.56,.2,.24], [.35,0,0], .035); [-1,1].forEach(s => add(head, SPH, hairM, [s*.56,.02,-.02], [.14,.3,.3], [0,0,0], .035));
        break;
    }
    // brillo del pelo (estilo dibujo animado)
    if(!bigHat && !["rapado","afro","rulos","cresta"].includes(cfg.hair)) [[-.24,.44],[-.1,.48]].forEach(([x,y],i) => { const z = Math.sqrt(Math.max(.02, 1 - (x/.69)**2 - (y/.645)**2))*.645 - .01; const s = new T.Mesh(SPH, shine); s.position.set(x, y, z); s.scale.set(i ? .05 : .11, .025, .02); s.rotation.set(-.6, 0, .55); head.add(s); });
    // gorros y accesorios
    const hatM = M(cfg.hatC), hatDk = M(mix(cfg.hatC, "#000000", .2)), hatLt = M(mix(cfg.hatC, "#FFFFFF", .5));
    const brim = (col, y) => { const b = new T.Group(); b.position.set(0,y,-.02); b.rotation.x = -.1; head.add(b); b.add(new T.Mesh(BRIM, M(col, {side:T.DoubleSide}))); const ol = new T.Mesh(BRIM, ink); ol.scale.set(1.04,1.3,1.04); b.add(ol); };
    switch(cfg.hat){
      case "gorraAtras": add(head, DOME, hatM, [0,.16,-.02], [.7,.52,.69], [-.12,0,0], .045); add(head, CYL, hatDk, [0,.2,-.64], [.34,.035,.28], [-.15,0,0], .03); add(head, SPH, hatDk, [0,.67,0], [.05,.04,.05], [0,0,0], .015); add(head, BOX, hatDk, [0,.34,.5], [.3,.12,.03], [-.9,0,0], .015); break;
      case "vinchaMono": add(head, BAND, hatM, [0,.04,-.04], [.67,.66,.8], [-.45,0,0], .02); [-1,1].forEach(s => add(head, SPH, hatM, [.34 + s*.12,.58,.2], [.13,.09,.06], [0,0,s*.4], .03)); add(head, SPH, hatDk, [.34,.58,.22], [.05,.05,.04], [0,0,0], .015); break;
      case "hebillas": [0,1].forEach(i => { add(head, BOX, M(i ? cfg.hatC : mix(cfg.hatC, "#FFFFFF", .4)), [.36 + i*.04,.36 - i*.12,.4 - i*.03], [.16,.04,.03], [0,-.5,.5], .015); }); decal(head, STAR, hatM, [-.4,.33,.38], .06, [-.5,.3,.8], 0, .2); break;
      case "tiara": { add(head, ARC, gold, [0,.36,.05], [.56,.4,.3], [-.35,0,0], 0); decal(head, STAR, gold, [0,.62,.3], .08, [0,.5,.9], 0, .2); [-1,1].forEach(s => add(head, SPH, M("#FF7EB6"), [s*.22,.56,.3], [.035,.035,.025], [0,0,0], .012)); add(head, SPH, M("#8FD3F4"), [0,.62,.36], [.03,.03,.02], [0,0,0], 0); break; }
      case "gorra": add(head, DOME, hatM, [0,.16,-.02], [.7,.52,.69], [-.12,0,0], .045); add(head, CYL, hatDk, [0,.22,.6], [.37,.035,.32], [.18,0,0], .03); add(head, SPH, hatDk, [0,.67,0], [.05,.04,.05], [0,0,0], .015); decal(head, STAR, M("#FFFFFF"), [0,.45,.5], .09, [0,.6,.8], 0, .2); break;
      case "lana": add(head, DOME, G0.fabric("tejido", cfg.hatC, tone), [0,.13,-.02], [.71,.64,.7], [-.15,0,0], .045); add(head, FAT, hatLt, [0,.14,-.02], [.69,.69,.6], [Math.PI/2 - .15,0,0], .025); add(head, SPH, hatLt, [0,.82,-.13], [.17,.17,.17], [0,0,0], .03); break;
      case "pescador": add(head, DOME, hatM, [0,.15,-.02], [.7,.55,.69], [-.1,0,0], .045); brim(cfg.hatC, .13); add(head, FAT, hatDk, [0,.2,-.02], [.69,.69,.2], [Math.PI/2 - .1,0,0], 0); break;
      case "boina": add(head, SPH, hatM, [.08,.5,-.05], [.72,.2,.68], [-.15,0,-.15], .045); add(head, CYL, hatDk, [.08,.72,-.08], [.03,.08,.03], [0,0,-.15], .015); break;
      case "vincha": add(head, RING, hatM, [0,.24,0], [.6,.58,.6], [Math.PI/2 - .2,0,0], .02); decal(head, STAR, M("#FFFFFF"), [0,.3,.6], .05, [0,.2,1], 0, .2); break;
      case "orejas": add(head, BAND, hatDk, [0,.04,-.04], [.67,.66,.8], [-.3,0,0], .015); [-1,1].forEach(s => { const e = add(head, SPH, hatM, [s*.32,.82,0], [.12,.3,.08], [0,0,-s*.25], .03); const inr = new T.Mesh(SPH, M("#FFC7DA")); inr.position.set(0,0,.06); inr.scale.set(.06,.2,.03); e.add(inr); }); break;
      case "antenas": add(head, BAND, hatDk, [0,.04,-.04], [.67,.66,.8], [-.3,0,0], .015); [-1,1].forEach(s => { add(head, CYL, M("#2D3047"), [s*.2,.8,0], [.022,.36,.022], [0,0,-s*.35], 0); const b = add(head, SPH, hatM, [s*.28,1.0,0], [.1,.1,.1], [0,0,0], .03); b.userData.ph = s; b.userData.y0 = 1.0; anim.bob.push(b); }); break;
      case "brote": add(head, CYL, M("#5FB84A"), [0,.72,0], [.025,.2,.025], [0,0,0], .015); [-1,1].forEach(s => add(head, SPH, M("#8AC926"), [s*.11,.85,0], [.12,.05,.07], [0,0,s*.45], .025)); break;
      case "flores": { const FC = [cfg.hatC, "#FFFFFF", "#FFC23C"]; for(let i=0;i<7;i++){ const a = -1.5 + i*.5; const f = add(head, SPH, M(FC[i%3]), [Math.sin(a)*.58, .44 - Math.abs(a)*.02, Math.cos(a)*.32 - .1], [.1,.1,.07], [0,a,0], .02); const c = new T.Mesh(SPH, M("#FFD84D")); c.position.z = .06; c.scale.setScalar(.04); f.add(c); } add(head, RING, M("#5FB84A"), [0,.42,-.06], [.6,.6,.42], [Math.PI/2 - .3,0,0], 0); break; }
      case "corona": { const cr = new T.Group(); cr.position.set(0,.5,-.03); cr.rotation.x = -.15; head.add(cr); add(cr, CYL, gold, [0,0,0], [.42,.12,.42], [0,0,0], .03); for(let i=0;i<7;i++){ const a = i/7*Math.PI*2; add(cr, CONE, gold, [Math.sin(a)*.4,.14,Math.cos(a)*.4], [.07,.16,.07], [0,0,0], .02); } [[0,.02,.43],[.3,.02,.3],[-.3,.02,.3]].forEach((p,i) => add(cr, SPH, M(i ? "#4F7BE8" : "#FF5A5F"), p, [.045,.045,.03], [0,0,0], .012)); break; }
      case "mago": add(head, CYL, hatDk, [0,.34,-.02], [.72,.04,.72], [-.12,0,0], .03); add(head, CONE, hatM, [0,.78,-.12], [.46,.9,.46], [-.25,0,.08], .045); [[.15,.7,.3],[-.2,.95,.12],[.05,1.12,0]].forEach((p,i) => decal(head, STAR, M("#FFD84D"), p, .06 - i*.01, [0,.3,1], i*.4, .2)); break;
      case "casco": add(head, DOME, M("#E8D3A2"), [0,.16,-.02], [.7,.6,.7], [-.1,0,0], .045); brim("#E8D3A2", .16); add(head, FAT, hatM, [0,.22,-.02], [.7,.7,.25], [Math.PI/2 - .1,0,0], 0); break;
      case "auris": add(head, ARC, M("#2D3047"), [0,.1,0], [.69,.7,.35], [0,0,0], 0); [-1,1].forEach(s => add(head, CYL, hatM, [s*.66,0,0], [.17,.11,.17], [0,0,Math.PI/2], .035)); break;
      case "mono": [-1,1].forEach(s => add(head, SPH, hatM, [.38 + s*.13,.52,.16], [.14,.1,.07], [0,0,s*.4], .03)); add(head, SPH, hatDk, [.38,.52,.18], [.06,.06,.05], [0,0,0], .02); break;
    }
    const shadow = new T.Mesh(PLANE, g().shadowMat); shadow.rotation.x = -Math.PI/2; shadow.position.y = .01; shadow.scale.set(1.1, .8, 1); root.add(shadow);
    return {root, body, head, legs, arms, anim, shadow, cfg, h: 2.25};
  }

  /* ---------- poses ---------- */
  function pose(a, mode, time, dt, k=1){
    const [lL, lR] = a.legs, [aL, aR] = a.arms;
    let y = 0, lean = 0;
    if(mode === "run"){
      const ph = time*k;
      lL.rotation.x = Math.sin(ph)*.9; lR.rotation.x = -Math.sin(ph)*.9;
      aL.rotation.x = -Math.sin(ph)*.8; aR.rotation.x = Math.sin(ph)*.8; aL.rotation.z = 0; aR.rotation.z = 0;
      y = Math.abs(Math.cos(ph))*.08; lean = .12;
    } else if(mode === "jump"){
      lL.rotation.x = .7; lR.rotation.x = -.3; aL.rotation.x = aR.rotation.x = 0; aL.rotation.z = -1.9; aR.rotation.z = 1.9; lean = .05;
    } else if(mode === "wave"){
      lL.rotation.x = lR.rotation.x = 0; aL.rotation.x = 0; aL.rotation.z = Math.sin(time*2)*.05;
      aR.rotation.x = -.25; aR.rotation.z = 1.95 + Math.sin(time*9)*.3;
      y = Math.abs(Math.sin(time*2))*.02;
    } else if(mode === "dizzy"){
      lL.rotation.x = .3; lR.rotation.x = -.2; aL.rotation.z = -1.2; aR.rotation.z = 1.2; aL.rotation.x = aR.rotation.x = 0;
    } else {
      lL.rotation.x = lR.rotation.x = 0; aL.rotation.x = aR.rotation.x = Math.sin(time*1.6)*.05; aL.rotation.z = -.05 - Math.sin(time*1.6)*.03; aR.rotation.z = .05 + Math.sin(time*1.6)*.03;
      y = Math.sin(time*2)*.012;
    }
    a.body.position.y = y; a.body.rotation.x = lean;
    a.head.rotation.z = mode === "idle" ? Math.sin(time*.9)*.05 : mode === "wave" ? Math.sin(time*2)*.08 : 0;
    if(!a.nextBlink) a.nextBlink = time + 1 + Math.random()*2;
    if(time >= a.nextBlink){ a.blinkT0 = time; a.nextBlink = time + (Math.random() < .25 ? .3 : 2.2 + Math.random()*3); }
    const bp = a.blinkT0 ? (time - a.blinkT0)/.16 : 2; const bs = bp < 1 ? 1 - Math.sin(bp*Math.PI)*.92 : 1;
    a.anim.blink.forEach(o => o.scale.y = bs);
    a.anim.bob.forEach(o => o.position.y = o.userData.y0 + Math.sin(time*4 + o.userData.ph)*.04);
    const sw = mode === "run" ? 2.5 : 1;
    a.anim.wave.forEach(o => o.rotation.x = (mode === "run" ? -.35 : 0) + Math.sin(time*2.4*sw)*.06*sw);
    a.anim.flap.forEach(o => o.rotation.y = o.userData.s*(.25 + Math.sin(time*(mode === "jump" ? 18 : 5))*.25));
  }
  function lights(scene){
    scene.add(new T.AmbientLight(0xffffff, .5));
    const k = new T.DirectionalLight(0xffffff, .55); k.position.set(2.5, 4, 6); scene.add(k);
  }

  /* miniatura (imagen) */
  let TR = null; const CACHE = {};
  function thumb(cfg, size=240, mode="wave"){
    const key = JSON.stringify(cfg) + size + mode; if(CACHE[key]) return CACHE[key];
    try {
      if(!TR){ const r = new T.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer:true}); r.setPixelRatio(1); const sc = new T.Scene(); lights(sc); const cam = new T.PerspectiveCamera(28, 1, .1, 50); cam.position.set(0, 1.35, 6.2); cam.lookAt(0, 1.14, 0); TR = {r, sc, cam}; }
      TR.r.setSize(size, size, false);
      const a = build(cfg); a.root.rotation.y = -.35; pose(a, mode, .9, 0); TR.sc.add(a.root); TR.r.render(TR.sc, TR.cam); const url = TR.r.domElement.toDataURL("image/png"); TR.sc.remove(a.root);
      return CACHE[key] = url;
    } catch(e){ return ""; }
  }

  /* ---------- datos guardados (compartidos entre juegos) ---------- */
  const readJSON = k => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e){ return null; } };
  function load(){
    const m = readJSON(MUNDO_KEY) || {}, t = readJSON(TABLAS_KEY) || {};
    const title = m.title || "Guardián";
    return {cfg: m.avatar ? normalize(m.avatar, m.avatar.g || genderOf(title)) : null, name: t.name || m.name || "", title};
  }
  function save(cfg, name, title){
    const m = readJSON(MUNDO_KEY) || {};
    if(cfg) m.avatar = cfg;
    if(title) m.title = title;
    if(name !== undefined && name !== null){ m.name = name; const t = readJSON(TABLAS_KEY) || {}; t.name = name; try { localStorage.setItem(TABLAS_KEY, JSON.stringify(t)); } catch(e){} }
    try { localStorage.setItem(MUNDO_KEY, JSON.stringify(m)); } catch(e){}
  }

  window.Avatar = {OPTS, SETS, DEFAULT, DEFAULTS, optsFor, genderOf, random, normalize, build, pose, lights, thumb, load, save};
})();
