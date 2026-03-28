// main.js - النسخة المصححة

function render() {
    // التأكد من تهيئة حالة الكاميرا في البداية لتجنب أخطاء undefined
    if (typeof S.cameraActiveInHome === 'undefined') S.cameraActiveInHome = false;

    var tabContent = '';
    
    // توجيه العرض بناءً على التبويب النشط
    if      (S.tab === "home")     tabContent = renderHome();
    else if (S.tab === "stock")    tabContent = renderStock();
    else if (S.tab === "print")    tabContent = renderPrint();
    else if (S.tab === "flixy")    tabContent = renderFlixy();
    else if (S.tab === "clients")  tabContent = renderClients();
    // تصحيح الخطأ الإملائي: تم توحيد الاستدعاء ليتوافق مع الملف render-expences.js 
    // أو renderExpenses إذا قمت بتغيير اسم الدالة داخل الملف الآخر.
    else if (S.tab === "expenses") tabContent = typeof renderExpenses === 'function' ? renderExpenses() : renderExpences(); 
    else if (S.tab === "report")   tabContent = renderReport();
    else if (S.tab === "settings") tabContent = renderSettings();

    // هيكل السلة الجانبية
    var cartSlide =
        '<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>' +
        '<div class="cart-sidebar" id="cartPanel">' +
            '<button onclick="closeCart()" style="background:linear-gradient(135deg,#c62828,#e53935);color:#fff;border:none;border-radius:12px;padding:10px;font-size:15px;font-weight:700;margin-bottom:12px;cursor:pointer">✕ إغلاق</button>' +
            '<div id="cartPanelContent">' + renderCartPanelContent(refreshGlobalCart) + '</div>' +
        '</div>';

    // حقن المحتوى في العنصر الرئيسي
    document.getElementById('root').innerHTML =
        '<div class="app-container">' +
            renderTabs() +
            '<div class="main-layout">' +
                renderHeader() +
                '<div class="tab-content">' + tabContent + '</div>' +
            '</div>' +
            cartSlide +
        '</div>';

    // --- إدارة التفاعلات والأحداث (Event Binding) ---

    // 1. تصحيح مزامنة الوضع الليلي (Dark Mode)
    // نعتمد على القيمة الموجودة في S.settings لضمان التوحيد
    if (S.settings && S.settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // 2. تحديث الساعة والتاريخ بشكل دوري
    if (!clockTimer) {
        clockTimer = setInterval(function() {
            var c = document.getElementById('clockLbl');
            var d = document.getElementById('dateLbl');
            if (c) c.textContent = clockStr();
            if (d) d.textContent = dateStr();
        }, 1000);
    }

    // 3. ربط أحداث التبويبات (فقط إذا كان التبويب معروضاً)
    if (S.tab === "home")     bindHomeEvents();
    if (S.tab === "stock")    bindStockEvents();
    if (S.tab === "flixy")    bindFlixyEvents();
    if (S.tab === "report")   bindReportEvents();
    if (S.tab === "settings") bindSettingsEvents();
    
    // ربط أحداث السلة دائماً لأنها مشتركة
    bindCartEvents(refreshGlobalCart);

    // استدعاء الوظائف الإضافية (مثل شريط الملخص العلوي)
    if (typeof refreshExtras === 'function') refreshExtras();
}

// تشغيل الجدولة لصفر الساعة (لتحديث التقارير اليومية تلقائياً)
if (typeof scheduleMidnight === 'function') scheduleMidnight();

// محاولة تشغيل التطبيق مع معالجة الأخطاء الكارثية
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
