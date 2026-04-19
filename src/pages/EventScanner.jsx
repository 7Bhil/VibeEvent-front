import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Scan, LogIn, LogOut, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const EventScanner = () => {
    const [scanMode, setScanMode] = useState('in'); // 'in' ou 'out'
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(handleScanSuccess, handleScanError);

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, [scanMode]); // Re-render if mode changes to keep context fresh if needed, though not strictly required

    const handleScanSuccess = async (decodedText) => {
        if (scanning) return; // Empêcher les multi-scans
        setScanning(true);
        
        // Cacher le résultat précédent
        setScanResult(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/tickets/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ qrToken: decodedText, action: scanMode })
            });

            const data = await response.json();
            
            if (response.ok) {
                setScanResult({ type: 'success', message: data.message, tier: data.ticketType });
            } else {
                setScanResult({ type: 'error', message: data.message });
            }
        } catch (error) {
            setScanResult({ type: 'error', message: 'Erreur réseau ou QR Code invalide' });
        } finally {
            // Permettre un nouveau scan après 3 secondes
            setTimeout(() => setScanning(false), 3000);
        }
    };

    const handleScanError = (err) => {
        // Ignorer les erreurs de scan continues quand aucun QR n'est en face
    };

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="mb-10 text-center">
                <Scan className="mx-auto text-red-500 mb-4" size={48} />
                <h1 className="text-4xl font-black tracking-tighter">Scanner Sécurisé</h1>
                <p className="text-slate-500 mt-2">Déchiffrement dynamique des accès.</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-2xl p-1 mb-10 max-w-md mx-auto">
                <button
                    onClick={() => setScanMode('in')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        scanMode === 'in' ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <LogIn size={16} /> Entrée
                </button>
                <button
                    onClick={() => setScanMode('out')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        scanMode === 'out' ? "bg-orange-600 text-slate-900 shadow-lg" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    <LogOut size={16} /> Sortie (Pass-out)
                </button>
            </div>

            {/* Scanner Area */}
            <div className="bg-white border-2 border-slate-200 p-4 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center">
                {/* Result Overlay */}
                {scanResult && (
                    <div className={cn(
                        "absolute inset-0 z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300",
                        scanResult.type === 'success' ? "bg-emerald-900/90 backdrop-blur-md text-emerald-400" : "bg-red-900/90 backdrop-blur-md text-red-400"
                    )}>
                        {scanResult.type === 'success' ? <CheckCircle2 size={80} className="mb-4" /> : <XCircle size={80} className="mb-4" />}
                        <h2 className="text-3xl font-black text-slate-900 text-center mb-2 px-4">{scanResult.message}</h2>
                        {scanResult.tier && <p className="text-xl font-bold uppercase py-2 px-6 border-2 border-current rounded-full">PASS {scanResult.tier}</p>}
                    </div>
                )}

                {scanning && !scanResult && (
                    <div className="absolute inset-0 z-10 bg-black/80 flex items-center justify-center">
                        <Loader2 className="text-red-500 animate-spin" size={60} />
                    </div>
                )}

                <div id="reader" className="w-full max-w-[400px] bg-black rounded-3xl overflow-hidden [&_video]:rounded-3xl [&_video]:object-cover" />
            </div>

            <div className="mt-8 text-center text-slate-500 text-sm">
                <p>Pointez le code QR roulant du participant.</p>
                <p>Mode actuel : le scan modifiera l'état à <strong>{scanMode === 'in' ? 'A L\'INTERIEUR' : 'SORTI'}</strong>.</p>
            </div>
            
            <style>{`
                /* Cacher les boutons par défaut moches de html5-qrcode */
                #reader__dashboard_section_csr button {
                    background-color: #2563eb !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 16px !important;
                    border-radius: 8px !important;
                    font-weight: bold !important;
                    cursor: pointer !important;
                }
                #reader__dashboard_section_csr select {
                    background-color: #ffffff !important;
                    color: white !important;
                    padding: 8px !important;
                    border-radius: 8px !important;
                    border: 1px solid #334155 !important;
                    margin-bottom: 10px !important;
                }
                #reader__scan_region img {
                    border-radius: 24px;
                }
            `}</style>
        </div>
    );
};

export default EventScanner;
