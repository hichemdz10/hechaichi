// ===== STOCK render =====
function renderStock() {
    var f = S.form;
    var totalShop = shopVal();
    var totalWh = whVal();
    var lowCount = lowItems().length;

    // شريط الإحصائيات
    var statsBar = '<div class="stock-stats">' + [
        { ic: "📦", l: "الأصناف", v: S.stock.length, g: "linear-gradient(135deg,#0d47a1,#0277bd)" },
        { ic: "🏪", l: "قيمة المحل", v: H(fmt(totalShop) + " دج"), g: "linear-gradient(135deg,#1b5e20,#2e7d32)" },
        { ic: "📦", l: "قيمة المستودع", v: H(fmt(totalWh) + " دج"), g: "linear-gradient(135deg,#4a148c,#6a1b9a)" },
        { ic: "⚠️", l: "ناقصة", v: lowCount, g: lowCount > 0 ? "linear-gradient(135deg,#bf360c,#e64a19)" : "linear-gradient(135deg,#1b5e20,#2e7d32)" }
    ].map(function(s) {
        return '<div class="stat-card" style="background:' + s.g + '">' +
            '<div class="stat-icon">' + s.ic + '</div>' +
            '<div class="stat-info"><div class="stat-label">' + s.l + '</div><div class="stat-value">' + s.v + '</div></div>' +
        '</div>';
    }).join('') + '</div>';

    // ===== قسم المنتجات الناقصة (يضاف هنا) =====
    var lowStockItems = S.stock.filter(function(s) { return s.q <= (S.settings.lowStockThreshold || 5); });
    var lowStockSection = '';
    if (lowStockItems.length > 0) {
        lowStockSection = '<div class="low-stock-section">' +
            '<div class="low-stock-header" onclick="document.querySelector(\'.low-stock-content\').classList.toggle(\'collapsed\')">' +
                '<div class="low-stock-title">⚠️ المنتجات الناقصة <span class="low-stock-badge">' + lowStockItems.length + '</span></div>' +
                '<div class="low-stock-toggle">⌄</div>' +
            '</div>' +
            '<div class="low-stock-content">' +
                '<div class="category-table-wrapper"><table class="stock-table low-stock-table">' +
                    '<thead>' +
                        '<th>🏪 الكمية</th>' +
                        (S.stockView === "warehouse" ? '' : '<th>🏪 المحل</th>') +
                        '<th>الصنف</th>' +
                        '<th>💰 البيع</th>' +
                        '<th>🛒 الشراء</th>' +
                        '<th>➕</th>' +
                        '<th></th>' +
                    '</thead>' +
                    '<tbody>' +
                        lowStockItems.map(function(s) {
                            return '<tr style="background:#fff5f0;">' +
                                '<td class="qty-cell low-stock"><input type="number" value="' + s.q + '" data-id="' + s.id + '" data-field="q" class="stock-qty" style="border-color:#f44336; background:#fff0f0;"><\/td>' +
                                '<td class="product-name">' + esc(s.n) + '<\/td>' +
                                '<td><input type="number" value="' + s.p + '" data-id="' + s.id + '" data-field="p" class="stock-price"><\/td>' +
                                '<td><input type="number" value="' + s.c + '" data-id="' + s.id + '" data-field="c" class="stock-price"><\/td>' +
                                '<td><button class="add-to-cart-btn" data-id="' + s.id + '">🛒<\/button><\/td>' +
                                '<td><button class="delete-btn" data-id="' + s.id + '">🗑<\/button><\/td>' +
                            '<\/tr>';
                        }).join('') +
                    '</tbody>' +
                '<\/table><\/div>' +
            '</div>' +
        '<\/div>';
    }
    // ===== انتهى قسم المنتجات الناقصة =====

    // نموذج إضافة/تحديث المنتج
    var formHTML = '<div class="stock-form-card">' +
        '<div class="form-header">' +
            '<span>➕ إضافة / تحديث منتج</span>' +
            '<button class="form-toggle" onclick="document.querySelector(\'.stock-form-body\').classList.toggle(\'collapsed\')">⌄</button>' +
        '</div>' +
        '<div class="stock-form-body">' +
            '<div class="dest-buttons">' + [
                ["shop", "🏪", "المحل", "#2e7d32"],
                ["warehouse", "📦", "المستودع", "#4a148c"],
                ["both", "🔄", "الاثنين", "#0277bd"]
            ].map(function(d) {
                return '<button class="dest-btn ' + (f.dest === d[0] ? 'active' : '') + '" data-dest="' + d[0] + '" style="background:' + (f.dest === d[0] ? d[3] : 'transparent') + ';border-color:' + d[3] + '">' +
                    '<span>' + d[1] + '</span><span>' + d[2] + '</span>' +
                '</button>';
            }).join('') + '</div>' +
            '<div class="form-grid">' +
                '<input class="inp" value="' + esc(f.n) + '" placeholder="📝 اسم المنتج *" onchange="S.form.n=this.value">' +
                '<select class="inp" onchange="S.form.cat=this.value">' + CATS.filter(function(x) { return x !== "الكل"; }).map(function(c) { return '<option value="' + c + '"' + (f.cat === c ? ' selected' : '') + '>' + CI[c] + ' ' + c + '</option>'; }).join('') + '</select>' +
                '<input class="inp" type="number" value="' + esc(f.p) + '" placeholder="💰 سعر البيع (دج)" onchange="S.form.p=this.value">' +
                '<input class="inp" type="number" value="' + esc(f.c) + '" placeholder="🛒 سعر الشراء (دج)" onchange="S.form.c=this.value">' +
                (f.dest !== "warehouse" ? '<input class="inp" type="number" value="' + esc(f.q) + '" placeholder="🏪 كمية المحل" onchange="S.form.q=this.value">' : '') +
                (f.dest !== "shop" ? '<input class="inp" type="number" value="' + esc(f.wq) + '" placeholder="📦 كمية المستودع" onchange="S.form.wq=this.value">' : '') +
                '<input class="inp" value="' + esc(f.bc) + '" placeholder="🔖 باركود (اختياري)" onchange="S.form.bc=this.value">' +
            '</div>' +
            '<div class="form-actions">' +
                '<button onclick="addStock()" class="btn-primary">✅ إضافة / تحديث</button>' +
                '<button onclick="openQuickAdd(\'\')" class="btn-secondary">📷 مسح باركود</button>' +
            '</div>' +
        '</div>' +
    '</div>';

    // شريط الأدوات
    var sorts = ['def', 'name', 'qa', 'qd', 'price'];
    var sortLabels = ['افتراضي', 'أ-ي', 'كمية ↑', 'كمية ↓', 'السعر'];
    var toolBar = '<div class="stock-toolbar">' +
        '<div class="search-box"><input id="stockSrch" value="' + esc(S.ssrch) + '" placeholder="🔍 بحث في المخزون..." class="inp" onchange="S.ssrch=this.value;render()"></div>' +
        '<div class="sort-buttons">' + sorts.map(function(k, i) {
            return '<button class="sort-btn ' + (S.sortBy === k ? 'active' : '') + '" data-sort="' + k + '">' + sortLabels[i] + '</button>';
        }).join('') + '</div>' +
        '<div class="view-buttons">' + [
            ["shop", "🏪 محل"],
            ["warehouse", "📦 مستودع"],
            ["both", "🔄 كلا"]
        ].map(function(v) {
            return '<button class="view-btn ' + (S.stockView === v[0] ? 'active' : '') + '" data-view="' + v[0] + '">' + v[1] + '</button>';
        }).join('') + '</div>' +
        '<button class="export-btn" onclick="expCSV(\'stock\')">📎 تصدير CSV</button>' +
    '</div>';

    // عرض الفئات والجداول
    var catTables = CATS.filter(function(x) { return x !== "الكل"; }).map(function(cat) {
        var items = sortItems(S.stock.filter(function(s) { return s.cat === cat && (!S.ssrch || nAr(s.n).includes(nAr(S.ssrch))); }));
        if (items.length === 0) return '';
        var isOpen = !!S.openCats[cat] || !!S.ssrch;
        var shopVal = items.reduce(function(a, s) { return a + s.q * s.c; }, 0);
        var whVal = items.reduce(function(a, s) { return a + (s.wq || 0) * s.c; }, 0);
        var profit = items.reduce(function(a, s) { return a + s.q * (s.p - s.c); }, 0);
        var lowCount = items.filter(function(s) { return s.q <= (S.settings.lowStockThreshold || 5); }).length;

        return '<div class="stock-category" data-cat="' + cat + '">' +
            '<div class="category-header" onclick="S.openCats[\'' + cat + '\']=!S.openCats[\'' + cat + '\'];render()">' +
                '<div class="category-title">' +
                    '<span class="cat-icon">' + (CI[cat] || "📦") + '</span>' +
                    '<span class="cat-name">' + cat + '</span>' +
                    '<span class="cat-count">' + items.length + ' صنف</span>' +
                '</div>' +
                '<div class="category-stats">' +
                    '<span class="stat">🏪 ' + fmt(shopVal) + '</span>' +
                    '<span class="stat">📦 ' + fmt(whVal) + '</span>' +
                    '<span class="stat">📈 ' + fmt(profit) + '</span>' +
                    (lowCount > 0 ? '<span class="stat low">⚠️ ' + lowCount + ' ناقص</span>' : '') +
                '</div>' +
                '<div class="category-toggle">' + (isOpen ? '▲' : '▼') + '</div>' +
            '</div>' +
            (isOpen ? '<div class="category-table-wrapper"><table class="stock-table">' +
                '<thead>' +
                    (S.stockView !== "warehouse" ? '<th>🏪 محل</th>' : '') +
                    (S.stockView !== "shop" ? '<th>📦 مستودع</th>' : '') +
                    '<th>الصنف</th>' +
                    '<th>💰 بيع</th>' +
                    '<th>🛒 شراء</th>' +
                    '<th>➕</th>' +
                    '<th>📈 ربح</th>' +
                    (S.stockView === "both" ? '<th>🔖 باركود</th>' : '') +
                    '<th></th>' +
                '</thead>' +
                '<tbody>' +
                    items.map(function(s) {
                        var isLow = s.q <= (S.settings.lowStockThreshold || 5);
                        return '<tr>' +
                            (S.stockView !== "warehouse" ? '<td class="qty-cell ' + (isLow ? 'low-stock' : '') + '"><input type="number" value="' + s.q + '" data-id="' + s.id + '" data-field="q" class="stock-qty"><\/td>' : '') +
                            (S.stockView !== "shop" ? '<td><input type="number" value="' + (s.wq || 0) + '" data-id="' + s.id + '" data-field="wq" class="stock-qty"><\/td>' : '') +
                            '<td class="product-name">' + esc(s.n) + '<\/td>' +
                            '<td><input type="number" value="' + s.p + '" data-id="' + s.id + '" data-field="p" class="stock-price"><\/td>' +
                            '<td><input type="number" value="' + s.c + '" data-id="' + s.id + '" data-field="c" class="stock-price"><\/td>' +
                            '<td><button class="add-to-cart-btn" data-id="' + s.id + '">🛒<\/button><\/td>' +
                            '<td class="profit-cell">' + (s.p - s.c) + ' دج<\/td>' +
                            (S.stockView === "both" ? '<td class="barcode-cell">' + (s.barcode || '—') + '<\/td>' : '') +
                            '<td><button class="delete-btn" data-id="' + s.id + '">🗑<\/button><\/td>' +
                        '<\/tr>';
                    }).join('') +
                '</tbody>' +
            '<\/table><\/div>' : '') +
        '<\/div>';
    }).join('');

    // إرجاع كل شيء مع ترتيب: الإحصائيات، ثم المنتجات الناقصة، ثم النموذج، ثم الأدوات، ثم الفئات
    return '<div class="stock-container">' + statsBar + lowStockSection + formHTML + toolBar + catTables + '<\/div>';
}

