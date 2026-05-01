import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    ArrowRight, 
    Zap, 
    ShieldCheck, 
    ChevronRight, 
    Star,
    Globe,
    Layers
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-['Inter'] selection:bg-red-500/30 overflow-x-hidden">
            {/* Minimalist Header */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-2xl z-50 flex items-center justify-between px-6 lg:px-16 border-b border-slate-200/50">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 shadow-lg shadow-red-500/25"></div>
                    <h2 className="text-slate-900 font-black text-lg tracking-tighter uppercase italic">Evenflow</h2>
                </div>
                <div className="flex items-center gap-4 lg:gap-8">
                    <button 
                        onClick={() => navigate('/explore')}
                        className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Explorer
                    </button>
                    <button 
                        onClick={() => navigate('/auth')}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-red-600 transition-all active:scale-95"
                    >
                        Connexion
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 lg:px-16">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.12),transparent_70%)] pointer-events-none"></div>
                
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-8 animate-fade-in">
                        <Star size={12} className="fill-red-500" />
                        Plateforme événementielle de nouvelle génération
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-950">
                        Vivez l'instant. <br />
                        <span className="italic font-light text-slate-400">Dominez la scène.</span>
                    </h1>
                    
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                        Que vous soyez un organisateur visionnaire ou un passionné d'expériences uniques, Evenflow redéfinit chaque moment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/auth')}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-black py-4 lg:py-5 px-10 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Démarrer l'aventure
                            <ArrowRight size={18} />
                        </button>
                        <button 
                            onClick={() => navigate('/explore')}
                            className="w-full sm:w-auto bg-slate-100/50 hover:bg-white border border-slate-200 text-slate-900 font-bold py-4 lg:py-5 px-10 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                        >
                            Explorer les événements
                        </button>
                    </div>

                    {/* Stats / Visual element */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
                        {[
                            { label: 'Utilisateurs', value: '10K+' },
                            { label: 'Événements', value: '500+' },
                            { label: 'Pays', value: '12' },
                            { label: 'Satisfaction', value: '99%' }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 backdrop-blur-sm">
                                <p className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 lg:py-32 px-6 lg:px-16 bg-slate-50/50 border-y border-slate-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-4 leading-tight text-slate-950">Tout ce dont vous avez besoin <br /> pour briller.</h2>
                        <div className="h-1.5 w-20 bg-red-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Gestion Intuitive",
                                desc: "Créez vos événements en quelques secondes avec une interface pensée pour la productivité."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Billetterie Sécurisée",
                                desc: "Vos transactions sont protégées par les meilleurs standards de sécurité du marché."
                            },
                            {
                                icon: Layers,
                                title: "Analyse en Temps Réel",
                                desc: "Suivez vos ventes et l'engagement de votre communauté avec des tableaux de bord précis."
                            }
                        ].map((f, i) => (
                            <div key={i} className="group p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-500">
                                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <f.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-950">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Banner */}
            <section className="py-24 px-6 lg:px-16">
                <div className="max-w-6xl mx-auto rounded-[48px] bg-slate-950 p-12 lg:p-24 relative overflow-hidden text-center lg:text-left">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(239,68,68,0.2),transparent_60%)]"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-6">
                                Prêt à passer au <br />
                                <span className="italic font-light text-red-400">niveau supérieur ?</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-medium">Rejoignez des centaines d'organisateurs qui font confiance à Evenflow.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/auth')}
                            className="bg-white text-slate-950 font-black py-5 px-12 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95"
                        >
                            Créer mon compte gratuit
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 lg:px-16 border-t border-slate-100 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-red-600"></div>
                        <h2 className="text-slate-900 font-extrabold text-sm tracking-tighter uppercase italic">Evenflow</h2>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2024 Evenflow Experience Platform. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
