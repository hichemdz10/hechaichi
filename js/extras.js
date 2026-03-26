
// =====================================================
// js/extras.js
// =====================================================
(function() {
    var btn=document.createElement('button');
    btn.id='darkModeToggle';
    var isDark=localStorage.getItem('hch_dark')==='1';
    if(isDark) document.body.classList.add('dark-mode');
    btn.textContent=isDark?'☀️':'🌙';
    btn.title='تبديل الوضع الليلي';
    btn.onclick=function(){ var dark=document.body.classList.toggle('dark-mode'); btn.textContent=dark?'☀️':'🌙'; localStorage.setItem('hch_dark',dark?'1':'0'); };
    document.body.appendChild(btn);
})();

