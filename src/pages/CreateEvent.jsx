import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, DollarSign, Users, Image as ImageIcon, Sparkles, Loader2, CheckCircle2, Ticket, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Nouveaux champs pour les tickets, la devise et maps
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        googleMapsLink: '',
        category: 'Nightlife',
        currency: 'EUR',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80',
        tickets: {
            Normal: { enabled: true, price: 0, limit: '', unlimited: true },
            VIP: { enabled: false, price: 0, limit: '', unlimited: true },
            VVIP: { enabled: false, price: 0, limit: '', unlimited: true }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTicketChange = (tier, field, value) => {
        setFormData(prev => ({
            ...prev,
            tickets: {
                ...prev.tickets,
                [tier]: {
                    ...prev.tickets[tier],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Formater les tickets pour l'API
        const formattedTickets = Object.keys(formData.tickets)
            .filter(tier => formData.tickets[tier].enabled)
            .map(tier => ({
                tier,
                price: Number(formData.tickets[tier].price),
                limit: formData.tickets[tier].unlimited ? null : Number(formData.tickets[tier].limit)
            }));

        if (formattedTickets.length === 0) {
            alert("Vous devez activer au moins un type de billet.");
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            tickets: formattedTickets
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/dashboard/events'), 2000);
            } else {
                const data = await response.json();
                alert(data.message || 'Erreur lors de la création');
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black mb-2">Événement créé !</h2>
                <p className="text-slate-500">Votre événement est maintenant en ligne. Redirection...</p>
            </div>
        );
    }

    return (
        <div className="p-10 max-w-5xl mx-auto">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-red-500" size={32} />
                    <h1 className="text-4xl font-black tracking-tighter">Créer un événement</h1>
                </div>
                <p className="text-slate-500 font-medium text-lg italic">Configurez les accès, les tarifs et les détails.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 pb-20">
                {/* General Info */}
                <section className="bg-slate-100 border border-slate-200 rounded-[40px] p-10 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Titre de l'événement</label>
                        <input 
                            name="title"
                            type="text" 
                            required
                            placeholder="Ex: Soirée Cyberpunk 2077"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 text-xl font-bold placeholder:text-slate-700 focus:border-red-500/30 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                            name="description"
                            rows="4"
                            required
                            placeholder="Détaillez le programme..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 text-sm font-medium placeholder:text-slate-700 focus:border-red-500/30 outline-none transition-all resize-none"
                        ></textarea>
                    </div>
                </section>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900">
                    <div className="bg-slate-100 border border-slate-200 rounded-[40px] p-10 space-y-8 flex flex-col justify-between">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar size={14} /> Date et Heure
                            </label>
                            <input 
                                name="date"
                                type="datetime-local" 
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 focus:border-red-500/30 outline-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={14} /> Catégorie
                            </label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 focus:border-red-500/30 outline-none appearance-none"
                            >
                                <option value="Nightlife">Nightlife</option>
                                <option value="Concert">Concert</option>
                                <option value="Festival">Festival</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Sport">Sport</option>
                                <option value="Other">Autre</option>
                            </select>
                        </div>
                    </div>

                    {/* Localisation */}
                    <div className="bg-slate-100 border border-slate-200 rounded-[40px] p-10 space-y-8 flex flex-col justify-between">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <MapPin size={14} /> Adresse (Ville, Pays)
                            </label>
                            <input 
                                name="location"
                                type="text"
                                required
                                placeholder="Paris, France"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 focus:border-red-500/30 outline-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Globe size={14} /> Lien Google Maps (Optionnel)
                            </label>
                            <input 
                                name="googleMapsLink"
                                type="url"
                                placeholder="https://maps.google.com/..."
                                value={formData.googleMapsLink}
                                onChange={handleChange}
                                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 focus:border-red-500/30 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 🎟️ TICKET MANAGEMENT 🎟️ */}
                <section className="bg-slate-100 border border-slate-200 rounded-[40px] p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Ticket className="text-red-500" size={24} />
                            <h2 className="text-xl font-black">Billetterie & Tarifs</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Devise globale</label>
                            <select 
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="bg-slate-200 border border-slate-200 rounded-xl py-2 px-4 focus:border-red-500/50 outline-none text-sm font-bold"
                            >
                                <option value="EUR">Euro (€)</option>
                                <option value="USD">Dollar ($)</option>
                                <option value="XOF">FCFA (XOF)</option>
                                <option value="GBP">Livre (£)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {['Normal', 'VIP', 'VVIP'].map((tier) => (
                            <div key={tier} className={cn(
                                "border rounded-2xl p-6 transition-all",
                                formData.tickets[tier].enabled ? "bg-slate-50 border-red-500/30 shadow-lg shadow-red-500/5" : "bg-slate-100 border-slate-200 opacity-60 hover:opacity-100"
                            )}>
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Enable toggle */}
                                    <div className="flex items-center gap-4 w-40">
                                        <input 
                                            type="checkbox" 
                                            id={`enable-${tier}`}
                                            checked={formData.tickets[tier].enabled}
                                            onChange={(e) => handleTicketChange(tier, 'enabled', e.target.checked)}
                                            className="w-5 h-5 accent-red-500 cursor-pointer"
                                        />
                                        <label htmlFor={`enable-${tier}`} className="font-black text-lg cursor-pointer">{tier}</label>
                                    </div>

                                    {/* Config fields (only if enabled) */}
                                    {formData.tickets[tier].enabled && (
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Prix ({formData.currency})</label>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    value={formData.tickets[tier].price}
                                                    onChange={(e) => handleTicketChange(tier, 'price', e.target.value)}
                                                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-red-500/50"
                                                />
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantité Max</label>
                                                    <label className="flex items-center gap-2 text-[10px] text-slate-500 cursor-pointer">
                                                        <input 
                                                            type="checkbox"
                                                            checked={formData.tickets[tier].unlimited}
                                                            onChange={(e) => handleTicketChange(tier, 'unlimited', e.target.checked)}
                                                            className="accent-red-500"
                                                        /> Illimité
                                                    </label>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    disabled={formData.tickets[tier].unlimited}
                                                    value={formData.tickets[tier].unlimited ? '' : formData.tickets[tier].limit}
                                                    onChange={(e) => handleTicketChange(tier, 'limit', e.target.value)}
                                                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    placeholder={formData.tickets[tier].unlimited ? "∞" : "Ex: 100"}
                                                    required={!formData.tickets[tier].unlimited}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Media Section */}
                <section className="bg-slate-100 border border-slate-200 rounded-[40px] p-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <ImageIcon size={14} /> URL de l'image de couverture
                        </label>
                        <input 
                            name="image"
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 focus:border-red-500/30 outline-none text-sm"
                        />
                        <div className="mt-4 aspect-video rounded-3xl overflow-hidden border border-slate-200 bg-black/20">
                            {formData.image && <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-60" />}
                        </div>
                    </div>
                </section>

                <div className="flex pt-6">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-600 hover:from-red-500 hover:to-red-500 text-slate-900 font-black py-6 rounded-[32px] text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-red-500/20 transition-all active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Publier l'événement maintenant"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
