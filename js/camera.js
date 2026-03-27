var camStream  = null;
var camDetector= null;
var camFrameId = null;
var scanLock = false;
var lastScannedCode = "";
var cameraActive = false;

// بدء الكاميرا في وضع العرض المقسوم
function startSplitCamera() {
    if (!('BarcodeDetector' in window)) {
        toast("الماسح الضوئي غير مدعوم في هذا المتصفح","e");
        return false;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast("الكاميرا غير متاحة","e");
        return false;
    }
    var video = document.getElementById('splitCameraVideo');
    if (!video) return false;

    // إعدادات منخفضة الدقة لتحسين الأداء
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { exact: "environment" },
            width: { ideal: 640 },
            height: { ideal: 480 }
        },
        audio: false
    })
    .then(function(stream) {
        camStream = stream;
        video.srcObject = stream;
        video.play();
        // إنشاء كاشف الباركود
        camDetector = new BarcodeDetector({ formats: ['ean_13','ean_8','code_128','code_39','qr_code','upc_a','upc_e'] });
        // بدء حلقة المسح باستخدام requestAnimationFrame
        function scanLoop() {
            if (!cameraActive || !video.videoWidth) {
                camFrameId = requestAnimationFrame(scanLoop);
                return;
            }
            camDetector.detect(video).then(function(barcodes) {
                if (barcodes && barcodes.length > 0) {
                    var code = barcodes[0].rawValue;
                    // منع التكرار خلال فترة التهدئة
                    if (!scanLock && code !== lastScannedCode) {
                        scanLock = true;
                        lastScannedCode = code;
                        handleScannedCode(code);
                        // فتح القفل بعد 1 ثانية لتجنب التكرار السريع
                        setTimeout(function() { scanLock = false; }, 1000);
                    }
                }
            }).catch(function(e) {
                // تجاهل الأخطاء البسيطة
            });
            camFrameId = requestAnimationFrame(scanLoop);
        }
        cameraActive = true;
        scanLock = false;
        lastScannedCode = "";
        scanLoop();
    })
    .catch(function(err) {
        toast("لا يمكن تشغيل الكاميرا: "+ (err.message || "غير معروف"),"e");
        cameraActive = false;
    });
    return true;
}

// معالجة الكود الممسوح
function handleScannedCode(code) {
    var item = S.stock.find(function(s){ return s.barcode === code; });
    if (!item) {
        // منتج غير موجود
        beep(false);
        stopSplitCamera(); // إيقاف الكاميرا قبل فتح النافذة
        openQuickAdd(code); // فتح نافذة إضافة المنتج
        return;
    }
    if (item.q <= 0) {
        beep(false);
        toast("نفذ المخزون: "+item.n,"e");
        return;
    }
    // المنتج موجود وكمية متوفرة
    beep(true);
    addToCartHome(item.id);
    // تحديث واجهة السلة في وضع الكاميرا
    var cartPanel = document.getElementById('splitCartContent');
    if (cartPanel) {
        cartPanel.innerHTML = renderCartPanelContent(refreshSplitCart);
        bindCartEvents(refreshSplitCart);
    }
}

// إيقاف الكاميرا وتحرير الموارد
function stopSplitCamera() {
    if (camFrameId) {
        cancelAnimationFrame(camFrameId);
        camFrameId = null;
    }
    if (camStream) {
        camStream.getTracks().forEach(function(t){ t.stop(); });
        camStream = null;
    }
    cameraActive = false;
    var video = document.getElementById('splitCameraVideo');
    if (video) video.srcObject = null;
    camDetector = null;
    scanLock = false;
}
