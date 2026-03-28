// ✅ هذه الدوال تُعرَّف في main.js — لا نعرّفها هنا لتجنب التعارض
// openCart / closeCart / toggleCart / refreshGlobalCart / refreshSplitCart

// تحديث السلة في وضع الكاميرا المنقسمة
function refreshSplitCart() {
    if (typeof _rebuildCart === 'function') _rebuildCart();
}

// ============================================================
//  رسم محتوى السلة
// ============================================================
function renderCartPanelContent(refreshFn) {

    var emptyCart =
        '<div style="flex:1;display:flex;flex-direction:column;align-items:center;' +
             'justify-content:center;gap:14px;padding:32px 0">' +
            '<div style="background:linear-gradient(135deg,#e8eeff,#f0f4ff);border-radius:50%;' +
                  'width:88px;height:88px;display:flex;align-items:center;justify-content:center;' +
                  'font-size:44px">🛒</div>' +
            '<div style="font-size:17px;font-weight:700;color:#9fa8da">السلة فارغة</div>' +
            '<div style="font-size:14px;color:#b0bec5;text-align:center;line-height:1.7">' +
                'اضغط على منتج<br>أو امسح الباركود 📷</div>' +
        '</div>';

    var cartCards = S.cart.length === 0 ? emptyCart :
        '<div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding-bottom:4px">' +
        S.cart.map(function(it) {
            var dispP    = it.customP !== undefined ? it.customP : it.p;
            var isCustom = it.customP !== undefined && it.customP !== it.p;
            var col      = (typeof CC !== 'undefined' && CC[it.cat]) || "#0277bd";
            var icon     = (typeof CI !== 'undefined' && CI[it.cat]) || "📦";
            return '<div style="background:#fff;border:2px solid ' +
                    (isCustom ? '#e65100' : '#eef1ff') +
                    ';border-right:5px solid ' + (isCustom ? '#e65100' : col) +
                    ';border-radius:14px;padding:13px;box-shadow:0 2px 9px rgba(0,0,0,.06)">' +

                '<div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">' +
                    '<span style="background:linear-gradient(135deg,' + col + ',' + col + 'cc);' +
                          'color:#fff;border-radius:9px;min-width:30px;height:30px;font-size:16px;' +
                          'display:flex;align-items:center;justify-content:center;flex-shrink:0">' + icon + '</span>' +
                    '<span style="flex:1;font-size:15px;font-weight:700;color:#1a2535;line-height:1.3">' +
                        esc(it.n) + '</span>' +
                    '<button data-rem="' + it.id + '" style="background:#fff0f0;color:#e53935;' +
                            'border:1.5px solid #ffcdd2;border-radius:9px;width:30px;height:30px;' +
                            'cursor:pointer;font-size:16px;font-weight:700;flex-shrink:0">×</button>' +
                '</div>' +

                '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' +
                    '<div style="display:flex;align-items:center;gap:3px;background:#f0f4ff;' +
                          'border-radius:10px;padding:4px 6px">' +
                        '<button data-dec="' + it.id + '" style="background:#fff;color:#0277bd;' +
                                'border:1.5px solid #dde4ff;border-radius:7px;width:30px;height:30px;' +
                                'font-size:20px;cursor:pointer;font-weight:700;line-height:1">−</button>' +
                        '<span style="background:linear-gradient(135deg,#0277bd,#01579b);color:#fff;' +
                              'border-radius:8px;padding:4px 13px;font-weight:800;font-size:17px;' +
                              'min-width:36px;text-align:center">' + it.q + '</span>' +
                        '<button data-inc="' + it.id + '" style="background:#fff;color:#0277bd;' +
                                'border:1.5px solid #dde4ff;border-radius:7px;width:30px;height:30px;' +
                                'font-size:20px;cursor:pointer;font-weight:700;line-height:1">+</button>' +
                    '</div>' +
                    '<span style="color:#ccc">×</span>' +
                    '<input data-price="' + it.id + '" type="number" value="' + dispP + '" ' +
                           'style="width:65px;padding:5px 4px;border-radius:8px;border:2px solid ' +
                           (isCustom ? '#e65100' : '#dde4ff') + ';text-align:center;font-size:15px;' +
                           'font-weight:700;color:' + (isCustom ? '#e65100' : '#0277bd') +
                           ';font-family:Tajawal,Arial">' +
                    '<span style="margin-right:auto;font-size:18px;font-weight:800;color:' +
                          (isCustom ? '#e65100' : col) + '">' + it.sum +
                        ' <span style="font-size:12px;font-weight:500">دج</span></span>' +
                '</div>' +
            '</div>';
        }).join('') + '</div>';

    var discRow = S.cart.length > 0 ?
        '<div style="display:flex;gap:4px;align-items:center;padding:8px 0;' +
             'border-top:1px dashed #eee;border-bottom:1px dashed #eee;margin:4px 0">' +
            '<span style="font-size:13px;color:#999;font-weight:700;white-space:nowrap">🏷️</span>' +
            [0,5,10,15,20].map(function(d) {
                return '<button data-disc="' + d + '" style="flex:1;padding:7px 2px;border-radius:9px;' +
                    'border:2px solid ' + (S.disc===d ? '#bf360c' : '#eee') + ';cursor:pointer;' +
                    'font-weight:800;font-size:13px;font-family:Tajawal,Arial;background:' +
                    (S.disc===d ? 'linear-gradient(135deg,#bf360c,#e53935)' : '#fff') +
                    ';color:' + (S.disc===d ? '#fff' : '#666') + '">' + d + '%</button>';
            }).join('') +
        '</div>' : '';

    var payRow = S.cart.length > 0 ?
        '<div style="background:linear-gradient(135deg,#1b5e20,#2e7d32);border-radius:16px;' +
             'padding:16px;box-shadow:0 5px 18px rgba(27,94,32,.4)">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:13px">' +
                '<div>' +
                    '<div style="color:rgba(255,255,255,.75);font-size:13px">' +
                        cQty() + ' قطعة · ' + S.cart.length + ' صنف' +
                        (S.disc > 0 ? ' · خصم −' + dAmt() + ' دج' : '') +
                    '</div>' +
                    '<div style="color:#fff;font-size:28px;font-weight:900;line-height:1.1">' +
                        cTotal() + ' <span style="font-size:15px;font-weight:500">دج</span></div>' +
                '</div>' +
                '<div style="display:flex;flex-direction:column;gap:6px">' +
                    '<button id="clrCartBtn" style="background:rgba(255,255,255,.15);color:#fff;' +
                            'border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:8px 12px;' +
                            'cursor:pointer;font-size:13px;font-weight:700;font-family:Tajawal,Arial">🗑 مسح</button>' +
                    '<button id="printBtn" style="background:rgba(255,255,255,.15);color:#fff;' +
                            'border:1px solid rgba(255,255,255,.3);border-radius:10px;padding:8px 12px;' +
                            'cursor:pointer;font-size:13px;font-weight:700;font-family:Tajawal,Arial">🖨️ طباعة</button>' +
                '</div>' +
            '</div>' +
            '<button id="payBtn" style="width:100%;background:#fff;color:#1b5e20;border:none;' +
                    'border-radius:13px;padding:16px;font-size:18px;font-weight:900;cursor:pointer;' +
                    'font-family:Tajawal,Arial;box-shadow:0 3px 12px rgba(0,0,0,.15)">' +
                '💵 دفع نقدي — ' + cTotal() + ' دج</button>' +
            (S.clients.length > 0 ?
                '<details style="margin-top:9px">' +
                    '<summary style="background:rgba(255,255,255,.15);color:#fff;padding:10px 13px;' +
                             'border-radius:10px;cursor:pointer;font-size:14px;font-family:Tajawal,Arial;' +
                             'list-style:none;text-align:center;font-weight:700">👤 على حساب زبون ▾</summary>' +
                    '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:8px">' +
                        S.clients.map(function(cl) {
                            return '<button data-client="' + cl.id + '" data-cname="' + esc(cl.name) + '" ' +
                                'style="flex:1;background:rgba(255,255,255,.92);color:#1b5e20;border:none;' +
                                'border-radius:10px;padding:9px;cursor:pointer;font-size:13px;' +
                                'font-family:Tajawal,Arial;font-weight:700">' +
                                esc(cl.name) +
                                (cl.debt > 0 ? '<div style="font-size:11px;color:#c62828">' + fmt(cl.debt) + ' دج</div>' : '') +
                            '</button>';
                        }).join('') +
                    '</div>' +
                '</details>' : '') +
        '</div>' : '';

    return '<div style="display:flex;flex-direction:column;height:100%;gap:8px">' +
        '<div style="background:linear-gradient(135deg,#0d1b2a,#1a3a5c);border-radius:13px;' +
             'padding:11px 15px;display:flex;align-items:center;justify-content:space-between">' +
            '<div style="display:flex;align-items:center;gap:8px">' +
                '<div style="background:#0277bd;border-radius:8px;width:30px;height:30px;' +
                     'display:flex;align-items:center;justify-content:center;font-size:16px">🛒</div>' +
                '<div style="color:#fff;font-weight:800;font-size:16px">السلة</div>' +
            '</div>' +
            (S.cart.length > 0 ?
                '<div style="display:flex;gap:6px">' +
                    '<span style="background:rgba(255,255,255,.15);color:#fff;border-radius:20px;' +
                          'padding:3px 11px;font-size:13px;font-weight:700">' + S.cart.length + ' صنف</span>' +
                    '<span style="background:#0277bd;color:#fff;border-radius:20px;' +
                          'padding:3px 11px;font-size:13px;font-weight:700">' + cTotal() + ' دج</span>' +
                '</div>'
            : '<span style="color:rgba(255,255,255,.4);font-size:13px">فارغة</span>') +
        '</div>' +
        cartCards + discRow + payRow +
    '</div>';
}

