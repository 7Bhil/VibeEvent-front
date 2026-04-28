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
    Loader2,
    Settings
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
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

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

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        // TODO: replace with API call to persist subscription
        setSubscribed(true);
        setNewsletterEmail('');
        setTimeout(() => setSubscribed(false), 5000);
    };

    // Helper to extract min price
    const getMinPrice = (tickets) => {
        if (!tickets || tickets.length === 0) return 'Gratuit';
        const prices = tickets.map(t => t.price);
        const min = Math.min(...prices);
        return min === 0 ? 'Gratuit' : `${min}€`; // TODO: Handle event.currency dynamically
    };

    const handleHype = async (e, eventId) => {
        e.stopPropagation(); // prevent navigating to event detail
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                navigate('/auth');
                return;
            }
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/hype`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const { hyped } = await response.json();
                setEvents(prev => prev.map(ev => {
                    if (ev._id === eventId) {
                        let newHypeUsers = [...(ev.hypeUsers || [])];
                        if (hyped) {
                            newHypeUsers.push(currentUser.id || currentUser._id);
                        } else {
                            newHypeUsers = newHypeUsers.filter(id => id !== (currentUser.id || currentUser._id));
                        }
                        return { ...ev, hypeUsers: newHypeUsers };
                    }
                    return ev;
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full">
            <main className="pb-20">
                {/* Hero section */}
                <div className="relative w-full h-[50vh] lg:h-[70vh] px-4 lg:px-12 pt-4 lg:pt-8 mb-8 lg:mb-16 group">
                    <div className="w-full h-full relative rounded-4xl lg:rounded-[48px] overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-70"
                            alt="Featured"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent"></div>
                        
                        <div className="absolute bottom-6 lg:bottom-10 left-8 lg:left-16 right-8 lg:right-auto z-10">
                            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                                <span className="bg-black/60 text-white text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                                    Tournée exclusive
                                </span>
                                <span className="text-white text-[9px] lg:text-[10px] font-bold uppercase tracking-widest">Arrive en Août</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-4 lg:mb-8 leading-[0.9] text-white">
                                Luminous <br /> Echoes 2024
                            </h1>
                            <p className="text-white text-sm lg:text-lg font-medium mb-6 lg:mb-10 max-w-xl leading-relaxed lg:block hidden">
                                Découvrez la première mondiale de l'expérience audio-visuelle la plus immersive de la décennie.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                                <button className="bg-red-600 hover:bg-red-500 text-white font-black py-3 lg:py-4 px-6 lg:px-10 rounded-2xl text-[10px] lg:text-xs uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 transition-all active:scale-95">
                                    Réserver mon accès
                                </button>
                                <button className="bg-slate-100/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-black py-3 lg:py-4 px-6 lg:px-10 rounded-2xl text-[10px] lg:text-xs uppercase tracking-[0.2em] transition-all">
                                    Détails
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="px-8 lg:px-12 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black tracking-tight underline decoration-red-500 underline-offset-8">Explorer par catégories</h2>
                        <button className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-8 px-8 lg:mx-0 lg:px-0.5 ">
                        {categories.map((cat, i) => (
                            <button 
                                key={i}
                                className={`flex items-center gap-3 px-6 py-2 lg:py-3 rounded-2xl border whitespace-nowrap transition-all ${
                                    cat.active 
                                    ? "bg-red-600 border-red-500 shadow-xl shadow-red-500/20 text-white" 
                                    : "bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-200 hover:text-slate-900"
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
                        <Loader2 className="animate-spin text-red-500" size={40} />
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
                                className="bg-slate-100 border border-slate-200 rounded-[40px] overflow-hidden group cursor-pointer hover:bg-slate-200 hover:border-slate-200 transition-all flex flex-col"
                            >
                                <div className="h-64 relative overflow-hidden shrink-0">
                                    <img src={event.image || 'https://images.unsplash.com/photo-1514525253361-b83f85df0f5c?auto=format&fit=crop&w=600&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#f8fafc] via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/40 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border border-slate-200">
                                            {new Date(event.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={(e) => handleHype(e, event._id)}
                                        className="absolute top-4 right-4 py-1.5 px-3 bg-black/40 backdrop-blur-md rounded-xl border border-slate-200 text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-1.5 hover:bg-black/60"
                                    >
                                        <Heart 
                                            size={16} 
                                            className={(event.hypeUsers || []).includes(currentUser.id || currentUser._id) ? "fill-red-500 text-red-500" : ""}
                                        />
                                        {event.hypeUsers?.length > 0 && <span className="text-[10px] font-black">{event.hypeUsers.length}</span>}
                                    </button>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-black tracking-tight max-w-37.5 leading-tight line-clamp-2">{event.title}</h3>
                                            <span className="text-red-600 font-black tracking-tighter text-lg">{getMinPrice(event.tickets)}</span>
                                        </div>
                                        <div className="space-y-2 text-slate-500">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest flex-wrap line-clamp-1">
                                                <MapPin size={12} className="text-red-500 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar size={12} className="text-red-500 shrink-0" />
                                                <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                                        <span className="text-slate-500">{event.organization?.name || 'Evenflow'}</span>
                                        <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">En vente</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Newsletter / Call to action */}
                <div className="px-8 lg:px-12">
                    <div className="bg-white border border-slate-200 rounded-[64px] p-8 sm:p-12 lg:p-20 flex flex-col items-start gap-6 relative overflow-hidden">
                            <div className="relative z-10 max-w-3xl text-center md:text-left">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-2 leading-tight">Ne manquez pas la prochaine étape.</h2>
                                <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">Inscrivez-vous pour recevoir des recommandations hebdomadaires.</p>
                            </div>
                            <form onSubmit={handleSubscribe} className="relative z-10 flex flex-col sm:flex-row w-full md:w-auto gap-3 mt-1">
                                <input 
                                    type="email" 
                                    aria-label="Email pour recommandations"
                                    required
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Votre email" 
                                    className="bg-slate-100 border border-slate-200 rounded-2xl py-3 px-4 md:py-4 md:px-6 outline-none focus:border-red-500/30 w-full md:w-80 font-medium"
                                />
                                <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-black py-3 px-6 md:py-4 md:px-10 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all w-full sm:w-auto shadow-xl shadow-red-500/20">
                                    S'abonner
                                </button>
                            </form>
                            {subscribed && <div className="text-sm text-emerald-600 font-bold mt-1">Merci — vous êtes inscrit(e) !</div>}
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Explore;
