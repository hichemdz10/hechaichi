function addToCartSilent(id) {
    var item = S.stock.find(function(s){ return s.id===id; });
    if (!item || item.q<=0) return;
    item.q--;
    var ex = S.cart.find(function(c){ return c.id===id; });
    if (ex) { ex.q++; ex.sum=(ex.customP!==undefined?ex.customP:ex.p)*ex.q; ex.prof=(ex.sum/ex.q-ex.c)*ex.q; }
    else S.cart.push({ id:item.id,n:item.n,p:item.p,c:item.c,q:1,sum:item.p,prof:item.p-item.c,cat:item.cat });
    save();
}

function addToCartHome(id) {
    var item = S.stock.find(function(s){ return s.id===id; });
    if (!item || item.q<=0) { toast("نفذ المخزون ❌","e"); return; }
    item.q--;
    var ex = S.cart.find(function(c){ return c.id===id; });
    if (ex) { ex.q++; ex.sum=(ex.customP!==undefined?ex.customP:ex.p)*ex.q; ex.prof=(ex.sum/ex.q-ex.c)*ex.q; }
    else S.cart.push({ id:item.id,n:item.n,p:item.p,c:item.c,q:1,sum:item.p,prof:item.p-item.c,cat:item.cat||"قرطاسية" });
    save(); beep(true); toast("🛒 "+item.n);
    if (S.cameraActiveInHome && document.getElementById('splitCameraContainer')) { refreshSplitCart(); }
    else { var cp=document.getElementById('cartPanelContent'); if(cp){ cp.innerHTML=renderCartPanelContent(refreshGlobalCart); bindCartEvents(refreshGlobalCart); } }
}

function addToCartFromStock(id) {
    var item = S.stock.find(function(s){ return s.id===id; });
    if (!item || item.q<=0) { toast("نفذ المخزون ❌","e"); return; }
    item.q--;
    var ex = S.cart.find(function(c){ return c.id===id; });
    if (ex) { ex.q++; ex.sum=(ex.customP!==undefined?ex.customP:ex.p)*ex.q; ex.prof=(ex.sum/ex.q-ex.c)*ex.q; }
    else S.cart.push({ id:item.id,n:item.n,p:item.p,c:item.c,q:1,sum:item.p,prof:item.p-item.c,cat:item.cat||"قرطاسية" });
    save(); beep(true); toast("🛒 أضيف للسلة: "+item.n);
    refreshGlobalCart();
    if (S.cameraActiveInHome) refreshSplitCart();
}

function remFromCart(id) {
    var ci = S.cart.find(function(c){ return c.id===id; });
    if (!ci) return;
    var item = S.stock.find(function(s){ return s.id===id; });
    if (item) item.q += ci.q;
    S.cart = S.cart.filter(function(c){ return c.id!==id; });
    save();
    if (S.cameraActiveInHome) refreshSplitCart();
    else { var cp=document.getElementById('cartPanelContent'); if(cp){ cp.innerHTML=renderCartPanelContent(refreshGlobalCart); bindCartEvents(refreshGlobalCart); } }
}

function changeCartQty(id, delta) {
    if (delta > 0) {
        var item = S.stock.find(function(s){ return s.id===id; });
        if (!item||item.q<=0) { toast("نفذ المخزون","e"); return; }
        item.q--;
        var ex = S.cart.find(function(c){ return c.id===id; });
        if (ex) { ex.q++; ex.sum=(ex.customP!==undefined?ex.customP:ex.p)*ex.q; ex.prof=(ex.sum/ex.q-ex.c)*ex.q; }
    } else {
        var ci = S.cart.find(function(c){ return c.id===id; });
        if (!ci) return;
        var it = S.stock.find(function(s){ return s.id===id; });
        if (it) it.q++;
        ci.q--;
        if (ci.q<=0) S.cart=S.cart.filter(function(c){ return c.id!==id; });
        else { ci.sum=(ci.customP!==undefined?ci.customP:ci.p)*ci.q; ci.prof=(ci.sum/ci.q-ci.c)*ci.q; }
    }
    save();
    if (S.cameraActiveInHome) refreshSplitCart();
    else { var cp=document.getElementById('cartPanelContent'); if(cp){ cp.innerHTML=renderCartPanelContent(refreshGlobalCart); bindCartEvents(refreshGlobalCart); } }
}

