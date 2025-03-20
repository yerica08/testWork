// 캐러셀 기능
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const carousel = document.querySelector('.carousel');
const itemWidth = items[0].getBoundingClientRect().width + 20; // 마진 포함
const visibleItems = 5; // 한 번에 보이는 아이템 수
let currentIndex = 0;

function updateCarousel() {
    const maxIndex = Math.max(0, items.length - visibleItems);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

nextBtn.addEventListener('click', () => {
    if (currentIndex < items.length - visibleItems) {
        currentIndex++;
        updateCarousel();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

// 구매 버튼 클릭 시 알림
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', () => {
        const gameTitle = button.parentElement.querySelector('h3').textContent;
        alert(`${gameTitle}을(를) 장바구니에 추가했습니다!`);
    });
});

// 히어로 버튼 클릭 시 캐러셀 섹션으로 스크롤
document.querySelector('.hero-btn').addEventListener('click', () => {
    document.querySelector('.carousel-section').scrollIntoView({ behavior: 'smooth' });
});

// 창 크기 변경 시 캐러셀 업데이트
window.addEventListener('resize', () => {
    updateCarousel();
});