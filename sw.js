/* Service worker — Parte de obra (Water Transition II)
   Hace que la app se guarde en el teléfono y abra SIN conexión (sin el dinosaurio).
   - El "caparazón" (index.html, config.js, íconos) se guarda localmente.
   - Cuando hay internet, baja la versión más nueva (network-first) y la guarda.
   - Cuando NO hay internet, abre la versión guardada.
   - Las llamadas a Supabase (otra dirección) NO se interceptan: la app ya maneja
     el modo sin conexión guardando en el teléfono y subiendo al reconectar. */
const CACHE = 'obra-v1';
const SHELL = ['./', './index.html', './config.js', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // POST/PATCH/DELETE (Supabase) -> red normal
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;  // Supabase u otros orígenes -> red normal
  // Caparazón propio: red primero (para traer actualizaciones), caché si no hay internet
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