function clrCart() {
    if (!confirm("مسح السلة بالكامل؟")) return;
    S.cart.forEach(function(ci){ var it=S.stock.find(function(s){ return s.id===ci.id; }); if(it) it.q+=ci.q; });
    S.cart=[]; S.disc=0; save();
    if (S.cameraActiveInHome) refreshSplitCart();
    else { var cp=document.getElementById('cartPanelContent'); if(cp){ cp.innerHTML=renderCartPanelContent(refreshGlobalCart); bindCartEvents(refreshGlobalCart); } }
}

function saveSale(client) {
    if (!S.cart.length) { toast("السلة فارغة","e"); return; }
    var sale = { id:Date.now(), items:JSON.parse(JSON.stringify(S.cart)), raw:cRaw(), discount:S.disc, discAmt:dAmt(), total:cTotal(), profit:cProfit(), date:new Date().toISOString(), client:client||null };
    S.sales.push(sale);
    if (client) { var cl=S.clients.find(function(c){ return c.id===client.id; }); if(cl) cl.debt+=cTotal(); }

    // تطبيق إعداد تفريغ السلة
    if (S.clearCartAfterSale) {
        S.cart = [];
        S.disc = 0;
    }
    save(); render();
    toast(client ? "✅ على حساب "+client.name : "✅ تم الحفظ");

    // طباعة تلقائية إذا كان الإعداد مفعلاً
    if (S.autoPrint) {
        setTimeout(printReceipt, 100);
    }
}

function cancelSale(sid) {
    var sale = S.sales.find(function(s){ return s.id===sid; });
    if (!sale) return;
    sale.items.forEach(function(it){ var st=S.stock.find(function(s){ return s.id===it.id; }); if(st) st.q+=it.q; });
    if (sale.client) { var cl=S.clients.find(function(c){ return c.id===sale.client.id; }); if(cl) cl.debt=Math.max(0,cl.debt-sale.total); }
    S.sales=S.sales.filter(function(s){ return s.id!==sid; }); save(); render(); toast("↩️ تم الإلغاء");
}

function updateCartItemPrice(id, newP) {
    var it = S.cart.find(function(c){ return c.id===id; });
    if (!it) return;
    it.customP=newP; it.sum=newP*it.q; it.prof=(newP-it.c)*it.q; save();
    if (S.cameraActiveInHome) refreshSplitCart();
    else { var cp=document.getElementById('cartPanelContent'); if(cp){ cp.innerHTML=renderCartPanelContent(refreshGlobalCart); bindCartEvents(refreshGlobalCart); } }
}

function transferToShop(id, qty) {
    var item = S.stock.find(function(s){ return s.id===id; });
    if (!item) return;
    if (!qty||qty<=0) { toast("أدخل الكمية","e"); return; }
    if (qty>item.wq) { toast("المستودع لا يحتوي إلا على "+item.wq,"e"); return; }
    item.q+=qty; item.wq-=qty; save(); render(); toast("✅ نُقل "+qty+" للمحل");
}

function addStock() {
    var f = S.form;
    if (!f.n||!+f.p||!+f.c) { toast("ملء جميع الحقول","e"); return; }
    if (+f.c>=+f.p) { toast("سعر الشراء أكبر","e"); return; }
    var shopQ = f.dest==="warehouse" ? 0 : (+f.q||0);
    var whQ   = f.dest==="shop"      ? 0 : (+f.wq||0);
    if (f.dest==="both") { shopQ=+f.q||0; whQ=+f.wq||0; }
    if (shopQ===0&&whQ===0) { toast("أدخل الكمية","e"); return; }
    var nn = nAr(f.n.trim());
    var idx = S.stock.findIndex(function(s){ return nAr(s.n)===nn; });
    if (idx>=0) { S.stock[idx].q+=shopQ; S.stock[idx].wq=(S.stock[idx].wq||0)+whQ; toast("✅ تم التحديث"); }
    else {
        var nId = S.stock.length>0 ? Math.max.apply(null,S.stock.map(function(s){ return s.id; }))+1 : 1;
        S.stock.push({ id:nId,n:f.n.trim(),p:+f.p,c:+f.c,q:shopQ,wq:whQ,cat:f.cat,barcode:f.bc||gbc(nId) });
        toast("✅ أضيف "+f.n);
    }
    S.form={ n:"",p:"",c:"",q:"",wq:"",dest:"shop",cat:"كراريس",bc:"" }; save(); render();
}

