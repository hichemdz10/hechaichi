/*
 * ════════════════════════════════════════════════════════════
 *  display.html — كيفية قراءة الصور من IndexedDB
 *  أضف هذا الكود في display.html لعرض الصور بشكل صحيح
 * ════════════════════════════════════════════════════════════
 *
 *  المبدأ:
 *  - display-admin.html يكتب Config (بدون صور) → localStorage
 *  - الصور محفوظة في IndexedDB (نفس المتصفح، نفس الـ origin)
 *  - display.html يقرأ config من localStorage
 *  - لكل شريحة نوعها "image"، يجلب الصورة من IndexedDB بالـ imageId
 * ════════════════════════════════════════════════════════════
 */

// ── 1. فتح قاعدة البيانات (نفس الاسم تماماً) ──────────────
var DB_NAME  = 'hashayshi_pos_db';   // ← نفس الاسم في display-admin.html
var DB_VER   = 1;
var STORE    = 'images';
var displayDB = null;

function openDisplayDB(callback) {
  var req = indexedDB.open(DB_NAME, DB_VER);
  req.onsuccess = function(e) {
    displayDB = e.target.result;
    callback();
  };
  req.onerror = function(e) {
    console.warn('IndexedDB unavailable:', e.target.error);
    callback(); // تابع حتى بدون صور
  };
  req.onupgradeneeded = function(e) {
    // يحدث فقط إذا فُتحت display.html قبل display-admin.html
    e.target.result.createObjectStore(STORE, { keyPath: 'id' });
  };
}

// ── 2. جلب صورة واحدة بالـ ID ─────────────────────────────
function getImageFromDB(id, callback) {
  if (!displayDB) { callback(null); return; }
  try {
    var tx  = displayDB.transaction(STORE, 'readonly');
    var req = tx.objectStore(STORE).get(id);
    req.onsuccess = function(e) { callback(e.target.result ? e.target.result.data : null); };
    req.onerror   = function()  { callback(null); };
  } catch(e) { callback(null); }
}

// ── 3. عرض شريحة مع صورتها ────────────────────────────────
function showSlide(slide, container) {
  container.style.background = '#0a0a1a';

  // ألوان التظليل
  var overlays = {
    purple: 'rgba(124,58,237,0.25)',
    blue:   'rgba(59,130,246,0.25)',
    green:  'rgba(16,185,129,0.25)',
    orange: 'rgba(245,158,11,0.25)',
    pink:   'rgba(236,72,153,0.25)',
    teal:   'rgba(20,184,166,0.25)',
    dark:   'rgba(0,0,0,0.70)',
    none:   'transparent'
  };
  var overlay = overlays[slide.color] || overlays.purple;

  var render = function(imageData) {
    container.innerHTML =
      // الصورة (إذا وجدت)
      (imageData
        ? '<img src="' + imageData + '" style="' +
            'position:absolute;inset:0;width:100%;height:100%;' +
            'object-fit:cover;object-position:center;z-index:0">'
        : '') +
      // طبقة التظليل الملوّنة
      '<div style="position:absolute;inset:0;background:' + overlay + ';z-index:1"></div>' +
      // النصوص
      '<div style="' +
          'position:absolute;inset:0;z-index:2;' +
          'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
          'text-align:center;padding:40px;gap:16px">' +

        // العنوان
        (slide.title
          ? '<div style="' +
                'font-size:clamp(28px,4vw,64px);font-weight:900;color:#fff;' +
                'text-shadow:0 3px 16px rgba(0,0,0,.6);line-height:1.2">' +
              slide.title + '</div>'
          : '') +

        // الوصف
        (slide.desc
          ? '<div style="' +
                'font-size:clamp(14px,2vw,32px);color:rgba(255,255,255,.85);' +
                'text-shadow:0 2px 8px rgba(0,0,0,.5);max-width:80%">' +
              slide.desc + '</div>'
          : '') +

        // الشارة
        (slide.badge
          ? '<div style="' +
                'background:rgba(124,58,237,.55);backdrop-filter:blur(8px);' +
                'color:#fff;padding:8px 28px;border-radius:40px;' +
                'font-size:clamp(12px,1.5vw,24px);font-weight:700;' +
                'border:1px solid rgba(255,255,255,.2)">' +
              slide.badge + '</div>'
          : '') +

      '</div>';
  };

  // هل الشريحة تحتوي على صورة؟
  if (slide.type === 'image' && slide.imageId) {
    getImageFromDB(slide.imageId, function(imageData) {
      render(imageData);
    });
  } else {
    render(null);
  }
}

// ── 4. حلقة الشرائح الرئيسية ──────────────────────────────
var slideTimer    = null;
var currentSlideIndex = 0;
var activeSlides  = [];

function startSlideshow(slides, container, defaultDuration) {
  activeSlides = slides;
  currentSlideIndex = 0;
  clearInterval(slideTimer);

  function next() {
    if (!activeSlides.length) return;
    var slide = activeSlides[currentSlideIndex % activeSlides.length];
    showSlide(slide, container);
    currentSlideIndex++;
    var dur = (slide.dur ? slide.dur * 1000 : null) || defaultDuration || 6000;
    clearInterval(slideTimer);
    slideTimer = setTimeout(next, dur);
  }

  next();
}

// ── 5. مراقبة الإعدادات الجديدة ───────────────────────────
var lastConfigTs = 0;

function watchConfig(container, tickerEl) {
  setInterval(function() {
    var raw = localStorage.getItem('hashayshi_display_full_config');
    if (!raw) return;
    try {
      var cfg = JSON.parse(raw);
      if (cfg.ts === lastConfigTs) return; // لا تغيير
      lastConfigTs = cfg.ts;

      // تحديث شريط الأخبار
      if (tickerEl && cfg.ticker && cfg.ticker.length) {
        tickerEl.textContent = '📢  ' + cfg.ticker.join('  ✦  ');
      }

      // تحديث الشرائح
      var slides = (cfg.slides || []).filter(function(s){ return s.active !== false; });
      if (slides.length) {
        startSlideshow(slides, container, cfg.slideDuration);
      }
    } catch(e) {}
  }, 1000);
}

// ── 6. الكود الكامل لتشغيل display.html ───────────────────
/*
  أضف هذا في window.onload داخل display.html:

  window.onload = function() {
    var container = document.getElementById('slide-container');  // عدّل الـ ID
    var tickerEl  = document.getElementById('ticker-text');      // عدّل الـ ID

    // افتح قاعدة البيانات أولاً
    openDisplayDB(function() {
      // ابدأ مراقبة الإعدادات
      watchConfig(container, tickerEl);

      // حاول تحميل الإعدادات الحالية فوراً
      var raw = localStorage.getItem('hashayshi_display_full_config');
      if (raw) {
        try {
          var cfg = JSON.parse(raw);
          lastConfigTs = cfg.ts;
          var slides = (cfg.slides || []).filter(function(s){ return s.active !== false; });
          if (tickerEl && cfg.ticker) {
            tickerEl.textContent = '📢  ' + cfg.ticker.join('  ✦  ');
          }
          if (slides.length) startSlideshow(slides, container, cfg.slideDuration);
        } catch(e) {}
      }
    });
  };
*/
