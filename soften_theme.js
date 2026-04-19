import fs from 'fs';
import path from 'path';

const dir = './src';

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // replacements for tailwind classes
    content = content.replace(/bg-\[\#030712\]/g, 'bg-slate-900');
    content = content.replace(/bg-\[\#161b2c\]/g, 'bg-slate-800');
    
    // replacements for CSS hex values directly (like in index.css)
    content = content.replace(/#030712/g, '#0f172a');
    content = content.replace(/#161b2c/g, '#1e293b');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
};

const walkSync = (d) => {
    fs.readdirSync(d).forEach(file => {
        const fullPath = path.join(d, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkSync(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            replaceInFile(fullPath);
        }
    });
};

walkSync(dir);
