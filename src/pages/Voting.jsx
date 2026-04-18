import React, { useState, useEffect } from 'react';
import { Vote, Users, TrendingUp, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Voting = () => {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myTickets, setMyTickets] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                navigate('/auth');
                return;
            }

            // 1. Fetch user's tickets to know which events they can vote for
            const ticketRes = await fetch('http://localhost:5000/api/tickets/my-tickets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const tickets = await ticketRes.json();
            setMyTickets(tickets);

            // 2. Fetch polls for those events
            const eventIds = [...new Set(tickets.map(t => t.event._id))];
            
            const pollPromises = eventIds.map(id => 
                fetch(`http://localhost:5000/api/polls/event/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json())
            );

            const pollResults = await Promise.all(pollPromises);
            setPolls(pollResults.flat());

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVote = async (pollId, optionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/polls/vote', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ pollId, optionId })
            });

            if (response.ok) {
                fetchData(); // Refresh to see live results
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getTotalVotes = (options) => options.reduce((acc, opt) => acc + opt.votes, 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="p-10 max-w-5xl mx-auto pb-20">
            <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest mb-6">
                    <Sparkles size={14} /> Engagements en direct
                </div>
                <h1 className="text-6xl font-black tracking-tighter mb-4">Vibez & Vote</h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto">
                    {polls.length > 0 
                        ? "Participez aux décisions des événements dont vous détenez un billet." 
                        : "Vous n'avez aucun sondage actif pour vos événements en cours."}
                </p>
            </div>

            {polls.length === 0 ? (
                <div className="bg-white/5 border border-white/5 rounded-[48px] p-20 text-center opacity-50">
                    <AlertCircle className="mx-auto text-slate-700 mb-6" size={48} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                        Aucun sondage disponible. Achetez des billets pour débloquer les votes.
                    </p>
                    <button 
                        onClick={() => navigate('/explore')}
                        className="mt-8 text-blue-500 font-black text-sm hover:underline"
                    >
                        Explorer les événements →
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {polls.map((poll) => {
                        const total = getTotalVotes(poll.options);
                        const hasVoted = poll.voters.includes(currentUser.id || currentUser._id);
                        const isClosed = poll.status === 'closed' || (poll.expiresAt && new Date() > new Date(poll.expiresAt));
                        
                        return (
                            <div key={poll._id} className="bg-white/5 border border-white/5 rounded-[48px] p-12 hover:bg-white/10 transition-all duration-500 relative overflow-hidden group">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-blue-500/20">
                                                    #{poll._id.substring(poll._id.length-4)}
                                                </span>
                                                {isClosed && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/10">Clos</span>}
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tighter mb-2">{poll.question}</h2>
                                            <p className="text-slate-400 font-medium">{poll.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Votes</p>
                                                <p className="font-black text-xl">{total.toLocaleString()}</p>
                                            </div>
                                            {(poll.expiresAt || isClosed) && (
                                                <>
                                                    <div className="w-px h-10 bg-white/10"></div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Statut</p>
                                                        <p className={`font-black text-xl ${isClosed ? 'text-red-400' : 'text-blue-400'}`}>
                                                            {isClosed ? 'Terminé' : 'En cours'}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {poll.options.map((opt) => {
                                            const percentage = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                                            const showResults = hasVoted || isClosed;

                                            return (
                                                <button 
                                                    key={opt._id}
                                                    disabled={showResults}
                                                    onClick={() => handleVote(poll._id, opt._id)}
                                                    className={`w-full relative group/opt overflow-hidden rounded-[24px] border transition-all ${
                                                        showResults ? "cursor-default" : "cursor-pointer hover:border-white/20"
                                                    } ${hasVoted ? "border-blue-500/30 bg-blue-600/5" : "border-white/5 bg-white/5"} `}
                                                >
                                                    {/* Percentage Bar */}
                                                    {showResults && (
                                                        <div 
                                                            className={`absolute inset-y-0 left-0 bg-blue-500 opacity-20 transition-all duration-1000 ease-out`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    )}

                                                    <div className="relative z-10 p-6 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-3 h-3 rounded-full ${showResults ? 'bg-blue-500' : 'bg-slate-500'} shadow-lg shadow-current/20`}></div>
                                                            <span className="font-bold tracking-tight text-lg">{opt.text}</span>
                                                        </div>
                                                        {showResults && (
                                                            <div className="text-right">
                                                                <span className="font-black text-xl tracking-tighter">{percentage}%</span>
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{opt.votes} voix</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {!hasVoted && !isClosed && (
                                        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <Vote size={14} className="animate-bounce" /> Cliquez sur une option pour valider votre choix
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Voting;
