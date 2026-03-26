// ===== STOCK render =====
function renderStock() {
    var f = S.form;
    var totalShop = shopVal();
    var totalWh = whVal();
    var lowCount = lowItems().length;
    var statsBar = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">'+[
        {ic:"📦",l:"الأصناف",v:S.stock.length,g:"linear-gradient(135deg,#0d47a1,#0277bd)"},
        {ic:"🏪",l:"قيمة المحل",v:H(fmt(totalShop)+" دج"),g:"linear-gradient(135deg,#1b5e20,#2e7d32)"},
        {ic:"📦",l:"قيمة المستودع",v:H(fmt(totalWh)+" دج"),g:"linear-gradient(135deg,#4a148c,#6a1b9a)"},
        {ic:"⚠️",l:"ناقصة",v:lowCount,g:lowCount>0?"linear-gradient(135deg,#bf360c,#e64a19)":"linear-gradient(135deg,#1b5e20,#2e7d32)"}
    ].map(function(s){ return '<div style="background:'+s.g+';border-radius:20px;padding:14px 12px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,.05)"><div style="font-size:24px;margin-bottom:6px">'+s.ic+'</div><div style="color:rgba(255,255,255,.8);font-size:12px;font-weight:600;margin-bottom:2px">'+s.l+'</div><div style="color:#fff;font-weight:800;font-size:16px">'+s.v+'</div></div>'; }).join('')+'</div>';
    var formHTML = '<div style="background:#f8fafc;border:1px solid #eef2f6;border-radius:24px;padding:20px;margin-bottom:24px;box-shadow:0 2px 8px rgba(0,0,0,.02)">'+
        '<h4 style="margin:0 0 16px;color:#0f172a;font-size:18px;font-weight:800;display:flex;align-items:center;gap:8px">'+
        '<span style="background:linear-gradient(135deg,#0277bd,#01579b);color:#fff;border-radius:12px;width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;font-size:18px">➕</span>'+
        'إضافة / تحديث منتج'+
        '</h4>'+
        '<div class="grid3" style="margin-bottom:20px">'+
        [["shop","🏪","المحل","#2e7d32"],["warehouse","📦","المستودع","#4a148c"],["both","🔄","الاثنين","#0277bd"]].map(function(d){
            return '<button onclick="S.form.dest=\''+d[0]+'\';render()" style="padding:12px;border-radius:16px;border:2px solid '+(f.dest===d[0]?d[3]:'#e2e8f0')+';cursor:pointer;background:'+(f.dest===d[0]?'linear-gradient(135deg,'+d[3]+','+d[3]+'cc)':'#fff')+';color:'+(f.dest===d[0]?'#fff':d[3])+';display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:700;transition:all .2s;box-shadow:'+(f.dest===d[0]?'0 4px 12px '+d[3]+'44':'none')+'">'+
                '<span style="font-size:24px">'+d[1]+'</span><span style="font-size:13px">'+d[2]+'</span></button>';
        }).join('')+
        '</div>'+
        '<div class="grid2" style="gap:16px">'+
        '<input class="inp" value="'+esc(f.n)+'" placeholder="📝 اسم المنتج *" onchange="S.form.n=this.value">'+
        '<select class="inp" onchange="S.form.cat=this.value">'+CATS.filter(function(x){ return x!=="الكل"; }).map(function(c){ return '<option value="'+c+'"'+(f.cat===c?' selected':'')+'>'+CI[c]+' '+c+'</option>'; }).join('')+'</select>'+
        '<input class="inp" type="number" value="'+esc(f.p)+'" placeholder="💰 سعر البيع (دج)" style="border-color:#0277bd" onchange="S.form.p=this.value">'+
        '<input class="inp" type="number" value="'+esc(f.c)+'" placeholder="🛒 سعر الشراء (دج)" onchange="S.form.c=this.value">'+
        (f.dest!=="warehouse"?'<input class="inp" type="number" value="'+esc(f.q)+'" placeholder="🏪 كمية المحل" style="border-color:#2e7d32" onchange="S.form.q=this.value">':'')+
        (f.dest!=="shop"?'<input class="inp" type="number" value="'+esc(f.wq)+'" placeholder="📦 كمية المستودع" style="border-color:#4a148c" onchange="S.form.wq=this.value">':'')+
        '<input class="inp" value="'+esc(f.bc)+'" placeholder="🔖 باركود (اختياري)" style="grid-column:span 2" onchange="S.form.bc=this.value">'+
        '</div>'+
        '<div style="display:flex;gap:12px;margin-top:20px">'+
        '<button onclick="addStock()" class="btn" style="flex:1;background:linear-gradient(135deg,#0277bd,#01579b);font-size:16px;padding:14px;box-shadow:0 4px 12px rgba(2,119,189,.2)">✅ إضافة / تحديث</button>'+
        '<button onclick="openQuickAdd(\'\')" class="btn" style="background:linear-gradient(135deg,#2e7d32,#1b5e20);font-size:14px;padding:14px 16px;box-shadow:0 4px 12px rgba(46,125,50,.2)">📷 مسح</button>'+
        '</div>'+
    '</div>';
    var sorts = ['def','name','qa','qd','price'];
    var sortLabels = ['افتراضي','أ-ي','كمية ↑','كمية ↓','السعر'];
    var toolBar = '<div style="background:#fff;border-radius:20px;padding:12px 16px;margin-bottom:24px;border:1px solid #eef2f6;display:flex;flex-wrap:wrap;gap:12px;align-items:center">'+
        '<input id="stockSrch" value="'+esc(S.ssrch)+'" placeholder="🔍 بحث في المخزون..." class="inp" style="flex:1;min-width:160px;border-color:#e2e8f0" onchange="S.ssrch=this.value;render()">'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap">'+sorts.map(function(k,i){ return '<button onclick="S.sortBy=\''+k+'\';render()" style="padding:8px 14px;border-radius:40px;border:none;cursor:pointer;font-weight:600;font-size:13px;background:'+(S.sortBy===k?'#0277bd':'#f1f5f9')+';color:'+(S.sortBy===k?'#fff':'#1e293b')+'">'+sortLabels[i]+'</button>'; }).join('')+'</div>'+
        '<div style="display:flex;gap:6px">'+[["shop","🏪"],["warehouse","📦"],["both","🔄"]].map(function(v){ return '<button onclick="S.stockView=\''+v[0]+'\';render()" style="padding:8px 14px;border-radius:40px;border:none;cursor:pointer;font-size:15px;background:'+(S.stockView===v[0]?'#0277bd':'#f1f5f9')+';color:'+(S.stockView===v[0]?'#fff':'#1e293b')+'">'+v[1]+'</button>'; }).join('')+'</div>'+
    '</div>';
    var catTables = CATS.filter(function(x){ return x!=="الكل"; }).map(function(cat){
        var items = sortItems(S.stock.filter(function(s){ return s.cat===cat && (!S.ssrch || nAr(s.n).includes(nAr(S.ssrch))); }));
        if(items.length===0) return '';
        var isOpen = !!S.openCats[cat] || !!S.ssrch;
        var cv = items.reduce(function(a,s){ return a+s.q*s.c; },0);
        var wv = items.reduce(function(a,s){ return a+(s.wq||0)*s.c; },0);
        var profit = items.reduce(function(a,s){ return a+s.q*(s.p-s.c); },0);
        var lowC = items.filter(function(s){ return s.q<=5; }).length;
        var showBC = S.stockView==="both";
        var thead = '<tr style="background:#f8fafc">'+
            (S.stockView!=="warehouse"?'<th style="color:#2e7d32;font-size:13px;padding:12px 8px;border-bottom:2px solid #eef2f6;min-width:70px">🏪 محل</th>':'')+
            (S.stockView!=="shop"?'<th style="color:#4a148c;font-size:13px;padding:12px 8px;border-bottom:2px solid #eef2f6;min-width:70px">📦 مستودع</th>':'')+
            '<th style="text-align:right;padding:12px 12px;font-size:13px;color:#334155;border-bottom:2px solid #eef2f6">الصنف</th>'+
            '<th style="font-size:13px;color:#0277bd;padding:12px 8px;border-bottom:2px solid #eef2f6;min-width:80px">💰 بيع</th>'+
            '<th style="font-size:13px;color:#475569;padding:12px 8px;border-bottom:2px solid #eef2f6;min-width:80px">🛒 شراء</th>'+
            '<th style="font-size:13px;padding:12px 8px;border-bottom:2px solid #eef2f6;min-width:70px">إضافة</th>'+
            '<th style="font-size:13px;color:#2e7d32;padding:12px 8px;border-bottom:2px solid #eef2f6;min-width:70px">📈 ربح</th>'+
            (showBC?'<th style="font-size:13px;color:#888;padding:12px 8px;border-bottom:2px solid #eef2f6">🔖</th>':'')+
            '<th style="font-size:13px;padding:12px 8px;border-bottom:2px solid #eef2f6">حذف</th>'+
        '   </tr>';
        var tbody = items.map(function(s,idx){
            var rb = idx%2===0 ? '#fff' : '#fafcff';
            var pv = s.p-s.c;
            return '<tr style="background:'+rb+'" onmouseover="this.style.background=\'#f8fafc\'" onmouseout="this.style.background=\''+rb+'\'">'+
                (S.stockView!=="warehouse"?'<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center"><input type="number" value="'+s.q+'" onchange="var it=S.stock.find(function(x){return x.id==='+s.id+'});if(it){it.q=+this.value;save();}" style="width:60px;padding:6px 3px;border-radius:8px;border:1px solid #e2e8f0;text-align:center;font-size:13px;font-weight:700;background:#fff">   </td>':'')+
                (S.stockView!=="shop"?'<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center"><input type="number" value="'+(s.wq||0)+'" onchange="var it=S.stock.find(function(x){return x.id==='+s.id+'});if(it){it.wq=+this.value;save();}" style="width:60px;padding:6px 3px;border-radius:8px;border:1px solid #e2e8f0;text-align:center;font-size:13px;color:#4a148c;font-weight:700;background:#fff">   </td>':'')+
                '<td style="text-align:right;padding:8px 12px;border-bottom:1px solid #f0f0f0"><span style="font-size:14px;font-weight:700;color:#1e293b">'+esc(s.n)+'</span>   </td>'+
                '<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center"><input type="number" value="'+s.p+'" onchange="var it=S.stock.find(function(x){return x.id==='+s.id+'});if(it&&+this.value>it.c){it.p=+this.value;save();}else{this.value=it?it.p:this.value;}" style="width:70px;padding:6px 3px;border-radius:8px;border:1px solid #e2e8f0;text-align:center;font-size:13px;font-weight:700;color:#0277bd;background:#fff">   </td>'+
                '<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center"><input type="number" value="'+s.c+'" onchange="var it=S.stock.find(function(x){return x.id==='+s.id+'});if(it&&it.p>+this.value){it.c=+this.value;save();}else{this.value=it?it.c:this.value;}" style="width:70px;padding:6px 3px;border-radius:8px;border:1px solid #e2e8f0;text-align:center;font-size:13px;color:#475569;background:#fff">   </td>'+
                '<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center"><button onclick="addToCartFromStock('+s.id+')" style="background:#e8f5e9;color:#2e7d32;border:1px solid #c8e6c9;border-radius:10px;padding:6px 12px;cursor:pointer;font-size:14px" title="إضافة للسلة">🛒</button>   </td>'+
                '<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center"><span style="background:'+(pv>0?'#e8f5e9':'#ffebee')+';color:'+(pv>0?'#2e7d32':'#f44336')+';border-radius:30px;padding:4px 12px;font-size:12px;font-weight:700">'+pv+' دج</span>   </td>'+
                (showBC?'<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;font-size:11px;color:#888;font-family:monospace;text-align:center">'+(s.barcode||'—')+'   </td>':'')+
                '<td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center"><button onclick="if(confirm(\'حذف '+esc(s.n)+'؟\'))delStock('+s.id+')" style="background:#fff0f0;color:#e53935;border:1px solid #ffcdd2;border-radius:10px;padding:6px 12px;cursor:pointer;font-size:14px">🗑</button>   </td>'+
            '</tr>';
        }).join('');
        return '<div data-cat="'+cat+'" style="margin-bottom:20px;border-radius:20px;overflow:hidden;border:1px solid #eef2f6;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.02)">'+
            '<div onclick="S.openCats[\''+cat+'\']=!S.openCats[\''+cat+'\'];render()" style="background:linear-gradient(135deg,'+CC[cat]+'ee,'+CC[cat]+'bb);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;cursor:pointer;user-select:none">'+
            '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">'+
            '<div style="background:rgba(255,255,255,.2);border-radius:12px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:24px">'+CI[cat]+'</div>'+
            '<div><div style="color:#fff;font-weight:800;font-size:18px">'+cat+'</div><div style="color:rgba(255,255,255,.8);font-size:12px">'+items.length+' صنف</div></div>'+
            '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
            '<span style="background:rgba(255,255,255,.2);color:#fff;border-radius:30px;padding:4px 12px;font-size:11px;font-weight:600">🏪 '+fmt(cv)+' دج</span>'+
            '<span style="background:rgba(255,255,255,.2);color:#fff;border-radius:30px;padding:4px 12px;font-size:11px;font-weight:600">📦 '+fmt(wv)+' دج</span>'+
            '<span style="background:rgba(255,255,255,.2);color:#fff;border-radius:30px;padding:4px 12px;font-size:11px;font-weight:600">📈 '+fmt(profit)+' دج</span>'+
            (lowC>0?'<span style="background:#ff6b35;color:#fff;border-radius:30px;padding:4px 12px;font-size:11px;font-weight:700">⚠️ '+lowC+' ناقص</span>':'')+
            '</div>'+
            '</div>'+
            '<div style="background:rgba(255,255,255,.2);border-radius:10px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;transition:transform .25s;transform:'+(isOpen?'rotate(180deg)':'rotate(0)')+'">▼</div>'+
            '</div>'+
            (isOpen?'<div style="overflow-x:auto;background:#fff"><table style="width:100%;border-collapse:collapse"><thead>'+thead+'</thead><tbody>'+tbody+'</tbody> </table></div>':'')+
        '</div>';
    }).join('');
    return statsBar+formHTML+toolBar+catTables;
}
