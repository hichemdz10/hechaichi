function renderSettings() {
    var isDark = localStorage.getItem('hch_dark') === '1';
    var isBeep = S.beepEnabled;
    var lowThres = S.lowStockThreshold;
    var autoPrint = S.autoPrint;
    var clearCart = S.clearCartAfterSale;
    var fontSize = S.fontSize;
    var isSync = syncEnabled;

    return `
    <div style="max-width:700px;margin:0 auto">
        <div style="font-size:24px;font-weight:800;margin-bottom:24px;display:flex;align-items:center;gap:12px">
            <span>⚙️</span> الإعدادات
        </div>

        <!-- المظهر -->
        <div class="settings-section">
            <div class="settings-section-title">🎨 المظهر</div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">🌙</span>
                    <div><div class="settings-row-label">الوضع الليلي</div>
                    <div class="settings-row-desc">تبديل بين الفاتح والداكن</div></div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="set_dark" ${isDark ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">👁️</span>
                    <div><div class="settings-row-label">إخفاء الأرقام</div>
                    <div class="settings-row-desc">إخفاء المبالغ عن الأعين</div></div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="set_hide" ${S.hideNums ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>

        <!-- الصوت -->
        <div class="settings-section">
            <div class="settings-section-title">🔊 الصوت</div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">🔔</span>
                    <div><div class="settings-row-label">صوت المسح</div>
                    <div class="settings-row-desc">تشغيل صوت عند مسح الباركود</div></div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="set_beep" ${isBeep ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>

        <!-- المخزون -->
        <div class="settings-section">
            <div class="settings-section-title">📦 المخزون</div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">⚠️</span>
                    <div><div class="settings-row-label">حد التنبيه للمخزون المنخفض</div>
                    <div class="settings-row-desc">عند وصول الكمية إلى هذا الرقم تظهر إشارة تحذير</div></div>
                </div>
                <input type="number" id="set_lowStock" value="${lowThres}" style="width:80px;padding:8px;border-radius:12px;border:1px solid #ccc;text-align:center">
            </div>
        </div>

        <!-- الفواتير -->
        <div class="settings-section">
            <div class="settings-section-title">🧾 الفواتير</div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">🖨️</span>
                    <div><div class="settings-row-label">طباعة تلقائية بعد البيع</div>
                    <div class="settings-row-desc">طباعة الفاتورة مباشرة بعد إتمام عملية الدفع</div></div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="set_autoPrint" ${autoPrint ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">🗑️</span>
                    <div><div class="settings-row-label">تفريغ السلة بعد البيع</div>
                    <div class="settings-row-desc">مسح محتويات السلة بعد إتمام البيع</div></div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="set_clearCart" ${clearCart ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>

        <!-- الخط -->
        <div class="settings-section">
            <div class="settings-section-title">🔤 حجم الخط</div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">Aa</span>
                    <div><div class="settings-row-label">حجم النصوص</div>
                    <div class="settings-row-desc">صغير – متوسط – كبير</div></div>
                </div>
                <select id="set_fontSize" style="padding:8px 12px;border-radius:12px;border:1px solid #ccc;background:#fff">
                    <option value="small" ${fontSize === 'small' ? 'selected' : ''}>صغير</option>
                    <option value="medium" ${fontSize === 'medium' ? 'selected' : ''}>متوسط</option>
                    <option value="large" ${fontSize === 'large' ? 'selected' : ''}>كبير</option>
                </select>
            </div>
        </div>

        <!-- السحابة والنسخ الاحتياطي -->
        <div class="settings-section">
            <div class="settings-section-title">☁️ المزامنة السحابية</div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">🔄</span>
                    <div><div class="settings-row-label">مزامنة البيانات</div>
                    <div class="settings-row-desc">${isSync ? '✅ المزامنة مفعّلة' : 'حفظ البيانات في السحابة'}</div></div>
                </div>
                ${isSync ?
                    '<span style="background:#dcfce7;color:#16a34a;border-radius:20px;padding:5px 14px;font-size:12px;font-weight:700">مفعّلة</span>' :
                    '<button id="set_sync_btn" class="btn" style="background:linear-gradient(135deg,#3668d6,#7c3aed);font-size:13px;padding:8px 18px">تفعيل</button>'
                }
            </div>
            <div id="syncStatusMsg" style="margin-top:8px;font-size:12px;color:var(--text3);padding-right:12px"></div>
        </div>

        <div class="settings-section">
            <div class="settings-section-title">💾 النسخ الاحتياطي</div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">⬆️</span>
                    <div><div class="settings-row-label">تصدير نسخة احتياطية</div>
                    <div class="settings-row-desc">حفظ كل البيانات في ملف JSON</div></div>
                </div>
                <button onclick="expBk()" class="btn" style="background:linear-gradient(135deg,#0277bd,#0891b2);font-size:13px;padding:8px 18px">تصدير</button>
            </div>
            <div class="settings-row">
                <div class="settings-row-info">
                    <span class="settings-row-icon">⬇️</span>
                    <div><div class="settings-row-label">استيراد نسخة احتياطية</div>
                    <div class="settings-row-desc">استعادة البيانات من ملف JSON</div></div>
                </div>
                <button onclick="document.getElementById('impFile').click()" class="btn" style="background:linear-gradient(135deg,#059669,#10b981);font-size:13px;padding:8px 18px">استيراد</button>
                <input type="file" id="impFile" accept=".json" style="display:none" onchange="impBk(this.files[0]);this.value=''">
            </div>
        </div>

        <!-- معلومات -->
        <div class="settings-section">
            <div class="settings-section-title">ℹ️ عن التطبيق</div>
            <div style="text-align:center;padding:16px 0;color:var(--text3)">
                <div style="font-size:36px;margin-bottom:8px">📚</div>
                <div style="font-size:16px;font-weight:800;color:var(--text)">مكتبة حشايشي</div>
                <div style="font-size:12px;margin-top:4px">HECHAICHI LIBRARY</div>
                <div style="font-size:11px;margin-top:8px;color:var(--text3)">نظام إدارة نقاط البيع</div>
            </div>
        </div>
    </div>
    `;
}

