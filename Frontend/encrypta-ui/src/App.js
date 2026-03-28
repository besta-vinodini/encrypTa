import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }) {
  const userId = localStorage.getItem('userId');
  return userId ? children : <Navigate to="/" replace />;
}

export default function App() {
  // Mouse spotlight effect
  useEffect(() => {
    const onMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(14,10,30,0.95)',
            color: '#ede9ff',
            border: '1px solid rgba(139,92,246,0.3)',
            backdropFilter: 'blur(20px)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.15)',
          },
          success: { iconTheme: { primary: '#a855f7', secondary: '#ede9ff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#ede9ff' } },
        }}
      />
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
