function render() {
    if (typeof S.cameraActiveInHome === 'undefined') S.cameraActiveInHome = false;

    // تطبيق حجم الخط من الإعدادات
    applyFontSize(S.settings.fontSize);

    var tabContent = '';
    if      (S.tab === "home")     tabContent = renderHome();
    else if (S.tab === "stock")    tabContent = renderStock();
    else if (S.tab === "print")    tabContent = renderPrint();
    else if (S.tab === "flixy")    tabContent = renderFlixy();
    else if (S.tab === "clients")  tabContent = renderClients();
    else if (S.tab === "expenses") tabContent = renderExpenses();
    else if (S.tab === "report")   tabContent = renderReport();
    else if (S.tab === "settings") tabContent = renderSettings();

    // السلة الثابتة (دائماً ظاهرة على الديسكتوب)
    var cartColumn =
        '<div class="cart-column" id="cartColumn">' +
            '<div class="cart-column-header">' +
                '<span style="font-size:20px">🛒</span>' +
                '<span style="font-weight:800;font-size:15px">السلة</span>' +
                (S.cart.length > 0 ?
                    '<span class="cart-col-badge">' + S.cart.length + '</span>' : '') +
            '</div>' +
            '<div id="cartColumnContent">' + renderCartPanelContent(refreshGlobalCart) + '</div>' +
        '</div>';

    // السلة المنزلقة (للموبايل فقط)
    var cartSlide =
        '<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>' +
        '<div class="cart-sidebar" id="cartPanel">' +
            '<button onclick="closeCart()" style="background:linear-gradient(135deg,#c62828,#e53935);color:#fff;border:none;border-radius:12px;padding:10px;font-size:15px;font-weight:700;margin-bottom:12px;cursor:pointer">✕ إغلاق</button>' +
            '<div id="cartPanelContent">' + renderCartPanelContent(refreshGlobalCart) + '</div>' +
        '</div>';

    document.getElementById('root').innerHTML =
        '<div class="app-layout">' +
            renderTabs() +
            '<div class="main-content">' +
                renderHeader() +
                '<div class="tab-content">' + tabContent + '</div>' +
            '</div>' +
            cartColumn +
        '</div>' +
        cartSlide;

    // زر الوضع الليلي
    if (!document.getElementById('darkModeToggle')) {
        var btn = document.createElement('button');
        btn.id = 'darkModeToggle';
        var isDark = S.settings.darkMode;
        if (isDark) document.body.classList.add('dark-mode');
        btn.textContent = isDark ? '☀️' : '🌙';
        btn.title = 'تبديل الوضع الليلي';
        btn.onclick = function() {
            var dark = document.body.classList.toggle('dark-mode');
            btn.textContent = dark ? '☀️' : '🌙';
            S.settings.darkMode = dark;
            saveSettings();
        };
        document.body.appendChild(btn);
    }

    if (!clockTimer) {
        clockTimer = setInterval(function() {
            var c = document.getElementById('clockLbl');
            var d = document.getElementById('dateLbl');
            if (c) c.textContent = clockStr();
            if (d) d.textContent = dateStr();
        }, 1000);
    }

    if (S.tab === "home")     bindHomeEvents();
    if (S.tab === "flixy")    bindFlixyEvents();
    if (S.tab === "report")   bindReportEvents();
    if (S.tab === "settings") bindSettingsEvents();
    bindCartEvents(refreshGlobalCart);
    bindCartEvents(refreshCartColumn);
}

// تحديث السلة الثابتة فقط
function refreshCartColumn() {
    var el = document.getElementById('cartColumnContent');
    if (el) el.innerHTML = renderCartPanelContent(refreshCartColumn);
    // تحديث شارة العدد
    var badge = document.querySelector('.cart-col-badge');
    if (badge) badge.textContent = S.cart.length;
    bindCartEvents(refreshCartColumn);
}

scheduleMidnight();
try {
    render();
} catch(e) {
    document.getElementById('root').innerHTML =
        '<div style="background:linear-gradient(135deg,#c62828,#e53935);color:#fff;padding:26px;font-size:16px;font-family:Tajawal,Arial;border-radius:18px;margin:20px;direction:rtl">' +
        '<h2 style="margin-bottom:12px">⚠️ خطأ</h2><p>' + e.message + '</p>' +
        '<pre style="font-size:12px;overflow:auto;white-space:pre-wrap;margin-top:13px;opacity:.8">' + (e.stack||'') + '</pre></div>';
}
