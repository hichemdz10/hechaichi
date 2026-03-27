var camStream  = null;
var camDetector= null;
var camFrameId = null;
var scanLock = false;
var lastScannedCode = "";
var cameraActive = false;

// بدء الكاميرا في وضع العرض المقسوم
function startSplitCamera() {
    // تأكد من أن الوضع المقسوم مفعل
    if (!S.cameraActiveInHome) {
        console.warn("startSplitCamera called but cameraActiveInHome is false");
        return false;
    }
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
        camDetector = new BarcodeDetector({ formats: ['ean_13','ean_8','code_128','code_39','qr_code','upc_a','upc_e'] });
        // حلقة المسح
        function scanLoop() {
            if (!cameraActive || !video.videoWidth) {
                camFrameId = requestAnimationFrame(scanLoop);
                return;
            }
            camDetector.detect(video).then(function(barcodes) {
                if (barcodes && barcodes.length > 0) {
                    var code = barcodes[0].rawValue;
                    if (!scanLock && code !== lastScannedCode) {
                        scanLock = true;
                        lastScannedCode = code;
                        handleScannedCode(code);
                        setTimeout(function() { scanLock = false; }, 1000);
                    }
                }
            }).catch(function(e) {});
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
        // عند فشل الكاميرا، نغلق وضع المقسوم
        S.cameraActiveInHome = false;
        render();
    });
    return true;
}

function handleScannedCode(code) {
    var item = S.stock.find(function(s){ return s.barcode === code; });
    if (!item) {
        beep(false);
        stopSplitCamera();
        openQuickAdd(code);
        return;
    }
    if (item.q <= 0) {
        beep(false);
        toast("نفذ المخزون: "+item.n,"e");
        return;
    }
    beep(true);
    addToCartHome(item.id);
    var cartPanel = document.getElementById('splitCartContent');
    if (cartPanel) {
        cartPanel.innerHTML = renderCartPanelContent(refreshSplitCart);
        bindCartEvents(refreshSplitCart);
    }
}

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
    // لا نغير S.cameraActiveInHome هنا، لأن إيقاف الكاميرا قد يكون مؤقتًا
}
