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

    const hash = clickedElement.getAttribute('href');
    if (hash) {
        window.history.pushState(null, null, hash);
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
window.addEventListener('load', function () {
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
        bgm.volume = 0.4;
        bgm.play();
        btn.classList.add('playing');
    } else {
        bgm.pause();
        btn.classList.remove('playing');
    }
}

// =========================================
// 服務項目 (#service) 
// =========================================
// A. 切換服務分類
function showCategory(catId) {
    // 1. 切換卡片高亮
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => card.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // 2. 切換內容區
    const blocks = document.querySelectorAll('.service-cat-block');
    blocks.forEach(block => block.classList.remove('active'));

    const target = document.getElementById('cat-' + catId);
    if (target) target.classList.add('active');
}

// B. 控制標籤列左右滑動
function scrollTabs(direction) {
    const viewport = document.getElementById('tabs-viewport');
    const scrollAmount = 300; // 每次滑動的距離
    viewport.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

window.addEventListener('DOMContentLoaded', () => {
    // 取得當前的 Hash，如果沒有則預設為 #home
    let currentHash = window.location.hash || '#home';
    const targetBtn = document.querySelector(`.hotbar-slot[href="${currentHash}"]`);
    const targetId = 'block-' + currentHash.replace('#', '');

    if (targetBtn) {
        switchBlock(null, targetId, targetBtn);
    }

    if (!window.location.hash) {
        window.history.replaceState(null, null, '#home');
    }
});
