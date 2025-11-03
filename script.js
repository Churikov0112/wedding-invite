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
      return video;
    }
  } else {
    console.log('📱 iOS устройство, оставляем картинку');
  }
  return null;
}

// Функция отправки данных в Telegram через Bot API
async function sendToTelegram(formData) {
  try {
    const BOT_TOKEN = '8442114962:AAE48KhPhyhjcLLHpGU9uzmosNFmgrbYR6k';
    const CHAT_ID = '1805490923';

    // Получаем исходные ключи напитков из формы (mead, vodka, wine, juice)
    const formDataObj = new FormData(document.getElementById('wedding-form'));
    const selectedDrinkKeys = formDataObj.getAll('drinks'); // Это вернет ['mead', 'vodka'] и т.д.

    // Структурируем напитки в объект на основе выбранных ключей
    const drinksData = {
      mead: selectedDrinkKeys.includes('mead'),
      vodka: selectedDrinkKeys.includes('vodka'),
      wine: selectedDrinkKeys.includes('wine'),
      juice: selectedDrinkKeys.includes('juice')
    };

    // Создаем JSON-like структуру
    const responseData = {
      name: formData.name,
      attendance: formData.attendance,
      drinks: drinksData,
      allergies: formData.allergies,
      timestamp: new Date().toISOString()
    };

    // Форматируем сообщение в читаемом JSON виде
    const message = `New response!

${JSON.stringify(responseData, null, 2)}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Telegram API error:', result);
      throw new Error(`Ошибка Telegram: ${result.description || 'Unknown error'}`);
    }

    console.log('✅ Данные отправлены в JSON формате');
    console.log('Выбранные напитки:', drinksData);
    return true;
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    return false;
  }
}

const drinksMap = {
      'mead': 'Медовуха/пиво/сидр',
      'vodka': 'Водка/крепкое', 
      'wine': 'Вино/шампанское',
      'juice': 'Сок/морс'
};

// Обработка формы свитка
function initWeddingForm() {
  const form = document.getElementById('wedding-form');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Собираем данные формы
    const formData = new FormData(form);
    const name = formData.get('guest-name') || 'Не указано';
    const attendance = formData.get('attendance');
    const allergies = formData.get('guest-message') || 'Нет';
    
    // Получаем выбранные напитки
    const selectedDrinks = formData.getAll('drinks');
    
    const drinks = selectedDrinks.map(drink => drinksMap[drink] || drink);
    
    // Текст для присутствия
    let attendanceText = '';
    switch (attendance) {
      case 'yes':
        attendanceText = '✅ Приду';
        break;
      case 'no':
        attendanceText = '❌ Не приду';
        break;
      case 'maybe':
        attendanceText = '❓ Пока не знаю';
        break;
      default:
        attendanceText = 'Не указано';
    }
    
    // Подготавливаем данные для отправки
    const dataToSend = {
      name,
      attendance,
      attendanceText,
      drinks,
      allergies,
      timestamp: new Date().toISOString()
    };
    
    console.log('Данные формы:', dataToSend);
    
    // Показываем загрузку
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем...';
    submitBtn.disabled = true;
    
    try {
      // Отправляем в Telegram
      const success = await sendToTelegram(dataToSend);
      
      if (success) {
        alert('✨ Волшебно! Мы получили Ваш ответ! ✨');
        form.reset();
        
        // Закрываем веб-приложение если открыто в Telegram
        if (window.TelegramWebViewProxy) {
          window.TelegramWebViewProxy.postEvent('web_app_close');
        }
      } else {
        throw new Error('Не удалось отправить ответ');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Магия не сработала. Пожалуйста, ответьте нам через Telegram');
    } finally {
      // Восстанавливаем кнопку
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
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