import React from 'react';

const Footer = () => {
    return (
        <footer className="px-8 lg:px-12 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#030712] text-white font-['Inter']">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-600 to-blue-500"></div>
                <h2 className="text-white font-black text-sm tracking-tighter">The Stage</h2>
            </div>
            <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Conditions d'Utilisation</a>
                <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-white transition-colors">Centre d'aide</a>
            </div>
            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">© 2024 THE STAGE GLOBAL. TOUS DROITS RÉSERVÉS.</p>
        </footer>
    );
};

export default Footer;
