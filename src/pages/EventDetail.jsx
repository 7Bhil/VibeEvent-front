import React, { useState, useEffect } from 'react';
import { 
    MapPin, 
    Calendar, 
    ChevronLeft, 
    Share2, 
    Navigation, 
    ShieldCheck, 
    Timer,
    Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/events/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setEvent(data);
                    // Select first available ticket by default
                    if (data.tickets && data.tickets.length > 0) {
                        setSelectedTicket(data.tickets[0].tier);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBuyTicket = async () => {
        if (!selectedTicket) return;
        setPurchasing(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/auth');
                return;
            }

            const response = await fetch('http://localhost:5000/api/tickets/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ eventId: event._id, tier: selectedTicket })
            });

            if (response.ok) {
                navigate('/tickets');
            } else {
                const data = await response.json();
                alert(data.message || 'Erreur lors de l\'achat');
            }
        } catch (err) {
            console.error(err);
            alert('Erreur réseau');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loader2 className="animate-spin text-red-500" size={50} />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="w-full h-screen flex justify-center items-center flex-col">
                <h1 className="text-3xl font-black mb-4">Événement introuvable</h1>
                <button onClick={() => navigate('/explore')} className="text-red-500 font-bold hover:underline">
                    Retour à l'exploration
                </button>
            </div>
        );
    }

    const currentSelectedTicketInfo = event.tickets.find(t => t.tier === selectedTicket);

    return (
        <div className="w-full">
            {/* Header / Hero */}
            <div className="relative h-[65vh] w-full overflow-hidden">
                <img 
                    src={event.image} 
                    className="w-full h-full object-cover blur-[4px] opacity-40 scale-105" 
                    alt="Event background" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] to-transparent"></div>
                
                {/* Back button & Actions */}
                <div className="absolute top-8 left-8 lg:left-12 flex gap-4 z-20">
                    <button 
                        onClick={() => navigate('/explore')}
                        className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-slate-200 text-slate-900 hover:bg-slate-200 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <div className="absolute top-8 right-8 lg:right-12 flex gap-4 z-20">
                    <button className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-slate-200 text-slate-900 hover:bg-slate-200 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Event Hero Info */}
                <div className="absolute bottom-16 left-8 lg:left-12 max-w-4xl z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-red-600/30 text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-red-500/30 backdrop-blur-md">
                            {event.category}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900">
                        {event.title}
                    </h1>
                    
                    <div className="flex flex-wrap gap-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-red-600">
                                <Calendar size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Date & Heure</p>
                                <p className="text-sm font-bold">
                                    {new Date(event.date).toLocaleDateString()} - {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-red-600">
                                <MapPin size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Lieu</p>
                                <p className="text-sm font-bold truncate max-w-[200px]">{event.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-8 lg:px-12 py-20 border-t border-slate-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Content Left */}
                    <div className="lg:col-span-2 space-y-20">
                        <section>
                            <h2 className="text-2xl font-black tracking-tight mb-8 underline decoration-red-500 underline-offset-8">À propos de l'expérience</h2>
                            <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black tracking-tight mb-8 underline decoration-red-500 underline-offset-8">Localisation</h2>
                            <div className="relative h-80 w-full rounded-[40px] overflow-hidden group">
                                <img 
                                    src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=80" 
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Map" 
                                />
                                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
                                <div className="absolute bottom-8 left-8 right-8 bg-slate-50/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-lg truncate max-w-[200px] sm:max-w-[300px]">{event.location}</h4>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                            {event.organization?.name || 'Evenflow'}
                                        </p>
                                    </div>
                                    {event.googleMapsLink && (
                                        <button 
                                            onClick={() => window.open(event.googleMapsLink, '_blank')}
                                            className="bg-red-600 p-4 rounded-2xl hover:bg-red-500 transition-all text-white shadow-xl shadow-red-500/20"
                                        >
                                            <Navigation size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Booking Right */}
                    <aside className="space-y-8">
                        <div className="bg-white border border-slate-200 rounded-[48px] p-10 sticky top-32">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black tracking-tight">Réserver</h3>
                                <div className="flex items-center gap-2 text-red-600">
                                    <Timer size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest underline decoration-red-500/30">Choisir une offre</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                {event.tickets.map((t) => (
                                    <div 
                                        key={t._id} 
                                        onClick={() => setSelectedTicket(t.tier)}
                                        className={cn(
                                            "p-6 rounded-3xl border transition-all cursor-pointer relative group",
                                            selectedTicket === t.tier 
                                                ? "border-red-500 shadow-[0_0_20px_bg-red-500/20] bg-red-500/10" 
                                                : "border-slate-200 hover:border-red-500/30 bg-slate-100 hover:bg-slate-200"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-extrabold text-sm tracking-tight">Pass {t.tier}</h4>
                                            <span className="text-lg font-black tracking-tighter">
                                                {t.price === 0 ? 'Gratuit' : `${t.price} ${event.currency}`}
                                            </span>
                                        </div>
                                        {t.tier === 'VVIP' && <span className="text-[8px] font-black uppercase text-red-600 tracking-[0.2em] mb-2 block">Expérience Ultime</span>}
                                        {t.tier === 'VIP' && <span className="text-[8px] font-black uppercase text-yellow-500 tracking-[0.2em] mb-2 block">Expérience Premium</span>}
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                            Accédez à l'événement. Limité aux stocks disponibles.
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-200 space-y-2 mb-8 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <div className="flex justify-between">
                                    <span>Frais de réservation</span>
                                    <span>0.00 {event.currency}</span>
                                </div>
                                <div className="flex justify-between text-slate-900 text-base font-black tracking-tight pt-2">
                                    <span>Total</span>
                                    <span className="text-red-600 text-3xl tracking-tighter">
                                        {currentSelectedTicketInfo ? `${currentSelectedTicketInfo.price} ${event.currency}` : '0'}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={handleBuyTicket}
                                disabled={purchasing || !selectedTicket}
                                className="w-full bg-gradient-to-r from-red-500 via-red-600 to-cyan-500 text-slate-900 font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-red-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {purchasing ? <Loader2 className="animate-spin" /> : "Acheter le billet maintenant"}
                            </button>
                            
                            <p className="text-center mt-6 text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                                <ShieldCheck size={12} className="text-red-500" />
                                Paiement sécurisé via VibePay
                            </p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default EventDetail;
