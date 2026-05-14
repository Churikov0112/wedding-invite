// Показ видео для всех устройств
function showVideoForAll() {
  console.log('🚀 Показываем видео для всех устройств...');
  
  const defaultImage = document.getElementById('default-image');
  const video = document.getElementById('wedding-video');
  const underVideoImage = document.getElementById('under-video-image');
  
  if (defaultImage && video) {
    // Скрываем картинку по умолчанию
    defaultImage.style.display = 'none';
    
    // Показываем видео
    video.style.display = 'block';
    
    // Меняем отзеркаленную картинку на оригинальную forest.jpg
    if (underVideoImage) {
      underVideoImage.src = 'assets/forest.jpg';
      console.log('✅ Установлена оригинальная forest.jpg');
    }
    
    console.log('✅ Показано видео');
    return video;
  }
  return null;
}

// Функция отправки данных в Google Таблицы
async function saveToGoogleSheets(formData) {
  try {
    // URL вашего Google Apps Script веб-приложения
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwEf8E9xsHZzzxjKLVnZjPdDjYL8qRk2y5IyjUtogTrHVrPcPgfKUoeuaGB8TiREdH87w/exec';
    
    // Получаем исходные ключи напитков из формы
    const formDataObj = new FormData(document.getElementById('wedding-form'));
    const selectedDrinkKeys = formDataObj.getAll('drinks');

    // Подготавливаем данные для отправки согласно структуре вашей таблицы
    const dataToSend = {
      name: formData.name,
      status: formData.attendanceText,
      mead: selectedDrinkKeys.includes('mead') ? 'Да' : 'Нет',
      vodka: selectedDrinkKeys.includes('vodka') ? 'Да' : 'Нет',
      wine: selectedDrinkKeys.includes('wine') ? 'Да' : 'Нет',
      mors: selectedDrinkKeys.includes('juice') ? 'Да' : 'Нет',
      allergies: formData.allergies,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Отправляем данные в Google Sheets:', dataToSend);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(dataToSend).toString()
    });

    const result = await response.text();
    
    if (!response.ok) {
      console.error('Google Sheets API error:', result);
      throw new Error(`Ошибка Google Sheets: ${result}`);
    }

    console.log('✅ Данные успешно сохранены в Google Таблицу');
    return true;
  } catch (error) {
    console.error('Ошибка отправки в Google Sheets:', error);
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
    const allergies = formData.get('guest-message') || 'Нет аллергий';
    
    // Текст для присутствия
    let attendanceText = '';
    switch (attendance) {
      case 'yes':
        attendanceText = 'Приду';
        break;
      case 'no':
        attendanceText = 'Не приду';
        break;
      case 'maybe':
        attendanceText = 'Пока не знаю';
        break;
      default:
        attendanceText = 'Не указано';
    }
    
    // Подготавливаем данные для отправки
    const dataToSend = {
      name,
      attendanceText,
      allergies
    };
    
    console.log('Данные формы:', dataToSend);
    
    // Показываем загрузку
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем...';
    submitBtn.disabled = true;
    
    try {
      // Отправляем в Google Таблицы
      const success = await saveToGoogleSheets(dataToSend);
      
      if (success) {
        alert('✨ Волшебно! Мы получили Ваш ответ! ✨');
        form.reset();
      } else {
        throw new Error('Не удалось сохранить ответ');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Магия не сработала. Пожалуйста, попробуйте еще раз или свяжитесь с нами');
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
  console.log('🚀 Инициализация приложения');
  
  // ПОКАЗЫВАЕМ ВИДЕО ДЛЯ ВСЕХ УСТРОЙСТВ
  const mediaElement = showVideoForAll();
  console.log('💻 Используем видео для всех устройств');
  
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
    // Работаем с видео для всех устройств
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

  let lastScrollY = 0;
  function handleScroll() {
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
