function renderTabs() {
    var tabKeys = ["home","stock","print","flixy","clients","expenses","report","settings"];
    var low = lowItems().length;

    var navBtns = tabKeys.map(function(k) {
        var t = TAB_STYLES[k];
        if (!t) return '';
        var active = S.tab === k;
        var parts = t.label.split(' '), icon = parts[0], text = parts.slice(1).join(' ');
        var badge = k === "stock" && low > 0 ? '<span class="tab-badge">' + low + '</span>' : '';
        return '<button class="tab-btn-vertical ' + (active ? 'active' : '') + '" onclick="S.tab=\'' + k + '\';save();render()">' +
            '<span>' + icon + '</span><span>' + text + '</span>' + badge +
        '</button>';
    });

    // إحصائيات مضغوطة – ستوضع أسفل زر التقارير
    var net = tNet();
    var sideStats =
        '<div class="sidebar-stats">' +
            '<div class="sidebar-stat-title">📊 اليوم</div>' +
            '<div class="sidebar-stat-row">' +
                '<span class="sidebar-stat-label">💰 مبيعات</span>' +
                '<span class="sidebar-stat-val">' + H(fmt(tST())) + '</span>' +
            '</div>' +
            '<div class="sidebar-stat-row">' +
                '<span class="sidebar-stat-label">📈 أرباح</span>' +
                '<span class="sidebar-stat-val" style="color:#4ade80">' + H(fmt(tPR())) + '</span>' +
            '</div>' +
            '<div class="sidebar-stat-row">' +
                '<span class="sidebar-stat-label">⚡ Flixy</span>' +
                '<span class="sidebar-stat-val" style="color:#818cf8">' + H(fmt(tFT())) + '</span>' +
            '</div>' +
            '<div class="sidebar-stat-row">' +
                '<span class="sidebar-stat-label">🖨️ طباعة</span>' +
                '<span class="sidebar-stat-val" style="color:#67e8f9">' + H(fmt(tPT())) + '</span>' +
            '</div>' +
            '<div class="sidebar-stat-divider"></div>' +
            '<div class="sidebar-stat-row">' +
                '<span class="sidebar-stat-label">💸 مصاريف</span>' +
                '<span class="sidebar-stat-val" style="color:#f87171">' + H(fmt(tET())) + '</span>' +
            '</div>' +
            '<div class="sidebar-stat-net ' + (net >= 0 ? 'pos' : 'neg') + '">' +
                '<span>🏦 صافي</span>' +
                '<span>' + H(fmt(net)) + ' دج</span>' +
            '</div>' +
        '</div>';

    // إدراج الإحصائيات بعد زر التقارير
    var reportIndex = tabKeys.indexOf("report");
    if (reportIndex !== -1) {
        navBtns.splice(reportIndex + 1, 0,
            '<hr style="margin:12px 10px; border:0; height:1px; background:rgba(255,255,255,.1)">',
            sideStats
        );
    }

    var spacer = '<div style="flex:1;min-height:16px"></div>';
    return '<div class="sidebar">' + navBtns.join('') + spacer + '</div>';
}
