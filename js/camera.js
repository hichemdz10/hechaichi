var camStream   = null;
var camDetector = null;
var camFrameId  = null;
var scanLock    = false;
var lastScannedCode = "";
var cameraActive    = false;

function startSplitCamera() {
    if (!S.cameraActiveInHome) return false;
    if (!('BarcodeDetector' in window)) { toast("الماسح الضوئي غير مدعوم","e"); return false; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast("الكاميرا غير متاحة","e"); return false; }

    var video = document.getElementById('splitCameraVideo');
    if (!video) { toast("عنصر الفيديو غير موجود","e"); return false; }

    if (camStream) stopSplitCamera();

    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { exact: "environment" },
            width:  { ideal: 1920 },
            height: { ideal: 1080 }
        },
        audio: false
    })
    .then(function(stream) {
        camStream = stream;
        video.srcObject = stream;

        video.onloadedmetadata = function() {
            video.play().then(function() {
                camDetector = new BarcodeDetector({
                    formats: ['ean_13','ean_8','code_128','code_39','qr_code','upc_a','upc_e']
                });
                cameraActive = true;
                scanLock = false;
                lastScannedCode = "";

                function scanLoop() {
                    if (!cameraActive) return;
                    if (!video.videoWidth) {
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
                                setTimeout(function() {
                                    scanLock = false;
                                    lastScannedCode = "";
                                }, 1200);
                            }
                        }
                    }).catch(function() {});
                    camFrameId = requestAnimationFrame(scanLoop);
                }
                scanLoop();
            }).catch(function(err) {
                toast("فشل تشغيل الفيديو","e");
                S.cameraActiveInHome = false;
                render();
            });
        };
    })
    .catch(function(err) {
        // إذا فشل exact: environment جرّب بدونه
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
        }).then(function(stream) {
            camStream = stream;
            video.srcObject = stream;
            video.onloadedmetadata = function() {
                video.play().then(function() {
                    camDetector = new BarcodeDetector({
                        formats: ['ean_13','ean_8','code_128','code_39','qr_code','upc_a','upc_e']
                    });
                    cameraActive = true;
                    scanLock = false;
                    lastScannedCode = "";
                    function scanLoop() {
                        if (!cameraActive) return;
                        if (!video.videoWidth) { camFrameId = requestAnimationFrame(scanLoop); return; }
                        camDetector.detect(video).then(function(barcodes) {
                            if (barcodes && barcodes.length > 0) {
                                var code = barcodes[0].rawValue;
                                if (!scanLock && code !== lastScannedCode) {
                                    scanLock = true;
                                    lastScannedCode = code;
                                    handleScannedCode(code);
                                    setTimeout(function() { scanLock = false; lastScannedCode = ""; }, 1200);
                                }
                            }
                        }).catch(function() {});
                        camFrameId = requestAnimationFrame(scanLoop);
                    }
                    scanLoop();
                }).catch(function() { toast("فشل تشغيل الكاميرا","e"); S.cameraActiveInHome = false; render(); });
            };
        }).catch(function() {
            toast("لا يمكن تشغيل الكاميرا","e");
            cameraActive = false;
            S.cameraActiveInHome = false;
            render();
        });
    });
    return true;
}

function handleScannedCode(code) {
    var item = S.stock.find(function(s) { return s.barcode === code; });

    if (!item) {
        // منتج غير موجود — أوقف الكاميرا وافتح نافذة الإضافة
        beep(false);
        stopSplitCamera();
        S.cameraActiveInHome = false;
        openQuickAdd(code);
        return;
    }

    if (item.q <= 0) {
        beep(false);
        toast("نفذ المخزون: " + item.n, "e");
        return;
    }

    // ✅ المنتج موجود — أضف للسلة بدون render()
    beep(true);
    addToCartSilent(item.id);
    toast("🛒 " + item.n);
    save();

    // تحديث السلة فقط بدون مسح الكاميرا
    var cartPanel = document.getElementById('splitCartContent');
    if (cartPanel) {
        cartPanel.innerHTML = renderCartPanelContent(refreshSplitCart);
        bindCartEvents(refreshSplitCart);
    }
}

function stopSplitCamera() {
    cameraActive = false;
    if (camFrameId) { cancelAnimationFrame(camFrameId); camFrameId = null; }
    if (camStream)  { camStream.getTracks().forEach(function(t) { t.stop(); }); camStream = null; }
    var video = document.getElementById('splitCameraVideo');
    if (video) { video.srcObject = null; video.onloadedmetadata = null; }
    camDetector = null;
    scanLock = false;
    lastScannedCode = "";
}
