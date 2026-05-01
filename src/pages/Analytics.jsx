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
import { TrendingUp, Users, Ticket, DollarSign, Loader2, ArrowUpRight, Filter, ChevronDown } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rangePreset, setRangePreset] = useState('30d'); // 7d | 30d | 90d | ytd | 12m | all | custom
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [groupBy, setGroupBy] = useState('day'); // day | month

    const buildRangeParams = () => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const toISO = (d) => d.toISOString();

        if (rangePreset === 'custom') {
            const from = customFrom ? new Date(customFrom) : null;
            const to = customTo ? new Date(customTo) : null;
            return {
                from: from && !Number.isNaN(from.getTime()) ? toISO(from) : null,
                to: to && !Number.isNaN(to.getTime()) ? toISO(to) : null
            };
        }

        if (rangePreset === 'all') return { from: null, to: null };
        if (rangePreset === 'ytd') return { from: toISO(startOfYear), to: toISO(now) };
        if (rangePreset === '12m') {
            const from = new Date(now);
            from.setMonth(from.getMonth() - 12);
            return { from: toISO(from), to: toISO(now) };
        }

        const days = rangePreset === '7d' ? 7 : rangePreset === '90d' ? 90 : 30;
        const from = new Date(now);
        from.setDate(from.getDate() - days);
        return { from: toISO(from), to: toISO(now) };
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { from, to } = buildRangeParams();
                const params = new URLSearchParams();
                if (from) params.set('from', from);
                if (to) params.set('to', to);
                params.set('groupBy', groupBy);

                const response = await fetch(`http://localhost:5000/api/events/stats?${params.toString()}`, {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rangePreset, customFrom, customTo, groupBy]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-linear-to-br from-white via-slate-50 to-slate-100/60">
                <div className="text-center">
                    <Loader2 className="animate-spin text-slate-700 mx-auto mb-4" size={48} />
                    <p className="text-slate-600 font-semibold">Chargement des analyses...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        { label: 'Revenu Total', value: `${stats.totalRevenue}`, icon: DollarSign, color: 'text-emerald-500', bg: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-200/40' },
        { label: 'Billets Vendus', value: stats.ticketsSold, icon: Ticket, color: 'text-red-500', bg: 'from-red-500/20 to-red-500/5', border: 'border-red-200/40' },
        { label: 'Taux de Présence', value: stats.ticketsSold > 0 ? `${Math.round((stats.scansIn / stats.ticketsSold) * 100)}%` : '0%', icon: Users, color: 'text-blue-500', bg: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-200/40' },
        { label: 'Événements', value: stats.totalEvents, icon: TrendingUp, color: 'text-orange-500', bg: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-200/40' },
    ];

    const seriesData = Array.isArray(stats?.timeSeries)
        ? stats.timeSeries.map((row) => ({
            name: row._id,
            revenue: row.revenue || 0,
            ticketsSold: row.ticketsSold || 0
        }))
        : [];

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-slate-100/60">
            {/* Header Premium */}
            <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-4">
                        Vue analytique
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-3">Analyses & Statistiques</h1>
                    <p className="text-slate-500 font-semibold text-sm sm:text-base">Mesurez l'impact de vos événements en temps réel.</p>

                    <div className="mt-6 bg-white border border-slate-200/70 rounded-2xl p-3 sm:p-4 shadow-sm">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                                    <Filter size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Période</p>
                                    <p className="text-sm font-bold text-slate-900">Choisis un intervalle</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:flex gap-2">
                                {[
                                    { id: '7d', label: '7 jours' },
                                    { id: '30d', label: '30 jours' },
                                    { id: '90d', label: '90 jours' },
                                    { id: 'ytd', label: 'YTD' },
                                    { id: '12m', label: '12 mois' },
                                    { id: 'all', label: 'Tout' },
                                    { id: 'custom', label: 'Personnalisé' }
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setRangePreset(p.id)}
                                        className={`rounded-2xl px-3 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                                            rangePreset === p.id
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <select
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    className="w-full lg:w-40 appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-300"
                                >
                                    <option value="day">Jour</option>
                                    <option value="month">Mois</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        {rangePreset === 'custom' && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    type="datetime-local"
                                    value={customFrom}
                                    onChange={(e) => setCustomFrom(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-300"
                                />
                                <input
                                    type="datetime-local"
                                    value={customTo}
                                    onChange={(e) => setCustomTo(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-300"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16 pb-20">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
                    {statCards.map((card, i) => (
                        <div key={i} className={`bg-linear-to-br ${card.bg} border ${card.border} rounded-2xl p-4 sm:p-5 relative overflow-hidden group transition-all hover:shadow-lg hover:shadow-slate-200`}>
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-linear-to-br from-white/40 to-white/0 blur-2xl rounded-full transition-all group-hover:scale-150 opacity-0 group-hover:opacity-100"></div>
                            
                            <div className={`${card.color} w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 relative z-10 bg-white shadow-lg shadow-slate-200/50`}>
                                <card.icon size={18} />
                            </div>
                            
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">{card.label}</p>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-slate-900 leading-none relative z-10">{card.value}</h3>
                            
                            <div className="mt-3 flex items-center gap-2 text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider relative z-10">
                                <ArrowUpRight size={12} className="text-emerald-500" /> +12.5% vs mois dernier
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Sales Chart */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.1)] hover:shadow-[0_16px_48px_-12px_rgba(15,23,42,0.15)] transition-shadow">
                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2">Ventes par Événement</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Évolution des revenus au fil du temps</p>
                        </div>
                        <div className="h-80 sm:h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={seriesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#94a3b8" 
                                        fontSize={12} 
                                        fontWeight="600" 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={12} 
                                        fontWeight="600" 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}€`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        itemStyle={{ color: '#dc2626', fontWeight: '700' }}
                                        cursor={{ fill: '#fef2f2' }}
                                        labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                                    />
                                    <Bar 
                                        dataKey="revenue" 
                                        fill="url(#colorSales)" 
                                        radius={[8, 8, 0, 0]} 
                                        barSize={40}
                                    />
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Attendees Chart */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.1)] hover:shadow-[0_16px_48px_-12px_rgba(15,23,42,0.15)] transition-shadow">
                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-2">Participation (Check-ins)</h3>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium">Taux de présence à vos événements</p>
                        </div>
                        <div className="h-80 sm:h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={seriesData}>
                                    <defs>
                                        <linearGradient id="colorAttendees" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#94a3b8" 
                                        fontSize={12} 
                                        fontWeight="600" 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#94a3b8" 
                                        fontSize={12} 
                                        fontWeight="600" 
                                        tickLine={false} 
                                        axisLine={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        itemStyle={{ color: '#7c3aed', fontWeight: '700' }}
                                        cursor={{ fill: '#f3e8ff' }}
                                        labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="ticketsSold" 
                                        stroke="#7c3aed" 
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
        </div>
    );
};

export default Analytics;
