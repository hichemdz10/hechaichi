function renderTabs() {
    var tabKeys  = ["home","stock","print","flixy","clients","expenses","report","settings"];
    var low      = lowItems().length;
    var net      = tNet();

    var navBtns = tabKeys.map(function(k) {
        var t = TAB_STYLES[k];
        if (!t) return '';
        var active = S.tab === k;
        var parts  = t.label.split(' ');
        var icon   = parts[0];
        var text   = parts.slice(1).join(' ');
        var badge  = (k === "stock" && low > 0)
            ? '<span class="nav-tab-badge">' + low + '</span>'
            : '';
        return '<button class="nav-tab' + (active ? ' active' : '') + '" ' +
               'onclick="S.tab=\'' + k + '\';save();render()">' +
            '<span class="nav-tab-icon">' + icon + '</span>' +
            '<span class="nav-tab-label">' + text + '</span>' +
            badge +
        '</button>';
    }).join('');

    // ملخص سريع على يمين شريط التنقل (ديسكتوب فقط)
    var quickStats =
        '<div class="nav-quick-stats">' +
            '<div class="nav-stat">' +
                '<span class="nav-stat-lbl">💰 مبيعات</span>' +
                '<span class="nav-stat-val">' + H(fmt(tST())) + '</span>' +
            '</div>' +
            '<div class="nav-stat">' +
                '<span class="nav-stat-lbl">📈 أرباح</span>' +
                '<span class="nav-stat-val" style="color:var(--green)">' + H(fmt(tPR())) + '</span>' +
            '</div>' +
            '<div class="nav-stat">' +
                '<span class="nav-stat-lbl">⚡ Flixy</span>' +
                '<span class="nav-stat-val" style="color:#818cf8">' + H(fmt(tFT())) + '</span>' +
            '</div>' +
            '<div class="nav-stat nav-stat-net ' + (net >= 0 ? 'pos' : 'neg') + '">' +
                '<span class="nav-stat-lbl">🏦 صافي</span>' +
                '<span class="nav-stat-val">' + H(fmt(net)) + ' دج</span>' +
            '</div>' +
        '</div>';

    return '<nav class="main-nav">' +
        '<div class="nav-scroll">' + navBtns + '</div>' +
        quickStats +
    '</nav>';
}
