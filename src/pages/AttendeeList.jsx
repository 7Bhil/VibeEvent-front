import React, { useState, useEffect } from 'react';
import { Users, Mail, Clock, ChevronRight, UserCircle, Search, Loader2 } from 'lucide-react';

const AttendeeList = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendeesLoading, setAttendeesLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
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
        fetchEvents();
    }, []);

    const fetchAttendees = async (eventId) => {
        setSelectedEvent(eventId);
        setAttendeesLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/tickets/event/${eventId}/attendees`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setAttendees(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAttendeesLoading(false);
        }
    };

    const filteredAttendees = attendees.filter(ticket => 
        ticket.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="p-10 max-w-7xl mx-auto flex flex-col h-[calc(100vh-80px)] overflow-hidden">
            <div className="mb-12 shrink-0">
                <h1 className="text-4xl font-black tracking-tighter mb-4">Liste des Participants</h1>
                <p className="text-slate-500 font-medium">Gérez la base de données des participants pour chaque événement.</p>
            </div>

            <div className="flex flex-1 gap-8 min-h-0 overflow-hidden">
                {/* Events Column */}
                <div className="w-80 border-r border-white/5 pr-8 space-y-4 overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-4">Vos Événements</p>
                    {events.map((event) => (
                        <button 
                            key={event._id}
                            onClick={() => fetchAttendees(event._id)}
                            className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all text-left ${
                                selectedEvent === event._id ? 'bg-blue-600 shadow-xl shadow-blue-500/20 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className="font-bold text-sm truncate pr-4">{event.title}</span>
                            <ChevronRight size={16} className={`shrink-0 transition-transform ${selectedEvent === event._id ? 'translate-x-1' : ''}`} />
                        </button>
                    ))}
                </div>

                {/* Attendees Column */}
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    {selectedEvent ? (
                        <>
                            <div className="mb-6 shrink-0 relative flex items-center">
                                <Search className="absolute left-4 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un participant..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/30 font-medium"
                                />
                                <div className="ml-4 px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 text-xs font-black">
                                    {filteredAttendees.length} PARTICIPANTS
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {attendeesLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="animate-spin text-blue-500" size={32} />
                                    </div>
                                ) : filteredAttendees.length === 0 ? (
                                    <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                        {searchTerm ? 'Aucun résultat trouvé' : 'Aucun ticket vendu pour cet événement'}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredAttendees.map((ticket) => (
                                            <div key={ticket._id} className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center justify-between hover:bg-white/10 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-colors">
                                                        <UserCircle size={24} className="text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm">{ticket.user?.name}</h4>
                                                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">
                                                            <div className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                                                                <Mail size={12} /> {ticket.user?.email}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={12} /> Acheté le {new Date(ticket.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                        ticket.status === 'checked_in' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                        ticket.status === 'active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-white/5 text-slate-400 border-white/10'
                                                    }`}>
                                                        {ticket.status === 'checked_in' ? 'PRÉSENT' : ticket.status === 'active' ? 'ACTIF' : 'UTILISÉ'}
                                                    </span>
                                                    <p className="text-[10px] font-medium text-slate-500 mt-2">Tier: {ticket.tier}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-50">
                            <Users size={48} className="text-slate-700 mb-6" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sélectionnez un événement pour voir la liste des participants</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendeeList;
