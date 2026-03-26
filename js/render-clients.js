// ===== CLIENTS =====
function renderClients() {
    var list = S.clients.map(function(cl){
        return '<div style="border:1px solid '+(cl.debt>0?'#ffcdd2':'#c8e6c9')+';border-radius:20px;padding:18px;margin-bottom:16px;background:'+(cl.debt>0?'#fff8f8':'#fff')+';box-shadow:0 2px 8px rgba(0,0,0,.02)">'+
            '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px">'+
            '<div style="display:flex;align-items:center;gap:12px"><div style="background:linear-gradient(135deg,#6a1b9a,#8e24aa);border-radius:16px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;box-shadow:0 2px 8px rgba(106,27,154,.2)">👤</div><div><div style="font-weight:800;font-size:16px;color:#0f172a">'+esc(cl.name)+'</div>'+(cl.phone?'<div style="font-size:12px;color:#64748b">📞 '+esc(cl.phone)+'</div>':'')+'</div></div>'+
            '<div style="display:flex;align-items:center;gap:12px"><span style="background:'+(cl.debt>0?'linear-gradient(135deg,#c62828,#e53935)':'linear-gradient(135deg,#1b5e20,#2e7d32)')+';color:#fff;border-radius:40px;padding:6px 20px;font-weight:700;font-size:14px">'+(cl.debt>0?fmt(cl.debt)+' دج':'✅ مسدد')+'</span><button onclick="if(confirm(\'حذف '+esc(cl.name)+'؟\'))delClient('+cl.id+')" style="background:#fff0f0;color:#f44336;border:1px solid #ffcdd2;border-radius:12px;padding:6px 14px;cursor:pointer;font-size:13px">🗑</button></div>'+
            '</div>'+
            '<div style="display:flex;gap:12px;flex-wrap:wrap">'+
            '<input id="adbt_'+cl.id+'" type="number" placeholder="إضافة دين (دج)" class="inp" style="flex:1;border-color:#ffcdd2;min-width:130px">'+
            '<button onclick="addDebt('+cl.id+')" class="btn" style="background:linear-gradient(135deg,#c62828,#e53935);padding:10px 18px;font-size:13px">+ دين</button>'+
            '<input id="pay_'+cl.id+'" type="number" placeholder="دفع (دج)" class="inp" style="flex:1;border-color:#c8e6c9;min-width:130px">'+
            '<button onclick="payDebt('+cl.id+')" class="btn" style="background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:10px 18px;font-size:13px">💵 دفع</button>'+
            '</div>'+
        '</div>';
    }).join('');
    return '<h3 style="margin:0 0 20px;color:#0f172a;font-size:22px;font-weight:800">📋 سجل الديون</h3>'+
        '<div style="background:linear-gradient(135deg,#4a0072,#6a1b9a,#8e24aa);border-radius:24px;padding:18px 24px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;box-shadow:0 6px 14px rgba(106,27,154,.2)">'+
        '<div><div style="color:rgba(255,255,255,.7);font-size:13px;font-weight:500">إجمالي الديون</div><div style="color:#fff;font-weight:800;font-size:26px">'+fmt(tDebt())+' دج</div></div>'+
        '<div><div style="color:rgba(255,255,255,.7);font-size:13px;font-weight:500">المدينون</div><div style="color:#fff;font-weight:800;font-size:26px">'+S.clients.filter(function(c){ return c.debt>0; }).length+' زبون</div></div>'+
        '</div>'+
        '<div style="background:#fff;border-radius:24px;padding:20px;margin-bottom:24px;border:1px solid #eef2f6">'+
        '<h4 style="margin:0 0 16px;color:#0f172a;font-size:18px;font-weight:800">تسجيل دين جديد</h4>'+
        '<div class="grid2"><input class="inp" value="'+esc(S.cForm.name)+'" onchange="S.cForm.name=this.value" placeholder="اسم الزبون"><input class="inp" value="'+esc(S.cForm.phone||"")+'" onchange="S.cForm.phone=this.value" placeholder="📞 الهاتف"><input class="inp" type="number" value="'+esc(S.cForm.debt||"")+'" onchange="S.cForm.debt=this.value" placeholder="مبلغ الدين (دج)" style="grid-column:span 2;border-color:#ab47bc"></div>'+
        '<button onclick="addClient()" class="btn" style="background:linear-gradient(135deg,#6a1b9a,#8e24aa);width:100%;margin-top:16px;font-size:16px;padding:14px;box-shadow:0 4px 12px rgba(106,27,154,.2)">✅ تسجيل</button>'+
        '</div>'+
        (S.clients.length===0?'<div style="text-align:center;padding:40px;color:#94a3b8;background:#fff;border-radius:20px;border:1px dashed #cbd5e1"><div style="font-size:48px;margin-bottom:12px">👤</div><div style="font-size:15px;font-weight:500">لا يوجد زبائن بعد</div></div>':list);
}
