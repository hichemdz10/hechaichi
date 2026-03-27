function renderSettings() {
    var isDark  = localStorage.getItem('hch_dark') === '1';
    var isBeep  = localStorage.getItem('hch_beep') !== '0';
    var isSync  = syncEnabled;

    return '<div style="max-width:560px;margin:0 auto">' +

        // عنوان
        '<div style="font-size:22px;font-weight:900;color:var(--text);margin-bottom:24px;display:flex;align-items:center;gap:10px">' +
            '<span style="background:linear-gradient(135deg,#3668d6,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">⚙️ الإعدادات</span>' +
        '</div>' +

        // ── المظهر ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">🎨 المظهر</div>' +

            // الوضع الليلي
            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">🌙</span>' +
                    '<div><div class="settings-row-label">الوضع الليلي</div>' +
                    '<div class="settings-row-desc">تبديل بين الفاتح والداكن</div></div>' +
                '</div>' +
                '<label class="toggle-switch">' +
                    '<input type="checkbox" id="set_dark"' + (isDark?' checked':'') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +

            // إخفاء الأرقام
            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">👁️</span>' +
                    '<div><div class="settings-row-label">إخفاء الأرقام</div>' +
                    '<div class="settings-row-desc">إخفاء المبالغ عن الأعين</div></div>' +
                '</div>' +
                '<label class="toggle-switch">' +
                    '<input type="checkbox" id="set_hide"' + (S.hideNums?' checked':'') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +
        '</div>' +

        // ── الصوت ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">🔊 الصوت</div>' +
            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">🔔</span>' +
                    '<div><div class="settings-row-label">صوت المسح</div>' +
                    '<div class="settings-row-desc">صوت beep عند مسح الباركود</div></div>' +
                '</div>' +
                '<label class="toggle-switch">' +
                    '<input type="checkbox" id="set_beep"' + (isBeep?' checked':'') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +
        '</div>' +

        // ── السحابة ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">☁️ المزامنة السحابية</div>' +
            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">🔄</span>' +
                    '<div><div class="settings-row-label">مزامنة البيانات</div>' +
                    '<div class="settings-row-desc">' + (isSync ? '✅ المزامنة مفعّلة' : 'حفظ البيانات في السحابة') + '</div></div>' +
                '</div>' +
                (isSync ?
                    '<span style="background:#dcfce7;color:#16a34a;border-radius:20px;padding:5px 14px;font-size:12px;font-weight:700">مفعّلة</span>' :
                    '<button id="set_sync_btn" class="btn" style="background:linear-gradient(135deg,#3668d6,#7c3aed);font-size:13px;padding:8px 18px">تفعيل</button>'
                ) +
            '</div>' +
            '<div id="syncStatusMsg" style="margin-top:8px;font-size:12px;color:var(--text3);padding-right:12px"></div>' +
        '</div>' +

        // ── النسخ الاحتياطي ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">💾 النسخ الاحتياطي</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">⬆️</span>' +
                    '<div><div class="settings-row-label">تصدير نسخة احتياطية</div>' +
                    '<div class="settings-row-desc">حفظ كل البيانات في ملف JSON</div></div>' +
                '</div>' +
                '<button onclick="expBk()" class="btn" style="background:linear-gradient(135deg,#0277bd,#0891b2);font-size:13px;padding:8px 18px">تصدير</button>' +
            '</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">⬇️</span>' +
                    '<div><div class="settings-row-label">استيراد نسخة احتياطية</div>' +
                    '<div class="settings-row-desc">استعادة البيانات من ملف JSON</div></div>' +
                '</div>' +
                '<button onclick="document.getElementById(\'impFile\').click()" class="btn" style="background:linear-gradient(135deg,#059669,#10b981);font-size:13px;padding:8px 18px">استيراد</button>' +
            '</div>' +
            '<input type="file" id="impFile" accept=".json" style="display:none" onchange="impBk(this.files[0]);this.value=\'\'">'+
        '</div>' +

        // ── معلومات ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">ℹ️ عن التطبيق</div>' +
            '<div style="text-align:center;padding:16px 0;color:var(--text3)">' +
                '<div style="font-size:36px;margin-bottom:8px">📚</div>' +
                '<div style="font-size:16px;font-weight:800;color:var(--text)">مكتبة حشايشي</div>' +
                '<div style="font-size:12px;margin-top:4px">HECHAICHI LIBRARY</div>' +
                '<div style="font-size:11px;margin-top:8px;color:var(--text3)">نظام إدارة نقاط البيع</div>' +
            '</div>' +
        '</div>' +

    '</div>';
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
        localStorage.setItem('hch_beep', this.checked ? '1' : '0');
        if (this.checked) beep(true);
    };

    // مزامنة السحابة
    var syncBtn = document.getElementById('set_sync_btn');
    if (syncBtn) syncBtn.onclick = function() {
        var msg = document.getElementById('syncStatusMsg');
        if (msg) msg.innerHTML = '<span style="color:#3668d6">⏳ جاري الاتصال...</span>';
        startSync();
    };
}
