import React from 'react';
import { 
    MapPin, 
    Calendar, 
    Clock, 
    ChevronLeft, 
    Share2, 
    Navigation, 
    ShieldCheck, 
    Timer,
    Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const EventDetail = () => {


    const navigate = useNavigate();

    const tickets = [
        { id: 'vip', name: 'VIP Backstage', price: '249€', desc: 'Accès au lounge VIP, boissons gratuites, et vue panoramique.', premium: true },
        { id: 'standard', name: 'Entrée Standard', price: '89€', desc: 'Accès complet à la scène principale et aux zones extérieures.', premium: false },
        { id: 'early', name: 'Early Bird', price: '49€', desc: 'Quantité limitée. Vendu.', soldOut: true },
    ];

    const recommendations = [
        { title: 'Prism Pulse', location: 'Kraftwerk, Berlin', date: '28 OCT', img: 'https://images.unsplash.com/photo-1557682250-33005888d30d?auto=format&fit=crop&w=400&q=80', tag: 'ART' },
        { title: 'Deep Code', location: 'Tresor, Berlin', date: '02 NOV', img: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&w=400&q=80', tag: 'TECHNO' },
        { title: 'Flora Lumen', location: 'Botanical Garden', date: '15 NOV', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80', tag: 'IMMERSIV' },
    ];

    return (
        <div className="w-full">
            {/* Header / Hero */}
            <div className="relative h-[65vh] w-full overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80" 
                    className="w-full h-full object-cover blur-[2px] opacity-40 scale-105" 
                    alt="Event background" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent"></div>
                
                {/* Back button & Actions */}
                <div className="absolute top-8 left-8 lg:left-12 flex gap-4 z-20">
                    <button 
                        onClick={() => navigate('/explore')}
                        className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 text-white hover:bg-white/10 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <div className="absolute top-8 right-8 lg:right-12 flex gap-4 z-20">
                    <button className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 text-white hover:bg-white/10 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Event Hero Info */}
                <div className="absolute bottom-16 left-8 lg:left-12 max-w-4xl z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-blue-600/30 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-blue-500/30 backdrop-blur-md">
                            Exclusivité Premiere
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
                        Neon Genesis <br />
                        <span className="text-blue-500">Audio Visual</span>
                    </h1>
                    
                    <div className="flex flex-wrap gap-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400">
                                <Calendar size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Date & Heure</p>
                                <p className="text-sm font-bold">24 Octobre 2024, 21:00</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400">
                                <MapPin size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Lieu</p>
                                <p className="text-sm font-bold">The Cyber Sphere, Berlin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-8 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Content Left */}
                    <div className="lg:col-span-2 space-y-20">
                        <section>
                            <h2 className="text-2xl font-black tracking-tight mb-8 underline decoration-blue-500 underline-offset-8">À propos de l'expérience</h2>
                            <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-medium">
                                <p>
                                    Rejoignez-nous pour une convergence inégalée de lumière, de son et de technologie. Neon Genesis est bien plus qu'un concert : c'est une immersion sensorielle dans le futur de la performance électronique.
                                </p>
                                <p>
                                    Mettant en vedette des artistes visuels de classe mondiale et des légendes de la techno underground, nous avons conçu un voyage de 12 heures à travers le paysage numérique.
                                </p>
                                <p>
                                    Découvrez le système exclusif "Aether-Sound", offrant une audio haute fidélité à 360 degrés qui se synchronise parfaitement avec nos installations lumineuses cinétiques.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black tracking-tight mb-8 underline decoration-blue-500 underline-offset-8">Localisation</h2>
                            <div className="relative h-80 w-full rounded-[40px] overflow-hidden group">
                                <img 
                                    src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=80" 
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Map" 
                                />
                                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
                                <div className="absolute bottom-8 left-8 right-8 bg-[#030712]/80 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-lg">The Cyber Sphere</h4>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Lichtstraße 12, 10115 Berlin</p>
                                    </div>
                                    <button className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 transition-all text-white shadow-xl shadow-blue-500/20">
                                        <Navigation size={20} />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Booking Right */}
                    <aside className="space-y-8">
                        <div className="bg-[#161b2c] border border-white/10 rounded-[48px] p-10 sticky top-32">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black tracking-tight">Réserver</h3>
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Timer size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest underline decoration-blue-500/30">Choisir une offre</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                {tickets.map((t) => (
                                    <div 
                                        key={t.id} 
                                        className={cn(
                                            "p-6 rounded-3xl border transition-all cursor-pointer relative group",
                                            t.soldOut ? "opacity-50 cursor-not-allowed border-white/5" : "border-white/5 hover:border-blue-500/30 bg-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-extrabold text-sm tracking-tight">{t.name}</h4>
                                            <span className="text-lg font-black tracking-tighter">{t.price}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">{t.desc}</p>
                                        {t.premium && <span className="text-[8px] font-black uppercase text-blue-400 tracking-[0.2em]">Expérience Premium</span>}
                                        {t.soldOut && <span className="text-[8px] font-black uppercase text-red-500 tracking-[0.2em]">Épuisé</span>}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/5 space-y-2 mb-8 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <div className="flex justify-between">
                                    <span>Frais de réservation</span>
                                    <span>4.50€</span>
                                </div>
                                <div className="flex justify-between text-white text-base font-black tracking-tight pt-2">
                                    <span>Total</span>
                                    <span className="text-blue-400 text-3xl tracking-tighter">253.50€</span>
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-purple-500 via-blue-600 to-cyan-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all">
                                Acheter le billet maintenant
                            </button>
                            
                            <p className="text-center mt-6 text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                                <ShieldCheck size={12} className="text-blue-500" />
                                Paiement sécurisé via VibePay
                            </p>
                        </div>
                    </aside>
                </div>

                {/* Recommendations */}
                <div className="mt-40">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-black tracking-tighter">Vous aimeriez aussi</h2>
                        <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Voir tout</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendations.map((rec, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="h-48 rounded-[32px] overflow-hidden relative mb-6">
                                    <img src={rec.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" alt={rec.title} />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border border-white/10">
                                            {rec.tag}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="text-lg font-black tracking-tight mb-1">{rec.title}</h4>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rec.date} • {rec.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EventDetail;
