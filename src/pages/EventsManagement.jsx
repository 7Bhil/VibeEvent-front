import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Trash2, Edit3, Eye, Loader2, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventsManagement = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/events/my-events', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
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

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const handleDelete = async (eventId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setEvents(prev => prev.filter(e => e._id !== eventId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-4">Gestion des Événements</h1>
                    <p className="text-slate-500 font-medium">Visualisez et gérez tous vos événements publiés ou en brouillon.</p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard/events/create')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                >
                    <Plus size={18} strokeWidth={3} /> Créer un événement
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white/5 border border-white/5 rounded-[40px] p-20 text-center">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">Vous n'avez pas encore créé d'événement</p>
                    <button 
                        onClick={() => navigate('/dashboard/events/create')}
                        className="text-blue-500 font-black text-sm hover:underline"
                    >
                        Commencer maintenant →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white/5 border border-white/5 rounded-[32px] p-6 flex flex-col md:flex-row items-center gap-8 hover:bg-white/10 transition-all group">
                            <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            
                            <div className="flex-1 min-w-0 text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2 truncate">{event.title}</h3>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-purple-500" />
                                        <span className="truncate max-w-[200px]">{event.location}</span>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        event.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                        {event.status === 'published' ? 'Publié' : 'Brouillon'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate(`/event/${event._id}`)}
                                    className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                                    title="Voir l'événement"
                                >
                                    <Eye size={18} />
                                </button>
                                <button 
                                    className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                                    title="Modifier"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(event._id)}
                                    className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all border border-red-500/10"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsManagement;
