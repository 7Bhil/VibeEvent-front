import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Voting from './pages/Voting';
import Explore from './pages/Explore';
import EventDetail from './pages/EventDetail';
import MainLayout from './layouts/MainLayout';
import Placeholder from './pages/Placeholder';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import './App.css';




function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      
      {/* Unified Layout */}
      <Route element={<MainLayout />}>
        {/* Attendee content */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/tickets" element={<Placeholder title="Mes Billets" />} />

        {/* Organizer content */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard/events/create" element={<CreateEvent />} />



        <Route path="/dashboard/events" element={<Placeholder title="Gestion des Événements" />} />
        <Route path="/dashboard/analytics" element={<Placeholder title="Analyses & Statistiques" />} />
        <Route path="/dashboard/attendees" element={<Placeholder title="Liste des Participants" />} />
        <Route path="/dashboard/settings" element={<Placeholder title="Paramètres" />} />
      </Route>

      <Route path="/" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}


export default App;