function bindSettingsEvents() {
    // الوضع الليلي
    var darkEl = document.getElementById('set_dark');
    if (darkEl) darkEl.onchange = function() {
        var dark = this.checked;
        document.body.classList.toggle('dark-mode', dark);
        localStorage.setItem('hch_dark', dark ? '1' : '0');
        var btn = document.getElementById('darkModeToggle');
        if (btn) btn.textContent = dark ? '☀️' : '🌙';
    };

    // إخفاء الأرقام
    var hideEl = document.getElementById('set_hide');
    if (hideEl) hideEl.onchange = function() {
        S.hideNums = this.checked;
        save();
        render();
    };

    // صوت المسح
    var beepEl = document.getElementById('set_beep');
    if (beepEl) beepEl.onchange = function() {
        S.beepEnabled = this.checked;
        localStorage.setItem('hch_beep', S.beepEnabled ? '1' : '0');
        if (this.checked) beep(true);
    };

    // حد المخزون المنخفض
    var lowStockEl = document.getElementById('set_lowStock');
    if (lowStockEl) lowStockEl.onchange = function() {
        var val = parseInt(this.value) || 5;
        if (val < 1) val = 1;
        S.lowStockThreshold = val;
        localStorage.setItem('hch_lowStock', val);
        render(); // لإعادة حساب التنبيهات
    };

    // طباعة تلقائية
    var autoPrintEl = document.getElementById('set_autoPrint');
    if (autoPrintEl) autoPrintEl.onchange = function() {
        S.autoPrint = this.checked;
        localStorage.setItem('hch_autoPrint', S.autoPrint ? '1' : '0');
    };

    // تفريغ السلة بعد البيع
    var clearCartEl = document.getElementById('set_clearCart');
    if (clearCartEl) clearCartEl.onchange = function() {
        S.clearCartAfterSale = this.checked;
        localStorage.setItem('hch_clearCart', S.clearCartAfterSale ? '1' : '0');
    };

    // حجم الخط
    var fontSizeEl = document.getElementById('set_fontSize');
    if (fontSizeEl) fontSizeEl.onchange = function() {
        S.fontSize = this.value;
        localStorage.setItem('hch_fontSize', S.fontSize);
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add('font-' + S.fontSize);
        render(); // لإعادة تطبيق الأحجام على بعض العناصر
    };

    // مزامنة السحابة
    var syncBtn = document.getElementById('set_sync_btn');
    if (syncBtn) syncBtn.onclick = function() {
        var msg = document.getElementById('syncStatusMsg');
        if (msg) msg.innerHTML = '<span style="color:#3668d6">⏳ جاري الاتصال...</span>';
        startSync();
    };
}
