// ===== FLIXY + IDOOM - نظام متكامل لإدارة الرصيد =====

// بيانات Flixy (المكالمات)
let flixyOperations = [];
let flixyNextId = 1;
let flixyBalance = { Djezzy: 0, Mobilis: 0, Ooredoo: 0 };

// بيانات Idoom (بطاقات الإنترنت)
let idoomOperations = [];
let idoomNextId = 1;
let idoomStock = { "Idoom 500": 0, "Idoom 1000": 0, "Idoom 2000": 0 };
const faceValues = { "Idoom 500": 500, "Idoom 1000": 1000, "Idoom 2000": 2000 };
const IDOOM_PROFIT = 50;

// تحميل البيانات من localStorage
function loadFlixyData() {
    const savedFlixy = localStorage.getItem("hch_flixy_combined");
    if (savedFlixy) {
        const data = JSON.parse(savedFlixy);
        flixyOperations = data.flixyOperations || [];
        flixyNextId = data.flixyNextId || 1;
        idoomOperations = data.idoomOperations || [];
        idoomNextId = data.idoomNextId || 1;
    } else {
        // بيانات تجريبية أولية
        flixyOperations = [
            { id: 1, date: new Date().toISOString().split('T')[0], type: "buy", operator: "Djezzy", amount: 5000, profit: 0 },
            { id: 2, date: new Date().toISOString().split('T')[0], type: "sell", operator: "Djezzy", amount: 1000, profit: 10 },
        ];
        flixyNextId = 3;
        idoomOperations = [
            { id: 1, date: new Date().toISOString().split('T')[0], type: "buy", category: "Idoom 500", qty: 10, unitPrice: 450, total: 4500, profit: 0 },
        ];
        idoomNextId = 2;
    }
    updateFlixyBalance();
    updateIdoomStock();
}

function saveFlixyData() {
    localStorage.setItem("hch_flixy_combined", JSON.stringify({
        flixyOperations, flixyNextId, idoomOperations, idoomNextId
    }));
}

// تحديث رصيد Flixy
function updateFlixyBalance() {
    flixyBalance = { Djezzy: 0, Mobilis: 0, Ooredoo: 0 };
    flixyOperations.forEach(op => {
        if (op.type === "buy") flixyBalance[op.operator] += op.amount;
        else if (op.type === "sell") flixyBalance[op.operator] -= op.amount;
    });
}

// تحديث رصيد Idoom
function updateIdoomStock() {
    idoomStock = { "Idoom 500": 0, "Idoom 1000": 0, "Idoom 2000": 0 };
    idoomOperations.forEach(op => {
        if (op.type === "buy") idoomStock[op.category] += op.qty;
        else if (op.type === "sell") idoomStock[op.category] -= op.qty;
    });
}

// حساب الربح لـ Flixy
function calculateFlixyProfit(amount) {
    return amount <= 1000 ? 10 : 20;
}

// إحصائيات Flixy
function getFlixyTodayProfit() {
    const today = new Date().toISOString().split('T')[0];
    return flixyOperations.filter(op => op.type === "sell" && op.date === today).reduce((s, op) => s + op.profit, 0);
}
function getFlixyTotalProfit() {
    return flixyOperations.filter(op => op.type === "sell").reduce((s, op) => s + op.profit, 0);
}
function getFlixyTotalSales() {
    return flixyOperations.filter(op => op.type === "sell").reduce((s, op) => s + op.amount, 0);
}
function getFlixyTotalPurchases() {
    return flixyOperations.filter(op => op.type === "buy").reduce((s, op) => s + op.amount, 0);
}
function getFlixyOperatorPurchases(op) {
    return flixyOperations.filter(o => o.type === "buy" && o.operator === op).reduce((s, o) => s + o.amount, 0);
}
function getFlixyOperatorSales(op) {
    return flixyOperations.filter(o => o.type === "sell" && o.operator === op).reduce((s, o) => s + o.amount, 0);
}

