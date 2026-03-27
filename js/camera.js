var camStream  = null;
var camDetector= null;
var camLoop    = null;
var scanCooldown = false;
var lastScanned  = "";
var cameraActive = false;

function startSplitCamera() {
    if (!('BarcodeDetector' in window)) { toast("الماسح الضوئي غير مدعوم في هذا المتصفح","e"); return false; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast("الكاميرا غير متاحة","e"); return false; }
    var video = document.getElementById('splitCameraVideo');
    if (!video) return false;

    // تقليل الدقة لتحسين الأداء
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { exact: "environment" },
            width:  { ideal: 1280 },
            height: { ideal: 720 }
            // focusMode: "continuous"  // تم إزالته لتخفيف الحمل
        },
        audio: false
    })
    .then(function(stream) {
        camStream = stream;
        video.srcObject = stream;
        video.play();
        camDetector = new BarcodeDetector({ formats: ['ean_13','ean_8','code_128','code_39','qr_code','upc_a','upc_e'] });
        if (camLoop) clearInterval(camLoop);
        // زيادة الفاصل إلى 500ms
        camLoop = setInterval(function() {
            if (scanCooldown || !video.videoWidth) return;
            camDetector.detect(video).then(function(barcodes) {
                if (!barcodes || !barcodes.length) return;
                var code = barcodes[0].rawValue;
                if (code === lastScanned) return;
                lastScanned = code;
                scanCooldown = true;
                var item = S.stock.find(function(s){ return s.barcode === code; });
                if (!item) {
                    // منتج غير موجود – فتح نافذة الإضافة
                    beep(false);
                    stopSplitCamera(); // أوقف الكاميرا قبل فتح النافذة
                    openQuickAdd(code);
                    setTimeout(function(){ scanCooldown = false; lastScanned = ""; }, 1500);
                    return;
                }
                if (item.q <= 0) {
                    beep(false);
                    toast("نفذ المخزون: "+item.n,"e");
                    setTimeout(function(){ scanCooldown = false; lastScanned = ""; }, 1500);
                    return;
                }
                // تم العثور على المنتج وكميته >0
                beep(true);
                addToCartHome(item.id);
                // تحديث واجهة السلة المقسومة
                var cartPanel = document.getElementById('splitCartContent');
                if (cartPanel) {
                    cartPanel.innerHTML = renderCartPanelContent(refreshSplitCart);
                    bindCartEvents(refreshSplitCart);
                }
                setTimeout(function(){ scanCooldown = false; lastScanned = ""; }, 800);
            }).catch(function(e) {
                // console.warn("Barcode detection error:", e);
            });
        }, 500);  // 500ms بدلاً من 300ms
        cameraActive = true;
    })
    .catch(function(err) {
        toast("لا يمكن تشغيل الكاميرا: "+ (err.message || "غير معروف"),"e");
        cameraActive = false;
    });
    return true;
}

function stopSplitCamera() {
    if (camLoop)   { clearInterval(camLoop); camLoop = null; }
    if (camStream) { camStream.getTracks().forEach(function(t){ t.stop(); }); camStream = null; }
    cameraActive = false;
    var video = document.getElementById('splitCameraVideo');
    if (video) video.srcObject = null;
}
