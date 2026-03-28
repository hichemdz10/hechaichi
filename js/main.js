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
        '<div class="app-wrapper">' +

            // ── الجزء العلوي الثابت: هيدر + شريط تنقل ──
            '<div class="sticky-header" id="stickyTop">' +
                renderHeader() +
                renderTabs() +
            '</div>' +

            // ── جسم الصفحة: محتوى + سلة ثابتة ──
            '<div class="page-body">' +
                '<div class="main-content-area">' +
                    '<div class="tab-content">' + tabContent + '</div>' +
                '</div>' +

                // السلة: ثابتة على اليسار في الديسكتوب / sheet سفلي في الموبايل
                '<div class="cart-column" id="cartPanel">' +
                    '<button class="cart-col-close" onclick="closeCart()">✕ إغلاق</button>' +
                    '<div id="cartPanelContent">' +
                        renderCartPanelContent(refreshGlobalCart) +
                    '</div>' +
                '</div>' +
            '</div>' +

            // Overlay خلفية (موبايل فقط)
            '<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>' +

        '</div>';

    // ── مزامنة الوضع الليلي ──
    if (S.settings && S.settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // ── ساعة دورية ──
    if (!clockTimer) {
        clockTimer = setInterval(function() {
            var c = document.getElementById('clockLbl');
            var d = document.getElementById('dateLbl');
            if (c) c.textContent = clockStr();
            if (d) d.textContent = dateStr();
        }, 1000);
    }

    // ── ربط الأحداث ──
    if (S.tab === "home")     bindHomeEvents();
    if (S.tab === "stock")    bindStockEvents();
    if (S.tab === "flixy")    bindFlixyEvents();
    if (S.tab === "report")   bindReportEvents();
    if (S.tab === "settings") bindSettingsEvents();

    bindCartEvents(refreshGlobalCart);

    if (typeof refreshExtras === 'function') refreshExtras();
}

if (typeof scheduleMidnight === 'function') scheduleMidnight();

try {
    render();
} catch(e) {
    console.error("Render Error:", e);
    document.getElementById('root').innerHTML =
        '<div style="background:linear-gradient(135deg,#c62828,#e53935);color:#fff;padding:26px;font-size:16px;font-family:Tajawal,Arial;border-radius:18px;margin:20px;text-align:center;direction:rtl">' +
            '<div style="font-size:40px;margin-bottom:15px">⚠️</div>' +
            '<strong>عذراً، حدث خطأ في تحميل النظام.</strong><br><br>' +
            'السبب المحتمل: ' + e.message + '<br>' +
            '<button onclick="location.reload()" style="margin-top:20px;padding:10px 20px;border-radius:10px;border:none;cursor:pointer;font-weight:bold">إعادة تحميل الصفحة</button>' +
        '</div>';
}
