import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket as TicketIcon, Clock, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

const TicketWallet = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [qrToken, setQrToken] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/tickets/my-tickets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) setTickets(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    // Fetch dynamic QR Token
    useEffect(() => {
        if (!selectedTicket) return;

        let isSubscribed = true;

        const generateQR = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/tickets/${selectedTicket._id}/qr`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok && isSubscribed) {
                    setQrToken(data.qrToken);
                    setTimeLeft(60); // Reset timer 
                }
            } catch (err) {
                console.error(err);
            }
        };

        generateQR(); // Init
        const qrInterval = setInterval(generateQR, 55000); // Rafraichissement toutes les 55s
        
        const tickInterval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            isSubscribed = false;
            clearInterval(qrInterval);
            clearInterval(tickInterval);
        };
    }, [selectedTicket]);

    if (loading) return <div className="p-10 flex justify-center text-blue-500"><RefreshCw className="animate-spin" size={40} /></div>;

    return (
        <div className="p-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
            {/* Liste des billets */}
            <div className="flex-1">
                <div className="mb-10">
                    <h1 className="text-4xl font-black flex items-center gap-3">
                        <TicketIcon className="text-purple-500" size={36} /> Mon Portefeuille
                    </h1>
                    <p className="text-slate-500 font-medium">Retrouvez tous vos billets d'accès ici.</p>
                </div>

                {tickets.length === 0 ? (
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-16 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                        Aucun billet pour le moment.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map(ticket => (
                            <div 
                                key={ticket._id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={cn(
                                    "bg-white/5 border border-white/5 rounded-[32px] p-6 flex flex-col md:flex-row gap-6 cursor-pointer hover:border-purple-500/50 transition-all",
                                    selectedTicket?._id === ticket._id ? "border-purple-500/50 shadow-lg shadow-purple-500/10" : ""
                                )}
                            >
                                <div className="w-24 h-24 rounded-2xl bg-black overflow-hidden shrink-0 hidden sm:block">
                                    {ticket.event?.image && <img src={ticket.event.image} alt="Event" className="w-full h-full object-cover opacity-80" />}
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold">{ticket.event?.title || 'Événement inconnu'}</h3>
                                    <div className="text-slate-400 text-sm mt-1 flex items-center gap-4">
                                        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(ticket.event?.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-3 inline-block">
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                                            ticket.tier === 'VVIP' ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : 
                                            ticket.tier === 'VIP' ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                                            "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                        )}>
                                            Pass {ticket.tier}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider",
                                        ticket.status === 'checked_in' ? "bg-emerald-500/10 text-emerald-500" :
                                        ticket.status === 'checked_out' ? "bg-orange-500/10 text-orange-500" : "bg-slate-800 text-slate-400"
                                    )}>
                                        {ticket.status === 'checked_in' ? 'À l\'intérieur' : ticket.status === 'checked_out' ? 'Sorti' : 'Valide'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Zone QR Code Dynamique */}
            {selectedTicket && (
                <div className="w-full lg:w-[400px] shrink-0">
                    <div className="sticky top-28 bg-[#161b2c] border border-white/5 rounded-[40px] p-8 text-center shadow-2xl flex flex-col items-center">
                        <div className="w-full mb-6">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full",
                                selectedTicket.status === 'checked_in' ? "bg-emerald-500 text-black" : "bg-white/10 text-white"
                            )}>
                                {selectedTicket.tier} - {selectedTicket.status === 'checked_in' ? 'Actuellement Dedans' : 'Prêt à entrer'}
                            </span>
                        </div>

                        {/* QR Code Container */}
                        <div className="bg-white p-4 rounded-3xl mx-auto w-64 h-64 flex items-center justify-center relative overflow-hidden">
                            {qrToken ? (
                                <QRCodeSVG 
                                    value={qrToken} 
                                    size={220} 
                                    level="H"
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                />
                            ) : (
                                <RefreshCw className="animate-spin text-slate-300" size={40} />
                            )}
                            
                            {/* Scanning Effect Overlay */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_bg-blue-500] animate-[scan_2s_ease-in-out_infinite]" />
                        </div>

                        <div className="mt-8 space-y-2">
                            <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                                <AlertCircle size={16} className="text-blue-500" />
                                Code anti-fraude sécurisé
                            </p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                Actualisation dans <RefreshCw size={12} className={timeLeft < 10 ? "animate-spin text-red-500" : ""} /> {timeLeft}s
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
            `}</style>
        </div>
    );
};

export default TicketWallet;
