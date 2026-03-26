// ===== FLIXY =====
function renderFlixy() {
    var statBar = '<div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:24px;padding:20px 24px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;box-shadow:0 6px 14px rgba(0,0,0,.1)">'+
        '<div style="text-align:center"><div style="color:rgba(255,255,255,.7);font-size:13px;font-weight:500">إيرادات اليوم</div><div style="color:#fff;font-weight:800;font-size:24px">'+fmt(tFT())+' دج</div></div>'+
        '<div style="text-align:center"><div style="color:rgba(255,255,255,.7);font-size:13px;font-weight:500">إيرادات الشهر</div><div style="color:#fff;font-weight:800;font-size:24px">'+fmt(mFT())+' دج</div></div>'+
        '<div style="text-align:center;background:rgba(105,240,174,.15);border-radius:16px;padding:8px 16px"><div style="color:rgba(255,255,255,.7);font-size:12px;font-weight:500">ربح اليوم</div><div style="color:#69f0ae;font-weight:800;font-size:24px">'+fmt(tFlixyProfit())+' دج</div></div>'+
        '<div style="text-align:center;background:rgba(105,240,174,.15);border-radius:16px;padding:8px 16px"><div style="color:rgba(255,255,255,.7);font-size:12px;font-weight:500">ربح الشهر</div><div style="color:#69f0ae;font-weight:800;font-size:24px">'+fmt(mFlixyProfit())+' دج</div></div>'+
    '</div>';
    var phoneCards = [
        { op: "Djezzy", img: "img/img/djezzy.png" },
        { op: "Mobilis", img: "img/img/mobilis.png" },
        { op: "Ooredoo", img: "img/img/oreedoo.jpeg" }
    ].map(function(p){
        return '<div style="border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);background:url('+p.img+') center/cover no-repeat;min-height:200px;position:relative;display:flex;align-items:flex-end">'+
            '<div style="background:rgba(0,0,0,.7);padding:16px;width:100%;text-align:center;color:#fff;text-shadow:0 1px 2px black">'+
            '<div style="font-weight:800;font-size:18px;margin-bottom:8px">'+p.op+'</div>'+
            '<input id="fi_'+p.op+'" type="number" placeholder="المبلغ (دج)" class="inp" style="margin-bottom:12px;background:rgba(255,255,255,.95);color:#000;border:none;border-radius:12px;padding:10px">'+
            '<button id="fib_'+p.op+'" style="width:100%;background:linear-gradient(135deg,#ff9800,#f57c00);color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.2)">✅ تسجيل</button>'+
            '</div>'+
        '</div>';
    }).join('');
    var idoomCards = [
        { op:"Idoom 500", price:500, img:"img/img/idoom500.jpeg" },
        { op:"Idoom 1000", price:1000, img:"img/img/idoom1000.jpeg" },
        { op:"Idoom 2000", price:2000, img:"img/img/idoom2000.png" }
    ].map(function(x){
        return '<div style="border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);background:url('+x.img+') center/cover no-repeat;min-height:200px;position:relative;display:flex;align-items:flex-end">'+
            '<div style="background:rgba(0,0,0,.7);padding:16px;width:100%;text-align:center;color:#fff;text-shadow:0 1px 2px black">'+
            '<div style="font-weight:800;font-size:18px;margin-bottom:8px">'+x.op+'</div>'+
            '<div style="background:rgba(255,255,255,.2);border-radius:30px;padding:4px 12px;display:inline-block;font-size:14px;margin-bottom:8px">'+x.price+' دج</div>'+
            '<div style="font-size:12px;background:#69f0ae33;display:inline-block;padding:2px 12px;border-radius:20px">ربح: 50 دج</div>'+
            '<button id="idb'+x.price+'" style="display:block;width:100%;margin-top:12px;background:linear-gradient(135deg,#ff9800,#f57c00);color:#fff;border:none;border-radius:12px;padding:12px;font-size:14px;font-weight:700;cursor:pointer">✅ تسجيل</button>'+
            '</div>'+
        '</div>';
    }).join('');
    var list = S.flixy.length===0?'<div style="text-align:center;padding:40px;color:#94a3b8;background:#fff;border-radius:20px;border:1px dashed #cbd5e1"><div style="font-size:48px;margin-bottom:12px">📱</div><div style="font-size:15px;font-weight:500">لا توجد عمليات بعد</div></div>':
        S.flixy.slice().reverse().map(function(f){
            var col = FLIXY_COLORS[f.op] || "#555";
            var isIdoom = f.op.indexOf("Idoom")===0;
            return '<div style="border:1px solid #eef2f6;border-right:5px solid '+col+';border-radius:16px;padding:14px 18px;margin-bottom:12px;background:#fff;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;box-shadow:0 2px 6px rgba(0,0,0,.02)">'+
                '<div style="display:flex;align-items:center;gap:14px"><span style="font-size:24px">'+(isIdoom?"📡":"📱")+'</span><div><div style="font-weight:700;color:'+col+';font-size:16px">'+f.op+'</div><div style="color:#94a3b8;font-size:12px">'+ld(f.date)+'</div></div></div>'+
                '<div style="display:flex;align-items:center;gap:12px"><span style="font-weight:800;color:'+col+';font-size:20px">'+fmt(f.amount)+' دج</span><span style="background:#e8f5e9;color:#2e7d32;border-radius:20px;padding:4px 12px;font-size:13px;font-weight:600">+'+f.profit+' دج</span><button id="delf'+f.id+'" style="background:#fff0f0;color:#e53935;border:1px solid #ffcdd2;border-radius:10px;padding:5px 12px;cursor:pointer;font-size:13px">🗑</button></div>'+
            '</div>';
        }).join('');
    return '<h3 style="margin:0 0 20px;color:#0f172a;font-size:22px;font-weight:800">📱 Flixy</h3>'+statBar+
        '<div style="background:#fff;border-radius:24px;padding:20px;margin-bottom:24px;border:1px solid #eef2f6"><h4 style="margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:800">📱 تعبئة رصيد الهاتف</h4><div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center">'+phoneCards+'</div></div>'+
        '<div style="background:#f8fafc;border-radius:24px;padding:20px;margin-bottom:24px;border:1px solid #eef2f6"><h4 style="margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:800">📡 Idoom Fibre</h4><div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center">'+idoomCards+'</div></div>'+
        '<h4 style="color:#0f172a;margin:0 0 16px;font-size:16px;font-weight:800">📋 سجل العمليات</h4>'+list;
}

function bindFlixyEvents() {
    if(S.tab!=="flixy") return;
    ["Djezzy","Mobilis","Ooredoo"].forEach(function(op){
        var btn = document.getElementById("fib_"+op);
        var inp = document.getElementById("fi_"+op);
        if(btn && inp){
            btn.onclick = function(){
                var v = parseFloat(inp.value)||0;
                if(!v){ toast("أدخل المبلغ","e"); return; }
                addFlixy(op, v);
                inp.value = "";
            };
        }
    });
    [500,1000,2000].forEach(function(price){
        var btn = document.getElementById("idb"+price);
        if(btn){
            btn.onclick = function(){
                addFlixy("Idoom "+price, price);
            };
        }
    });
    S.flixy.forEach(function(f){
        var btn = document.getElementById("delf"+f.id);
        if(btn){
            btn.onclick = function(){ if(confirm("حذف؟")) delFlixy(f.id); };
        }
    });
}

