function drawPieChart(){
    var ctx=document.getElementById('dailySalesChart');
    if(!ctx)return;
    var categorySales={};
    tSales().forEach(function(sale){sale.items.forEach(function(item){var cat=item.cat||"أخرى";if(!categorySales[cat])categorySales[cat]=0;categorySales[cat]+=item.sum;});});
    var labels=Object.keys(categorySales);
    if(pieChart)pieChart.destroy();
    pieChart=new Chart(ctx,{type:'pie',data:{labels:labels,datasets:[{data:labels.map(function(l){return categorySales[l];}),backgroundColor:labels.map(function(l){return CC[l]||"#9ca3af";}),borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{position:'bottom',labels:{font:{family:'Tajawal',size:12}}},tooltip:{callbacks:{label:function(t){return t.label+': '+fmt(t.raw)+' دج';}}}}}});
}

function renderHome(){
    // ===== أزرار الإجراء =====
    var actionBar='<div style="display:flex;gap:12px;margin-bottom:20px">'+
        '<button id="camBtn" style="background:linear-gradient(135deg,#0284c7,#0f172a);color:#fff;border:none;border-radius:40px;padding:12px 20px;font-size:20px;cursor:pointer;box-shadow:0 4px 12px rgba(2,132,199,.2)">📷</button>'+
        '<button onclick="openManualCart()" style="background:linear-gradient(135deg,#2e7d32,#1b5e20);color:#fff;border:none;border-radius:40px;padding:12px 20px;font-size:20px;cursor:pointer;box-shadow:0 4px 12px rgba(46,125,50,.2)">➕</button>'+
    '</div>';

    // ===== تصفح حسب الفئة (فوق) =====
    var catCards = '<div style="margin-bottom:24px">'+
    '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px">'+
        '<span style="background:linear-gradient(135deg,#3668d6,#0891b2);-webkit-background-clip:text;-webkit-text-fill-color:transparent">🗂️ تصفح حسب الفئة</span>'+
    '</div>'+
    '<div class="category-grid">'+
    CATS.filter(function(x){return x!=="الكل";}).map(function(cat){
        var count = S.stock.filter(function(s){return s.cat===cat;}).length;
        var imgUrl = CAT_IMG[cat] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=70';
        return '<div class="category-card" onclick="goToStockCat(\''+cat+'\')">'+
            '<div class="category-icon" style="background:linear-gradient(135deg,'+CC[cat]+'22, #ffffff); overflow:hidden; border-radius:16px;">'+
                '<img src="'+imgUrl+'" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">'+
            '</div>'+
            '<div class="category-name">'+cat+'</div>'+
            '<div class="category-count">'+count+' صنف</div>'+
        '</div>';
    }).join('')+'</div>'+
'</div>';

    // ===== الرسم البياني =====
    var chartSection=S.cameraActiveInHome?'':'<div class="chart-container" style="margin-bottom:24px"><div class="chart-title"><span>📊</span> أفضل المبيعات اليوم حسب الفئة</div><canvas id="dailySalesChart" style="max-height:260px;width:100%"></canvas></div>';

    // ===== الإحصائيات (تحت — قائمة عمودية بتصميم جديد) =====
    var stats=[
        {ic:"💰", l:"مبيعات اليوم",   v:H(fmt(tST())+" دج"),  c1:"#0d47a1", c2:"#0277bd", glow:"rgba(2,119,189,.25)"},
        {ic:"📈", l:"أرباح اليوم",    v:H(fmt(tPR())+" دج"),  c1:"#1b5e20", c2:"#43a047", glow:"rgba(67,160,71,.25)"},
        {ic:"🖨️",l:"طباعة اليوم",    v:H(fmt(tPT())+" دج"),  c1:"#004d40", c2:"#00897b", glow:"rgba(0,137,123,.25)"},
        {ic:"⚡", l:"Flixy اليوم",    v:H(fmt(tFT())+" دج"),  c1:"#1a237e", c2:"#3949ab", glow:"rgba(57,73,171,.25)"},
        {ic:"🏪", l:"قيمة المحل",     v:H(fmt(shopVal())+" دج"),c1:"#bf360c",c2:"#e64a19", glow:"rgba(230,74,25,.25)"},
        {ic:"📋", l:"إجمالي الديون",  v:H(fmt(tDebt())+" دج"),
            c1:tDebt()>0?"#b71c1c":"#1b5e20",
            c2:tDebt()>0?"#e53935":"#43a047",
            glow:tDebt()>0?"rgba(229,57,53,.25)":"rgba(67,160,71,.25)"}
    ];

    var statsHTML='<div style="margin-bottom:24px">'+
        '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px">'+
            '<span style="background:linear-gradient(135deg,#3668d6,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent">📊 لوحة الأداء اليومي</span>'+
        '</div>'+
        '<div style="display:flex;flex-direction:column;gap:10px">'+
        stats.map(function(s){
            return '<div style="'+
                'display:flex;align-items:center;gap:14px;'+
                'background:linear-gradient(135deg,'+s.c1+'18,'+s.c2+'0a);'+
                'border:1.5px solid '+s.c1+'33;'+
                'border-radius:16px;'+
                'padding:14px 18px;'+
                'box-shadow:0 4px 16px '+s.glow+',0 1px 4px rgba(0,0,0,.06);'+
                'transition:transform .2s,box-shadow .2s;'+
                'cursor:default" '+
                'onmouseover="this.style.transform=\'translateX(-4px)\';this.style.boxShadow=\'0 6px 22px '+s.glow+',0 2px 8px rgba(0,0,0,.08)\'" '+
                'onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'0 4px 16px '+s.glow+',0 1px 4px rgba(0,0,0,.06)\'"'+
            '>'+
                // أيقونة مع خلفية دائرية
                '<div style="'+
                    'width:48px;height:48px;border-radius:14px;flex-shrink:0;'+
                    'background:linear-gradient(135deg,'+s.c1+','+s.c2+');'+
                    'display:flex;align-items:center;justify-content:center;'+
                    'font-size:22px;'+
                    'box-shadow:0 4px 12px '+s.glow+
                '">'+s.ic+'</div>'+
                // النص
                '<div style="flex:1;min-width:0">'+
                    '<div style="font-size:12px;font-weight:600;color:'+s.c1+';opacity:.8;margin-bottom:3px">'+s.l+'</div>'+
                    '<div style="font-size:18px;font-weight:900;color:'+s.c2+';letter-spacing:.3px">'+s.v+'</div>'+
                '</div>'+
                // خط جانبي ديكور
                '<div style="width:4px;height:36px;border-radius:4px;background:linear-gradient(to bottom,'+s.c1+','+s.c2+');opacity:.6;flex-shrink:0"></div>'+
            '</div>';
        }).join('')+
        '</div>'+
    '</div>';

    // ===== عرض الكاميرا المقسّم =====
    var splitView='';
    if(S.cameraActiveInHome){
        splitView='<div id="splitViewContainer" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:2000;background:#000;display:flex;flex-direction:column;">'+
            '<div id="splitCameraContainer" style="flex:4;background:#000;position:relative;min-height:0;">'+
                '<video id="splitCameraVideo" autoplay playsinline style="width:100%;height:100%;object-fit:contain"></video>'+
                '<button id="closeSplitCamera" style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,.7);color:#fff;border:none;border-radius:30px;padding:8px 18px;font-size:14px;font-weight:700;cursor:pointer;z-index:10">✕ إغلاق</button>'+
            '</div>'+
            '<div id="splitCartContainer" style="flex:6;background:#fff;padding:16px;border-top:1px solid #eef2f6;display:flex;flex-direction:column;overflow-y:auto;min-height:0;">'+
                '<div id="splitCartContent">'+renderCartPanelContent(refreshSplitCart)+'</div>'+
            '</div>'+
        '</div>';
    }

    return '<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>'+
        '<div>'+(S.cameraActiveInHome ? splitView : actionBar+catCards+chartSection+statsHTML)+'</div>'+
        '<div class="cart-sidebar" id="cartPanel">'+
            '<button onclick="closeCart()" style="background:linear-gradient(135deg,#c62828,#e53935);color:#fff;border:none;border-radius:12px;padding:10px;font-size:15px;font-weight:700;margin-bottom:12px;cursor:pointer">✕ إغلاق</button>'+
            '<div id="cartPanelContent">'+renderCartPanelContent(refreshGlobalCart)+'</div>'+
        '</div>'+
        '<script>'+
            'document.getElementById("camBtn").onclick=function(){S.cameraActiveInHome=true;render();setTimeout(startSplitCamera,100);};'+
            (S.cameraActiveInHome?'document.getElementById("closeSplitCamera").onclick=function(){stopSplitCamera();S.cameraActiveInHome=false;render();};':'')+
            'setTimeout(drawPieChart,200);'+
        '<\/script>';
}

function bindHomeEvents(){
    bindCartEvents(refreshGlobalCart);
    var camBtn=document.getElementById('camBtn');
    if(camBtn)camBtn.onclick=function(){S.cameraActiveInHome=true;render();setTimeout(startSplitCamera,100);};
    var closeCam=document.getElementById('closeSplitCamera');
    if(closeCam)closeCam.onclick=function(){stopSplitCamera();S.cameraActiveInHome=false;render();};
    drawPieChart();
}
