// =====================================================
// js/main.js
// =====================================================
function render() {
    if (typeof S.cameraActiveInHome==='undefined') S.cameraActiveInHome=false;
    var tabContent='';
    if(S.tab==="home")     tabContent=renderHome();
    else if(S.tab==="stock")    tabContent=renderStock();
    else if(S.tab==="print")    tabContent=renderPrint();
    else if(S.tab==="flixy")    tabContent=renderFlixy();
    else if(S.tab==="clients")  tabContent=renderClients();
    else if(S.tab==="expenses") tabContent=renderExpenses();
    else if(S.tab==="report")   tabContent=renderReport();

    var cartPanelGlobal='<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>'+
        '<div class="cart-sidebar" id="cartPanel">'+
            '<button onclick="closeCart()" style="background:linear-gradient(135deg,#c62828,#e53935);color:#fff;border:none;border-radius:12px;padding:10px;font-size:15px;font-weight:700;margin-bottom:12px;cursor:pointer">✕ إغلاق</button>'+
            '<div id="cartPanelContent">'+renderCartPanelContent(refreshGlobalCart)+'</div>'+
        '</div>';

    document.getElementById('root').innerHTML=
        // أعد إنشاء زر الوضع الليلي بعد كل render
(function() {
    if (document.getElementById('darkModeToggle')) return;
    var btn = document.createElement('button');
    btn.id = 'darkModeToggle';
    var isDark = localStorage.getItem('hch_dark') === '1';
    if (isDark) document.body.classList.add('dark-mode');
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = 'تبديل الوضع الليلي';
    btn.onclick = function() {
        var dark = document.body.classList.toggle('dark-mode');
        btn.textContent = dark ? '☀️' : '🌙';
        localStorage.setItem('hch_dark', dark ? '1' : '0');
    };
    document.body.appendChild(btn);
})();
        '<div class="app-layout">'+renderTabs()+
        '<div class="main-content">'+renderHeader()+'<div class="tab-content">'+tabContent+'</div></div>'+
        '</div>'+cartPanelGlobal;

    if (!clockTimer) {
        clockTimer=setInterval(function(){
            var c=document.getElementById('clockLbl'), d=document.getElementById('dateLbl');
            if(c) c.textContent=clockStr();
            if(d) d.textContent=dateStr();
        },1000);
    }
    if(S.tab==="home")    bindHomeEvents();
    if(S.tab==="flixy")   bindFlixyEvents();
    if(S.tab==="report")  bindReportEvents();
    bindCartEvents(refreshGlobalCart);
}

scheduleMidnight();
try { render(); } catch(e) {
    document.getElementById('root').innerHTML='<div style="background:linear-gradient(135deg,#c62828,#e53935);color:#fff;padding:26px;font-size:16px;font-family:Tajawal,Arial;border-radius:18px;margin:20px;direction:rtl"><h2 style="margin-bottom:12px">⚠️ خطأ</h2><p>'+e.message+'</p><pre style="font-size:12px;overflow:auto;white-space:pre-wrap;margin-top:13px;opacity:.8">'+(e.stack||'')+'</pre></div>';
}
