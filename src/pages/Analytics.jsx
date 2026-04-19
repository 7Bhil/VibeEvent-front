import React, { useState, useEffect } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { TrendingUp, Users, Ticket, DollarSign, Loader2, ArrowUpRight } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/events/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <Loader2 className="animate-spin text-red-500" size={40} />
            </div>
        );
    }

    const statCards = [
        { label: 'Revenu Total', value: `${stats.totalRevenue}€`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Billets Vendus', value: stats.ticketsSold, icon: Ticket, color: 'text-red-600', bg: 'bg-red-500/10' },
        { label: 'Taux de Présence', value: stats.ticketsSold > 0 ? `${Math.round((stats.scansIn / stats.ticketsSold) * 100)}%` : '0%', icon: Users, color: 'text-red-600', bg: 'bg-red-500/10' },
        { label: 'Événements', value: stats.totalEvents, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="p-10 max-w-7xl mx-auto pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter mb-4">Analyses & Statistiques</h1>
                <p className="text-slate-500 font-medium">Mesurez l'impact de vos événements en temps réel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-slate-100 border border-slate-200 rounded-[32px] p-8 relative overflow-hidden group">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.bg} blur-3xl rounded-full transition-all group-hover:scale-150`}></div>
                        <div className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10`}>
                            <card.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">{card.label}</p>
                        <h3 className="text-3xl font-black tracking-tighter relative z-10">{card.value}</h3>
                        <div className="mt-4 flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase tracking-wider relative z-10">
                            <ArrowUpRight size={14} /> +12.5% vs mois dernier
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-slate-100 border border-slate-200 rounded-[40px] p-10 h-[500px] flex flex-col">
                    <h3 className="text-xl font-bold mb-10">Ventes par Événement</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#64748b" 
                                    fontSize={10} 
                                    fontWeight="bold" 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={10} 
                                    fontWeight="bold" 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}€`}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar 
                                    dataKey="sales" 
                                    fill="url(#colorSales)" 
                                    radius={[8, 8, 0, 0]} 
                                    barSize={40}
                                />
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendees Chart */}
                <div className="bg-slate-100 border border-slate-200 rounded-[40px] p-10 h-[500px] flex flex-col">
                    <h3 className="text-xl font-bold mb-10">Participation (Check-ins)</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorAttendees" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#64748b" 
                                    fontSize={10} 
                                    fontWeight="bold" 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={10} 
                                    fontWeight="bold" 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="attendees" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorAttendees)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
