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

  // Инициализация карусели
  initCarousel();
});

// Карусель гостей
function initCarousel() {
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  const guestImages = [
    'assets/guest1.jpg',
    'assets/guest2.jpg',
    'assets/guest3.jpg',
    'assets/guest4.jpg',
    'assets/guest5.jpg',
    'assets/guest6.jpg'
  ];

  let currentIndex = 0;
  let autoPlayInterval;
  let cardsPerView = getCardsPerView();

  // Создаем карточки
  guestImages.forEach((imageSrc, index) => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.innerHTML = `<img src="${imageSrc}" alt="Гость ${index + 1}" loading="lazy">`;
    carouselTrack.appendChild(card);
  });

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    const cardWidth = carouselTrack.children[0].offsetWidth + 20; // + gap
    const translateX = -currentIndex * cardWidth;
    carouselTrack.style.transform = `translateX(${translateX}px)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % guestImages.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + guestImages.length) % guestImages.length;
    updateCarousel();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Обработчики событий
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoPlay();
    startAutoPlay();
  });

  // Пауза автовоспроизведения при наведении
  carouselTrack.addEventListener('mouseenter', stopAutoPlay);
  carouselTrack.addEventListener('mouseleave', startAutoPlay);

  // Адаптация к изменению размера окна
  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    updateCarousel();
  });

  // Запуск автовоспроизведения
  startAutoPlay();
  updateCarousel();
}