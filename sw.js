// ═══════════════════════════════════════════════
// sw.js — Service Worker | مكتبة حشايشي v4.5
// احفظه في نفس مجلد pos.html
// ═══════════════════════════════════════════════

const CACHE = 'hashishi-v4.5';

// الملفات التي تُحفظ للعمل أوفلاين
const ASSETS = [
  './pos.html',
  './display.html',
  './display-admin.html',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

// ① التثبيت — احفظ الملفات في الكاش
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.filter(a => !a.startsWith('http') || navigator.onLine)))
      .then(() => self.skipWaiting())
  );
  console.log('[SW] تم التثبيت ✅');
});

// ② التفعيل — احذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('[SW] حذف كاش قديم:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
  console.log('[SW] تم التفعيل ✅');
});

// ③ الاعتراض — كاش أولاً، ثم الشبكة
self.addEventListener('fetch', e => {
  // تجاهل طلبات Supabase (لازم إنترنت)
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
    return;
  }

  // تجاهل POST requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      // إذا موجود في الكاش → رجّعه فوراً
      if (cached) {
        // في الخلفية: حدّث الكاش من الشبكة
        fetch(e.request).then(fresh => {
          if (fresh && fresh.status === 200) {
            caches.open(CACHE).then(c => c.put(e.request, fresh));
          }
        }).catch(() => {});
        return cached;
      }

      // إذا غير موجود → اجلبه من الشبكة واحفظه
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => {
        // أوفلاين ولا يوجد كاش → رجّع pos.html كـ fallback
        return caches.match('./pos.html');
      });
    })
  );
});

// ④ رسائل من الصفحة (مثل: تحديث قسري)
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  if (e.data === 'CLEAR_CACHE') {
    caches.delete(CACHE).then(() => console.log('[SW] تم مسح الكاش'));
  }
});
