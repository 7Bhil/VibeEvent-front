import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<Navigate to="/auth" replace />} />
      {/* Add more routes here as we progress */}
    </Routes>
  );
}

export default App;
