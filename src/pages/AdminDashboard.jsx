import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, Building2, UserCheck, UserX, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/pending-upgrades', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId, action) => {
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/auth/handle-upgrade', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ requestId, action })
            });
            fetchRequests(); // Refresh
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-blue-500" size={32} />
                    <h1 className="text-4xl font-black tracking-tighter">Terminal Administration</h1>
                </div>
                <p className="text-slate-500 font-medium">Contrôle global de la plateforme VibeEvent.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Utilisateurs</p>
                    <h3 className="text-4xl font-black tracking-tighter">1,284</h3>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Organisations Active</p>
                    <h3 className="text-4xl font-black tracking-tighter">42</h3>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Demandes en attente</p>
                    <h3 className="text-4xl font-black tracking-tighter text-blue-400">{requests.length}</h3>
                </div>
            </div>

            <section className="mb-20">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black tracking-tight">Demandes de passage Organisateur</h2>
                    <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-500/20">
                        {requests.length} en attente
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white/5 border border-white/5 rounded-[32px] p-20 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Aucune demande en attente</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req._id} className="bg-white/5 border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-black">
                                        {req.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{req.user?.name}</h4>
                                        <p className="text-sm text-slate-500">{req.user?.email}</p>
                                        <p className="mt-2 text-xs text-slate-400 italic">"{req.message}"</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleAction(req._id, 'approve')}
                                        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 font-black py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                                    >
                                        <CheckCircle size={16} /> Approuver
                                    </button>
                                    <button 
                                        onClick={() => handleAction(req._id, 'reject')}
                                        className="flex items-center gap-2 bg-red-500/10 text-red-400 font-black py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all"
                                    >
                                        <XCircle size={16} /> Rejeter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </section>

            <section>
                <h2 className="text-2xl font-black tracking-tight mb-8">Organisations</h2>
                <div className="bg-[#161b2c] border border-white/5 rounded-[32px] p-10 text-center">
                    <Building2 className="mx-auto mb-6 text-slate-700" size={48} />
                    <h3 className="text-xl font-bold mb-2">Gestion des structures</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">Consultez et gérez les organisations enregistrées sur la plateforme.</p>
                    <button className="bg-white/5 text-white py-4 px-10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">
                        Voir toutes les organisations
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
