// =========================================
// 1. 切換畫面區塊與 Hotbar 狀態
// =========================================
function switchBlock(event, targetId, clickedElement) {
    if (event) event.preventDefault();

    // --- 處理畫面的淡入淡出 ---
    const allBlocks = document.querySelectorAll('.other-block');
    allBlocks.forEach(block => {
        block.classList.remove('active');
    });
    
    const targetBlock = document.getElementById(targetId);
    if (targetBlock) {
        targetBlock.classList.add('active');
    }

    // --- 處理 Hotbar 按鈕的發光狀態 ---
    if (clickedElement) {
        const allSlots = document.querySelectorAll('.hotbar-slot');
        allSlots.forEach(slot => {
            slot.classList.remove('active-slot');
        });
        
        clickedElement.classList.add('active-slot');
    }
}

// =========================================
// 2. 切換 Hotbar 收合/展開狀態
// =========================================
function toggleHotbar() {
    const hotbarWrapper = document.getElementById('ui-hotbar');
    const toggleBtn = document.getElementById('hotbar-btn');
    
    hotbarWrapper.classList.toggle('hidden');
    
    if (hotbarWrapper.classList.contains('hidden')) {
        toggleBtn.innerText = '︿'; 
    } else {
        toggleBtn.innerText = '﹀'; 
    }
}

// =========================================
// 音樂播放器
// =========================================
window.addEventListener('load', function() {
    const bgm = document.getElementById('bgm');
    const btn = document.getElementById('music-toggle');
    const isFromSecret = localStorage.getItem('playBgm');

    if (bgm) {
        bgm.volume = 0.8;

        // secret.html to otherside.html 
        if (isFromSecret === 'true') {
            bgm.currentTime = 0;
            localStorage.removeItem('playBgm');
            playAndSync(bgm, btn);
        } 
    }
});


function playAndSync(bgm, btn) {
    bgm.volume = 0;
    
    bgm.play().then(() => {
        if (btn) btn.classList.add('playing');
        
        // Fade-in
        let targetVolume = 0.5; 
        let duration = 800;    
        let step = 0.05;       
        let interval = duration / (targetVolume / step);
        
        let fadeIn = setInterval(() => {
            if (bgm.volume < targetVolume) {
                bgm.volume = Math.min(bgm.volume + step, targetVolume);
            } else {
                clearInterval(fadeIn);
            }
        }, interval);

    }).catch(err => {
        console.log("等待點擊後接續音樂...");
    });
}


function toggleMusic() {
    const bgm = document.getElementById('bgm');
    const btn = document.getElementById('music-toggle');
    
    if (!bgm || !btn) return;

    if (bgm.paused) {
        bgm.volume = 0.5; 
        bgm.play();
        btn.classList.add('playing');
    } else {
        bgm.pause();
        btn.classList.remove('playing');
    }
}