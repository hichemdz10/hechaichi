function renderTabs() {
    var tabKeys = ["home","stock","print","flixy","clients","expenses","report","settings"];
    var low     = lowItems().length;
    var net     = tNet();

    var tabs = [
        { k:"home",     ic:"🏠", lbl:"الرئيسية"  },
        { k:"stock",    ic:"📦", lbl:"المخزون"   },
        { k:"print",    ic:"🖨️", lbl:"الطباعة"   },
        { k:"flixy",    ic:"📱", lbl:"Flixy"     },
        { k:"clients",  ic:"👤", lbl:"الديون"    },
        { k:"expenses", ic:"💸", lbl:"المصاريف"  },
        { k:"report",   ic:"📊", lbl:"التقارير"  },
        { k:"settings", ic:"⚙️", lbl:"الإعدادات" }
    ];

    var navBtns = tabs.map(function(t) {
        var active = S.tab === t.k;
        var badge  = (t.k === "stock" && low > 0)
            ? '<span class="ntab-badge">' + low + '</span>' : '';
        return '<button class="ntab' + (active ? ' ntab-active' : '') + '" ' +
               'onclick="S.tab=\'' + t.k + '\';save();render()">' +
            '<span class="ntab-ic">' + t.ic + '</span>' +
            '<span class="ntab-lbl">' + t.lbl + '</span>' +
            badge +
        '</button>';
    }).join('');

    // إحصائيات سريعة — ديسكتوب فقط
    var stats = [
        { lbl:"مبيعات", val: H(fmt(tST())),       clr:"var(--blue)"  },
        { lbl:"أرباح",  val: H(fmt(tPR())),       clr:"var(--green)" },
        { lbl:"Flixy",  val: H(fmt(tFT())),       clr:"#818cf8"      },
        { lbl:"صافي",   val: H(fmt(net))+" دج",   clr: net>=0?"var(--green)":"var(--red)" }
    ];

    var quickStats = '<div class="ntab-stats">' +
        stats.map(function(s){
            return '<div class="ntab-stat">' +
                '<span class="ntab-stat-lbl">' + s.lbl + '</span>' +
                '<span class="ntab-stat-val" style="color:' + s.clr + '">' + s.val + '</span>' +
            '</div>';
        }).join('<div class="ntab-stat-div"></div>') +
    '</div>';

    return '<nav class="ntab-bar">' +
        '<div class="ntab-scroll">' + navBtns + '</div>' +
        quickStats +
    '</nav>';
}
