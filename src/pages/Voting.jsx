import React, { useState, useEffect } from 'react';
import { Trophy, Flame, TrendingUp, Music, Star, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Voting = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Couleur spécifique pour les 3 premiers
    const colors = ['#f59e0b', '#94a3b8', '#b45309', '#3b82f6', '#8b5cf6'];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                if (response.ok) {
                    const data = await response.json();
                    
                    // Calculer le nombre de votes et trier
                    const sorted = data.map(ev => ({
                        ...ev,
                        votes: ev.hypeUsers ? ev.hypeUsers.length : 0,
                    })).sort((a, b) => b.votes - a.votes);

                    setEvents(sorted);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleHype = async (e, eventId) => {
        e.stopPropagation();
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
                
                setEvents(prev => {
                    const updated = prev.map(ev => {
                        if (ev._id === eventId) {
                            let newHypeUsers = [...(ev.hypeUsers || [])];
                            if (hyped) {
                                newHypeUsers.push(currentUser.id || currentUser._id);
                            } else {
                                newHypeUsers = newHypeUsers.filter(id => id !== (currentUser.id || currentUser._id));
                            }
                            return { ...ev, hypeUsers: newHypeUsers, votes: newHypeUsers.length };
                        }
                        return ev;
                    });
                    return updated.sort((a, b) => b.votes - a.votes);
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loader2 className="animate-spin text-blue-500" size={50} />
            </div>
        );
    }

    const chartData = events.slice(0, 5).map((ev, index) => ({
        name: ev.title.substring(0, 15) + '...',
        votes: ev.votes,
        color: colors[index] || '#334155'
    }));

    return (
        <div className="p-10 max-w-7xl mx-auto pb-20">
            <div className="mb-12 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl mx-auto flex items-center justify-center mb-6">
                    <Flame size={32} />
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-4">Vibe Charts</h1>
                <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">Votez pour les événements que vous attendez le plus. Les événements en tête attirent plus de sponsors et de surprises.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Podium Chart */}
                <div className="lg:col-span-2 bg-[#161b2c] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px]"></div>
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div>
                            <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight">
                                <TrendingUp className="text-red-500" />
                                Top 5 Global
                            </h2>
                            <p className="text-slate-500 mt-1">En temps réel</p>
                        </div>
                    </div>

                    <div className="h-80 w-full relative z-10">
                        {chartData.length > 0 && chartData.some(d => d.votes > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barSize={60}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="votes" radius={[12, 12, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                                Aucun vote pour le moment
                            </div>
                        )}
                    </div>
                </div>

                {/* Leaderboard List */}
                <div className="bg-white/5 border border-white/5 rounded-[40px] p-8">
                    <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                        <Trophy className="text-yellow-500" />
                        Classement Live
                    </h2>

                    <div className="space-y-4">
                        {events.map((event, index) => {
                            const isHyped = (event.hypeUsers || []).includes(currentUser.id || currentUser._id);
                            
                            return (
                                <div 
                                    key={event._id}
                                    onClick={() => navigate(`/event/${event._id}`)}
                                    className="bg-[#030712]/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-white/20 transition-all group"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                                        index === 0 ? "bg-yellow-500/20 text-yellow-500" :
                                        index === 1 ? "bg-slate-300/20 text-slate-300" :
                                        index === 2 ? "bg-amber-700/20 text-amber-500" : "bg-white/5 text-slate-500"
                                    }`}>
                                        {index + 1}
                                    </div>
                                    
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-sm truncate">{event.title}</h4>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">{event.votes} Hypes</p>
                                    </div>

                                    <button 
                                        onClick={(e) => handleHype(e, event._id)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                                            isHyped 
                                            ? "bg-red-500/20 border-red-500/50 text-red-500" 
                                            : "bg-white/5 border-white/5 text-slate-500 hover:border-red-500/30 hover:text-red-400"
                                        }`}
                                    >
                                        <Flame size={20} className={isHyped ? "fill-red-500" : ""} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Voting;
