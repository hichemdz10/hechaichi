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

    // إعدادات جديدة
    beepEnabled: localStorage.getItem('hch_beep') !== '0',
    lowStockThreshold: parseInt(localStorage.getItem('hch_lowStock')) || 5,
    autoPrint: localStorage.getItem('hch_autoPrint') === '1',
    clearCartAfterSale: localStorage.getItem('hch_clearCart') !== '0',
    fontSize: localStorage.getItem('hch_fontSize') || 'medium'
};

var toastTimer   = null;
var clockTimer   = null;
var midnightTimer= null;
var pieChart     = null;

function save() {
    lsS("hch_stock5",   S.stock);
    lsS("hch_sales",    S.sales);
    lsS("hch_clients",  S.clients);
    lsS("hch_expenses", S.expenses);
    lsS("hch_print",    S.pjobs);
    lsS("hch_flixy",    S.flixy);
    lsS("hch_tab",      S.tab);

    // حفظ الإعدادات الجديدة
    lsS("hch_beep", S.beepEnabled ? "1" : "0");
    lsS("hch_lowStock", S.lowStockThreshold);
    lsS("hch_autoPrint", S.autoPrint ? "1" : "0");
    lsS("hch_clearCart", S.clearCartAfterSale ? "1" : "0");
    lsS("hch_fontSize", S.fontSize);

    pushToCloud();
}

function scheduleMidnight() {
    if (midnightTimer) clearTimeout(midnightTimer);
    var now = new Date();
    var midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    midnightTimer = setTimeout(function() { render(); scheduleMidnight(); }, midnight - now);
}
