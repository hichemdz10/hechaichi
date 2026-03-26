// =====================================================
// js/render-header.js
// =====================================================
function clockStr() { return new Date().toLocaleTimeString("ar-DZ",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}); }
function dateStr()  { return new Date().toLocaleDateString("ar-DZ",{weekday:"long",year:"numeric",month:"long",day:"numeric"}); }

function renderHeader() {
    return '<div class="header">'+
        '<img src="image/logo.png" class="header-banner" alt="banner">'+
        '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 18px;background:rgba(255,255,255,.95);border-top:1px solid rgba(100,130,200,.13)">'+
        '<div style="flex:1;min-width:0">'+
        '<div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center">'+
        '<div style="background:#f0f4ff;border-radius:9px;padding:4px 11px;border:1px solid rgba(100,130,200,.18)"><span style="color:#0d1b3e;font-size:12px;font-weight:600" id="dateLbl">'+dateStr()+'</span></div>'+
        '<div style="background:#f0f4ff;border-radius:9px;padding:4px 13px;border:1px solid rgba(100,130,200,.18)"><span style="font-size:15px;font-weight:800;font-family:monospace" id="clockLbl">'+clockStr()+'</span></div>'+
        '</div></div>'+
        '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'+
        '<div class="info-card"><div>💰 مبيعات اليوم</div><div>'+H(fmt(tST())+" دج")+'</div></div>'+
        '<div class="info-card"><div>📈 صافي اليوم</div><div style="color:'+(tNet()>=0?'#059669':'#dc2626')+'">'+H(fmt(tNet())+" دج")+'</div></div>'+
        '<button style="background:var(--card2);border:1px solid var(--border2);border-radius:40px;font-size:19px;padding:8px 12px;cursor:pointer" onclick="S.hideNums=!S.hideNums;render()">'+(S.hideNums?"👁":"🙈")+'</button>'+
        '<button onclick="toggleCart()" style="background:var(--card2);border:1px solid var(--border2);border-radius:40px;font-size:15px;padding:8px 13px;cursor:pointer;display:flex;align-items:center;gap:6px">'+
        '<span style="font-size:22px">🛒</span><span style="font-size:15px;font-weight:700">السلة</span>'+
        '</button></div></div></div>';
}
