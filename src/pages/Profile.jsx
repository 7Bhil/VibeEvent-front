import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Building, ArrowUpCircle, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const Profile = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');

    const handleCreateOrganization = async () => {
        if (!newOrgName) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/organizations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newOrgName })
            });

            if (response.ok) {
                showToast("Organisation créée avec succès !", "success");
                window.location.reload(); 
            } else {
                const data = await response.json();
                showToast(data.message || "Erreur lors de la création.", "error");
            }
        } catch (err) {
            showToast("Erreur de connexion.", "error");
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };


    return (
        <div className="p-10 max-w-5xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter mb-2">Mon Profil</h1>
                <p className="text-slate-500 font-medium">Gérez votre identité et vos accès sur Evenflow.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left - Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-red-600 to-red-500 mx-auto mb-6 flex items-center justify-center text-3xl font-black shadow-2xl shadow-red-500/20 relative z-10">
                            {user.name?.charAt(0)}
                        </div>
                        
                        <h3 className="text-xl font-bold tracking-tight mb-1 relative z-10">{user.name}</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6 relative z-10">{user.role}</p>
                        
                        <div className="flex justify-center gap-2 relative z-10">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                user.role === 'admin' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                user.role === 'organizer' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            )}>
                                {user.role === 'admin' ? 'Administrateur' : user.role === 'organizer' ? 'Organisateur' : 'Participant'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Email</p>
                                <p className="text-sm font-bold text-slate-900">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                <Shield size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Statut Compte</p>
                                <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                    Vérifié <CheckCircle2 size={12} />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Organization Section */}
                    <section className="bg-slate-100 border border-slate-200 rounded-[40px] p-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Building className="text-red-500" size={24} />
                            <h2 className="text-2xl font-black tracking-tight">Organisation</h2>
                        </div>

                        {user.organization ? (
                            <div className="flex items-center justify-between p-6 bg-slate-100 rounded-2xl border border-slate-200">
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{user.organization.name || "Ma Structure"}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Membre actif</p>
                                </div>
                                <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Quitter</button>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-500 mb-6 font-medium">Vous n'appartenez à aucune organisation pour le moment.</p>
                                {user.role === 'attendee' ? (
                                    <div className="bg-red-50 border border-red-100 rounded-3xl p-8">
                                        <AlertCircle className="mx-auto text-red-600 mb-4" size={32} />
                                        <h4 className="font-bold mb-2">Devenir un créateur</h4>
                                        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                                            Choisissez le forfait qui vous correspond (Événements ou Sondages) pour commencer à créer.
                                        </p>
                                        
                                        <button 
                                            onClick={() => navigate('/upgrade')}
                                            className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 transition-all flex items-center justify-center mx-auto"
                                        >
                                            Voir les Forfaits
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        disabled={loading}
                                        className="bg-slate-900 text-white py-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                                    >
                                        {loading ? "Chargement..." : "Créer mon organisation"}
                                    </button>
                                )}
                            </div>
                        )}
                    </section>
                    
                    {/* Subscription Section */}
                    <section className="bg-white border-2 border-slate-200 rounded-[40px] p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 -mr-20 -mt-20 rounded-full blur-[80px]"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                        <ArrowUpCircle size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Mon Abonnement</h2>
                                </div>
                                <span className={cn(
                                    "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border",
                                    user.plan && user.plan !== 'none' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-100 text-slate-400 border-slate-200"
                                )}>
                                    {user.plan === 'premium' ? 'Suite Complète' : user.plan === 'events_only' ? 'Événements' : user.plan === 'polls_only' ? 'Sondages' : 'Aucun'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50/50 p-8 rounded-[32px] border border-slate-200/60">
                                <div>
                                    <h4 className="text-lg font-black mb-2">
                                        {user.plan === 'premium' ? 'Plan Gold Illimité' : user.plan === 'none' ? 'Pass Gratuit' : `Pack ${user.plan === 'events_only' ? 'Organisateur' : 'Community'}`}
                                    </h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                                        {user.plan === 'polls_only' ? "Vous avez accès aux sondages mais pas encore à la création d'événements." : 
                                         user.plan === 'events_only' ? "Vous pouvez créer des événements mais n'avez pas accès aux sondages." :
                                         user.plan === 'premium' ? "Vous avez l'accès total à toutes les fonctionnalités." :
                                         "Passez au statut organisateur pour commencer à vendre des billets."}
                                    </p>
                                    {user.roleExpiresAt && (
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Expire le : {new Date(user.roleExpiresAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => navigate('/upgrade')}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-8 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {user.plan && user.plan !== 'none' ? 'Changer de forfait' : 'Améliorer mon compte'}
                                        <ArrowUpCircle size={16} />
                                    </button>
                                    <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">Facturation mensuelle sans engagement</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Preferences / Security Section Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-8 opacity-40">
                            <h4 className="font-bold mb-2">Sécurité</h4>
                            <p className="text-xs text-slate-500 mb-6 font-medium">Changez votre mot de passe et activez la 2FA.</p>
                            <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="bg-slate-100 border border-slate-200 rounded-[32px] p-8 opacity-40">
                            <h4 className="font-bold mb-2">Paiements</h4>
                            <p className="text-xs text-slate-500 mb-6 font-medium">Gérez vos méthodes de paiement et factures.</p>
                            <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Nouvelle Organisation"
                footer={(
                    <button 
                        onClick={handleCreateOrganization}
                        disabled={loading || !newOrgName}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
                    >
                        {loading ? "Création..." : "Confirmer la création"}
                    </button>
                )}
            >
                <div className="space-y-4">
                    <p className="text-slate-500 text-sm font-medium">Donnez un nom unique à votre structure pour commencer à organiser des événements.</p>
                    <input 
                        type="text" 
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        placeholder="Ex: Visionary Events"
                        className="w-full bg-slate-100 border border-transparent rounded-2xl py-4 px-6 outline-none focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 transition-all text-sm font-bold"
                        autoFocus
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