function delStock(id) { S.stock=S.stock.filter(function(s){ return s.id!==id; }); save(); render(); }

function addClient() {
    if (!S.cForm.name) { toast("أدخل الاسم","e"); return; }
    S.clients.push({ id:Date.now(),name:S.cForm.name,phone:S.cForm.phone||"",debt:parseFloat(S.cForm.debt)||0 });
    S.cForm={name:"",phone:"",debt:""}; save(); render(); toast("✅ تمت الإضافة");
}
function delClient(id) { S.clients=S.clients.filter(function(c){ return c.id!==id; }); save(); render(); }

function payDebt(cid) {
    var a = parseFloat(document.getElementById("pay_"+cid).value)||0;
    if (!a) { toast("أدخل مبلغ","e"); return; }
    var cl = S.clients.find(function(c){ return c.id===cid; });
    if (!cl) return;
    if (a>cl.debt) { toast("المبلغ أكبر من الدين","e"); return; }
    cl.debt-=a; save(); render(); toast("💵 دفع "+fmt(a)+" دج");
}
function addDebt(cid) {
    var a = parseFloat(document.getElementById("adbt_"+cid).value)||0;
    if (!a) { toast("أدخل مبلغ","e"); return; }
    var cl = S.clients.find(function(c){ return c.id===cid; });
    if (!cl) return;
    cl.debt+=a; save(); render(); toast("➕ أضيف "+fmt(a)+" دج");
}

function addExp() {
    if (!S.eForm.lbl||!+S.eForm.amt) { toast("أدخل البيانات","e"); return; }
    S.expenses.push({ id:Date.now(),label:S.eForm.lbl,amount:+S.eForm.amt,cat:S.eForm.cat,date:new Date().toISOString() });
    S.eForm={lbl:"",amt:"",cat:"إيجار"}; save(); render(); toast("✅ تم");
}
function delExp(id) { S.expenses=S.expenses.filter(function(e){ return e.id!==id; }); save(); render(); }

function addPrint() {
    if (!+S.pForm.price) { toast("أدخل المبلغ","e"); return; }
    S.pjobs.push({ id:Date.now(),type:S.pForm.type,pages:+S.pForm.pages||0,price:+S.pForm.price,date:new Date().toISOString() });
    S.pForm.pages=""; S.pForm.price=""; save(); render(); toast("✅ "+S.pForm.type);
}
function delPrint(id) { S.pjobs=S.pjobs.filter(function(p){ return p.id!==id; }); save(); render(); }

function flixyProfit(op, amount) { return op.indexOf("Idoom")===0 ? 50 : (amount>=1000 ? 20 : 10); }
function addFlixy(op, amount) {
    if (!amount||amount<=0) { toast("أدخل المبلغ","e"); return; }
    S.flixy.push({ id:Date.now(),op:op,amount:amount,profit:flixyProfit(op,amount),date:new Date().toISOString() });
    save(); render(); toast("✅ "+op+" — "+fmt(amount)+" دج");
}
function delFlixy(id) { S.flixy=S.flixy.filter(function(f){ return f.id!==id; }); save(); render(); }

function expBk() {
    var data={ stock:S.stock,sales:S.sales,clients:S.clients,expenses:S.expenses,pjobs:S.pjobs,flixy:S.flixy,date:new Date().toISOString() };
    var a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:"application/json"}));
    a.download="backup_"+dk()+".json"; a.click(); toast("✅ تم التصدير");
}

function impBk(file) {
    if (!file) return;
    var r=new FileReader();
    r.onload=function(ev){
        try {
            var d=JSON.parse(ev.target.result);
            if(d.stock) S.stock=d.stock; if(d.sales) S.sales=d.sales;
            if(d.clients) S.clients=d.clients; if(d.expenses) S.expenses=d.expenses;
            if(d.pjobs) S.pjobs=d.pjobs; if(d.flixy) S.flixy=d.flixy;
            save(); render(); toast("✅ تم الاستيراد");
        } catch(e) { toast("ملف خاطئ","e"); }
    };
    r.readAsText(file);
}