// إحصائيات Idoom
function getIdoomTodayProfit() {
    const today = new Date().toISOString().split('T')[0];
    return idoomOperations.filter(op => op.type === "sell" && op.date === today).reduce((s, op) => s + op.profit, 0);
}
function getIdoomTotalProfit() {
    return idoomOperations.filter(op => op.type === "sell").reduce((s, op) => s + op.profit, 0);
}
function getIdoomTotalSales() {
    return idoomOperations.filter(op => op.type === "sell").reduce((s, op) => s + op.total, 0);
}
function getIdoomTotalPurchases() {
    return idoomOperations.filter(op => op.type === "buy").reduce((s, op) => s + op.total, 0);
}
function getIdoomCategoryPurchases(cat) {
    return idoomOperations.filter(op => op.type === "buy" && op.category === cat).reduce((s, op) => s + op.qty, 0);
}
function getIdoomCategorySales(cat) {
    return idoomOperations.filter(op => op.type === "sell" && op.category === cat).reduce((s, op) => s + op.qty, 0);
}

// حذف العمليات
function deleteFlixyOperation(id) {
    if (confirm("حذف العملية؟")) {
        flixyOperations = flixyOperations.filter(op => op.id !== id);
        updateFlixyBalance();
        saveFlixyData();
        renderFlixyIdoom();
    }
}
function deleteIdoomOperation(id) {
    if (confirm("حذف العملية؟")) {
        idoomOperations = idoomOperations.filter(op => op.id !== id);
        updateIdoomStock();
        saveFlixyData();
        renderFlixyIdoom();
    }
}

// إضافة عمليات Flixy
function addFlixyPurchase() {
    const date = document.getElementById("flixy-purchaseDate").value;
    const operator = document.getElementById("flixy-purchaseType").value;
    const amount = parseFloat(document.getElementById("flixy-purchaseAmount").value);
    if (!date || !amount || amount <= 0) { toast("يرجى ملء جميع الحقول", "e"); return; }
    flixyOperations.push({ id: flixyNextId++, date, type: "buy", operator, amount, profit: 0 });
    updateFlixyBalance();
    saveFlixyData();
    renderFlixyIdoom();
    document.getElementById("flixy-purchaseAmount").value = "";
}

function addFlixySell() {
    const operator = document.getElementById("flixy-sellType").value;
    const amount = parseFloat(document.getElementById("flixy-sellAmount").value);
    if (!amount || amount <= 0) { toast("أدخل المبلغ المباع", "e"); return; }
    if (amount > flixyBalance[operator]) {
        toast(`⚠️ الرصيد غير كافٍ في ${operator}! المتاح: ${flixyBalance[operator].toLocaleString()} دج`, "e");
        return;
    }
    flixyOperations.push({
        id: flixyNextId++,
        date: new Date().toISOString().split('T')[0],
        type: "sell",
        operator,
        amount,
        profit: calculateFlixyProfit(amount)
    });
    updateFlixyBalance();
    saveFlixyData();
    renderFlixyIdoom();
    document.getElementById("flixy-sellAmount").value = "";
}

// إضافة عمليات Idoom
function addIdoomPurchase() {
    const date = document.getElementById("idoom-purchaseDate").value;
    const category = document.getElementById("idoom-purchaseType").value;
    const qty = parseInt(document.getElementById("idoom-purchaseQty").value);
    const unitPrice = parseFloat(document.getElementById("idoom-purchaseUnitPrice").value);
    if (!date || !qty || qty <= 0 || !unitPrice || unitPrice <= 0) { toast("يرجى ملء جميع الحقول", "e"); return; }
    idoomOperations.push({
        id: idoomNextId++,
        date,
        type: "buy",
        category,
        qty,
        unitPrice,
        total: qty * unitPrice,
        profit: 0
    });
    updateIdoomStock();
    saveFlixyData();
    renderFlixyIdoom();
    document.getElementById("idoom-purchaseQty").value = "1";
    document.getElementById("idoom-purchaseUnitPrice").value = "";
}

function addIdoomSell() {
    const category = document.getElementById("idoom-sellType").value;
    const qty = parseInt(document.getElementById("idoom-sellQty").value);
    if (!qty || qty <= 0) { toast("أدخل العدد المباع", "e"); return; }
    if (qty > idoomStock[category]) {
        toast(`⚠️ الرصيد غير كافٍ في ${category}! المتاح: ${idoomStock[category]} بطاقة`, "e");
        return;
    }
    idoomOperations.push({
        id: idoomNextId++,
        date: new Date().toISOString().split('T')[0],
        type: "sell",
        category,
        qty,
        unitPrice: faceValues[category],
        total: qty * faceValues[category],
        profit: qty * IDOOM_PROFIT
    });
    updateIdoomStock();
    saveFlixyData();
    renderFlixyIdoom();
    document.getElementById("idoom-sellQty").value = "1";
}

