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
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const handleGoBack = () => {
        if (event && event.createdBy) {
            // Check if createdBy is a string (ObjectId) or an object (populated user)
            const createdById = typeof event.createdBy === 'string' 
                ? event.createdBy 
                : event.createdBy._id;
            
            // Compare with current user
            const currentUserId = currentUser._id || currentUser.id;
            
            if (createdById === currentUserId) {
                // User created this event, go back to their management dashboard
                navigate('/dashboard/events');
            } else {
                // User is browsing, go back to explore
                navigate('/explore');
            }
        } else {
            // Default to explore if we can't determine ownership
            navigate('/explore');
        }
    };

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
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
            <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                {/* Hero */}
                <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8">
                    <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_30px_100px_-50px_rgba(15,23,42,0.35)] sm:rounded-[40px]">
                        <div className="relative min-h-[38vh] sm:min-h-[52vh] lg:min-h-[72vh]">
                            <img 
                                src={event.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80'}
                                className="h-full w-full object-cover opacity-75 transition-transform duration-1000 hover:scale-105"
                                alt="Event background"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.10),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.12),transparent_45%)]" />

                            <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2 sm:left-6 sm:right-6 sm:top-6">
                                <button 
                                    onClick={handleGoBack}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-900 shadow-sm backdrop-blur-md transition-all hover:bg-white sm:px-4 sm:py-2.5"
                                >
                                    <ChevronLeft size={18} />
                                    <span className="hidden sm:inline">Retour</span>
                                </button>

                                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-bold text-slate-900 shadow-sm backdrop-blur-md transition-all hover:bg-white sm:px-4 sm:py-2.5">
                                    <Share2 size={16} />
                                    <span className="hidden sm:inline">Partager</span>
                                </button>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 lg:p-8">
                                <div className="max-w-3xl">
                                    <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                                        <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-900 backdrop-blur-md shadow-sm">
                                            {event.category}
                                        </span>
                                        <span className="rounded-full border border-red-400/20 bg-red-500/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-red-500/25">
                                            {event.tickets?.length ? `${event.tickets.length} offres` : 'Offre unique'}
                                        </span>
                                    </div>

                                    <h1 className="max-w-3xl text-2xl font-black tracking-tight text-red-500 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-6xl xl:text-7xl">
                                        {event.title}
                                    </h1>

                                    <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 xl:max-w-3xl">
                                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 backdrop-blur-md shadow-sm sm:rounded-3xl sm:p-4">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 sm:h-11 sm:w-11 sm:rounded-2xl">
                                                <Calendar size={16} strokeWidth={2.5} className="sm:hidden" />
                                                <Calendar size={18} strokeWidth={2.5} className="hidden sm:block" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">Date & Heure</p>
                                                <p className="truncate text-[13px] font-bold leading-tight text-slate-900 sm:text-sm">
                                                    {new Date(event.date).toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 backdrop-blur-md shadow-sm sm:rounded-3xl sm:p-4">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 sm:h-11 sm:w-11 sm:rounded-2xl">
                                                <MapPin size={16} strokeWidth={2.5} className="sm:hidden" />
                                                <MapPin size={18} strokeWidth={2.5} className="hidden sm:block" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[10px] sm:tracking-[0.2em]">Lieu</p>
                                                <p className="truncate text-[13px] font-bold leading-tight text-slate-900 sm:text-sm">{event.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:sticky lg:top-6">
                        <div className="rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.55)] sm:p-6 lg:p-8">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Réservation</p>
                                    <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Choisis ton pass</h3>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-2 text-red-600">
                                    <Timer size={15} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.16em]">Sélection</span>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                {event.tickets.map((t) => (
                                    <div 
                                        key={t._id} 
                                        onClick={() => setSelectedTicket(t.tier)}
                                        className={cn(
                                            "cursor-pointer rounded-[24px] border p-4 transition-all duration-300",
                                            selectedTicket === t.tier 
                                                ? "border-red-500 bg-red-500/8 shadow-[0_18px_40px_-30px_rgba(239,68,68,0.55)] ring-1 ring-red-500/15" 
                                                : "border-slate-200 bg-slate-50/70 hover:border-red-200 hover:bg-white hover:shadow-[0_16px_34px_-30px_rgba(15,23,42,0.45)]"
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="text-sm font-black tracking-tight text-slate-900">Pass {t.tier}</h4>
                                                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                                                    {t.tier === 'Premium' ? 'Expérience ultime' : t.tier === 'VIP' ? 'Accès privilégié' : t.tier === 'Early Bird' ? 'Vente flash' : 'Offre standard'}
                                                </p>
                                            </div>
                                            <span className="text-lg font-black tracking-tighter text-slate-900">
                                                {t.price === 0 ? 'Gratuit' : `${t.price} ${event.currency}`}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm leading-relaxed text-slate-500">
                                            Accède à l’événement avec un niveau d’accès adapté à cette formule.
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                                <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <div className="flex justify-between gap-4">
                                        <span>Frais de réservation</span>
                                        <span>0.00 {event.currency}</span>
                                    </div>
                                    <div className="flex justify-between gap-4 pt-2 text-slate-900">
                                        <span>Total</span>
                                        <span className="text-3xl tracking-tighter text-red-600">
                                            {currentSelectedTicketInfo ? `${currentSelectedTicketInfo.price} ${event.currency}` : '0'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleBuyTicket}
                                disabled={purchasing || !selectedTicket}
                                className="mt-5 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 via-red-600 to-red-500 px-5 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_-18px_rgba(239,68,68,0.8)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {purchasing ? <Loader2 className="animate-spin" /> : 'Acheter le billet maintenant'}
                            </button>

                            <p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                                <ShieldCheck size={12} className="text-red-500" />
                                Paiement sécurisé via VibePay
                            </p>
                        </div>
                    </aside>
                </section>

                <section className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8">
                    <div className="space-y-6 lg:space-y-8">
                        <section className="rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_22px_70px_-50px_rgba(15,23,42,0.45)] sm:p-6 lg:p-8">
                            <h2 className="text-2xl font-black tracking-tight underline decoration-red-500 underline-offset-8">À propos de l'expérience</h2>
                            <div className="mt-5 space-y-4 whitespace-pre-wrap text-base leading-8 text-slate-600 sm:text-lg">
                                {event.description}
                            </div>
                        </section>

                        <section className="rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_22px_70px_-50px_rgba(15,23,42,0.45)] sm:p-6 lg:p-8">
                            <h2 className="text-2xl font-black tracking-tight underline decoration-red-500 underline-offset-8">Localisation</h2>
                            <div className="relative mt-4 min-h-56 overflow-hidden rounded-[24px] group sm:min-h-64">
                                <img 
                                    src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=80" 
                                    className="h-full w-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105" 
                                    alt="Map" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/5 to-transparent"></div>
                                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                                    <div className="flex flex-col gap-3 rounded-[20px] border border-slate-200 bg-white/90 p-3 text-slate-900 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
                                        <div className="min-w-0">
                                            <h4 className="truncate text-base font-black text-slate-900 sm:text-lg">{event.location}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                {event.organization?.name || 'Evenflow'}
                                            </p>
                                        </div>
                                        {event.googleMapsLink && (
                                            <button 
                                                onClick={() => window.open(event.googleMapsLink, '_blank')}
                                                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white transition-all hover:bg-red-500 sm:px-4 sm:py-3 sm:text-sm"
                                            >
                                                <Navigation size={18} />
                                                <span className="ml-2 hidden sm:inline">Itinéraire</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="rounded-[32px] border border-slate-200/80 bg-white p-4 text-slate-900 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] sm:p-5 lg:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Aperçu rapide</p>
                                <h3 className="mt-1 text-lg font-black tracking-tight sm:text-xl">Infos clés</h3>
                            </div>
                            <span className="rounded-full border border-red-500/15 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                                Résumé
                            </span>
                        </div>

                        <div className="mt-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Date</span>
                                <span className="text-sm font-bold text-slate-900 text-right">{new Date(event.date).toLocaleDateString([], { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Horaire</span>
                                <span className="text-sm font-bold text-slate-900 text-right">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Lieu</span>
                                <span className="text-sm font-bold text-slate-900 text-right">{event.location}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Organisateur</span>
                                <span className="text-sm font-bold text-slate-900 text-right">{event.organization?.name || 'Evenflow'}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default EventDetail;
