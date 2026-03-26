// ===== PRINT TAB =====
function renderPrint() {
    var byType = {};
    Object.keys(PI).forEach(function(t){ byType[t] = S.pjobs.filter(function(p){ return p.type===t; }).reduce(function(a,p){ return a+p.price; },0); });
    var maxVal = Math.max.apply(null, Object.keys(byType).map(function(k){ return byType[k]||0; })) || 1;
    var statsBar = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">'+[
        {ic:"🖨️",l:"اليوم",v:H(fmt(tPT())+" دج"),g:"linear-gradient(135deg,#004d40,#00695c)"},
        {ic:"📅",l:"الشهر",v:H(fmt(mPT())+" دج"),g:"linear-gradient(135deg,#00695c,#00897b)"},
        {ic:"📋",l:"إجمالي",v:S.pjobs.length,g:"linear-gradient(135deg,#006064,#00838f)"}
    ].map(function(s){ return '<div style="background:'+s.g+';border-radius:20px;padding:16px 12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,.05)"><div style="font-size:28px;margin-bottom:6px">'+s.ic+'</div><div style="color:rgba(255,255,255,.8);font-size:12px;font-weight:600;margin-bottom:4px">'+s.l+'</div><div style="color:#fff;font-weight:800;font-size:18px">'+s.v+'</div></div>'; }).join('')+'</div>';
    var chartHTML = '<div style="background:#f8fafc;border-radius:20px;padding:20px;margin-bottom:24px;border:1px solid #eef2f6">'+
        '<div style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:16px">📊 الخدمات حسب الإيراد</div>'+
        Object.keys(PI).map(function(t){ var val = byType[t]||0; var pct = Math.round(val/maxVal*100);
            return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">'+
                '<span style="font-size:18px;width:28px;text-align:center">'+PI[t]+'</span>'+
                '<span style="font-size:13px;font-weight:600;color:#334155;min-width:100px">'+t+'</span>'+
                '<div style="flex:1;background:#e2e8f0;border-radius:20px;height:8px;overflow:hidden"><div style="height:100%;border-radius:20px;background:linear-gradient(90deg,#00695c,#00897b);width:'+pct+'%"></div></div>'+
                '<span style="font-size:13px;font-weight:700;color:#00695c;min-width:70px;text-align:left">'+fmt(val)+' دج</span>'+
            '</div>';
        }).join('')+'</div>';
    var typesBtns = '<div class="grid3" style="gap:12px;margin-bottom:24px">'+Object.keys(PI).map(function(t){
        var active = S.pForm.type===t;
        var col = PTCOLORS[t]||"#00695c";
        return '<button onclick="S.pForm.type=\''+t+'\';render()" style="border:2px solid '+(active?col:'#e2e8f0')+';border-radius:20px;padding:12px 8px;cursor:pointer;background:'+(active?'linear-gradient(135deg,'+col+','+col+'cc)':'#fff')+';color:'+(active?'#fff':col)+';display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:700;transition:all .2s;box-shadow:'+(active?'0 4px 12px '+col+'44':'none')+'"><span style="font-size:28px">'+PI[t]+'</span><span style="font-size:12px;text-align:center">'+t+'</span></button>';
    }).join('')+'</div>';
    var formSection = '<div style="background:#fff;border-radius:24px;padding:20px;margin-bottom:24px;border:1px solid #eef2f6">'+
        '<h4 style="margin:0 0 16px;color:#0f172a;font-size:18px;font-weight:800;display:flex;align-items:center;gap:8px"><span style="background:linear-gradient(135deg,#00695c,#00897b);color:#fff;border-radius:12px;width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;font-size:18px">🖨️</span>تسجيل عملية طباعة</h4>'+
        typesBtns+
        '<div class="grid2" style="gap:16px;margin-bottom:20px">'+
        '<div><label style="font-size:13px;color:#475569;font-weight:600;display:block;margin-bottom:6px">عدد الصفحات</label><input class="inp" type="number" value="'+esc(S.pForm.pages)+'" onchange="S.pForm.pages=this.value" placeholder="مثال: 10" style="border-color:#e2e8f0"></div>'+
        '<div><label style="font-size:13px;color:#475569;font-weight:600;display:block;margin-bottom:6px">المبلغ (دج) *</label><input class="inp" type="number" value="'+esc(S.pForm.price)+'" onchange="S.pForm.price=this.value" placeholder="مثال: 50" style="border-color:#00897b;border-width:2px"></div>'+
        '</div>'+
        '<button onclick="addPrint()" class="btn" style="background:linear-gradient(135deg,#00695c,#00897b);width:100%;font-size:16px;padding:14px;box-shadow:0 4px 12px rgba(0,105,92,.2)">✅ تسجيل العملية</button>'+
    '</div>';
    var listHTML = S.pjobs.length===0?'<div style="text-align:center;padding:40px;color:#94a3b8;background:#f9fffe;border-radius:20px;border:1px dashed #cbd5e1"><div style="font-size:48px;margin-bottom:12px">🖨️</div><div style="font-size:15px;font-weight:500">لا توجد عمليات بعد</div></div>':
        '<div>'+
        '<div style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:16px;display:flex;align-items:center;gap:8px">📋 <span>سجل العمليات</span><span style="background:#eef2f6;color:#334155;border-radius:30px;padding:2px 12px;font-size:12px">'+S.pjobs.length+'</span></div>'+
        S.pjobs.slice().reverse().map(function(j){
            var col = PTCOLORS[j.type]||"#00695c";
            var isToday = dk(new Date(j.date))===tstr();
            return '<div style="background:#fff;border:1px solid #eef2f6;border-right:5px solid '+col+';border-radius:16px;padding:14px 18px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;box-shadow:0 2px 6px rgba(0,0,0,.02)">'+
                '<div style="display:flex;align-items:center;gap:14px">'+
                '<div style="background:linear-gradient(135deg,'+col+','+col+'cc);border-radius:14px;width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;box-shadow:0 2px 8px '+col+'44">'+PI[j.type]+'</div>'+
                '<div>'+
                '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">'+
                '<span style="background:linear-gradient(135deg,'+col+','+col+'cc);color:#fff;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600">'+j.type+'</span>'+
                (j.pages>0?'<span style="background:#f1f5f9;color:#334155;border-radius:20px;padding:3px 10px;font-size:12px">'+j.pages+' صفحة</span>':'')+
                (isToday?'<span style="background:#fff9c4;color:#b45309;border-radius:20px;padding:2px 10px;font-size:11px;font-weight:600">اليوم</span>':'')+
                '</div>'+
                '<div style="color:#94a3b8;font-size:12px">'+ld(j.date)+'</div>'+
                '</div>'+
                '</div>'+
                '<div style="display:flex;align-items:center;gap:12px">'+
                '<div style="font-weight:800;color:'+col+';font-size:20px">'+fmt(j.price)+' <span style="font-size:12px;font-weight:500">دج</span></div>'+
                '<button onclick="if(confirm(\'حذف؟\'))delPrint('+j.id+')" style="background:#fff0f0;color:#e53935;border:1px solid #ffcdd2;border-radius:10px;padding:6px 12px;cursor:pointer;font-size:13px">🗑</button>'+
                '</div>'+
            '</div>';
        }).join('')+
        '</div>';
    return '<h3 style="margin:0 0 20px;color:#0f172a;font-size:22px;font-weight:800;display:flex;align-items:center;gap:10px">'+
        '<span style="background:linear-gradient(135deg,#00695c,#00897b);color:#fff;border-radius:16px;width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 12px rgba(0,105,92,.2)">🖨️</span>خدمات الطباعة</h3>'+
        statsBar+chartHTML+formSection+listHTML;
}

