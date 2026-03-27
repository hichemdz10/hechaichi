// ===== REPORT =====
function renderReport() {
    var rs = fSales(), re = fExp(), rp = fPrint();
    var rf = S.flixy.filter(function(f){ var d = new Date(f.date); if(S.rep==="today") return dk(d)===tstr(); if(S.rep==="week") return (now()-d)<7*86400000; if(S.rep==="month") return d.getMonth()===nm() && d.getFullYear()===ny(); return true; });
    var rT = rs.reduce(function(a,s){ return a+s.total; },0);
    var rP = rs.reduce(function(a,s){ return a+s.profit; },0);
    var rPR = rp.reduce(function(a,p){ return a+p.price; },0);
    var rFR = rf.reduce(function(a,f){ return a+(f.profit||0); },0);
    var rE = re.reduce(function(a,e){ return a+e.amount; },0);
    var rNet = rP + rPR + rFR - rE;
    var repBtns = '<div style="display:flex;gap:8px;flex-wrap:wrap">'+[["today","اليوم"],["week","الأسبوع"],["month","الشهر"],["all","الكل"]].map(function(p){ return '<button onclick="S.rep=\''+p[0]+'\';render()" class="btn" style="background:'+(S.rep===p[0]?'linear-gradient(135deg,#0277bd,#01579b)':'#f1f5f9')+';color:'+(S.rep===p[0]?'#fff':'#1e293b')+';border:1px solid '+(S.rep===p[0]?'transparent':'#e2e8f0')+';padding:10px 20px;font-size:14px;border-radius:40px">'+p[1]+'</button>'; }).join('')+'</div>';
    var csvBtns = '<div style="display:flex;gap:8px;flex-wrap:wrap"><button onclick="expCSV(\'sales\')" class="btn" style="background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:8px 16px;font-size:12px">📊 مبيعات</button><button onclick="expCSV(\'exp\')" class="btn" style="background:linear-gradient(135deg,#bf360c,#e64a19);padding:8px 16px;font-size:12px">💸 مصاريف</button><button onclick="expCSV(\'stock\')" class="btn" style="background:linear-gradient(135deg,#4a148c,#6a1b9a);padding:8px 16px;font-size:12px">📦 مخزون</button><button onclick="printReport()" class="btn" style="background:linear-gradient(135deg,#01579b,#0277bd);padding:8px 16px;font-size:12px">🖨️ طباعة</button></div>';
    var summCards = [
        {ic:"💰",l:"مبيعات",v:fmt(rT)+" دج",g:"linear-gradient(135deg,#0d47a1,#0277bd)"},
        {ic:"📈",l:"أرباح",v:fmt(rP)+" دج",g:"linear-gradient(135deg,#1b5e20,#2e7d32)"},
        {ic:"🖨️",l:"طباعة",v:fmt(rPR)+" دج",g:"linear-gradient(135deg,#004d40,#00695c)"},
        {ic:"📱",l:"Flixy",v:fmt(rFR)+" دج",g:"linear-gradient(135deg,#1a237e,#3949ab)"},
        {ic:"💸",l:"مصاريف",v:fmt(rE)+" دج",g:"linear-gradient(135deg,#bf360c,#e64a19)"},
        {ic:"🏆",l:"صافي الربح",v:fmt(rNet)+" دج",g:rNet>=0?"linear-gradient(135deg,#1b5e20,#43a047)":"linear-gradient(135deg,#b71c1c,#e53935)"}
    ];
    var salesList = rs.slice().reverse().map(function(s,idx){
        return '<div style="border:1px solid #eef2f6;border-radius:20px;padding:16px 18px;margin-bottom:16px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.02)">'+
            '<div style="display:flex;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">'+
                '<span style="background:linear-gradient(135deg,#0277bd,#01579b);color:#fff;border-radius:40px;padding:4px 16px;font-size:12px;font-weight:600">#'+(rs.length-idx)+(s.client?' • '+esc(s.client.name):'')+'</span>'+
                '<div style="display:flex;gap:10px;align-items:center"><span style="color:#64748b;font-size:12px">'+ld(s.date)+'</span><button onclick="if(confirm(\'إلغاء؟\'))cancelSale('+s.id+')" style="background:#fff0f0;color:#f44336;border:1px solid #ffcdd2;border-radius:10px;padding:4px 12px;cursor:pointer;font-size:12px;font-weight:600">↩️</button></div>'+
            '</div>'+
            s.items.map(function(it){ return '<div style="border-bottom:1px dashed #eef2f6;display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span style="color:#334155">'+esc(it.n)+' × '+it.q+'</span><span style="font-weight:600;color:#0277bd">'+it.sum+' دج</span></div>'; }).join('')+
            '<div style="display:flex;justify-content:space-between;margin-top:12px;font-weight:700;flex-wrap:wrap;gap:8px">'+
                (s.discount>0?'<span style="color:#e65100;font-size:13px">🏷️ −'+s.discAmt+' دج</span>':'')+
                '<span style="color:#0277bd;font-size:16px">'+s.total+' دج</span>'+
                '<span style="background:#e8f5e9;color:#2e7d32;border-radius:30px;padding:4px 14px;font-size:13px;font-weight:600">+'+s.profit+' دج</span>'+
            '</div>'+
        '</div>';
    }).join('');
    return '<div style="display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap;align-items:center;justify-content:space-between">'+repBtns+csvBtns+'</div>'+
        '<div class="grid2" style="margin-bottom:24px;gap:16px">'+summCards.map(function(c){ return '<div style="background:'+c.g+';border-radius:20px;padding:16px;display:flex;gap:16px;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.05)"><span style="font-size:32px">'+c.ic+'</span><div><div style="color:rgba(255,255,255,.7);font-size:12px;font-weight:500">'+c.l+'</div><div style="color:#fff;font-size:20px;font-weight:800">'+c.v+'</div></div></div>'; }).join('')+'</div>'+
        '<div style="background:'+(rNet>=0?'linear-gradient(135deg,#1b5e20,#2e7d32)':'linear-gradient(135deg,#b71c1c,#c62828)')+';border-radius:24px;padding:20px;text-align:center;margin-bottom:24px;box-shadow:0 6px 14px '+(rNet>=0?'rgba(27,94,32,.2)':'rgba(183,28,28,.2)')+'">'+
            '<div style="color:rgba(255,255,255,.7);font-size:14px;font-weight:500;margin-bottom:6px">صافي الربح</div>'+
            '<div style="color:#fff;font-size:32px;font-weight:800">'+(rNet>=0?'📈':'📉')+' '+fmt(rNet)+' دج</div>'+
        '</div>'+
        (rs.length===0?'<div style="text-align:center;padding:40px;color:#94a3b8;background:#fff;border-radius:20px;border:1px dashed #cbd5e1"><div style="font-size:48px;margin-bottom:12px">📊</div><div style="font-size:15px;font-weight:500">لا توجد مبيعات</div></div>':salesList);
}

// التعديل الجديد لمنع الخطأ في ملف main.js
function bindReportEvents() {
    console.log("تم تحميل أحداث التقارير بنجاح ✅");
}
