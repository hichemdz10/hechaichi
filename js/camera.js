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

    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { exact: "environment" },
            width:  { ideal: 3840 },
            height: { ideal: 2160 },
            focusMode: "continuous"
        },
        audio: false
    })
    .then(function(stream) {
        camStream = stream;
        video.srcObject = stream;
        video.play();
        camDetector = new BarcodeDetector({ formats: ['ean_13','ean_8','code_128','code_39','qr_code','upc_a','upc_e'] });
        if (camLoop) clearInterval(camLoop);
        camLoop = setInterval(function() {
            if (scanCooldown || !video.videoWidth) return;
            camDetector.detect(video).then(function(barcodes) {
                if (!barcodes || !barcodes.length) return;
                var code = barcodes[0].rawValue;
                if (code === lastScanned) return;
                lastScanned = code;
                scanCooldown = true;
                var item = S.stock.find(function(s){ return s.barcode===code; });
                if (!item) {
                    beep(false); stopSplitCamera(); openQuickAdd(code);
                    setTimeout(function(){ scanCooldown=false; lastScanned=""; }, 1500);
                    return;
                }
                if (item.q <= 0) {
                    beep(false); toast("نفذ المخزون: "+item.n,"e");
                    setTimeout(function(){ scanCooldown=false; lastScanned=""; }, 1500);
                    return;
                }
                beep(true); addToCartHome(item.id);
                var cartPanel = document.getElementById('splitCartContent');
                if (cartPanel) cartPanel.innerHTML = renderCartPanelContent(refreshSplitCart);
                bindCartEvents(refreshSplitCart);
                setTimeout(function(){ scanCooldown=false; lastScanned=""; }, 800);
            }).catch(function(){});
        }, 300);
        cameraActive = true;
    })
    .catch(function() { toast("لا يمكن تشغيل الكاميرا","e"); cameraActive = false; });
    return true;
}

function stopSplitCamera() {
    if (camLoop)   { clearInterval(camLoop); camLoop = null; }
    if (camStream) { camStream.getTracks().forEach(function(t){ t.stop(); }); camStream = null; }
    cameraActive = false;
    var video = document.getElementById('splitCameraVideo');
    if (video) video.srcObject = null;
}
