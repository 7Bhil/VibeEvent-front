import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Search, Bell } from 'lucide-react';

const MainLayout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{"name": "Guest"}'));

    useEffect(() => {
        const syncUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const latestUser = await response.json();
                    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

                    // If role changed (e.g. expired), update local storage and state
                    if (latestUser.role !== storedUser.role) {
                        const updatedUser = { ...storedUser, role: latestUser.role };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        setUser(updatedUser);

                        // If on a restricted route, redirect
                        if (latestUser.role === 'attendee' && (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin'))) {
                            navigate('/explore');
                        }
                    }
                } else if (response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/auth');
                }
            } catch (err) {
                console.error("Sync error:", err);
            }
        };

        syncUser();
    }, [navigate]);


    return (
        <div className="min-h-screen bg-[#030712] text-white font-['Inter'] selection:bg-blue-500/30 flex">
            <Sidebar user={user} />
            
            <div className="pl-72 flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#030712]/80 backdrop-blur-xl z-20 w-full">
                    <div className="relative group w-96 hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Rechercher des événements ou analyses..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-white"
                        />
                    </div>

                    <div className="flex items-center gap-6 ml-auto">
                        <div className="relative">
                            <Bell className="text-slate-500 hover:text-white transition-colors cursor-pointer" size={20} />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#030712]"></div>
                        </div>
                        <div 
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 p-0.5 overflow-hidden cursor-pointer hover:scale-105 transition-transform shrink-0"
                        >
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="profile" className="w-full h-full object-cover" />
                        </div>
                    </div>

                </header>

                <main className="flex-1 w-full overflow-x-hidden">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
