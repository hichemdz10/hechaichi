function createDarkModeBtn() {
    if (document.getElementById('darkModeToggle')) return;
    var btn = document.createElement('button');
    btn.id = 'darkModeToggle';
    var isDark = localStorage.getItem('hch_dark') === '1';
    if (isDark) document.body.classList.add('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = 'تبديل الوضع الليلي';
    btn.onclick = function() {
        var dark = document.body.classList.toggle('dark-mode');
        btn.textContent = dark ? '☀️' : '🌙';
        localStorage.setItem('hch_dark', dark ? '1' : '0');
    };
    document.body.appendChild(btn);
}

function injectLiveBar() {
    if (window.innerWidth < 769) return;
    if (S.tab !== 'home' || S.cameraActiveInHome) return;
    if (document.getElementById('liveBar')) return;
    var tc = document.querySelector('.tab-content');
    if (!tc) return;

    var last7 = [];
    for (var i = 6; i >= 0; i--) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        var key = dk(d);
        last7.push({
            day: d.toLocaleDateString('ar-DZ', { weekday: 'short' }),
            val: S.sales.filter(function(s) { return dk(new Date(s.date)) === key; })
                        .reduce(function(a, s) { return a + s.total; }, 0)
        });
    }
    var maxVal = Math.max.apply(null, last7.map(function(x) { return x.val; })) || 1;

    var itemSales = {};
    tSales().forEach(function(sale) {
        sale.items.forEach(function(it) {
            if (!itemSales[it.n]) itemSales[it.n] = { q: 0, cat: it.cat };
            itemSales[it.n].q += it.q;
        });
    });
    var topItems = Object.keys(itemSales)
        .map(function(n) { return { n: n, q: itemSales[n].q, cat: itemSales[n].cat }; })
        .sort(function(a, b) { return b.q - a.q; })
        .slice(0, 3);

    var barsHTML = last7.map(function(d, idx) {
        var pct = Math.round(d.val / maxVal * 100) || 0;
        var isToday = idx === 6;
        return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1">' +
            '<span style="font-size:9px;color:' + (d.val > 0 ? (isToday ? 'var(--green)' : 'var(--blue)') : 'var(--text3)') + ';font-weight:700">' + (d.val > 0 ? fmt(d.val) : '—') + '</span>' +
            '<div style="width:100%;background:var(--bg2);border-radius:4px;height:52px;display:flex;align-items:flex-end;overflow:hidden">' +
                '<div style="width:100%;height:' + pct + '%;background:linear-gradient(to top,' + (isToday ? '#059669,#10b981' : 'var(--blue),#7eb3ff') + ');border-radius:4px;min-height:' + (d.val > 0 ? '4' : '0') + 'px"></div>' +
            '</div>' +
            '<span style="font-size:9px;color:var(--text3);white-space:nowrap">' + d.day + '</span>' +
        '</div>';
    }).join('');

    var topHTML = topItems.length === 0
        ? '<div style="color:var(--text3);font-size:12px;text-align:center;padding:10px">لا مبيعات اليوم</div>'
        : topItems.map(function(it, i) {
            var medals = ['🥇','🥈','🥉'];
            var col = CC[it.cat] || 'var(--blue)';
            return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">' +
                '<span>' + medals[i] + '</span>' +
                '<span style="flex:1;font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(it.n) + '</span>' +
                '<span style="font-size:11px;font-weight:700;color:' + col + '">' + it.q + ' ق</span>' +
            '</div>';
        }).join('');

    var bar = document.createElement('div');
    bar.id = 'liveBar';
    bar.style.cssText = 'margin-top:20px;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:18px 20px;display:flex;align-items:flex-start;gap:18px;flex-wrap:wrap;box-shadow:var(--shadow)';
    bar.innerHTML =
        '<div style="width:100%;display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border)">' +
            '<span style="font-size:11px;font-weight:700;color:var(--green);background:rgba(5,150,105,.1);border:1px solid rgba(5,150,105,.2);padding:3px 10px;border-radius:99px">🟢 مباشر</span>' +
            '<span style="font-size:14px;font-weight:800;color:var(--text)">لوحة الأداء اليومي</span>' +
        '</div>' +
        '<div style="flex:1;min-width:190px">' +
            '<div style="font-size:10px;font-weight:700;color:var(--text3);margin-bottom:10px">📊 مبيعات آخر 7 أيام</div>' +
            '<div style="display:flex;gap:5px;align-items:flex-end;height:76px">' + barsHTML + '</div>' +
        '</div>' +
        '<div style="width:1px;background:var(--border);align-self:stretch;flex-shrink:0"></div>' +
        '<div style="flex:1;min-width:165px">' +
            '<div style="font-size:10px;font-weight:700;color:var(--text3);margin-bottom:10px">🏆 أفضل مبيعات اليوم</div>' +
            topHTML +
        '</div>' +
        '<div style="width:1px;background:var(--border);align-self:stretch;flex-shrink:0"></div>' +
        '<div style="flex:1;min-width:150px">' +
            '<div style="font-size:10px;font-weight:700;color:var(--text3);margin-bottom:10px">⚡ ملخص اليوم</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">' +
            [
                { l: 'فواتير',  v: String(tSales().length), c: 'var(--blue)'  },
                { l: 'بالسلة',  v: String(S.cart.length),   c: 'var(--orange)'},
                { l: 'صافي',    v: fmt(tNet()) + ' دج',     c: tNet() >= 0 ? 'var(--green)' : 'var(--red)' },
                { l: 'مصاريف', v: fmt(tET()) + ' دج',      c: 'var(--red)'  }
            ].map(function(x) {
                return '<div style="background:var(--bg2);border-radius:9px;padding:8px 9px;border:1px solid var(--border)">' +
                    '<div style="font-size:9px;color:var(--text3);font-weight:600;margin-bottom:2px">' + x.l + '</div>' +
                    '<div style="font-size:13px;font-weight:800;color:' + x.c + '">' + x.v + '</div>' +
                '</div>';
            }).join('') +
            '</div>' +
        '</div>';

    tc.appendChild(bar);
}

function refreshExtras() {
    createDarkModeBtn();
    var lb = document.getElementById('liveBar');
    if (lb) lb.remove();
    injectLiveBar();
}

window.addEventListener('load', function() {
    createDarkModeBtn();
    setTimeout(injectLiveBar, 600);
});

document.addEventListener('click', function() {
    setTimeout(function() {
        createDarkModeBtn();
        var lb = document.getElementById('liveBar');
        if (lb) lb.remove();
        injectLiveBar();
    }, 400);
});

setInterval(refreshExtras, 15000);
