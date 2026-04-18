import React from 'react';
import { 
    Flame, 
    Timer, 
    Users, 
    ChevronRight, 
    CheckCircle2, 
    Trophy,
    Music,
    Mic2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const Voting = () => {

    const candidates = [
        { 
            id: 1, 
            name: 'Luna Valance', 
            style: 'Alternative', 
            desc: '"Neon Dreams" Live Orchestral Version', 
            img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80',
            voted: true
        },
        { 
            id: 2, 
            name: 'The Circuit', 
            style: 'Electronic', 
            desc: 'Improvisational Modular Synth Set', 
            img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
            voted: false
        },
        { 
            id: 3, 
            name: 'Soul Echoes', 
            style: 'Jazz Fusion', 
            desc: 'Midnight Sessions at the Atrium', 
            img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=400&q=80',
            voted: false
        },
        { 
            id: 4, 
            name: 'Vanguard', 
            style: 'Rock', 
            desc: 'Arena Tour Finalé Premiere', 
            img: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=400&q=80',
            voted: false
        },
    ];

    const results = [
        { name: 'Luna Valance', percentage: '42%', color: 'from-blue-400 to-cyan-400' },
        { name: 'The Circuit', percentage: '28%', color: 'from-slate-600 to-slate-500' },
        { name: 'Vanguard', percentage: '18%', color: 'from-slate-600 to-slate-500' },
        { name: 'Soul Echoes', percentage: '12%', color: 'from-slate-600 to-slate-500' },
    ];

    const activity = [
        { user: 'Marco R.', action: 'voted for Luna Valance', time: '12s ago' },
        { user: 'Sara W.', action: 'voted for The Circuit', time: '45s ago' },
        { user: 'James L.', action: 'voted for Luna Valance', time: '1m ago' },
    ];

    return (
        <div className="w-full">
            <main className="max-w-7xl mx-auto p-8 lg:p-12">
                {/* Header Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Live Voting</span>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div className="max-w-3xl">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                                Category: <br />
                                <span className="text-slate-200">Best Performer</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                                Cast your vote for the most electrifying performance of the night. Live results are updated every second as participants submit their choices.
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 min-w-[160px] text-center backdrop-blur-md">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Participants</p>
                                <h3 className="text-3xl font-black text-blue-400 tracking-tighter">2,481</h3>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 min-w-[160px] text-center backdrop-blur-md">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Closing In</p>
                                <h3 className="text-3xl font-black text-purple-400 tracking-tighter">04:52</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Candidates Column */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {candidates.map((person) => (
                            <div key={person.id} className="group relative bg-[#161b2c]/40 border border-white/5 rounded-[40px] overflow-hidden transition-all hover:bg-[#161b2c]/60 hover:border-white/10">
                                <div className="h-64 relative overflow-hidden">
                                    <img 
                                        src={person.img} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" 
                                        alt={person.name} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b2c] via-transparent to-transparent"></div>
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                                            {person.style}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <h3 className="text-2xl font-black tracking-tight mb-2">{person.name}</h3>
                                    <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed italic">{person.desc}</p>
                                    
                                    <button className={cn(
                                        "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all",
                                        person.voted 
                                            ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-[0.98]" 
                                            : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white border border-white/5"
                                    )}>
                                        {person.voted ? (
                                            <>
                                                <CheckCircle2 size={16} strokeWidth={3} />
                                                Voted
                                            </>
                                        ) : (
                                            'Vote Now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Results / Sidebar Column */}
                    <div className="space-y-8">
                        {/* Live Tally Card */}
                        <div className="bg-[#161b2c] border border-white/10 rounded-[40px] p-10 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black tracking-tight underline decoration-blue-500 underline-offset-8">Live Tally</h3>
                                <div className="bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border border-blue-500/20 animate-pulse">
                                    Real-time
                                </div>
                            </div>

                            <div className="space-y-10">
                                {results.map((res, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{res.name}</span>
                                            <span className="text-2xl font-black tracking-tighter text-white">{res.percentage}</span>
                                        </div>
                                        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                            <div 
                                                className={cn("h-full rounded-full transition-all duration-1000 bg-gradient-to-r", res.color)}
                                                style={{ width: res.percentage }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-14 pt-8 border-t border-white/5">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Recent Activity</p>
                                <div className="space-y-6">
                                    {activity.map((act, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                                <Users size={14} />
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-400">
                                                <span className="text-white">{act.user}</span> {act.action}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Event Details Mini Card */}
                        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-[40px] p-10 group cursor-pointer hover:from-purple-600/30 hover:to-blue-600/30 transition-all">
                           <div className="flex items-center justify-between mb-4">
                                <Trophy size={32} className="text-yellow-500" />
                                <ChevronRight className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                           </div>
                           <h4 className="text-xl font-black mb-2 tracking-tight">Synthetica Grand Finale</h4>
                           <p className="text-sm text-slate-400 font-medium">Main Stage • Tonight, 22:30</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Voting;
