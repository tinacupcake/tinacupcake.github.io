/* Valle de los Guardianes — permite instalar los juegos y jugar sin internet.
   Al subir una versión nueva, cambiá el número de VERSION para que se actualice. */
const VERSION = "valle-v1";
const PRECACHE = [
  "/", "/index.html", "/carrera.html", "/criaturas.js", "/avatar.js", "/manifest.webmanifest",
  "/icon-192.png", "/icon-512.png", "/icon-maskable.png",
  "/mision-tablas/", "/mision-tablas/index.html",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(PRECACHE.map(u => c.add(new Request(u, {mode: u.startsWith("http") ? "no-cors" : "same-origin"})).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Con internet: trae lo último y lo guarda. Sin internet: usa lo guardado.
self.addEventListener("fetch", e => {
  const req = e.request; if(req.method !== "GET") return;
  e.respondWith(
    fetch(req).then(res => { if(res && (res.ok || res.type === "opaque")){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || (req.mode === "navigate" ? caches.match("/index.html") : undefined)))
  );
});
