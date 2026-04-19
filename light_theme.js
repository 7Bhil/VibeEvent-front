import fs from 'fs';
import path from 'path';

const dir = './src';

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Overall backgrounds
    content = content.replace(/bg-slate-900/g, 'bg-slate-50');
    content = content.replace(/bg-\[\#030712\]/g, 'bg-slate-50');
    content = content.replace(/bg-slate-800/g, 'bg-white');
    content = content.replace(/bg-\[\#161b2c\]/g, 'bg-white');
    
    // CSS Hex values
    content = content.replace(/#0f172a/g, '#f8fafc'); // slate-900 to slate-50
    content = content.replace(/#1e293b/g, '#ffffff'); // slate-800 to white
    content = content.replace(/#030712/g, '#f8fafc'); // in case it was missed
    
    // 2. Borders and secondary elements
    content = content.replace(/border-white\/5/g, 'border-slate-200');
    content = content.replace(/border-white\/10/g, 'border-slate-200');
    content = content.replace(/border-white\/20/g, 'border-slate-300');
    content = content.replace(/bg-white\/5/g, 'bg-slate-100');
    content = content.replace(/bg-white\/10/g, 'bg-slate-200');
    content = content.replace(/bg-white\/20/g, 'bg-slate-300');
    
    // 3. Text conversions (make white text dark)
    content = content.replace(/text-white/g, 'text-slate-900');
    content = content.replace(/text-slate-400/g, 'text-slate-500'); 
    
    // 4. Purple & Blue to Red accents
    content = content.replace(/purple-600/g, 'red-600');
    content = content.replace(/purple-500/g, 'red-500');
    content = content.replace(/purple-400/g, 'red-600'); // text-purple-400 -> text-red-600 for contrast
    content = content.replace(/blue-600/g, 'red-600');
    content = content.replace(/blue-500/g, 'red-500');
    content = content.replace(/blue-400/g, 'red-600'); // text-blue-400 -> text-red-600 for contrast
    
    // 5. Gradients & Shadow
    content = content.replace(/from-white\/10/g, 'from-slate-200');
    content = content.replace(/via-white\/10/g, 'via-slate-200');
    content = content.replace(/to-white\/10/g, 'to-slate-200');
    content = content.replace(/shadow-white\//g, 'shadow-slate-400/');
    
    // 6. Fix Button Typography
    const bgSolidClasses = ['blue', 'red', 'emerald'].map(c => `bg-${c}-600`).join('|');
    const regex1 = new RegExp(`(${bgSolidClasses})([^"'>]*?)text-slate-900`, 'g');
    content = content.replace(regex1, '$1$2text-white');
    
    const regex2 = new RegExp(`text-slate-900([^"'>]*?)(${bgSolidClasses})`, 'g');
    content = content.replace(regex2, 'text-white$1$2');

    const regex3 = new RegExp(`from-slate-800([^"'>]*?)text-slate-900`, 'g');
    content = content.replace(regex3, 'from-slate-800$1text-white');
    
    // Special fix for inputs background in Light Mode: we removed bg-white/5, so input backgrounds became bg-slate-100
    // Make sure placeholder is visible
    content = content.replace(/placeholder:text-white\/50/g, 'placeholder:text-slate-400');
    
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
