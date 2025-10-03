const fs = require('fs');
const path = require('path');

function checkFiles() {
    console.log('🔍 Проверка файлов в assets:\n');
    
    const assetsPath = './assets';
    const files = fs.readdirSync(assetsPath);
    
    files.forEach(file => {
        const filePath = path.join(assetsPath, file);
        const stat = fs.statSync(filePath);
        const size = (stat.size / 1024 / 1024).toFixed(2) + ' MB';
        console.log('📄 ' + file + ' (' + size + ')');
    });
    
    // Проверим, упоминаются ли они в HTML
    const html = fs.readFileSync('./index.html', 'utf8');
    const js = fs.readFileSync('./script.js', 'utf8');
    
    console.log('\n🔎 Поиск упоминаний в коде:');
    
    files.forEach(file => {
        const inHtml = html.includes(file);
        const inJs = js.includes(file);
        console.log(`${file}: HTML: ${inHtml ? '✅' : '❌'}, JS: ${inJs ? '✅' : '❌'}`);
    });
}

checkFiles();