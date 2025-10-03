const fs = require('fs');
const path = require('path');

function encodeFileToBase64(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.otf': 'font/otf',
            '.mp4': 'video/mp4'
        };
        
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.warn('⚠️ Не удалось закодировать:', filePath, error.message);
        return null;
    }
}

async function build() {
    try {
        console.log('🏗️  Начинаем сборку свадебного приглашения...\n');
        
        // Читаем основной HTML
        let html = fs.readFileSync('./index.html', 'utf8');
        console.log('📄 Исходный HTML:', html.length, 'символов');
        
        // 1. Инлайним CSS
        console.log('\n🎨 Инлайним CSS...');
        const cssRegex = /<link[^>]*href="([^"]+\.css)"[^>]*>/g;
        let cssMatch;
        while ((cssMatch = cssRegex.exec(html)) !== null) {
            const cssPath = cssMatch[1];
            const fullPath = path.resolve('./', cssPath);
            
            if (fs.existsSync(fullPath)) {
                const cssContent = fs.readFileSync(fullPath, 'utf8');
                html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
                console.log('✅', cssPath);
            } else {
                console.log('❌ Не найден:', cssPath);
            }
        }
        
        // 2. Инлайним JS
        console.log('\n⚡ Инлайним JS...');
        const jsRegex = /<script[^>]*src="([^"]+\.js)"[^>]*><\/script>/g;
        let jsMatch;
        while ((jsMatch = jsRegex.exec(html)) !== null) {
            const jsPath = jsMatch[1];
            const fullPath = path.resolve('./', jsPath);
            
            if (fs.existsSync(fullPath)) {
                const jsContent = fs.readFileSync(fullPath, 'utf8');
                html = html.replace(jsMatch[0], `<script>${jsContent}</script>`);
                console.log('✅', jsPath);
            } else {
                console.log('❌ Не найден:', jsPath);
            }
        }
        
        // 3. Инлайним ВСЕ изображения из assets (даже если они не упомянуты в HTML)
        console.log('\n🖼️  Инлайним ВСЕ изображения из assets...');
        const assetsPath = './assets';
        const allAssets = fs.readdirSync(assetsPath);
        
        allAssets.forEach(assetFile => {
            if (assetFile.match(/\.(jpg|jpeg|png|gif)$/i)) {
                const assetPath = `assets/${assetFile}`;
                const fullPath = path.resolve('./', assetPath);
                
                if (fs.existsSync(fullPath)) {
                    const base64 = encodeFileToBase64(fullPath);
                    if (base64) {
                        // Заменяем все упоминания этого файла
                        const escapedPath = assetPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(escapedPath, 'g');
                        
                        if (html.match(regex)) {
                            // Если файл упоминается в HTML - заменяем
                            html = html.replace(regex, base64);
                            console.log('✅ Заменен в HTML:', assetFile);
                        } else {
                            // Если файл не упоминается - добавляем скрытый div с данными
                            html += `\n<!-- Hidden asset: ${assetFile} -->\n<div data-asset="${assetFile}" style="display:none">${base64}</div>`;
                            console.log('✅ Добавлен скрытый:', assetFile);
                        }
                    }
                }
            }
        });
        
        // 4. Инлайним видео (осторожно - может быть очень большим!)
        // В секции видео добавьте:
        console.log('\n🎥 Пробуем инлайнить большое видео...');
        const videoFiles = allAssets.filter(file => file.match(/\.(mp4|webm)$/i));

        videoFiles.forEach(videoFile => {
            const videoPath = `assets/${videoFile}`;
            const fullPath = path.resolve('./', videoPath);
            const stat = fs.statSync(fullPath);
            const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
            
            console.log(`📹 Видео: ${videoFile} (${sizeMB} MB)`);
            
            // ПРЕДУПРЕЖДЕНИЕ о размере
            if (sizeMB > 5) {
                console.log(`⚠️  ВНИМАНИЕ: Видео ${sizeMB} MB будет инлайнено!`);
                console.log(`📊 Примерный размер HTML увеличится на ${(sizeMB * 1.35).toFixed(1)} MB`);
                console.log(`📱 На слабых устройствах возможны проблемы с производительностью`);
                
                // Спросим подтверждение
                console.log('❓ Все равно инлайнить? (y/n)');
                // Для автоматизации - просто инлайним
            }
            
            const base64 = encodeFileToBase64(fullPath);
            if (base64) {
                const escapedPath = videoPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedPath, 'g');
                html = html.replace(regex, base64);
                console.log('✅ Видео инлайнуто!');
            }
        });
        
        // 5. Инлайним шрифты
        console.log('\n🔤 Инлайним шрифты...');
        if (fs.existsSync('./fonts')) {
            const fontFiles = fs.readdirSync('./fonts');
            
            fontFiles.forEach(fontFile => {
                const fontPath = `fonts/${fontFile}`;
                const fullPath = path.resolve('./', fontPath);
                const base64 = encodeFileToBase64(fullPath);
                
                if (base64) {
                    const escapedPath = fontPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(escapedPath, 'g');
                    html = html.replace(regex, base64);
                    console.log('✅', fontFile);
                }
            });
        }
        
        // 6. Добавляем JavaScript хелпер для доступа к скрытым ассетам
        console.log('\n📦 Добавляем хелпер для ассетов...');
        const assetHelper = `
<script>
// Хелпер для доступа к скрытым ассетам
window.getAsset = function(assetName) {
    const element = document.querySelector('[data-asset="' + assetName + '"]');
    return element ? element.textContent : null;
};
</script>`;
        
        html = html.replace('</body>', assetHelper + '\n</body>');
        
        // Сохраняем результат
        fs.writeFileSync('./wedding-invitation.html', html);
        
        console.log('\n🎉 Сборка завершена!');
        console.log('✅ Файл создан: wedding-invitation.html');
        console.log('📊 Размер файла:', (Buffer.byteLength(html, 'utf8') / 1024 / 1024).toFixed(2), 'MB');
        
        // Статистика
        const base64Images = (html.match(/data:image\/[^;]+;base64/g) || []).length;
        const base64Videos = (html.match(/data:video\/[^;]+;base64/g) || []).length;
        const hiddenAssets = (html.match(/data-asset/g) || []).length;
        
        console.log('\n📊 Статистика:');
        console.log('📷 Base64 изображений:', base64Images);
        console.log('🎥 Base64 видео:', base64Videos);
        console.log('📦 Скрытых ассетов:', hiddenAssets);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

build();