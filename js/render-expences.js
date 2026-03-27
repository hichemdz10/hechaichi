function renderExpenses() {
    var list = S.expenses.slice().reverse().map(function(e){
        return '<div style="border:1px solid #ffe0b2;border-radius:18px;padding:14px 18px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;background:#fffaf5;box-shadow:0 2px 6px rgba(0,0,0,.02)">'+
            '<div><span style="font-weight:700;color:#bf360c;font-size:15px">'+esc(e.label)+'</span><span style="background:#bf360c22;color:#bf360c;border-radius:30px;padding:3px 12px;font-size:12px;margin-right:8px;font-weight:500">'+e.cat+'</span><div style="font-size:12px;color:#94a3b8;margin-top:4px">'+ldo(e.date)+'</div></div>'+
            '<div style="display:flex;gap:12px;align-items:center"><span style="font-weight:800;color:#bf360c;font-size:18px">'+fmt(e.amount)+' دج</span><button onclick="delExp('+e.id+')" style="background:#fff0f0;color:#f44336;border:1px solid #ffcdd2;border-radius:10px;padding:6px 12px;cursor:pointer;font-size:13px">🗑</button></div>'+
        '</div>';
    }).join('');
    return '<div style="background:#fff;border-radius:24px;padding:20px;margin-bottom:24px;border:1px solid #eef2f6">'+
        '<h4 style="margin:0 0 16px;color:#bf360c;font-size:18px;font-weight:800">💸 تسجيل مصروف</h4>'+
        '<div class="grid2"><input class="inp" value="'+esc(S.eForm.lbl)+'" onchange="S.eForm.lbl=this.value" placeholder="وصف المصروف"><select class="inp" onchange="S.eForm.cat=this.value">'+ECATS.map(function(c){ return '<option value="'+c+'"'+(S.eForm.cat===c?' selected':'')+'>'+c+'</option>'; }).join('')+'</select><input class="inp" type="number" value="'+esc(S.eForm.amt)+'" onchange="S.eForm.amt=this.value" placeholder="المبلغ (دج)" style="grid-column:span 2;border-color:#ff8a65"></div>'+
        '<button onclick="addExp()" class="btn" style="background:linear-gradient(135deg,#bf360c,#e64a19);width:100%;margin-top:20px;font-size:16px;padding:14px;box-shadow:0 4px 12px rgba(191,54,12,.2)">✅ تسجيل</button>'+
    '</div>'+
    '<div class="grid2" style="margin-bottom:24px;gap:16px">'+
        '<div style="background:linear-gradient(135deg,#bf360c,#e64a19);border-radius:20px;padding:16px;text-align:center;box-shadow:0 4px 12px rgba(191,54,12,.2)"><div style="font-size:13px;color:rgba(255,255,255,.7);font-weight:500">مصاريف اليوم</div><div style="font-size:28px;font-weight:800;color:#fff;margin-top:6px">'+fmt(tET())+' دج</div></div>'+
        '<div style="background:linear-gradient(135deg,#e64a19,#ff7043);border-radius:20px;padding:16px;text-align:center;box-shadow:0 4px 12px rgba(230,74,25,.2)"><div style="font-size:13px;color:rgba(255,255,255,.7);font-weight:500">مصاريف الشهر</div><div style="font-size:28px;font-weight:800;color:#fff;margin-top:6px">'+fmt(mET())+' دج</div></div>'+
    '</div>'+
    (S.expenses.length===0?'<div style="text-align:center;padding:40px;color:#94a3b8;background:#fff;border-radius:20px;border:1px dashed #cbd5e1"><div style="font-size:48px;margin-bottom:12px">💸</div><div style="font-size:15px;font-weight:500">لا توجد مصاريف</div></div>':list);
}