function expCSV(type) {
    var headers,rows,fn;
    if (type==="sales") {
        headers=["التاريخ","الزبون","الأصناف","الخام","الخصم","الإجمالي","الربح"];
        rows=S.sales.map(function(s){ return [new Date(s.date).toLocaleString("ar-DZ"),(s.client&&s.client.name)||"نقدي",s.items.map(function(i){ return i.n+"x"+i.q; }).join("|"),s.raw,s.discount,s.total,s.profit]; });
        fn="مبيعات.csv";
    } else if (type==="exp") {
        headers=["التاريخ","الوصف","الفئة","المبلغ"];
        rows=S.expenses.map(function(e){ return [new Date(e.date).toLocaleString("ar-DZ"),e.label,e.cat,e.amount]; });
        fn="مصاريف.csv";
    } else {
        headers=["الصنف","الفئة","بيع","شراء","ربح","باركود","المحل","المستودع"];
        rows=S.stock.map(function(s){ return [s.n,s.cat,s.p,s.c,s.p-s.c,s.barcode||"",s.q,s.wq||0]; });
        fn="مخزون.csv";
    }
    var csv="\uFEFF"+[headers].concat(rows).map(function(r){ return r.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(","); }).join("\n");
    var a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    a.download=fn; a.click(); toast("✅ تم التصدير");
}

function goToStockCat(cat) {
    S.tab='stock'; S.openCats[cat]=true; S.ssrch=''; save(); render();
    setTimeout(function(){ var el=document.querySelector('[data-cat="'+cat+'"]'); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); },200);
}

function openManualCart() {
    var ov=document.getElementById('manualCartModal');
    if (!ov) { ov=document.createElement('div'); ov.id='manualCartModal'; ov.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.75);z-index:6000;display:flex;align-items:flex-end;justify-content:center;direction:rtl'; document.body.appendChild(ov); }
    var items=S.stock.filter(function(s){ return s.q>0; });
    ov.innerHTML='<div style="background:#fff;border-radius:24px 24px 0 0;padding:20px;width:100%;max-width:600px;max-height:85vh;overflow-y:auto;box-shadow:0 -8px 32px rgba(0,0,0,.3)"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 style="color:#0277bd;font-size:20px;font-weight:900;font-family:Tajawal,Arial">➕ إضافة للسلة</h3><button onclick="document.getElementById(\'manualCartModal\').style.display=\'none\'" style="background:#f0f0f0;color:#555;border:none;border-radius:10px;padding:8px 14px;font-size:16px;font-weight:700;cursor:pointer;font-family:Tajawal,Arial">✕</button></div><input id="manSrch" class="inp" placeholder="🔍 بحث عن منتج..." style="margin-bottom:14px" oninput="filterManualCart(this.value)"><div id="manualList">'+renderManualList(items,'')+'</div></div>';
    ov.style.display='flex';
    setTimeout(function(){ var el=document.getElementById('manSrch'); if(el) el.focus(); },150);
}

function renderManualList(items, srch) {
    var filtered=items.filter(function(s){ return !srch||nAr(s.n).includes(nAr(srch)); });
    if (filtered.length===0) return '<div style="text-align:center;padding:28px;color:#aaa;font-size:16px">لا توجد نتائج</div>';
    return filtered.map(function(item){
        var col=CC[item.cat]||"#0277bd";
        var inCart=S.cart.find(function(c){ return c.id===item.id; });
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:13px;border:1.5px solid '+col+'22;background:'+(inCart?col+'11':'#fafafa')+';margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px"><span style="background:linear-gradient(135deg,'+col+','+col+'cc);color:#fff;border-radius:9px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">'+(CI[item.cat]||"📦")+'</span><div><div style="font-size:15px;font-weight:700;color:#1a2535">'+esc(item.n)+'</div><div style="font-size:13px;color:'+col+';font-weight:700">'+item.p+' دج <span style="color:#aaa;font-weight:400">· متبقي: '+item.q+'</span></div></div></div><button onclick="addManualToCart('+item.id+')" style="background:linear-gradient(135deg,'+col+','+col+'cc);color:#fff;border:none;border-radius:10px;padding:10px 16px;font-size:16px;font-weight:800;cursor:pointer;font-family:Tajawal,Arial;min-width:50px">'+(inCart?'<span style="font-size:12px">'+inCart.q+'</span> +':'+'')+'</button></div>';
    }).join('');
}

