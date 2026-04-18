import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, Globe, Apple as AppleIcon, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';


const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin 
            ? { email: formData.email, password: formData.password }
            : { ...formData, role: 'attendee' };

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                const errMsg = data.message === 'User already exists' ? 'Cet utilisateur existe déjà' :
                               data.message === 'Invalid email or password' ? 'Email ou mot de passe incorrect' :
                               data.message || 'Une erreur est survenue';
                throw new Error(errMsg);
            }

            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);

            
            // Redirection basée sur le rôle
            if (data.role === 'admin') {
                navigate('/admin');
            } else if (data.role === 'organizer') {
                navigate('/dashboard');
            } else {
                navigate('/explore');
            }

            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#030712] flex flex-col lg:flex-row font-['Inter'] selection:bg-purple-500/30">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black items-start justify-center p-20 border-r border-white/5 pt-32">
                {/* Background Party Image with Overlay */}
                <div className="absolute inset-0">
                    <img 
                        src="/assets/party-bg.png" 
                        alt="Ambiance de fête" 
                        className="w-full h-full object-cover opacity-60 scale-110 blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-xl">
                    <div className="mb-24 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20"></div>
                        <h2 className="text-white font-black text-2xl tracking-tighter">LUMINESCENT</h2>
                    </div>

                    <h1 className="text-white text-7xl font-black leading-[0.95] mb-8 tracking-tighter">
                        Rejoignez la <br />
                        <span className="italic font-light text-slate-500">nouvelle scène</span> de <br />
                        l'événementiel<span className="text-blue-500">.</span>
                    </h1>
                    
                    <p className="text-slate-400 text-lg mb-16 leading-relaxed max-w-md">
                        Vivez des expériences exclusives dans le monde réel et numérique. L'accès vous attend.
                    </p>
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-slate-950/50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="mb-14">
                        <h2 className="text-white text-4xl font-extrabold mb-3 tracking-tight">
                            {isLogin ? 'Ravi de vous revoir' : 'Créer un compte'}
                        </h2>
                        <p className="text-slate-500 text-lg">
                            {isLogin ? 'Connectez-vous pour continuer l\'aventure.' : 'Rejoignez la communauté aujourd\'hui.'}
                        </p>
                    </div>

                    {/* Login/Signup Toggle */}
                    <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-12 border border-white/5">
                        <button 
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={cn(
                                "flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                                isLogin ? "bg-slate-800 text-white shadow-xl shadow-black/40 border border-white/10" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            Connexion
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={cn(
                                "flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                                !isLogin ? "bg-slate-800 text-white shadow-xl shadow-black/40 border border-white/10" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            Inscription
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nom complet</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors pointer-events-none">
                                        <User size={20} strokeWidth={2.5} />
                                    </div>
                                    <input 
                                        name="name"
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Votre nom"
                                        className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-slate-700 focus:bg-slate-900/60 focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/5 transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        )}


                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Adresse Email</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors pointer-events-none">
                                    <Mail size={20} strokeWidth={2.5} />
                                </div>
                                <input 
                                    name="email"
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="votre@email.com"
                                    className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-slate-700 focus:bg-slate-900/60 focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/5 transition-all outline-none text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mot de passe</label>
                                {isLogin && <a href="#" className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors">Oublié ?</a>}
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors pointer-events-none">
                                    <Lock size={20} strokeWidth={2.5} />
                                </div>
                                <input 
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-5 pl-14 pr-14 text-white placeholder:text-slate-700 focus:bg-slate-900/60 focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/5 transition-all outline-none text-sm font-medium"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full bg-gradient-to-r from-purple-500 via-blue-600 to-cyan-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-500/20 hover:scale-[1.01] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:grayscale mt-4",
                                loading && "cursor-not-allowed"
                            )}
                        >
                            {loading ? 'Entrée...' : isLogin ? 'Entrer sur scène' : 'Créer le compte'}
                        </button>

                        <div className="relative flex items-center py-6">
                            <div className="flex-grow border-t border-white/5"></div>
                            <span className="flex-shrink mx-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Ou continuer avec</span>
                            <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-3 bg-slate-900/40 text-slate-300 py-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all group">
                                <Globe size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-3 bg-slate-900/40 text-slate-300 py-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all group">
                                <AppleIcon size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Apple ID</span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-16 text-center">
                        <div className="flex justify-center gap-8 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6">
                            <a href="#" className="hover:text-slate-400 transition-colors">Politique de Confidentialité</a>
                            <a href="#" className="hover:text-slate-400 transition-colors">Conditions d'Utilisation</a>
                        </div>
                        <p className="text-[9px] text-slate-700 font-bold tracking-[0.1em] uppercase">© 2024 THE LUMINESCENT STAGE. ACCÈS SÉCURISÉ.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
