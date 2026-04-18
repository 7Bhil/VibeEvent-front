import React from 'react';
import Sidebar from '../components/Sidebar';
import { 
    Search, 
    Bell, 
    ArrowUpRight, 
    Calendar, 
    DollarSign, 
    Users, 
    QrCode, 
    MoreHorizontal,
    ExternalLink
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { label: 'Total Events', value: '24', change: '+4 this month', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Revenue', value: '$128.4k', change: '+18.2%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Participants', value: '12,490', change: '8.2k active', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    const sales = [
        { event: 'Midnight Jazz Festival', details: '2 Tickets • Alex Morgan', price: '+$240', time: '2M AGO', icon: '🎷' },
        { event: 'Tech Summit VIP Pass', details: '1 Ticket • Sarah Chen', price: '+$850', time: '12M AGO', icon: '💻' },
        { event: 'The Stage Workshop', details: '3 Passes • Liam J.', price: '+$120', time: '45M AGO', icon: '🎨' },
    ];

    return (
        <div className="p-10 max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-black tracking-tight mb-2">Performance Overview</h1>
                        <p className="text-slate-500 font-medium">Welcome back, Curator. Your events are performing <span className="text-emerald-400 font-bold">12% better</span> than last month.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-all group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/2 opacity-[0.02] rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                                        <stat.icon size={24} strokeWidth={2.5} />
                                    </div>
                                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full">{stat.change}</span>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts & Sales Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Sales Trends Placeholder */}
                        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-[32px] p-8">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Sales Trends</h3>
                                    <p className="text-slate-500 text-sm font-medium">Daily ticket sales across all events</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tickets</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Merchandise</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mock Chart Area */}
                            <div className="h-64 flex items-end justify-between gap-3 px-2">
                                {[40, 65, 45, 90, 55, 75, 50, 85, 60, 45, 70, 55].map((h, i) => (
                                    <div key={i} className="flex-1 group relative">
                                        <div 
                                            className="w-full bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-lg group-hover:brightness-125 transition-all duration-500" 
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-6 px-2">
                                {['OCT', 'NOV', 'DEC'].map(m => (
                                    <span key={m} className="text-[10px] font-black text-slate-700 tracking-widest">{m}</span>
                                ))}
                            </div>
                        </div>

                        {/* Recent Sales List */}
                        <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold tracking-tight">Recent Sales</h3>
                                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">View All</button>
                            </div>
                            
                            <div className="space-y-6">
                                {sales.map((sale, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl group-hover:bg-white/10 transition-colors border border-white/5">
                                                {sale.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold tracking-tight mb-0.5">{sale.event}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sale.details}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-emerald-400 mb-0.5">{sale.price}</p>
                                            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">{sale.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-12 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                                Download Report
                            </button>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        {/* Event Card */}
                        <div className="md:col-span-1 bg-white/5 border border-white/5 rounded-[32px] overflow-hidden group cursor-pointer">
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src="/assets/party-bg.png" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" 
                                    alt="event" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent"></div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded">Sold Out</span>
                                    <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded">Music</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-black tracking-tight mb-1">Synthetica Rave 2024</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                    <span>Berlin, Germany</span>
                                    <span>•</span>
                                    <span>Dec 24, 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Access Card */}
                        <div className="bg-[#161b2c] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                    <QrCode size={24} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-2">Check-in Terminal</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">Quick access for staff during live events to scan and verify tickets.</p>
                            </div>
                            <button className="w-full mt-8 bg-white/5 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">
                                Launch Terminal
                            </button>
                        </div>

                         {/* Team Card */}
                         <div className="bg-white/5 border border-white/5 rounded-[32px] p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex -space-x-3 mb-6">
                                    {[1, 2, 3].map(i => (
                                        <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} className="w-10 h-10 rounded-full border-2 border-[#161b2c]" alt="avatar" />
                                    ))}
                                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#161b2c] flex items-center justify-center text-[10px] font-black">+42</div>
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-2">Collaborators</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">Manage permissions for your event crew and security staff.</p>
                            </div>
                            <button className="w-full mt-8 bg-purple-500/10 text-purple-400 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-500/20 hover:bg-purple-500/20 transition-all">
                                Invite Team
                            </button>
                        </div>
                    </div>
        </div>
    );
};

export default Dashboard;
