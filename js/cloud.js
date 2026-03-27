var SB_URL = "https://pdjurjkbqnmzpvocqkym.supabase.co";
var SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkanVyamticW5tenB2b2Nxa3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTY4ODYsImV4cCI6MjA4OTY3Mjg4Nn0.A9gBsv9oH0C0IK9c2TKqJQEeUM-84HTl34wl2VqES8A";
var syncEnabled = false;

function sbGet(k, cb) {
    fetch(SB_URL + "/rest/v1/app_data?key=eq." + encodeURIComponent(k), {
        headers: { "apikey": SB_KEY, "Authorization": "Bearer " + SB_KEY }
    }).then(function(r) { return r.json(); })
    .then(function(d) { cb(d && d.length > 0 ? d[0].value : null); })
    .catch(function() { cb(null); });
}

function sbSet(k, v) {
    fetch(SB_URL + "/rest/v1/app_data", {
        method: "POST",
        headers: {
            "apikey": SB_KEY,
            "Authorization": "Bearer " + SB_KEY,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({ key: k, value: v })
    }).catch(function() {});
}

function pushToCloud() {
    if (!syncEnabled) return;
    sbSet("app_state", {
        stock: S.stock, sales: S.sales, clients: S.clients,
        expenses: S.expenses, pjobs: S.pjobs, flixy: S.flixy,
        ts: Date.now()
    });
}

function startSync() {
    syncEnabled = true;
    pushToCloud();
    var msg = document.getElementById('syncStatusMsg');
    if (msg) msg.innerHTML = '<span style="color:#16a34a">✅ تم تفعيل المزامنة ورفع البيانات</span>';
    setTimeout(function() { if(msg) msg.innerHTML = ''; }, 3000);
    render(); // لتحديث واجهة الإعدادات
}

function cleanStock(arr) {
    return (arr || []).filter(function(s) { return s && s.n && s.id; })
    .map(function(s) {
        return { id: s.id, n: String(s.n||''), p: +s.p||0, c: +s.c||0,
                 q: +s.q||0, wq: +s.wq||0, cat: s.cat||"قرطاسية", barcode: s.barcode||'' };
    });
}

function applyCloud(data) {
    S.stock    = cleanStock(data.stock);
    S.sales    = data.sales    || [];
    S.clients  = data.clients  || [];
    S.expenses = data.expenses || [];
    S.pjobs    = data.pjobs    || [];
    S.flixy    = data.flixy    || [];
    save();
    render();
}
