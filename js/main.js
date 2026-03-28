function render() {
    if (typeof S.cameraActiveInHome === 'undefined') S.cameraActiveInHome = false;

    var tabContent = '';
    if      (S.tab === "home")     tabContent = renderHome();
    else if (S.tab === "stock")    tabContent = renderStock();
    else if (S.tab === "print")    tabContent = renderPrint();
    else if (S.tab === "flixy")    tabContent = renderFlixy();
    else if (S.tab === "clients")  tabContent = renderClients();
    else if (S.tab === "expenses") tabContent = renderExpenses();
    else if (S.tab === "report")   tabContent = renderReport();
    else if (S.tab === "settings") tabContent = renderSettings();

    document.getElementById('root').innerHTML =
        '<div class="app-root">' +

            '<div class="top-bar" id="stickyTop">' +
                renderHeader() +
                renderTabs() +
            '</div>' +

            '<div class="body-row">' +

                '<div class="content-col">' +
                    '<div class="tab-content" id="tabContent">' +
                        tabContent +
                    '</div>' +
                '</div>' +

                '<aside class="cart-aside" id="cartPanel">' +
                    '<div class="cart-aside-inner">' +
                        // زر الإغلاق للموبايل فقط
                        '<button class="cart-close-mob" onclick="closeCart()">✕ إغلاق</button>' +
                        '<div id="cartPanelContent"></div>' +
                    '</div>' +
                '</aside>' +

            '</div>' +

            '<div class="mob-overlay" id="cartOverlay" onclick="closeCart()"></div>' +

        '</div>';

    // مزامنة الوضع الليلي
    if (S.settings && S.settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // ساعة — مرة واحدة فقط
    if (!clockTimer) {
        clockTimer = setInterval(function() {
            var c = document.getElementById('clockLbl');
            var d = document.getElementById('dateLbl');
            if (c) c.textContent = clockStr();
            if (d) d.textContent = dateStr();
        }, 1000);
    }

    // ربط أحداث التبويبات
    if (S.tab === "home")     bindHomeEvents();
    if (S.tab === "stock")    bindStockEvents();
    if (S.tab === "flixy")    bindFlixyEvents();
    if (S.tab === "report")   bindReportEvents();
    if (S.tab === "settings") bindSettingsEvents();

    // ✅ رسم السلة وربط أحداثها بعد بناء DOM مباشرة
    _rebuildCart();

    // ضبط ارتفاع السلة
    _fixCartHeight();

    if (typeof refreshExtras === 'function') refreshExtras();
}

// ✅ دالة موحّدة لإعادة رسم السلة وربط أحداثها
function _rebuildCart() {
    var el = document.getElementById('cartPanelContent');
    if (!el) return;
    el.innerHTML = renderCartPanelContent(_rebuildCart);
    bindCartEvents(_rebuildCart);
}

// ✅ هذه هي الدوال الرسمية — تستخدم _rebuildCart داخلياً
function refreshGlobalCart() { _rebuildCart(); }
function refreshSplitCart()  { _rebuildCart(); }

// فتح/إغلاق السلة في الموبايل
function openCart() {
    var p = document.getElementById('cartPanel');
    var o = document.getElementById('cartOverlay');
    if (p) p.classList.add('open');
    if (o) o.classList.add('open');
}
function closeCart() {
    var p = document.getElementById('cartPanel');
    var o = document.getElementById('cartOverlay');
    if (p) p.classList.remove('open');
    if (o) o.classList.remove('open');
}
function toggleCart() {
    var p = document.getElementById('cartPanel');
    if (p && p.classList.contains('open')) closeCart();
    else openCart();
}

// ضبط ارتفاع السلة الثابتة ديناميكياً
function _fixCartHeight() {
    var top  = document.getElementById('stickyTop');
    var cart = document.getElementById('cartPanel');
    if (!top || !cart) return;
    if (window.innerWidth > 768) {
        var h = top.offsetHeight;
        cart.style.top       = h + 'px';
        cart.style.height    = 'calc(100vh - ' + h + 'px)';
        cart.style.maxHeight = 'calc(100vh - ' + h + 'px)';
    } else {
        cart.style.top = '';
        cart.style.height = '';
        cart.style.maxHeight = '';
    }
}
window.addEventListener('resize', _fixCartHeight);

if (typeof scheduleMidnight === 'function') scheduleMidnight();

try {
    render();
} catch(e) {
    console.error("Render Error:", e);
    document.getElementById('root').innerHTML =
        '<div style="background:#c62828;color:#fff;padding:26px;font-size:16px;' +
        'font-family:Tajawal,Arial;border-radius:18px;margin:20px;text-align:center;direction:rtl">' +
            '<div style="font-size:40px;margin-bottom:15px">⚠️</div>' +
            '<strong>حدث خطأ في التحميل</strong><br><br>' + e.message + '<br>' +
            '<button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;' +
            'border-radius:10px;border:none;cursor:pointer;font-weight:bold">إعادة تحميل</button>' +
        '</div>';
}
