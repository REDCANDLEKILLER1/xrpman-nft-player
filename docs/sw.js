const CACHE_NAME = 'xrpman-audio-v4';
const OFFLINE_AUDIO = '/fallback.mp3';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        './',
        './index.html',
        './style.css',
        OFFLINE_AUDIO,
        './assets/js/player.js',
        './assets/js/auth.js'
      ]))
  );
});

self.addEventListener('fetch', (e) => {
  // Audio cache strategy
  if (e.request.url.match(/\.(mp3|wav|ogg)$/)) {
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request)
        .catch(() => caches.match(OFFLINE_AUDIO))
    );
  } else {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
