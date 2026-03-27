function renderTabs() {
    // أزل "settings" لأنه غير موجود في TAB_STYLES
    var tabKeys = ["home","stock","print","flixy","clients","expenses","report"];
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
    }).join('');

    // إحصائيات مضغوطة — تظهر فقط على الكمبيوتر
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

    return '<div class="sidebar">' + navBtns + '<div style="margin-top: 12px;"></div>' + sideStats + '</div>';
}
