const CACHE_NAME = 'khadija-v3';
const STATIC = ['/', '/index.html'];

// تثبيت - حفظ الصفحة الأساسية
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

// تنشيط - حذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// الاستراتيجية: جرب النت الأول، لو مافيش ارجع للكاش
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // الصور والأغاني والفيديوهات - حفظهم في الكاش
  if (url.includes('raw.githubusercontent.com')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        try {
          const res = await fetch(e.request);
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        } catch {
          return cached || new Response('Offline', { status: 503 });
        }
      })
    );
    return;
  }

  // GitHub API - جرب النت الأول
  if (url.includes('api.github.com')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // باقي الطلبات - كاش أول
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        fetch(e.request).then(res => {
          if (res && res.ok) caches.open(CACHE_NAME).then(c => c.put(e.request, res));
        }).catch(() => {});
        return cached;
      }
      return fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => new Response('Offline', { status: 503 }));
    })
  );
});
