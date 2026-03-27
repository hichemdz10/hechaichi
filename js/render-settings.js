function renderSettings() {
    var s = S.settings;
    return '<div style="max-width:560px;margin:0 auto">' +
        '<div style="font-size:22px;font-weight:900;color:var(--text);margin-bottom:24px;display:flex;align-items:center;gap:10px">' +
            '<span style="background:linear-gradient(135deg,#3668d6,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">⚙️ الإعدادات</span>' +
        '</div>' +

        // ── المظهر ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">🎨 المظهر</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">🌙</span>' +
                    '<div><div class="settings-row-label">الوضع الليلي</div>' +
                    '<div class="settings-row-desc">تبديل بين الفاتح والداكن</div></div>' +
                '</div>' +
                '<label class="toggle-switch">' +
                    '<input type="checkbox" id="set_dark"' + (s.darkMode ? ' checked' : '') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">👁️</span>' +
                    '<div><div class="settings-row-label">إخفاء الأرقام</div>' +
                    '<div class="settings-row-desc">إخفاء المبالغ عن الأعين</div></div>' +
                '</div>' +
                '<label class="toggle-switch">' +
                    '<input type="checkbox" id="set_hide"' + (s.hideNums ? ' checked' : '') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">🔤</span>' +
                    '<div><div class="settings-row-label">حجم الخط</div>' +
                    '<div class="settings-row-desc">تصغير أو تكبير النصوص</div></div>' +
                '</div>' +
                '<select id="set_fontsize" class="inp" style="width:auto;padding:5px 12px">' +
                    '<option value="small"' + (s.fontSize === "small" ? " selected" : "") + '>صغير</option>' +
                    '<option value="medium"' + (s.fontSize === "medium" ? " selected" : "") + '>متوسط</option>' +
                    '<option value="large"' + (s.fontSize === "large" ? " selected" : "") + '>كبير</option>' +
                '</select>' +
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
                    '<input type="checkbox" id="set_beep"' + (s.beepEnabled ? ' checked' : '') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +
        '</div>' +

        // ── المخزون ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">📦 المخزون</div>' +
            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">⚠️</span>' +
                    '<div><div class="settings-row-label">حد التنبيه للمخزون المنخفض</div>' +
                    '<div class="settings-row-desc">عدد القطع المتبقية التي تظهر التنبيه</div></div>' +
                '</div>' +
                '<input id="set_lowstock" type="number" value="' + s.lowStockThreshold + '" style="width:70px;padding:6px;border-radius:10px;border:1px solid var(--border2);text-align:center">' +
            '</div>' +
        '</div>' +

        // ── السلة والبيع ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">🛒 السلة والبيع</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">🖨️</span>' +
                    '<div><div class="settings-row-label">طباعة الفاتورة تلقائياً بعد البيع</div>' +
                    '<div class="settings-row-desc">فتح نافذة الطباعة فور إتمام البيع</div></div>' +
                '</div>' +
                '<label class="toggle-switch">' +
                    '<input type="checkbox" id="set_autoprint"' + (s.autoPrintAfterSale ? ' checked' : '') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">🗑️</span>' +
                    '<div><div class="settings-row-label">تفريغ السلة بعد البيع</div>' +
                    '<div class="settings-row-desc">مسح محتويات السلة تلقائياً بعد الدفع</div></div>' +
                '</div>' +
                '<label class="toggle-switch">' +
                    '<input type="checkbox" id="set_clearcart"' + (s.clearCartAfterSale ? ' checked' : '') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>' +
        '</div>' +

        // ── السحابة والنسخ الاحتياطي ──
        '<div class="settings-section">' +
            '<div class="settings-section-title">☁️ المزامنة السحابية والنسخ الاحتياطي</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">⬆️</span>' +
                    '<div><div class="settings-row-label">رفع للسحابة</div>' +
                    '<div class="settings-row-desc">حفظ البيانات الحالية في السحابة</div></div>' +
                '</div>' +
                '<button id="syncUpBtn" class="btn" style="background:linear-gradient(135deg,#3668d6,#7c3aed);font-size:13px;padding:8px 18px">رفع</button>' +
            '</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">⬇️</span>' +
                    '<div><div class="settings-row-label">استيراد من السحابة</div>' +
                    '<div class="settings-row-desc">استبدال بيانات الجهاز ببيانات السحابة</div></div>' +
                '</div>' +
                '<button id="syncDownBtn" class="btn" style="background:linear-gradient(135deg,#3668d6,#7c3aed);font-size:13px;padding:8px 18px">استيراد</button>' +
            '</div>' +
            '<div id="syncStatusMsg" style="margin-top:8px;font-size:12px;color:var(--text3);padding-right:12px"></div>' +

            '<div style="border-top:1px solid var(--border);margin:16px 0 8px;"></div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">💾</span>' +
                    '<div><div class="settings-row-label">تصدير نسخة احتياطية (JSON)</div>' +
                    '<div class="settings-row-desc">حفظ كل البيانات في ملف JSON</div></div>' +
                '</div>' +
                '<button onclick="expBk()" class="btn" style="background:linear-gradient(135deg,#059669,#10b981);font-size:13px;padding:8px 18px">تصدير</button>' +
            '</div>' +

            '<div class="settings-row">' +
                '<div class="settings-row-info">' +
                    '<span class="settings-row-icon">📂</span>' +
                    '<div><div class="settings-row-label">استيراد نسخة احتياطية (JSON)</div>' +
                    '<div class="settings-row-desc">استعادة البيانات من ملف</div></div>' +
                '</div>' +
                '<button onclick="document.getElementById(\'impFile\').click()" class="btn" style="background:linear-gradient(135deg,#059669,#10b981);font-size:13px;padding:8px 18px">استيراد</button>' +
            '</div>' +
            '<input type="file" id="impFile" accept=".json" style="display:none" onchange="impBk(this.files[0]);this.value=\'\'">' +
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
    if (S.tab !== "settings") return;

    var darkEl = document.getElementById('set_dark');
    if (darkEl) darkEl.onchange = function() {
        var dark = this.checked;
        S.settings.darkMode = dark;
        document.body.classList.toggle('dark-mode', dark);
        var btn = document.getElementById('darkModeToggle');
        if (btn) btn.textContent = dark ? '☀️' : '🌙';
        saveSettings();
        render(); // لإعادة رسم الألوان
    };

    var hideEl = document.getElementById('set_hide');
    if (hideEl) hideEl.onchange = function() {
        S.settings.hideNums = this.checked;
        S.hideNums = this.checked;
        saveSettings();
        render();
    };

    var beepEl = document.getElementById('set_beep');
    if (beepEl) beepEl.onchange = function() {
        S.settings.beepEnabled = this.checked;
        saveSettings();
    };

    var lowEl = document.getElementById('set_lowstock');
    if (lowEl) lowEl.onchange = function() {
        var v = parseInt(this.value, 10);
        if (isNaN(v) || v < 0) v = 5;
        S.settings.lowStockThreshold = v;
        saveSettings();
        render(); // لتحديث شارة المخزون المنخفض
    };

    var fontSizeEl = document.getElementById('set_fontsize');
    if (fontSizeEl) fontSizeEl.onchange = function() {
        S.settings.fontSize = this.value;
        applyFontSize(S.settings.fontSize);
        saveSettings();
    };

    var autoPrintEl = document.getElementById('set_autoprint');
    if (autoPrintEl) autoPrintEl.onchange = function() {
        S.settings.autoPrintAfterSale = this.checked;
        saveSettings();
    };

    var clearCartEl = document.getElementById('set_clearcart');
    if (clearCartEl) clearCartEl.onchange = function() {
        S.settings.clearCartAfterSale = this.checked;
        saveSettings();
    };

    // أحداث المزامنة
    var upBtn = document.getElementById('syncUpBtn');
    var downBtn = document.getElementById('syncDownBtn');
    var statusEl = document.getElementById('syncStatusMsg');
    if (upBtn) {
        upBtn.onclick = function() {
            if (!confirm("سيتم رفع بياناتك واستبدال بيانات السحابة. موافق؟")) return;
            if (statusEl) statusEl.innerHTML = '<span style="color:#0284c7">⏳ جاري الرفع...</span>';
            syncEnabled = true;
            pushToCloud();
            setTimeout(function() { if (statusEl) statusEl.innerHTML = '<span style="color:#16a34a;font-weight:600">✅ تم رفع البيانات بنجاح!</span>'; }, 1200);
        };
    }
    if (downBtn) {
        downBtn.onclick = function() {
            if (!confirm("سيتم استبدال بيانات جهازك ببيانات السحابة. موافق؟")) return;
            if (statusEl) statusEl.innerHTML = '<span style="color:#0284c7">⏳ جاري التحميل...</span>';
            syncEnabled = true;
            sbGet("app_state", function(data) {
                if (!data || !data.stock || data.stock.length === 0) {
                    if (statusEl) statusEl.innerHTML = '<span style="color:#dc2626;font-weight:600">❌ السحابة فارغة!</span>';
                    return;
                }
                applyCloud(data);
                if (statusEl) statusEl.innerHTML = '<span style="color:#16a34a;font-weight:600">✅ تم تحميل ' + data.stock.length + ' منتج!</span>';
            });
        };
    }
}
