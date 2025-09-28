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

// Карусель гостей - ОБНОВЛЕННАЯ ЛОГИКА (бесконечная, без автоплея)
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
  let isAnimating = false;

  // Создаем карточки + добавляем клоны для бесконечности
  function createCarouselCards() {
    carouselTrack.innerHTML = '';
    
    // Добавляем клон последней карточки в начало
    const lastCardClone = document.createElement('div');
    lastCardClone.className = 'carousel-card';
    lastCardClone.innerHTML = `<img src="${guestImages[guestImages.length - 1]}" alt="Гость ${guestImages.length}" loading="lazy">`;
    carouselTrack.appendChild(lastCardClone);

    // Добавляем основные карточки
    guestImages.forEach((imageSrc, index) => {
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.innerHTML = `<img src="${imageSrc}" alt="Гость ${index + 1}" loading="lazy">`;
      carouselTrack.appendChild(card);
    });

    // Добавляем клон первой карточки в конец
    const firstCardClone = document.createElement('div');
    firstCardClone.className = 'carousel-card';
    firstCardClone.innerHTML = `<img src="${guestImages[0]}" alt="Гость 1" loading="lazy">`;
    carouselTrack.appendChild(firstCardClone);
  }

  function updateCarousel() {
    if (isAnimating) return;
    
    isAnimating = true;
    const cardWidth = carouselTrack.children[0].offsetWidth + 20; // + gap
    const translateX = -currentIndex * cardWidth;
    
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(${translateX}px)`;
    
    setTimeout(() => {
      isAnimating = false;
      
      // Бесконечная прокрутка - перескакиваем на клон без анимации
      if (currentIndex === guestImages.length + 1) {
        currentIndex = 1;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
      }
      
      if (currentIndex === 0) {
        currentIndex = guestImages.length;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
      }
    }, 500);
  }

  function nextSlide() {
    currentIndex++;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex--;
    updateCarousel();
  }

  // Инициализация карусели
  createCarouselCards();
  
  // Устанавливаем начальную позицию (первая настоящая карточка)
  currentIndex = 1;
  const cardWidth = carouselTrack.children[0].offsetWidth + 20;
  carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth}px)`;

  // Обработчики событий
  nextBtn.addEventListener('click', () => {
    if (!isAnimating) nextSlide();
  });

  prevBtn.addEventListener('click', () => {
    if (!isAnimating) prevSlide();
  });

  // Адаптация к изменению размера окна
  window.addEventListener('resize', () => {
    const cardWidth = carouselTrack.children[0].offsetWidth + 20;
    carouselTrack.style.transition = 'none';
    carouselTrack.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
  });
}