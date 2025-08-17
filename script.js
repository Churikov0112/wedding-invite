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
});
