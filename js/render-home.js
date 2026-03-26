// =====================================================
// js/render-home.js
// =====================================================
function drawPieChart() {
    var ctx=document.getElementById('dailySalesChart');
    if (!ctx) return;
    var categorySales={};
    tSales().forEach(function(sale){ sale.items.forEach(function(item){ var cat=item.cat||"أخرى"; if(!categorySales[cat]) categorySales[cat]=0; categorySales[cat]+=item.sum; }); });
    var labels=Object.keys(categorySales);
    if (pieChart) pieChart.destroy();
    pieChart=new Chart(ctx,{ type:'pie', data:{ labels:labels, datasets:[{ data:labels.map(function(l){ return categorySales[l]; }), backgroundColor:labels.map(function(l){ return CC[l]||"#9ca3af"; }), borderWidth:0, hoverOffset:8 }] }, options:{ responsive:true, maintainAspectRatio:true, plugins:{ legend:{position:'bottom',labels:{font:{family:'Tajawal',size:12}}}, tooltip:{callbacks:{label:function(t){ return t.label+': '+fmt(t.raw)+' دج'; }}} } } });
}

function renderHome() {
    var stats=[
        {ic:"💰",l:"مبيعات اليوم",v:H(fmt(tST())+" دج"),g:"linear-gradient(135deg,#0d47a1,#1565c0,#0277bd)"},
        {ic:"📈",l:"أرباح اليوم",v:H(fmt(tPR())+" دج"),g:"linear-gradient(135deg,#1b5e20,#2e7d32,#388e3c)"},
        {ic:"🖨️",l:"طباعة اليوم",v:H(fmt(tPT())+" دج"),g:"linear-gradient(135deg,#004d40,#00695c,#00897b)"},
        {ic:"📱",l:"Flixy اليوم",v:H(fmt(tFT())+" دج"),g:"linear-gradient(135deg,#1a237e,#283593,#3949ab)"},
        {ic:"🏪",l:"قيمة المحل",v:H(fmt(shopVal())+" دج"),g:"linear-gradient(135deg,#bf360c,#d84315,#e64a19)"},
        {ic:"📋",l:"إجمالي الديون",v:H(fmt(tDebt())+" دج"),g:tDebt()>0?"linear-gradient(135deg,#b71c1c,#c62828,#e53935)":"linear-gradient(135deg,#1b5e20,#2e7d32,#43a047)"}
    ];
    var statsHTML='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">'+
        stats.map(function(s){ return '<div style="background:'+s.g+';border-radius:20px;padding:16px 12px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.05);transition:transform .2s" onmouseover="this.style.transform=\'translateY(-3px)\'" onmouseout="this.style.transform=\'none\'"><div style="font-size:28px;margin-bottom:6px">'+s.ic+'</div><div style="color:rgba(255,255,255,.8);font-size:12px;font-weight:600;margin-bottom:4px">'+s.l+'</div><div style="color:#fff;font-weight:800;font-size:16px">'+s.v+'</div></div>'; }).join('')+'</div>';

    var actionBar='<div style="display:flex;gap:12px;margin-bottom:24px">'+
        '<button id="camBtn" style="background:linear-gradient(135deg,#0284c7,#0f172a);color:#fff;border:none;border-radius:40px;padding:12px 20px;font-size:20px;cursor:pointer;box-shadow:0 4px 12px rgba(2,132,199,.2)">📷</button>'+
        '<button onclick="openManualCart()" style="background:linear-gradient(135deg,#2e7d32,#1b5e20);color:#fff;border:none;border-radius:40px;padding:12px 20px;font-size:20px;cursor:pointer;box-shadow:0 4px 12px rgba(46,125,50,.2)">➕</button>'+
    '</div>';

    var chartSection=S.cameraActiveInHome?'':'<div class="chart-container"><div class="chart-title"><span>📊</span> أفضل المبيعات اليوم حسب الفئة</div><canvas id="dailySalesChart" style="max-height:260px;width:100%"></canvas></div>';

    var catCards='<div style="margin-top:16px"><div style="font-size:18px;font-weight:800;color:var(--text);margin-bottom:16px">🗂️ تصفح حسب الفئة</div>'+
        '<div class="category-grid">'+
        CATS.filter(function(x){ return x!=="الكل"; }).map(function(cat){
            var count=S.stock.filter(function(s){ return s.cat===cat; }).length;
            return '<div class="category-card" onclick="goToStockCat(\''+cat+'\')">'+
                '<div class="category-icon" style="background:linear-gradient(135deg,'+CC[cat]+'22,#ffffff)">'+(CI[cat]||"📦")+'</div>'+
                '<div class="category-name">'+cat+'</div>'+
                '<div class="category-count">'+count+' صنف</div>'+
            '</div>';
        }).join('')+'</div></div>';

    var splitView='';
    if (S.cameraActiveInHome) {
        splitView='<div id="splitViewContainer" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:2000;background:#000;display:flex;flex-direction:column;">'+
            '<div id="splitCameraContainer" style="flex:4;background:#000;position:relative;min-height:0;">'+
                '<video id="splitCameraVideo" autoplay playsinline style="width:100%;height:100%;object-fit:contain"></video>'+
                '<button id="closeSplitCamera" style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,.7);color:#fff;border:none;border-radius:30px;padding:8px 18px;font-size:14px;font-weight:700;cursor:pointer;z-index:10">✕ إغلاق</button>'+
            '</div>'+
            '<div id="splitCartContainer" style="flex:6;background:#fff;padding:16px;border-top:1px solid #eef2f6;display:flex;flex-direction:column;overflow-y:auto;min-height:0;">'+
                '<div id="splitCartContent">'+renderCartPanelContent(refreshSplitCart)+'</div>'+
            '</div></div>';
    }

    return '<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>'+
        '<div>'+(S.cameraActiveInHome?splitView:actionBar+statsHTML+chartSection+catCards)+'</div>'+
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

function bindHomeEvents() {
    bindCartEvents(refreshGlobalCart);
    var camBtn=document.getElementById('camBtn');
    if(camBtn) camBtn.onclick=function(){ S.cameraActiveInHome=true; render(); setTimeout(startSplitCamera,100); };
    var closeCam=document.getElementById('closeSplitCamera');
    if(closeCam) closeCam.onclick=function(){ stopSplitCamera(); S.cameraActiveInHome=false; render(); };
    drawPieChart();
}
