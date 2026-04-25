import React from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    BarChart3, 
    Users, 
    Plus, 
    LogOut,
    Eye,
    Vote,
    Ticket,
    Scan,
    Settings,
    User as UserIcon
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ShieldAlert } from 'lucide-react';

const Sidebar = ({ user, isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const publicMenuItems = [
        { icon: Eye, label: 'Explorer', path: '/explore' },
        { icon: Vote, label: 'Votes Live', path: '/voting' },
        { icon: Ticket, label: 'Mes Billets', path: '/tickets' },
    ];

    const organizerMenuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', plan: ['events_only', 'premium'] },
        { icon: Scan, label: 'Scanner', path: '/dashboard/scanner', plan: ['events_only', 'premium'] },
        { icon: Calendar, label: 'Événements', path: '/dashboard/events', plan: ['events_only', 'premium'] },
        { icon: Vote, label: 'Sondages', path: '/dashboard/voting', plan: ['polls_only', 'premium'] },
        { icon: BarChart3, label: 'Analyses', path: '/dashboard/analytics', plan: ['events_only', 'polls_only', 'premium'] },
        { icon: Users, label: 'Participants', path: '/dashboard/attendees', plan: ['events_only', 'premium'] },
        { icon: UserIcon, label: 'Mon Profil', path: '/profile' },
    ];

    const filteredOrganizerItems = organizerMenuItems.filter(item => {
        if (!item.plan) return true;
        // Admins see everything
        if (user.role === 'admin') return true;
        // Check if the user plan provides access to this item
        return item.plan.includes(user.plan || 'none');
    });

    const handleCreateClick = () => {
        if (user.plan === 'polls_only') {
            navigate('/dashboard/voting');
        } else {
            navigate('/dashboard/events/create');
        }
    };

    const adminMenuItems = [
        { icon: ShieldAlert, label: 'Admin Terminal', path: '/admin' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/auth');
    };

    return (
        <aside className={cn(
            "w-72 h-screen bg-slate-50 border-r border-slate-200 flex flex-col fixed left-0 top-0 z-[60] overflow-y-auto custom-scrollbar transition-transform duration-300 lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Mobile close overlay */}
            <div 
                className={cn(
                    "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[-1] lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/explore')}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-red-500 shadow-lg shadow-red-500/20"></div>
                    <h2 className="text-slate-900 font-black text-xl tracking-tighter uppercase italic">Evenflow</h2>

                </div>

                <div className="mb-8">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Participant</p>
                    <nav className="space-y-1">
                        {publicMenuItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={cn(
                                    "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                    location.pathname.startsWith(item.path)
                                        ? "bg-slate-100 text-red-600" 
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                )}
                            >
                                <item.icon size={18} strokeWidth={location.pathname.startsWith(item.path) ? 2.5 : 2} />
                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                
                {(user.role === 'organizer' || user.role === 'admin') && (
                    <>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8"></div>

                        <div className="mb-8">
                            <div className="flex items-center justify-between px-2 mb-4">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Organisateur</p>
                            </div>
                            
                            <button 
                                onClick={handleCreateClick}
                                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:to-red-600 text-slate-900 font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-2xl shadow-red-500/20 transition-all active:scale-95 mb-6 text-[10px] uppercase tracking-[0.2em]"
                            >
                                <Plus size={16} strokeWidth={3} />
                                Créer
                            </button>


                            <nav className="space-y-1">
                                {filteredOrganizerItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={cn(
                                            "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                            location.pathname === item.path 
                                                ? "bg-slate-100 text-red-600" 
                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        )}
                                    >
                                        <item.icon size={18} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </>
                )}

                {user.role === 'admin' && (
                    <>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8"></div>

                        <div>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Plateforme</p>
                            <nav className="space-y-1">
                                {adminMenuItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={cn(
                                            "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                            location.pathname === item.path 
                                                ? "bg-slate-100 text-emerald-400" 
                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        )}
                                    >
                                        <item.icon size={18} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </>
                )}

            </div>

            <div className="mt-auto p-8 pt-4">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold tracking-tight">Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
