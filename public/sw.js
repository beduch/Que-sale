const CACHE_NAME = 'que-sale-v1';
const RECURSOS_A_CACHEAR = [
  '/',
  '/index.html',
  '/Logo_QueSale.png'
];

self.addEventListener('install', event => {
  console.log('Instalando Service Worker y cacheando archivos');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Archivos cacheados');
      return cache.addAll(RECURSOS_A_CACHEAR);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Activado y listo para controlar la app');
  event.waitUntil(
    caches.keys().then(nombres => {
      return Promise.all(
        nombres
          .filter(nombre => nombre !== CACHE_NAME)
          .map(nombre => caches.delete(nombre))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(respuestaCacheada => {
      if (respuestaCacheada) {
        return respuestaCacheada;
      }

      return fetch(event.request).then(respuestaDeRed => {
        if (!respuestaDeRed || respuestaDeRed.status !== 200 || respuestaDeRed.type !== 'basic') {
          return respuestaDeRed;
        }

        const copiaRespuesta = respuestaDeRed.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copiaRespuesta);
        });

        return respuestaDeRed;
      });
    })
  );
});