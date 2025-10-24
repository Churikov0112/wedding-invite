// Определение iOS устройства
function isIOS() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1)
  );
}

// Показ видео для не-iOS устройств
function showVideoForNonIOS() {
  if (!isIOS()) {
    console.log('🚀 Не iOS устройство, показываем видео...');
    
    const defaultImage = document.getElementById('default-image');
    const video = document.getElementById('wedding-video');
    const underVideoImage = document.getElementById('under-video-image');
    
    if (defaultImage && video) {
      // Скрываем картинку по умолчанию
      defaultImage.style.display = 'none';
      
      // Показываем видео
      video.style.display = 'block';
      
      // Для не-iOS меняем отзеркаленную картинку на оригинальную forest.jpg
      if (underVideoImage) {
        underVideoImage.src = 'assets/forest.jpg';
        console.log('✅ Для не-iOS установлена оригинальная forest.jpg');
      }
      
      console.log('✅ Показано видео для не-iOS устройства');
      return video; // Возвращаем видео элемент
    }
  } else {
    console.log('📱 iOS устройство, оставляем картинку');
  }
  return null;
}

// Использование после инлайнинга:
function loadGuestImage(guestNumber) {
    const base64 = window.getAsset(`guest${guestNumber}.jpg`);
    if (base64) {
        return base64;
    }
    return `assets/guest${guestNumber}.jpg`;
}

// Обработка формы свитка
function initWeddingForm() {
  const form = document.getElementById('wedding-form');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Данные формы:', data);
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
    const cardWidth = 320 + 20;
    const scrollAmount = cardWidth * direction;
    
    scrollContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
  
  prevBtn.addEventListener('click', () => scrollCarousel(-1));
  nextBtn.addEventListener('click', () => scrollCarousel(1));
}

// Основная функция инициализации
function initApp() {
  const isIOSDevice = isIOS();
  console.log('🚀 Инициализация приложения, iOS:', isIOSDevice);
  
  // ОПРЕДЕЛЯЕМ АКТИВНЫЙ МЕДИА-ЭЛЕМЕНТ
  let mediaElement;
  if (isIOSDevice) {
    // Для iOS оставляем картинку
    mediaElement = document.getElementById('default-image');
    console.log('📱 iOS: используем картинку');
  } else {
    // Для не-iOS показываем видео
    mediaElement = showVideoForNonIOS();
    console.log('💻 Не-iOS: используем видео');
  }
  
  const transitionBlock = document.querySelector('.transition-block');

  function updateTransitionPosition() {
    if (!mediaElement) return;
    
    const mediaRect = mediaElement.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    
    if (transitionBlock) {
      transitionBlock.style.width = mediaRect.width + 'px';
      transitionBlock.style.top = scrollTop + mediaRect.bottom + 'px';
    }
  }

  function initMedia() {
    if (isIOSDevice) {
      // Для iOS - просто обновляем позицию после загрузки картинки
      if (mediaElement) {
        mediaElement.addEventListener('load', updateTransitionPosition);
      }
    } else {
      // Для не-iOS - работаем с видео
      const video = mediaElement;
      if (!video) return;
      
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

      video.addEventListener('loadedmetadata', updateTransitionPosition);
      playVideo();

      // Добавляем обработчик клика для воспроизведения
      document.addEventListener('click', () => {
        video.play().catch(() => {});
      }, { once: true });
    }
  }

  let lastScrollY = 0;
  function handleScroll() {
    if (window.scrollY < 10 && window.scrollY < lastScrollY) {
      window.scrollTo(0, 0);
    }
    lastScrollY = window.scrollY;
    updateTransitionPosition();
  }

  // Инициализация
  initMedia();
  updateTransitionPosition();

  // События
  window.addEventListener('resize', updateTransitionPosition);
  window.addEventListener('orientationchange', updateTransitionPosition);
  window.addEventListener('scroll', handleScroll);

  // Инициализация формы
  initWeddingForm();
  
  // Инициализация карусели для десктопа
  if (window.innerWidth >= 769) {
    initCarouselDesktop();
  }
}

// Запускаем при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);