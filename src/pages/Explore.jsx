import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Bell, 
    Filter, 
    MapPin, 
    Calendar, 
    Heart, 
    ChevronRight, 
    Star,
    Music,
    Mic2,
    Palette,
    Dumbbell,
    PartyPopper,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'Tous', icon: PartyPopper, active: true },
    { name: 'Concerts', icon: Music, active: false },
    { name: 'Nightlife', icon: Star, active: false },
    { name: 'Workshops', icon: Palette, active: false },
    { name: 'Expositions', icon: Mic2, active: false },
    { name: 'Sports', icon: Dumbbell, active: false },
];

const Explore = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();
                if (response.ok) {
                    setEvents(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Helper to extract min price
    const getMinPrice = (tickets) => {
        if (!tickets || tickets.length === 0) return 'Gratuit';
        const prices = tickets.map(t => t.price);
        const min = Math.min(...prices);
        return min === 0 ? 'Gratuit' : `${min}€`; // TODO: Handle event.currency dynamically
    };

    return (
        <div className="w-full">
            <main className="pb-20">
                {/* Hero section */}
                <div className="relative w-full h-[70vh] px-8 lg:px-12 pt-8 mb-16 group">
                    <div className="w-full h-full relative rounded-[48px] overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-70"
                            alt="Featured"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/60 via-transparent to-transparent"></div>
                        
                        <div className="absolute bottom-16 left-16 max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-purple-600/30 text-purple-300 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-purple-500/30 backdrop-blur-md">
                                    Tournée exclusive
                                </span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Arrive en Août</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                                Luminous <br /> Echoes 2024
                            </h1>
                            <p className="text-slate-300 text-lg font-medium mb-10 max-w-xl leading-relaxed">
                                Découvrez la première mondiale de l'expérience audio-visuelle la plus immersive de la décennie. Un voyage sensoriel unique.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-all active:scale-95">
                                    Réserver mon accès
                                </button>
                                <button className="bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all">
                                    Détails du tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="px-8 lg:px-12 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black tracking-tight underline decoration-blue-500 underline-offset-8">Explorer par catégories</h2>
                        <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((cat, i) => (
                            <button 
                                key={i}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border whitespace-nowrap transition-all ${
                                    cat.active 
                                    ? "bg-purple-600 border-purple-500 shadow-xl shadow-purple-500/20 text-white" 
                                    : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-white"
                                }`}
                            >
                                <cat.icon size={18} />
                                <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : events.length === 0 ? (
                    <div className="px-8 lg:px-12 text-center py-20 text-slate-500 font-bold tracking-widest uppercase text-xs">
                        Aucun événement publié pour le moment.
                    </div>
                ) : (
                    <div className="px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {events.map((event) => (
                            <div 
                                key={event._id} 
                                onClick={() => navigate(`/event/${event._id}`)}
                                className="bg-white/5 border border-white/5 rounded-[40px] overflow-hidden group cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all flex flex-col"
                            >
                                <div className="h-64 relative overflow-hidden shrink-0">
                                    <img src={event.image || 'https://images.unsplash.com/photo-1514525253361-b83f85df0f5c?auto=format&fit=crop&w=600&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border border-white/10">
                                            {new Date(event.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                        <Heart size={18} />
                                    </button>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-black tracking-tight max-w-[150px] leading-tight line-clamp-2">{event.title}</h3>
                                            <span className="text-blue-400 font-black tracking-tighter text-lg">{getMinPrice(event.tickets)}</span>
                                        </div>
                                        <div className="space-y-2 text-slate-500">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest flex-wrap line-clamp-1">
                                                <MapPin size={12} className="text-blue-500 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar size={12} className="text-purple-500 shrink-0" />
                                                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                                        <span className="text-slate-500">{event.organization?.name || 'VibeEvent'}</span>
                                        <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">En vente</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Newsletter / Call to action */}
                <div className="px-8 lg:px-12">
                    <div className="bg-[#161b2c] border border-white/5 rounded-[64px] p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full"></div>
                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-5xl font-black tracking-tighter mb-6 leading-tight">Ne manquez pas <br /> la prochaine étape.</h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">Inscrivez-vous pour recevoir des recommandations hebdomadaires et un accès prioritaire aux soirées les plus exclusives.</p>
                        </div>
                        <div className="relative z-10 flex w-full md:w-auto gap-4">
                            <input 
                                type="email" 
                                placeholder="Votre email" 
                                className="bg-white/5 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-blue-500/30 w-full md:w-80 font-medium"
                            />
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-xl shadow-blue-500/20">
                                S'abonner
                            </button>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Explore;
