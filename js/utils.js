// ── helpers ──
function gbc(id) { return "20" + String(id).padStart(6, "0"); }

function nAr(s) {
    if (!s) return "";
    return String(s).replace(/[أإآا]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").toLowerCase().trim();
}

function dk(d) {
    var date = d ? new Date(d) : new Date();
    return date.getFullYear() + '-' +
           String(date.getMonth()+1).padStart(2,'0') + '-' +
           String(date.getDate()).padStart(2,'0');
}

function fmt(n)  { return Number(n).toLocaleString("ar-DZ"); }
function ld(d)   { return new Date(d).toLocaleString("ar-DZ"); }
function ldo(d)  { return new Date(d).toLocaleDateString("ar-DZ"); }

function lsG(k) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }
    catch(e) { return null; }
}
function lsS(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
}

function esc(s) {
    if (!s) return "";
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
                    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function beep(ok) {
    if (!S.settings.beepEnabled) return;
    try {
        var ctx = new(window.AudioContext || window.webkitAudioContext)();
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = ok ? 1200 : 400;
        o.type = ok ? "sine" : "square";
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (ok ? 0.15 : 0.3));
        o.start(ctx.currentTime); o.stop(ctx.currentTime + (ok ? 0.15 : 0.3));
    } catch(e) {}
}

function toast(msg, type) {
    var el = document.getElementById("toast");
    if (!el) {
        el = document.createElement("div");
        el.id = "toast"; el.className = "toast";
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = type === "e"
        ? "linear-gradient(135deg,#c62828,#e53935)"
        : "linear-gradient(135deg,#01579b,#0277bd)";
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { el.style.display = "none"; }, 2800);
}

function applyFontSize(size) {
    var root = document.documentElement;
    if (size === "small") {
        root.style.fontSize = "12px";
    } else if (size === "large") {
        root.style.fontSize = "18px";
    } else {
        root.style.fontSize = "";
    }
}
window.applyFontSize = applyFontSize;

// ── computed ──
function now()  { return new Date(); }
function tstr() { return dk(now()); }
function nm()   { return now().getMonth(); }
function ny()   { return now().getFullYear(); }

function lowItems() { 
    var threshold = S.settings.lowStockThreshold || 5;
    return S.stock.filter(function(s){ return s.q <= threshold; }); 
}
function tDebt()    { return S.clients.reduce(function(a,c){ return a+c.debt; },0); }
function shopVal()  { return S.stock.reduce(function(a,s){ return a+s.q*s.c; },0); }
function whVal()    { return S.stock.reduce(function(a,s){ return a+(s.wq||0)*s.c; },0); }

function tSales() { return S.sales.filter(function(s){ return dk(new Date(s.date))===tstr(); }); }
function tST()    { return tSales().reduce(function(a,s){ return a+s.total; },0); }
function tPR()    { return tSales().reduce(function(a,s){ return a+s.profit; },0); }
function tET()    { return S.expenses.filter(function(e){ return dk(new Date(e.date))===tstr(); }).reduce(function(a,e){ return a+e.amount; },0); }
function tPT()    { return S.pjobs.filter(function(p){ return dk(new Date(p.date))===tstr(); }).reduce(function(a,p){ return a+p.price; },0); }
function tFT()    { return S.flixy.filter(function(f){ return dk(new Date(f.date))===tstr(); }).reduce(function(a,f){ return a+f.amount; },0); }

function tFlixyProfit() { return S.flixy.filter(function(f){ return dk(new Date(f.date))===tstr(); }).reduce(function(a,f){ return a+(f.profit||0); },0); }
function mFlixyProfit() { return S.flixy.filter(function(f){ var d=new Date(f.date); return d.getMonth()===nm()&&d.getFullYear()===ny(); }).reduce(function(a,f){ return a+(f.profit||0); },0); }
function mPT() { return S.pjobs.filter(function(p){ var d=new Date(p.date); return d.getMonth()===nm()&&d.getFullYear()===ny(); }).reduce(function(a,p){ return a+p.price; },0); }
function mET() { return S.expenses.filter(function(e){ var d=new Date(e.date); return d.getMonth()===nm()&&d.getFullYear()===ny(); }).reduce(function(a,e){ return a+e.amount; },0); }
function mFT() { return S.flixy.filter(function(f){ var d=new Date(f.date); return d.getMonth()===nm()&&d.getFullYear()===ny(); }).reduce(function(a,f){ return a+f.amount; },0); }

function tNet()   { return tPR() + tPT() + tFlixyProfit() - tET(); }
function cRaw()   { return S.cart.reduce(function(a,i){ return a+i.sum; },0); }
function dAmt()   { return Math.round(cRaw()*S.disc/100); }
function cTotal() { return cRaw()-dAmt(); }
function cProfit(){ return S.cart.reduce(function(a,i){ return a+i.prof; },0)-dAmt(); }
function cQty()   { return S.cart.reduce(function(a,i){ return a+i.q; },0); }
function H(v)     { return S.hideNums ? "••••" : v; }

function fSales() {
    return S.sales.filter(function(s) {
        var d = new Date(s.date);
        if (S.rep==="today") return dk(d)===tstr();
        if (S.rep==="week")  return (now()-d)<7*86400000;
        if (S.rep==="month") return d.getMonth()===nm()&&d.getFullYear()===ny();
        return true;
    });
}
function fExp() {
    return S.expenses.filter(function(e) {
        var d = new Date(e.date);
        if (S.rep==="today") return dk(d)===tstr();
        if (S.rep==="week")  return (now()-d)<7*86400000;
        if (S.rep==="month") return d.getMonth()===nm()&&d.getFullYear()===ny();
        return true;
    });
}
function fPrint() {
    return S.pjobs.filter(function(p) {
        var d = new Date(p.date);
        if (S.rep==="today") return dk(d)===tstr();
        if (S.rep==="week")  return (now()-d)<7*86400000;
        if (S.rep==="month") return d.getMonth()===nm()&&d.getFullYear()===ny();
        return true;
    });
}
function fStock() {
    return S.stock.filter(function(s){ return (!S.ssrch||nAr(s.n).includes(nAr(S.ssrch))); });
}
function sortItems(items) {
    var s = S.sortBy;
    if (s==="name")  return items.slice().sort(function(a,b){ return a.n.localeCompare(b.n,"ar"); });
    if (s==="qa")    return items.slice().sort(function(a,b){ return a.q-b.q; });
    if (s==="qd")    return items.slice().sort(function(a,b){ return b.q-a.q; });
    if (s==="price") return items.slice().sort(function(a,b){ return b.p-a.p; });
    return items;
}