// ============================================================
//  ربط أحداث السلة
// ============================================================
function bindCartEvents(refreshFn) {
    // استخدم _rebuildCart إن وُجد، وإلا refreshFn
    var fn = (typeof _rebuildCart === 'function') ? _rebuildCart : refreshFn;

    document.querySelectorAll('[data-rem]').forEach(function(btn) {
        btn.onclick = function() { remFromCart(+btn.dataset.rem); fn(); };
    });
    document.querySelectorAll('[data-inc]').forEach(function(btn) {
        btn.onclick = function() { changeCartQty(+btn.dataset.inc, 1); fn(); };
    });
    document.querySelectorAll('[data-dec]').forEach(function(btn) {
        btn.onclick = function() { changeCartQty(+btn.dataset.dec, -1); fn(); };
    });
    document.querySelectorAll('[data-price]').forEach(function(inp) {
        inp.oninput = function() { updateCartItemPrice(+inp.dataset.price, +inp.value); fn(); };
    });
    document.querySelectorAll('[data-disc]').forEach(function(btn) {
        btn.onclick = function() { S.disc = +btn.dataset.disc; fn(); };
    });

    var payBtn  = document.getElementById('payBtn');
    var clrBtn  = document.getElementById('clrCartBtn');
    var prtBtn  = document.getElementById('printBtn');

    if (payBtn) payBtn.onclick = function() { saveSale(null); };
    if (clrBtn) clrBtn.onclick = function() { clrCart(); fn(); };
    if (prtBtn) prtBtn.onclick = printReceipt;

    document.querySelectorAll('[data-client]').forEach(function(btn) {
        btn.onclick = function() {
            if (confirm("على حساب " + btn.dataset.cname + "؟"))
                saveSale({ id: +btn.dataset.client, name: btn.dataset.cname });
        };
    });
}
