document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('wedding-video');
  const videoWrapper = document.querySelector('.video-wrapper');
  const videoSection = document.querySelector('.video-section');
  const transitionBlock = document.querySelector('.transition-block');

  function resizeVideo() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
      videoWrapper.style.width = '100%';
      videoWrapper.style.height = 'auto';
      video.style.width = '100%';
      video.style.height = 'auto';
      videoSection.style.height = video.offsetWidth + 'px';
    } else {
      videoWrapper.style.width = 'auto';
      videoWrapper.style.height = '100%';
      video.style.width = 'auto';
      video.style.height = '100%';
      videoSection.style.height = '100vh';
    }
  }

  function updateTransitionPosition() {
    const videoRect = video.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    transitionBlock.style.width = videoRect.width + 'px';
    // Центр полосы = нижний край видео относительно документа
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
  }

  video.addEventListener('loadedmetadata', updateTransitionPosition);

  resizeVideo();
  updateTransitionPosition();
  playVideo();

  window.addEventListener('resize', () => {
    resizeVideo();
    updateTransitionPosition();
  });

  window.addEventListener('orientationchange', () => {
    resizeVideo();
    updateTransitionPosition();
  });

  window.addEventListener('scroll', handleScroll);

  document.addEventListener('click', () => {
    video.play().catch(() => {});
  }, { once: true });
});
