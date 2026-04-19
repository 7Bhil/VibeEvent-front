import React, { useState, useEffect } from 'react';
import { 
    Vote, 
    Plus, 
    Download, 
    X, 
    Trash2, 
    Loader2, 
    PieChart, 
    Calendar,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const PollManager = () => {
    const [polls, setPolls] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    
    // Create Poll Form State
    const [newPoll, setNewPoll] = useState({
        eventId: '',
        question: '',
        description: '',
        options: ['', ''],
        expiresAt: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [pollsRes, eventsRes] = await Promise.all([
                fetch('http://localhost:5000/api/polls/my-polls', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/events/my-events', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (pollsRes.ok) setPolls(await pollsRes.json());
            if (eventsRes.ok) setEvents(await eventsRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/polls', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    ...newPoll,
                    options: newPoll.options.filter(opt => opt.trim() !== '')
                })
            });

            if (response.ok) {
                setShowCreate(false);
                setNewPoll({ eventId: '', question: '', description: '', options: ['', ''], expiresAt: '' });
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleClosePoll = async (pollId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/polls/${pollId}/close`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const exportPoll = (poll) => {
        const data = {
            question: poll.question,
            totalVotes: poll.options.reduce((acc, o) => acc + o.votes, 0),
            results: poll.options.map(o => ({ option: o.text, votes: o.votes })),
            voters: poll.voters.length
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poll_results_${poll._id}.json`;
        a.click();
    };

    return (
        <div className="p-10 max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-4">Gestion des Votes</h1>
                    <p className="text-slate-500 font-medium">Créez des sondages exclusifs pour vos détenteurs de billets.</p>
                </div>
                <button 
                    onClick={() => setShowCreate(true)}
                    className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                >
                    <Plus size={18} strokeWidth={3} /> Nouveau Sondage
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-red-500" size={40} />
                </div>
            ) : polls.length === 0 ? (
                <div className="bg-slate-100 border border-slate-200 rounded-[40px] p-20 text-center">
                    <Vote className="mx-auto text-slate-700 mb-6" size={48} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">Aucun sondage créé</p>
                    <button onClick={() => setShowCreate(true)} className="text-red-500 font-black text-sm hover:underline">
                        Lancer votre premier vote →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {polls.map((poll) => (
                        <div key={poll._id} className="bg-slate-100 border border-slate-200 rounded-[40px] p-8 flex flex-col justify-between group hover:bg-slate-200 transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-red-500/10 text-red-600 p-3 rounded-xl border border-red-500/20">
                                        <PieChart size={20} />
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                            poll.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {poll.status === 'active' ? 'OUVERT' : 'CLOS'}
                                        </span>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-2">{poll.question}</h3>
                                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{poll.description}</p>
                                
                                <div className="space-y-3 mb-8">
                                    {poll.options.map((opt, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                                            <span className="truncate pr-4">{opt.text}</span>
                                            <span className="text-slate-900">{opt.votes} voix</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <Calendar size={14} className="text-red-500" />
                                    {poll.event?.title}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => exportPoll(poll)}
                                        className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all"
                                        title="Exporter les résultats"
                                    >
                                        <Download size={16} />
                                    </button>
                                    {poll.status === 'active' && (
                                        <button 
                                            onClick={() => handleClosePoll(poll._id)}
                                            className="px-4 py-2 bg-red-500/10 text-red-500 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all"
                                        >
                                            Clôturer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Poll Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                    <div className="bg-white border border-slate-200 rounded-[48px] w-full max-w-2xl p-12 relative overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setShowCreate(false)} className="absolute top-8 right-8 text-slate-500 hover:text-slate-900 transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-black tracking-tighter mb-8">Nouveau Sondage</h2>
                        
                        <form onSubmit={handleCreatePoll} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Choisir l'événement</label>
                                <select 
                                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 outline-none focus:border-red-500/30 font-medium appearance-none"
                                    required
                                    value={newPoll.eventId}
                                    onChange={(e) => setNewPoll({...newPoll, eventId: e.target.value})}
                                >
                                    <option value="" className="bg-white">Sélectionnez un événement</option>
                                    {events.map(ev => (
                                        <option key={ev._id} value={ev._id} className="bg-white">{ev.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Question</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Ex: Quel artiste préférez-vous ?"
                                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 outline-none focus:border-red-500/30"
                                    value={newPoll.question}
                                    onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Options</label>
                                <div className="space-y-3">
                                    {newPoll.options.map((opt, i) => (
                                        <div key={i} className="relative">
                                            <input 
                                                type="text" 
                                                required={i < 2}
                                                placeholder={`Option ${i+1}`}
                                                className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 outline-none focus:border-red-500/30 pr-12"
                                                value={opt}
                                                onChange={(e) => {
                                                    const updated = [...newPoll.options];
                                                    updated[i] = e.target.value;
                                                    setNewPoll({...newPoll, options: updated});
                                                }}
                                            />
                                            {i > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => setNewPoll({...newPoll, options: newPoll.options.filter((_, idx) => idx !== i)})}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {newPoll.options.length < 5 && (
                                        <button 
                                            type="button"
                                            onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})}
                                            className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline"
                                        >
                                            + Ajouter une option
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 transition-all">
                                Publier le Sondage
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollManager;
