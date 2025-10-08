// Использование после инлайнинга:
function loadGuestImage(guestNumber) {
    const base64 = window.getAsset(`guest${guestNumber}.jpg`);
    if (base64) {
        return base64;
    }
    // fallback на обычный путь
    return `assets/guest${guestNumber}.jpg`;
}

// Обработка формы свитка
function initWeddingForm() {
  const form = document.getElementById('wedding-form');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Здесь можно отправить данные на сервер
    console.log('Данные формы:', data);
    
    // Показываем сообщение об успехе
    alert('Спасибо! Ваш ответ успешно отправлен.');
    form.reset();
  });
}

// Функция для прокрутки карусели на десктопе
function initCarouselDesktop() {
  const scrollContainer = document.getElementById('carousel-scroll');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (!scrollContainer || !prevBtn || !nextBtn) return;
  
  function scrollCarousel(direction) {
    const cardWidth = 320 + 20; // ширина карточки + gap
    const scrollAmount = cardWidth * direction;
    
    scrollContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
  
  prevBtn.addEventListener('click', () => scrollCarousel(-1));
  nextBtn.addEventListener('click', () => scrollCarousel(1));
}

document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('wedding-video');
  const transitionBlock = document.querySelector('.transition-block');

  function updateTransitionPosition() {
    const videoRect = video.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    transitionBlock.style.width = videoRect.width + 'px';
    transitionBlock.style.top = scrollTop + videoRect.bottom + 'px';
  }

  function playVideo() {
    video.play().catch(error => {
      console.log('Автовоспроизведение заблокировано:', error);
      showPlayButton();
    });
  }

  function showPlayButton() {
    const btn = document.createElement('button');
    btn.className = 'play-button';
    btn.textContent = '▶ Нажмите для запуска';
    btn.onclick = () => {
      video.play();
      btn.remove();
    };
    document.body.appendChild(btn);
  }

  let lastScrollY = 0;
  function handleScroll() {
    if (window.scrollY < 10 && window.scrollY < lastScrollY) {
      window.scrollTo(0, 0);
    }
    lastScrollY = window.scrollY;
    updateTransitionPosition();
  }

  video.addEventListener('loadedmetadata', updateTransitionPosition);

  updateTransitionPosition();
  playVideo();

  window.addEventListener('resize', updateTransitionPosition);
  window.addEventListener('orientationchange', updateTransitionPosition);
  window.addEventListener('scroll', handleScroll);

  document.addEventListener('click', () => {
    video.play().catch(() => {});
  }, { once: true });

  // Инициализация формы
  initWeddingForm();
  
  // Инициализация карусели для десктопа
  if (window.innerWidth >= 769) {
    initCarouselDesktop();
  }
});