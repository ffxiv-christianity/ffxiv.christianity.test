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

        // secret.html to JeSoothe.html 
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
        let targetVolume = 0.15;
        let duration = 800;
        let step = 0.015;
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
        bgm.volume = 0.15;
        bgm.play();
        btn.classList.add('playing');
    } else {
        bgm.pause();
        btn.classList.remove('playing');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 取得當前的 Hash，如果沒有則預設為 #home
    // =========================================    
    let currentHash = window.location.hash || '#home';
    const targetBtn = document.querySelector(`.hotbar-slot[href="${currentHash}"]`);
    const targetId = 'block-' + currentHash.replace('#', '');

    if (targetBtn) {
        switchBlock(null, targetId, targetBtn);
    }

    if (!window.location.hash) {
        window.history.replaceState(null, null, '#home');
    }

    // =========================================
    // (#members) 預設顯示第一位店員
    // =========================================
    const defaultMemberBtn = document.querySelector('.member-avatar-btn.active');
    const defaultMemberCard = document.querySelector('.member-detail-card.active');
    
    if (defaultMemberBtn && defaultMemberCard) {
        const titleText = defaultMemberBtn.getAttribute('data-title') || '';
        const nameText = defaultMemberBtn.getAttribute('data-name') || '';
        
        const cardTitle = defaultMemberCard.querySelector('.dynamic-title');
        const cardName = defaultMemberCard.querySelector('.dynamic-name');
        
        if (cardTitle) cardTitle.textContent = titleText;
        if (cardName) cardName.textContent = nameText;

        if (window.innerWidth <= 768) {
            defaultMemberBtn.parentNode.insertBefore(defaultMemberCard, defaultMemberBtn.nextSibling);
        }
    }
});

// =========================================
// 服務項目 (#service) 
// =========================================

// A. 切換服務分類 (維持妳原本完美的邏輯)
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

let isScrolling = false;
function scrollTabs(direction) {
    if (isScrolling) return;
    let isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    const viewport = document.getElementById('tabs-viewport');
    const card = viewport.querySelector('.category-card');      
    if (!card) return; 

    const cardWidth = card.offsetWidth;
    const style = window.getComputedStyle(viewport);
    const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 15; 
    
    const unitWidth = cardWidth + gap;
    const itemsVisible = Math.floor((viewport.clientWidth + gap) / unitWidth);
    const columnsToScroll = Math.max(1, itemsVisible); 
    const scrollAmount = unitWidth * columnsToScroll; 

    isScrolling = true;

    viewport.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });

    setTimeout(() => {
        isScrolling = false;
    }, 300);
}


// 手機版：切換左右面板
function switchMobileTab(target) {
    document.getElementById('btn-tab-right').classList.remove('active');
    document.getElementById('btn-tab-left').classList.remove('active');
    document.getElementById('btn-tab-' + target).classList.add('active');

    const leftPanel = document.querySelector('.service-menu-left');
    const rightPanel = document.querySelector('.service-sidebar-right');
    
    if (target === 'right') {
        leftPanel.classList.remove('m-active');
        rightPanel.classList.add('m-active');
    } else {
        rightPanel.classList.remove('m-active');
        leftPanel.classList.add('m-active');
    }
}

// =========================================
// 店員介紹 (#members) 
// =========================================
// --- 切換店員介紹 ---
function showMember(memberId, clickedBtn) {
    const isAlreadyActive = clickedBtn && clickedBtn.classList.contains('active');

    // 清除所有 active 狀態
    const allBtns = document.querySelectorAll('.member-avatar-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));

    const allCards = document.querySelectorAll('.member-detail-card');
    allCards.forEach(card => card.classList.remove('active'));

    if (isAlreadyActive) {
        return;
    }

    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }

    const targetCard = document.getElementById(memberId);
    if (targetCard) {
        if (clickedBtn) {
            const titleText = clickedBtn.getAttribute('data-title') || '';
            const nameText = clickedBtn.getAttribute('data-name') || '';

            const cardTitle = targetCard.querySelector('.dynamic-title');
            const cardName = targetCard.querySelector('.dynamic-name');

            if (cardTitle) cardTitle.textContent = titleText;
            if (cardName) cardName.textContent = nameText;
        }

        targetCard.classList.add('active');
        
        // 手機版：動態插入到名牌正下方
        if (window.innerWidth <= 768) {
            clickedBtn.parentNode.insertBefore(targetCard, clickedBtn.nextSibling);
            clickedBtn.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}