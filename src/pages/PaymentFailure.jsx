import React from 'react';
import { XCircle, ArrowLeft, Ticket, RefreshCw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const reason = searchParams.get('reason') || 'Paiement non finalisé';
    const eventId = searchParams.get('eventId');
    const summary = searchParams.get('summary');

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.10),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-[40px] border border-slate-200/80 bg-white p-6 text-center shadow-[0_24px_90px_-50px_rgba(15,23,42,0.4)] sm:p-10 lg:p-14">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                    <XCircle size={44} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Paiement interrompu</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                    Le paiement n'a pas abouti.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                    {reason}
                </p>

                <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Billet</p>
                        <p className="mt-2 text-sm font-bold text-slate-900">{summary || 'Pass sélectionné'}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Action</p>
                        <p className="mt-2 text-sm font-bold text-slate-900">Vous pouvez réessayer en toute sécurité</p>
                    </div>
                </div>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                    <button
                        onClick={() => navigate(eventId ? `/event/${eventId}` : '/explore')}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-slate-800"
                    >
                        <RefreshCw size={16} />
                        Réessayer
                    </button>
                    <button
                        onClick={() => navigate('/explore')}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-700 transition-all hover:border-slate-300"
                    >
                        <ArrowLeft size={16} />
                        Retour à l'exploration
                    </button>
                </div>

                <button
                    onClick={() => navigate('/tickets')}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-600 hover:underline"
                >
                    <Ticket size={14} />
                    Vérifier mes billets
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;
