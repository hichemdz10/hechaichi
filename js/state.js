var S = {
    stock:    lsG("hch_stock5") || [],
    sales:    lsG("hch_sales")  || [],
    clients:  lsG("hch_clients")|| [],
    expenses: lsG("hch_expenses")|| [],
    pjobs:    lsG("hch_print")  || [],
    flixy:    lsG("hch_flixy")  || [],
    cart: [],
    disc: 0,
    tab:  lsG("hch_tab") || "home",
    srch: "",
    ssrch: "",
    sortBy: "def",
    rep: "today",
    hideNums: false,
    stockView: "shop",
    openCats: {},
    cameraActiveInHome: false,
    form:  { n:"", p:"", c:"", q:"", wq:"", dest:"shop", cat:"كراريس", bc:"" },
    cForm: { name:"", phone:"", debt:"" },
    eForm: { lbl:"", amt:"", cat:"إيجار" },
    pForm: { type:"طباعة وثيقة", pages:"", price:"" },
    // الإعدادات الجديدة
    settings: {
        lowStockThreshold: 5,
        autoPrintAfterSale: false,
        clearCartAfterSale: true,
        fontSize: "medium",   // small, medium, large
        beepEnabled: true,
        darkMode: false,
        hideNums: false
    }
};

var toastTimer   = null;
var clockTimer   = null;
var midnightTimer= null;
var pieChart     = null;

function loadSettings() {
    var saved = lsG("hch_settings");
    if (saved) {
        for (var k in saved) {
            if (S.settings.hasOwnProperty(k)) S.settings[k] = saved[k];
        }
    }
    // تطبيق الإعدادات التي تؤثر فوراً
    if (S.settings.darkMode) document.body.classList.add("dark-mode");
    S.hideNums = S.settings.hideNums;
}

function saveSettings() {
    lsS("hch_settings", S.settings);
}

function save() {
    lsS("hch_stock5",   S.stock);
    lsS("hch_sales",    S.sales);
    lsS("hch_clients",  S.clients);
    lsS("hch_expenses", S.expenses);
    lsS("hch_print",    S.pjobs);
    lsS("hch_flixy",    S.flixy);
    lsS("hch_tab",      S.tab);
    saveSettings();
    pushToCloud();
}

function scheduleMidnight() {
    if (midnightTimer) clearTimeout(midnightTimer);
    var now = new Date();
    var midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    midnightTimer = setTimeout(function() { render(); scheduleMidnight(); }, midnight - now);
}

// تحميل الإعدادات عند بدء التشغيل
loadSettings();
