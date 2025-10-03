const inlineSource = require('inline-source').inlineSource;
const fs = require('fs');
const path = require('path');

async function debug() {
    try {
        const html = fs.readFileSync('./index.html', 'utf8');
        
        // Найдем все ссылки на ресурсы
        console.log('🔍 Поиск ресурсов в HTML:');
        
        // CSS файлы
        const cssLinks = html.match(/<link[^>]*href="[^"]*\.css"[^>]*>/g);
        console.log('📄 CSS ссылки:', cssLinks);
        
        // JS файлы  
        const jsScripts = html.match(/<script[^>]*src="[^"]*\.js"[^>]*>/g);
        console.log('📜 JS ссылки:', jsScripts);
        
        // Изображения
        const images = html.match(/<img[^>]*src="[^"]*\.(jpg|jpeg|png|gif|svg)"[^>]*>/gi);
        console.log('🖼️ Изображения:', images);
        
        // Проверим существование файлов
        console.log('\n📁 Проверка файлов:');
        
        if (cssLinks) {
            cssLinks.forEach(link => {
                const href = link.match(/href="([^"]*)"/)[1];
                const fullPath = path.resolve('./', href);
                console.log(`CSS ${href}:`, fs.existsSync(fullPath) ? '✅ существует' : '❌ не найден');
            });
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

debug();