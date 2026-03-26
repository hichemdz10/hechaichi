// =====================================================
// js/render-tabs.js
// =====================================================
function renderTabs() {
    var tabKeys=["home","stock","print","flixy","clients","expenses","report"];
    var low=lowItems().length;
    return '<div class="sidebar">'+tabKeys.map(function(k){
        var t=TAB_STYLES[k], active=S.tab===k;
        var parts=t.label.split(' '), icon=parts[0], text=parts.slice(1).join(' ');
        var badge=k==="stock"&&low>0?'<span class="tab-badge">'+low+'</span>':'';
        return '<button class="tab-btn-vertical '+(active?'active':'')+'" onclick="S.tab=\''+k+'\';save();render()">'+
            '<span>'+icon+'</span><span>'+text+'</span>'+badge+'</button>';
    }).join('')+'</div>';
}
