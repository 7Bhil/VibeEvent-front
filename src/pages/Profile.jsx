import React, { useState } from 'react';
import { User, Mail, Shield, Building, ArrowUpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [requestSent, setRequestSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleRequestUpgrade = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/upgrade-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: "Demande de passage au statut Organisateur." })
            });

            if (response.ok) {
                setRequestSent(true);
            } else {
                const data = await response.json();
                setError(data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            setError("Impossible de contacter le serveur.");
        } finally {
            setLoading(false);
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
                                <p className="text-sm font-bold text-slate-200">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                <Shield size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Statut Compte</p>
                                <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
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
                                    <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
                                        <AlertCircle className="mx-auto text-red-600 mb-4" size={32} />
                                        <h4 className="font-bold mb-2">Devenir un créateur</h4>
                                        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                                            Pour organiser vos propres événements et créer une organisation, vous devez d'abord obtenir le statut Organisateur.
                                        </p>
                                        
                                        {!requestSent ? (
                                            <button 
                                                onClick={handleRequestUpgrade}
                                                className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 transition-all flex items-center gap-3 mx-auto"
                                            >
                                                <ArrowUpCircle size={18} /> Envoyer ma demande
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-emerald-400">
                                                <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                                                    <CheckCircle2 size={20} /> Demande envoyée
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-bold italic">L'administrateur étudie votre demande.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button className="bg-slate-100 text-slate-900 py-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-all">
                                        Créer mon organisation
                                    </button>
                                )}
                            </div>
                        )}
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
        </div>
    );
};

export default Profile;
