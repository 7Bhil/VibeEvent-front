import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center p-10">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-600 mb-8 animate-pulse">
                <Construction size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4">{title}</h1>
            <p className="text-slate-500 max-w-md font-medium">
                Cette section est en cours de développement. Revenez bientôt pour découvrir cette nouvelle expérience luminescente.
            </p>
        </div>
    );
};

export default Placeholder;