function filterManualCart(val) {
    var items=S.stock.filter(function(s){ return s.q>0; });
    var el=document.getElementById('manualList');
    if (el) el.innerHTML=renderManualList(items,val);
}

function addManualToCart(id) {
    addToCartHome(id);
    var srch=document.getElementById('manSrch');
    var items=S.stock.filter(function(s){ return s.q>0; });
    var el=document.getElementById('manualList');
    if (el) el.innerHTML=renderManualList(items,srch?srch.value:'');
    if (S.cameraActiveInHome&&document.getElementById('splitCameraContainer')) refreshSplitCart();
}

function openQuickAdd(barcode) {
    var ov=document.getElementById('qaModal');
    if (!ov) { ov=document.createElement('div'); ov.id='qaModal'; ov.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.75);z-index:6000;display:flex;align-items:center;justify-content:center;padding:16px;direction:rtl'; document.body.appendChild(ov); }
    var catOpts=CATS.filter(function(x){ return x!=="الكل"; }).map(function(c){ return '<option value="'+c+'">'+CI[c]+' '+c+'</option>'; }).join('');
    ov.innerHTML='<div style="background:#fff;border-radius:22px;padding:26px;max-width:420px;width:100%;box-shadow:0 12px 40px rgba(0,0,0,.4)"><div style="text-align:center;margin-bottom:18px"><div style="font-size:44px">📦</div><h3 style="color:#0277bd;margin:8px 0 6px;font-size:21px;font-family:Tajawal,Arial">منتج جديد</h3>'+(barcode?'<div style="background:#e3f2fd;border-radius:10px;padding:6px 14px;font-size:14px;color:#0277bd;font-weight:700;display:inline-block;font-family:monospace">'+esc(barcode)+'</div>':'')+'</div><input id="qa_n" class="inp" placeholder="اسم المنتج *" style="margin-bottom:10px"><select id="qa_cat" class="inp" style="margin-bottom:10px">'+catOpts+'</select><div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:10px"><input id="qa_p" class="inp" type="number" placeholder="سعر البيع (دج) *"><input id="qa_c" class="inp" type="number" placeholder="سعر الشراء (دج) *"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:18px"><input id="qa_q" class="inp" type="number" placeholder="🏪 كمية المحل"><input id="qa_wq" class="inp" type="number" placeholder="📦 كمية المستودع"></div><div style="display:flex;gap:9px"><button id="qa_save" style="flex:1;background:linear-gradient(135deg,#1b5e20,#2e7d32);color:#fff;border:none;border-radius:13px;padding:15px;font-size:16px;font-weight:700;cursor:pointer;font-family:Tajawal,Arial">✅ حفظ</button><button id="qa_cancel" style="background:#f0f0f0;color:#555;border:none;border-radius:13px;padding:15px 18px;font-size:15px;font-weight:700;cursor:pointer;font-family:Tajawal,Arial">إلغاء</button></div></div>';
    ov.style.display='flex';
    document.getElementById('qa_cancel').onclick=function(){ ov.style.display='none'; if(S.cameraActiveInHome&&document.getElementById('splitCameraContainer')) startSplitCamera(); };
    document.getElementById('qa_save').onclick=function(){
        var n=(document.getElementById('qa_n').value||'').trim();
        var p=parseFloat(document.getElementById('qa_p').value)||0;
        var c=parseFloat(document.getElementById('qa_c').value)||0;
        var cat=document.getElementById('qa_cat').value;
        var q=parseInt(document.getElementById('qa_q').value)||0;
        var wq=parseInt(document.getElementById('qa_wq').value)||0;
        if(!n){toast("أدخل اسم المنتج","e");return;}
        if(!p){toast("أدخل سعر البيع","e");return;}
        if(!c){toast("أدخل سعر الشراء","e");return;}
        if(c>=p){toast("سعر الشراء يجب أن يكون أقل","e");return;}
        if(q===0&&wq===0){toast("أدخل الكمية","e");return;}
        var nId=S.stock.length>0?Math.max.apply(null,S.stock.map(function(s){return s.id;}))+1:1;
        var bc=barcode||gbc(nId);
        S.stock.push({id:nId,n:n,p:p,c:c,q:q,wq:wq,cat:cat,barcode:bc});
        save(); ov.style.display='none';
        if(q>0) addToCartSilent(nId);
        if(S.cameraActiveInHome&&document.getElementById('splitCameraContainer')){ refreshSplitCart(); startSplitCamera(); } else render();
        toast((q>0?"✅ أضيف: ":"💾 حُفظ: ")+n);
    };
    setTimeout(function(){ var el=document.getElementById('qa_n'); if(el) el.focus(); },150);
}