// تحديث الربح المتوقع
function updateFlixyExpectedProfit() {
    const amount = parseFloat(document.getElementById("flixy-sellAmount").value);
    const span = document.getElementById("flixy-expectedProfit");
    if (!amount || amount <= 0) span.innerHTML = "0";
    else span.innerHTML = calculateFlixyProfit(amount) + " دج";
}
function updateIdoomExpectedProfit() {
    const qty = parseInt(document.getElementById("idoom-sellQty").value) || 0;
    document.getElementById("idoom-expectedProfit").innerHTML = `${qty * IDOOM_PROFIT} دج (${IDOOM_PROFIT} دج/بطاقة)`;
}

// دالة العرض الرئيسية
function renderFlixyIdoom() {
    // تعيين التاريخ الافتراضي
    const today = new Date().toISOString().split('T')[0];
    if (!document.getElementById("flixy-purchaseDate")?.value) {
        setTimeout(() => {
            if (document.getElementById("flixy-purchaseDate")) document.getElementById("flixy-purchaseDate").value = today;
            if (document.getElementById("idoom-purchaseDate")) document.getElementById("idoom-purchaseDate").value = today;
        }, 50);
    }

    return `
    <div class="flixy-idoom-container">
        <style>
            /* أنماط Flixy+Idoom */
            .flixy-idoom-container .tabs {
                display: flex;
                gap: 20px;
                margin-bottom: 30px;
                justify-content: center;
            }
            .flixy-idoom-container .tab-btn {
                padding: 12px 32px;
                font-size: 18px;
                font-weight: 800;
                border: none;
                border-radius: 60px;
                cursor: pointer;
                transition: all 0.2s;
                background: var(--card);
                color: var(--text);
                box-shadow: var(--shadow);
            }
            .flixy-idoom-container .tab-btn.active {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
            }
            .flixy-idoom-container .tab-btn:last-child.active {
                background: linear-gradient(135deg, #06b6d4, #0891b2);
            }
            .flixy-idoom-container .tab-content {
                display: none;
            }
            .flixy-idoom-container .tab-content.active {
                display: block;
            }
            .flixy-idoom-container .stats-operators, .flixy-idoom-container .stats-idoom {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            .flixy-idoom-container .operator-card, .flixy-idoom-container .idoom-card {
                background: var(--card);
                border-radius: 28px;
                padding: 20px;
                text-align: center;
                box-shadow: var(--shadow);
                transition: transform 0.2s;
            }
            .flixy-idoom-container .operator-card:hover, .flixy-idoom-container .idoom-card:hover {
                transform: translateY(-4px);
            }
            .flixy-idoom-container .operator-icon, .flixy-idoom-container .idoom-icon {
                font-size: 48px;
                margin-bottom: 12px;
            }
            .flixy-idoom-container .operator-name {
                font-size: 20px;
                font-weight: 800;
                margin-bottom: 8px;
            }
            .flixy-idoom-container .operator-balance {
                font-size: 28px;
                font-weight: 800;
                color: #3b82f6;
                margin: 12px 0;
            }
            .flixy-idoom-container .idoom-name {
                font-size: 22px;
                font-weight: 800;
                margin-bottom: 8px;
                color: #06b6d4;
            }
            .flixy-idoom-container .idoom-value {
                font-size: 16px;
                color: #f59e0b;
                margin-bottom: 8px;
            }
            .flixy-idoom-container .idoom-balance {
                font-size: 28px;
                font-weight: 800;
                color: #06b6d4;
                margin: 12px 0;
            }
            .flixy-idoom-container .operator-stats, .flixy-idoom-container .idoom-stats {
                display: flex;
                justify-content: space-between;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid var(--border);
                font-size: 12px;
                color: var(--text3);
            }
            .flixy-idoom-container .extra-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .flixy-idoom-container .stat-card {
                background: var(--card);
                border-radius: 24px;
                padding: 20px;
                text-align: center;
                box-shadow: var(--shadow);
            }
            .flixy-idoom-container .stat-icon { font-size: 32px; margin-bottom: 12px; }
            .flixy-idoom-container .stat-label { font-size: 13px; color: var(--text3); margin-bottom: 8px; }
            .flixy-idoom-container .stat-value { font-size: 26px; font-weight: 800; color: var(--text); }
            .flixy-idoom-container .profit { color: #10b981; }
            .flixy-idoom-container .sections-row {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 24px;
                margin-bottom: 30px;
            }
            .flixy-idoom-container .section-card {
                background: var(--card);
                border-radius: 28px;
                padding: 24px;
                box-shadow: var(--shadow);
            }
            .flixy-idoom-container .section-title {
                font-size: 20px;
                font-weight: 800;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 2px solid var(--border);
                display: flex;
                align-items: center;
                gap: 10px;
                color: var(--text);
            }
            .flixy-idoom-container .input-group {
                margin-bottom: 20px;
            }
            .flixy-idoom-container .input-group label {
                display: block;
                font-weight: 600;
                margin-bottom: 8px;
                color: var(--text2);
            }
            .flixy-idoom-container .input-group input, .flixy-idoom-container .input-group select {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid var(--border2);
                border-radius: 20px;
                font-family: 'Tajawal', sans-serif;
                font-size: 14px;
                background: var(--card2);
                color: var(--text);
            }
            .flixy-idoom-container .btn-primary {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 40px;
                font-weight: 700;
                cursor: pointer;
                width: 100%;
                font-size: 16px;
                transition: transform 0.2s;
            }
            .flixy-idoom-container .btn-primary:hover { transform: scale(1.02); }
            .flixy-idoom-container .btn-success { background: linear-gradient(135deg, #10b981, #059669); }
            .flixy-idoom-container .btn-teal { background: linear-gradient(135deg, #06b6d4, #0891b2); }
            .flixy-idoom-container .operations-table {
                background: var(--card);
                border-radius: 28px;
                padding: 24px;
                box-shadow: var(--shadow);
                margin-top: 24px;
            }
            .flixy-idoom-container .table-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 12px;
            }
            .flixy-idoom-container .filter-group {
                display: flex;
                gap: 12px;
            }
            .flixy-idoom-container .filter-group select, .flixy-idoom-container .filter-group input {
                padding: 8px 16px;
                border-radius: 40px;
                border: 1px solid var(--border2);
                font-family: 'Tajawal', sans-serif;
                background: var(--card2);
                color: var(--text);
            }
            .flixy-idoom-container table {
                width: 100%;
                border-collapse: collapse;
            }
            .flixy-idoom-container th, .flixy-idoom-container td {
                padding: 14px 12px;
                text-align: center;
                border-bottom: 1px solid var(--border);
            }
            .flixy-idoom-container th {
                background: var(--card2);
                font-weight: 800;
                color: var(--text2);
            }
            .flixy-idoom-container tr:hover { background: var(--bg2); }
            .flixy-idoom-container .badge {
                padding: 4px 12px;
                border-radius: 40px;
                font-size: 12px;
                font-weight: 700;
            }
            .flixy-idoom-container .badge-buy { background: #e2e8f0; color: #475569; }
            .flixy-idoom-container .badge-sell { background: #d1fae5; color: #059669; }
            .flixy-idoom-container .delete-btn {
                background: none;
                border: none;
                color: #ef4444;
                cursor: pointer;
                font-size: 18px;
                padding: 4px 8px;
                border-radius: 8px;
            }
            .flixy-idoom-container .delete-btn:hover { background: #fee2e2; }
            .flixy-idoom-container .empty-state { text-align: center; padding: 40px; color: var(--text3); }
            .flixy-idoom-container .profit-info {
                background: var(--bg2);
                padding: 12px;
                border-radius: 16px;
                margin-bottom: 16px;
                text-align: center;
            }
            @media (max-width: 768px) {
                .flixy-idoom-container .stats-operators,
                .flixy-idoom-container .stats-idoom,
                .flixy-idoom-container .sections-row {
                    grid-template-columns: 1fr;
                }
                .flixy-idoom-container th, .flixy-idoom-container td {
                    padding: 8px;
                    font-size: 12px;
                }
            }
        </style>

        <!-- تبويبات داخلية -->
        <div class="tabs">
            <button class="tab-btn active" data-tab="flixy-section">📱 Flixy (المكالمات)</button>
            <button class="tab-btn" data-tab="idoom-section">🌐 Idoom (بطاقات الإنترنت)</button>
        </div>

        <!-- قسم Flixy -->
        <div id="flixy-section" class="tab-content active">
            <div class="stats-operators" id="flixy-stats-operators"></div>
            <div class="extra-stats" id="flixy-extra-stats"></div>
            <div class="sections-row">
                <div class="section-card">
                    <div class="section-title"><i class="fas fa-download"></i> شراء رصيد (إعادة تخزين)</div>
                    <div class="input-group"><label>📅 تاريخ الشراء</label><input type="date" id="flixy-purchaseDate"></div>
                    <div class="input-group"><label>📱 نوع الرصيد</label><select id="flixy-purchaseType"><option value="Djezzy">Djezzy</option><option value="Mobilis">Mobilis</option><option value="Ooredoo">Ooredoo</option></select></div>
                    <div class="input-group"><label>💰 الرصيد (دج)</label><input type="number" id="flixy-purchaseAmount" placeholder="المبلغ المراد إضافته"></div>
                    <button class="btn-primary" id="flixy-addPurchaseBtn">➕ إضافة عملية شراء</button>
                </div>
                <div class="section-card">
                    <div class="section-title"><i class="fas fa-upload"></i> بيع رصيد (تعبئة)</div>
                    <div class="input-group"><label>📱 نوع الرصيد</label><select id="flixy-sellType"><option value="Djezzy">Djezzy</option><option value="Mobilis">Mobilis</option><option value="Ooredoo">Ooredoo</option></select></div>
                    <div class="input-group"><label>💰 الرصيد المباع (دج)</label><input type="number" id="flixy-sellAmount" placeholder="المبلغ المباع للزبون"></div>
                    <div class="profit-info"><i class="fas fa-chart-line"></i> الربح: <span id="flixy-expectedProfit" style="font-weight:800; color:#10b981;">0</span> دج</div>
                    <button class="btn-primary btn-success" id="flixy-addSellBtn">💰 إضافة عملية بيع</button>
                </div>
            </div>
            <div class="operations-table">
                <div class="table-header">
                    <div class="section-title" style="margin-bottom:0;"><i class="fas fa-history"></i> سجل عمليات Flixy</div>
                    <div class="filter-group">
                        <select id="flixy-filterType"><option value="all">الكل</option><option value="buy">مشتريات</option><option value="sell">مبيعات</option></select>
                        <input type="text" id="flixy-searchInput" placeholder="🔍 بحث عن نوع...">
                    </div>
                </div>
                <div style="overflow-x: auto;">
                    <table id="flixy-table"><thead><tr><th>التاريخ</th><th>النوع</th><th>المشغل</th><th>الرصيد</th><th>الربح</th><th></th></tr></thead><tbody id="flixy-tableBody"></tbody></table>
                </div>
            </div>
        </div>

        <!-- قسم Idoom -->
        <div id="idoom-section" class="tab-content">
            <div class="stats-idoom" id="idoom-stats"></div>
            <div class="extra-stats" id="idoom-extra-stats"></div>
            <div class="sections-row">
                <div class="section-card">
                    <div class="section-title"><i class="fas fa-download"></i> شراء بطاقات (إعادة تخزين)</div>
                    <div class="input-group"><label>📅 تاريخ الشراء</label><input type="date" id="idoom-purchaseDate"></div>
                    <div class="input-group"><label>🌐 فئة البطاقة</label><select id="idoom-purchaseType"><option value="Idoom 500">Idoom 500 (500 دج)</option><option value="Idoom 1000">Idoom 1000 (1000 دج)</option><option value="Idoom 2000">Idoom 2000 (2000 دج)</option></select></div>
                    <div class="input-group"><label>🔢 العدد</label><input type="number" id="idoom-purchaseQty" placeholder="عدد البطاقات" value="1"></div>
                    <div class="input-group"><label>💰 سعر الشراء للبطاقة (دج)</label><input type="number" id="idoom-purchaseUnitPrice" placeholder="مثال: 450"></div>
                    <button class="btn-primary btn-teal" id="idoom-addPurchaseBtn">➕ إضافة عملية شراء</button>
                </div>
                <div class="section-card">
                    <div class="section-title"><i class="fas fa-upload"></i> بيع بطاقات</div>
                    <div class="input-group"><label>🌐 فئة البطاقة</label><select id="idoom-sellType"><option value="Idoom 500">Idoom 500 (500 دج)</option><option value="Idoom 1000">Idoom 1000 (1000 دج)</option><option value="Idoom 2000">Idoom 2000 (2000 دج)</option></select></div>
                    <div class="input-group"><label>🔢 العدد</label><input type="number" id="idoom-sellQty" placeholder="عدد البطاقات المباعة" value="1"></div>
                    <div class="profit-info"><i class="fas fa-chart-line"></i> الربح المتوقع: <span id="idoom-expectedProfit" style="font-weight:800; color:#10b981;">0</span> دج</div>
                    <button class="btn-primary btn-success" id="idoom-addSellBtn">💰 إضافة عملية بيع</button>
                </div>
            </div>
            <div class="operations-table">
                <div class="table-header">
                    <div class="section-title" style="margin-bottom:0;"><i class="fas fa-history"></i> سجل عمليات Idoom</div>
                    <div class="filter-group">
                        <select id="idoom-filterType"><option value="all">الكل</option><option value="buy">مشتريات</option><option value="sell">مبيعات</option></select>
                        <input type="text" id="idoom-searchInput" placeholder="🔍 بحث عن فئة...">
                    </div>
                </div>
                <div style="overflow-x: auto;">
                    <table id="idoom-table"><thead><tr><th>التاريخ</th><th>النوع</th><th>الفئة</th><th>العدد</th><th>سعر الوحدة</th><th>الإجمالي</th><th>الربح</th><th></th></tr></thead><tbody id="idoom-tableBody"></tbody></table>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ربط الأحداث بعد التحميل
function bindFlixyIdoomEvents() {
    // تعيين التواريخ
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById("flixy-purchaseDate") && !document.getElementById("flixy-purchaseDate").value) {
        document.getElementById("flixy-purchaseDate").value = today;
        document.getElementById("idoom-purchaseDate").value = today;
    }

    // تحديث البيانات المعروضة
    function updateFlixyDisplay() {
        const operatorIcons = { Djezzy: "📱", Mobilis: "📱", Ooredoo: "📱" };
        document.getElementById("flixy-stats-operators").innerHTML = Object.keys(flixyBalance).map(op => `
            <div class="operator-card">
                <div class="operator-icon">${operatorIcons[op]}</div>
                <div class="operator-name">${op}</div>
                <div class="operator-balance">${flixyBalance[op].toLocaleString()} <span>دج</span></div>
                <div class="operator-stats"><span>📥 مشتريات: ${getFlixyOperatorPurchases(op).toLocaleString()}</span><span>📤 مبيعات: ${getFlixyOperatorSales(op).toLocaleString()}</span></div>
            </div>
        `).join('');
        document.getElementById("flixy-extra-stats").innerHTML = `
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-chart-line"></i></div><div class="stat-label">ربح اليوم</div><div class="stat-value profit">${getFlixyTodayProfit().toLocaleString()} دج</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-chart-simple"></i></div><div class="stat-label">إجمالي الأرباح</div><div class="stat-value profit">${getFlixyTotalProfit().toLocaleString()} دج</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-shopping-cart"></i></div><div class="stat-label">إجمالي المبيعات</div><div class="stat-value">${getFlixyTotalSales().toLocaleString()} دج</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-download"></i></div><div class="stat-label">إجمالي المشتريات</div><div class="stat-value">${getFlixyTotalPurchases().toLocaleString()} دج</div></div>
        `;
        const filter = document.getElementById("flixy-filterType")?.value || "all";
        const search = document.getElementById("flixy-searchInput")?.value.toLowerCase() || "";
        let filtered = flixyOperations;
        if (filter !== "all") filtered = filtered.filter(op => op.type === filter);
        if (search) filtered = filtered.filter(op => op.operator.toLowerCase().includes(search));
        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        const tbody = document.getElementById("flixy-tableBody");
        if (!tbody) return;
        if (sorted.length === 0) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">لا توجد عمليات</td></tr>'; return; }
        tbody.innerHTML = sorted.map(op => `
            <tr>
                <td>${new Date(op.date).toLocaleDateString("ar-DZ")}</td>
                <td><span class="badge ${op.type === 'buy' ? 'badge-buy' : 'badge-sell'}">${op.type === 'buy' ? 'شراء' : 'بيع'}</span></td>
                <td>${op.operator}</td>
                <td>${op.amount.toLocaleString()} دج</td>
                <td class="${op.profit > 0 ? 'profit' : ''}">${op.profit > 0 ? '+' : ''}${op.profit.toLocaleString()} دج</td>
                <td><button class="delete-btn" data-id="${op.id}" data-system="flixy"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('');
        document.querySelectorAll('.delete-btn[data-system="flixy"]').forEach(btn => {
            btn.onclick = () => deleteFlixyOperation(parseInt(btn.dataset.id));
        });
    }

    function updateIdoomDisplay() {
        document.getElementById("idoom-stats").innerHTML = Object.keys(idoomStock).map(cat => `
            <div class="idoom-card">
                <div class="idoom-icon">🌐</div>
                <div class="idoom-name">${cat}</div>
                <div class="idoom-value">قيمة: ${faceValues[cat]} دج</div>
                <div class="idoom-balance">${idoomStock[cat]} <span>بطاقة</span></div>
                <div class="idoom-stats"><span>📥 مشتريات: ${getIdoomCategoryPurchases(cat)}</span><span>📤 مبيعات: ${getIdoomCategorySales(cat)}</span></div>
            </div>
        `).join('');
        document.getElementById("idoom-extra-stats").innerHTML = `
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-chart-line"></i></div><div class="stat-label">ربح اليوم</div><div class="stat-value profit">${getIdoomTodayProfit().toLocaleString()} دج</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-chart-simple"></i></div><div class="stat-label">إجمالي الأرباح</div><div class="stat-value profit">${getIdoomTotalProfit().toLocaleString()} دج</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-shopping-cart"></i></div><div class="stat-label">إجمالي المبيعات</div><div class="stat-value">${getIdoomTotalSales().toLocaleString()} دج</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-download"></i></div><div class="stat-label">إجمالي المشتريات</div><div class="stat-value">${getIdoomTotalPurchases().toLocaleString()} دج</div></div>
        `;
        const filter = document.getElementById("idoom-filterType")?.value || "all";
        const search = document.getElementById("idoom-searchInput")?.value.toLowerCase() || "";
        let filtered = idoomOperations;
        if (filter !== "all") filtered = filtered.filter(op => op.type === filter);
        if (search) filtered = filtered.filter(op => op.category.toLowerCase().includes(search));
        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
        const tbody = document.getElementById("idoom-tableBody");
        if (!tbody) return;
        if (sorted.length === 0) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">لا توجد عمليات</td></tr>'; return; }
        tbody.innerHTML = sorted.map(op => `
            <tr>
                <td>${new Date(op.date).toLocaleDateString("ar-DZ")}</td>
                <td><span class="badge ${op.type === 'buy' ? 'badge-buy' : 'badge-sell'}">${op.type === 'buy' ? 'شراء' : 'بيع'}</span></td>
                <td>${op.category}</td>
                <td>${op.qty}</td>
                <td>${op.unitPrice.toLocaleString()} دج</td>
                <td>${op.total.toLocaleString()} دج</td>
                <td class="${op.profit > 0 ? 'profit' : ''}">${op.profit > 0 ? '+' : ''}${op.profit.toLocaleString()} دج</td>
                <td><button class="delete-btn" data-id="${op.id}" data-system="idoom"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('');
        document.querySelectorAll('.delete-btn[data-system="idoom"]').forEach(btn => {
            btn.onclick = () => deleteIdoomOperation(parseInt(btn.dataset.id));
        });
    }

    // ربط الأحداث
    document.getElementById("flixy-addPurchaseBtn").onclick = addFlixyPurchase;
    document.getElementById("flixy-addSellBtn").onclick = addFlixySell;
    document.getElementById("flixy-sellAmount").oninput = updateFlixyExpectedProfit;
    document.getElementById("flixy-filterType").onchange = updateFlixyDisplay;
    document.getElementById("flixy-searchInput").oninput = updateFlixyDisplay;
    document.getElementById("idoom-addPurchaseBtn").onclick = addIdoomPurchase;
    document.getElementById("idoom-addSellBtn").onclick = addIdoomSell;
    document.getElementById("idoom-sellQty").oninput = updateIdoomExpectedProfit;
    document.getElementById("idoom-filterType").onchange = updateIdoomDisplay;
    document.getElementById("idoom-searchInput").oninput = updateIdoomDisplay;

    // التبويبات الداخلية
    document.querySelectorAll('.flixy-idoom-container .tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.flixy-idoom-container .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.flixy-idoom-container .tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(btn.dataset.tab).classList.add('active');
        };
    });

    // تحديث العرض الأولي
    updateFlixyDisplay();
    updateIdoomDisplay();
    updateFlixyExpectedProfit();
    updateIdoomExpectedProfit();
}

// تحميل البيانات عند بدء التشغيل
loadFlixyData();

// دالة التصدير الرئيسية (يستدعيها main.js)
window.renderFlixy = renderFlixyIdoom;
