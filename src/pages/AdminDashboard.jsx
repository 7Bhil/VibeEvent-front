import React, { useEffect, useState } from 'react';
import { ShieldCheck, Building2, UserCircle, CheckCircle, XCircle, Loader2, ListTree, MoreVertical } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'users', 'organizations'
    
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    
    const [stats, setStats] = useState({ totalUsers: 0, totalOrganizations: 0, pendingRequests: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            
            const [reqRes, statsRes, usersRes, orgsRes] = await Promise.all([
                fetch('http://localhost:5000/api/auth/pending-upgrades', { headers }),
                fetch('http://localhost:5000/api/admin/stats', { headers }),
                fetch('http://localhost:5000/api/admin/users', { headers }),
                fetch('http://localhost:5000/api/admin/organizations', { headers })
            ]);

            if (reqRes.ok) setRequests(await reqRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
            if (orgsRes.ok) setOrganizations(await orgsRes.json());
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (requestId, action) => {
        let durationDays = null;
        if (action === 'approve') {
            const days = window.prompt("Durée de l'accès Organisateur en jours (laisser vide pour permanent) :", "30");
            if (days === null) return; // Cancelled
            durationDays = days;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/handle-upgrade', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ requestId, action, durationDays })
            });
            
            if (response.ok) {
                fetchData(); // Refresh everything
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUserAction = async (userId, type, payload) => {
        try {
            const token = localStorage.getItem('token');
            const url = type === 'role' 
                ? `http://localhost:5000/api/admin/users/${userId}/role`
                : `http://localhost:5000/api/admin/users/${userId}/status`;
                
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: payload ? JSON.stringify(payload) : undefined
            });

            if (response.ok) {
                fetchData(); // Refresh the list
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-red-500" size={32} />
                    <h1 className="text-4xl font-black tracking-tighter">Terminal Administration</h1>
                </div>
                <p className="text-slate-500 font-medium">Contrôle global de la plateforme Evenflow.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Utilisateurs</p>
                    <h3 className="text-4xl font-black tracking-tighter">{stats.totalUsers}</h3>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Organisations Active</p>
                    <h3 className="text-4xl font-black tracking-tighter">{stats.totalOrganizations}</h3>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-8 border-red-500/30 bg-red-500/10">
                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Demandes en attente</p>
                    <h3 className="text-4xl font-black tracking-tighter text-red-600">{stats.pendingRequests}</h3>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all whitespace-nowrap border ${activeTab === 'requests' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'}`}
                >
                    Demandes ({stats.pendingRequests})
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all whitespace-nowrap border ${activeTab === 'users' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'}`}
                >
                    Base Utilisateurs
                </button>
                <button 
                    onClick={() => setActiveTab('organizations')}
                    className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all whitespace-nowrap border ${activeTab === 'organizations' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'}`}
                >
                    Organisations
                </button>
            </div>

            <section className="mb-20">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-red-500" size={40} />
                    </div>
                ) : (
                    <>
                        {/* TAB: REQUESTS */}
                        {activeTab === 'requests' && (
                            <div className="space-y-4">
                                {requests.length === 0 ? (
                                    <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-20 text-center">
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Aucune demande en attente</p>
                                    </div>
                                ) : (
                                    requests.map((req) => (
                                        <div key={req._id} className="bg-slate-100 border border-slate-200 rounded-[40px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-200 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-600 flex items-center justify-center text-xl font-black border border-red-500/30">
                                                    {req.user?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg">{req.user?.name}</h4>
                                                    <p className="text-sm text-slate-500">{req.user?.email}</p>
                                                    <p className="mt-2 text-xs text-slate-500 italic">"{req.message}"</p>
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
                                    ))
                                )}
                            </div>
                        )}

                        {/* TAB: USERS */}
                        {activeTab === 'users' && (
                            <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-100 border-b border-slate-200">
                                        <tr>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Utilisateur</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Rôle</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Statut</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Date d'inscription</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-100 transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                            <UserCircle size={20} className="text-slate-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">{user.name}</p>
                                                            <p className="text-xs text-slate-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                        user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        user.role === 'organizer' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                        user.status === 'blocked' ? 'bg-red-50 text-red-600 border-red-200' :
                                                        'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    }`}>
                                                        {user.status === 'blocked' ? 'Bloqué' : 'Actif'}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-sm text-slate-500 font-medium">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-6 flex items-center justify-end gap-2">
                                                    {user.role === 'attendee' ? (
                                                        <button 
                                                            onClick={() => handleUserAction(user._id, 'role', { role: 'organizer' })} 
                                                            className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-200"
                                                        >
                                                            Promouvoir
                                                        </button>
                                                    ) : user.role === 'organizer' ? (
                                                        <button 
                                                            onClick={() => handleUserAction(user._id, 'role', { role: 'attendee' })} 
                                                            className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                                                        >
                                                            Rétrograder
                                                        </button>
                                                    ) : null}

                                                    {user.status === 'blocked' ? (
                                                        <button 
                                                            onClick={() => handleUserAction(user._id, 'status')} 
                                                            className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-200"
                                                        >
                                                            Débloquer
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleUserAction(user._id, 'status')} 
                                                            className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
                                                        >
                                                            Bloquer
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* TAB: ORGANIZATIONS */}
                        {activeTab === 'organizations' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {organizations.length === 0 ? (
                                    <p className="text-slate-500 col-span-full text-center">Aucune organisation trouvée.</p>
                                ) : (
                                    organizations.map((org) => (
                                        <div key={org._id} className="bg-slate-100 border border-slate-200 rounded-[32px] p-8 hover:border-slate-200 transition-all flex flex-col justify-between">
                                            <div>
                                                <div className="w-12 h-12 bg-red-500/10 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                                                    <Building2 size={24} />
                                                </div>
                                                <h3 className="font-bold text-xl mb-1">{org.name}</h3>
                                                <p className="text-xs text-slate-500 mb-6">{org.description || 'Aucune description fournie.'}</p>
                                            </div>
                                            
                                            <div className="pt-6 border-t border-slate-200">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Propriétaire</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold">
                                                        {org.owner?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold">{org.owner?.name || 'Inconnu'}</p>
                                                        <p className="text-[10px] text-slate-500">{org.owner?.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