function bindStockEvents() {
    if (S.tab !== "stock") return;
    // أزرار الوجهة
    document.querySelectorAll('.dest-btn').forEach(function(btn) {
        btn.onclick = function() {
            S.form.dest = this.getAttribute('data-dest');
            render();
        };
    });
    // أزرار الترتيب
    document.querySelectorAll('.sort-btn').forEach(function(btn) {
        btn.onclick = function() {
            S.sortBy = this.getAttribute('data-sort');
            render();
        };
    });
    // أزرار العرض
    document.querySelectorAll('.view-btn').forEach(function(btn) {
        btn.onclick = function() {
            S.stockView = this.getAttribute('data-view');
            render();
        };
    });
    // أزرار الإضافة للسلة
    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
        btn.onclick = function() {
            addToCartFromStock(parseInt(this.getAttribute('data-id')));
        };
    });
    // أزرار الحذف
    document.querySelectorAll('.delete-btn').forEach(function(btn) {
        btn.onclick = function() {
            if (confirm("حذف المنتج؟")) delStock(parseInt(this.getAttribute('data-id')));
        };
    });
    // حقول الكميات والأسعار
    document.querySelectorAll('.stock-qty, .stock-price').forEach(function(inp) {
        inp.onchange = function() {
            var id = parseInt(this.getAttribute('data-id'));
            var field = this.getAttribute('data-field');
            var val = parseFloat(this.value);
            if (isNaN(val)) return;
            var item = S.stock.find(function(s) { return s.id === id; });
            if (item) {
                item[field] = val;
                save();
                render();
            }
        };
    });
}
