var camStream  = null;
var camDetector= null;
var camFrameId = null;
var scanLock = false;
var lastScannedCode = "";
var cameraActive = false;

function startSplitCamera() {
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
    if (!video) {
        toast("عنصر الفيديو غير موجود","e");
        return false;
    }

    // تنظيف أي كاميرا سابقة
    if (camStream) {
        stopSplitCamera();
    }

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

        video.onloadedmetadata = function() {
            setTimeout(function() {
                video.play().then(function() {
                    camDetector = new BarcodeDetector({ formats: ['ean_13','ean_8','code_128','code_39','qr_code','upc_a','upc_e'] });
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
                                    // فتح القفل بعد ثانية وإعادة تعيين الكود الممسوح
                                    setTimeout(function() {
                                        scanLock = false;
                                        lastScannedCode = "";
                                    }, 1000);
                                }
                            }
                        }).catch(function(e) {});
                        camFrameId = requestAnimationFrame(scanLoop);
                    }
                    cameraActive = true;
                    scanLock = false;
                    lastScannedCode = "";
                    scanLoop();
                }).catch(function(err) {
                    toast("فشل تشغيل الفيديو: "+err.message,"e");
                    S.cameraActiveInHome = false;
                    render();
                });
            }, 100);
        };
        video.onerror = function() {
            toast("خطأ في الفيديو","e");
            S.cameraActiveInHome = false;
            render();
        };
    })
    .catch(function(err) {
        toast("لا يمكن تشغيل الكاميرا: "+ (err.message || "غير معروف"),"e");
        cameraActive = false;
        S.cameraActiveInHome = false;
        render();
    });
    return true;
}

function handleScannedCode(code) {
    var item = S.stock.find(function(s){ return s.barcode === code; });
    if (!item) {
        // منتج غير موجود
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
    // المنتج موجود
    beep(true);
    addToCartHome(item.id);
    
    // تحديث السلة في وضع الكاميرا (المقسوم)
    var cartPanel = document.getElementById('splitCartContent');
    if (cartPanel) {
        cartPanel.innerHTML = renderCartPanelContent(refreshSplitCart);
        bindCartEvents(refreshSplitCart);
    } else {
        // إذا لم يكن في وضع الكاميرا، قم بتحديث السلة العادية
        refreshGlobalCart();
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
    if (video) {
        video.srcObject = null;
        video.onloadedmetadata = null;
        video.onerror = null;
    }
    camDetector = null;
    scanLock = false;
    lastScannedCode = "";
}
