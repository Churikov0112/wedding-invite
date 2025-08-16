document.addEventListener('DOMContentLoaded', () => {
  // Элементы
  const video = document.getElementById('wedding-video');
  const videoWrapper = document.querySelector('.video-wrapper');
  
  // Настройка размеров
  function resizeVideo() {
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isPortrait) {
      videoWrapper.style.width = '100%';
      videoWrapper.style.height = 'auto';
      video.style.width = '100%';
      video.style.height = 'auto';
    } else {
      videoWrapper.style.width = 'auto';
      videoWrapper.style.height = '100%';
      video.style.width = 'auto';
      video.style.height = '100%';
    }
  }

  // Автовоспроизведение
  function playVideo() {
    video.play().catch(error => {
      console.log('Автовоспроизведение заблокировано:', error);
      showPlayButton();
    });
  }

  // Кнопка воспроизведения
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

  // Блокировка оттягивания
  let lastScrollY = 0;
  function handleScroll() {
    if (window.scrollY < 10 && window.scrollY < lastScrollY) {
      window.scrollTo(0, 0);
    }
    lastScrollY = window.scrollY;
  }

  // Инициализация
  resizeVideo();
  playVideo();
  
  window.addEventListener('resize', resizeVideo);
  window.addEventListener('orientationchange', resizeVideo);
  window.addEventListener('scroll', handleScroll);

  // iOS фикс
  document.addEventListener('click', () => {
    video.play().catch(() => {});
  }, { once: true });
});