function printReceipt() {
    if (!S.cart.length) { toast("السلة فارغة","e"); return; }
    var n=new Date(), invoiceNum=S.sales.length+1;
    var rows=S.cart.map(function(it){ var p=it.customP!==undefined?it.customP:it.p; return '<tr><td style="text-align:right;padding:6px 4px;font-size:13px;border-bottom:1px dashed #e0e0e0">'+esc(it.n)+'</td><td style="text-align:center;padding:6px 4px;font-size:13px;border-bottom:1px dashed #e0e0e0;color:#555">'+it.q+' × '+p+'</td><td style="text-align:left;padding:6px 4px;font-size:13px;border-bottom:1px dashed #e0e0e0;font-weight:700;color:#0277bd">'+it.sum+'</td></tr>'; }).join('');
    var html='<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>فاتورة #'+invoiceNum+'</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Tajawal,Arial,sans-serif;font-size:13px;direction:rtl;width:80mm;margin:0 auto;padding:4mm 3mm;color:#000}@media print{body{width:80mm;margin:0;padding:3mm 2mm}@page{size:80mm auto;margin:0}}.center{text-align:center}.dash{border:none;border-top:1px dashed #999;margin:6px 0}.solid{border:none;border-top:2px solid #000;margin:6px 0}table{width:100%;border-collapse:collapse}</style></head><body><div class="center" style="padding:8px 0"><div style="font-size:22px;font-weight:900">مكتبة حشايشي</div><div style="font-size:11px;color:#666;margin-top:3px">📍 مركز صالح باي</div></div><hr class="solid"><div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span>رقم: <b>#'+invoiceNum+'</b></span><span>'+n.toLocaleDateString("ar-DZ")+'</span></div><div style="text-align:center;font-size:11px;color:#666;padding-bottom:4px">'+n.toLocaleTimeString("ar-DZ",{hour:"2-digit",minute:"2-digit",hour12:false})+'</div><hr class="dash"><table><thead><tr><th style="text-align:right;font-size:11px;padding:4px 3px;border-bottom:1.5px solid #000">الصنف</th><th style="font-size:11px;padding:4px 3px;border-bottom:1.5px solid #000">الكمية×السعر</th><th style="text-align:left;font-size:11px;padding:4px 3px;border-bottom:1.5px solid #000">المجموع</th></tr></thead><tbody>'+rows+'</tbody></table><hr class="dash">'+(S.disc>0?'<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:#e65100;font-weight:700"><span>خصم '+S.disc+'%:</span><span>− '+dAmt()+' دج</span></div>':'')+'<hr class="solid"><div style="text-align:center;padding:8px 0"><div style="font-size:12px;color:#555;margin-bottom:2px">المبلغ الإجمالي</div><div style="font-size:26px;font-weight:900;color:#0277bd">'+cTotal()+' دج</div></div><hr class="solid"><div class="center" style="padding:10px 0;font-size:13px;line-height:2;color:#555"><div style="font-size:15px;font-weight:700;color:#000">شكراً لتسوقكم معنا 🙏</div></div><hr class="dash"></body></html>';
    var w=window.open('','_blank','width=350,height=600');
    if(!w){toast("يرجى السماح بالنوافذ","e");return;}
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(function(){ w.print(); },400);
}
