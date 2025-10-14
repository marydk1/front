import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import UserHome from './components/UserHome';
import AdminDashboard from './components/AdminDashboard';
import ProductPage from './components/ProductPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, [token]);

  const handleLogin = (t, r) => {
    setToken(t);
    setRole(r);
    localStorage.setItem('role', r);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        {!token && <Route path="*" element={<LoginRegister onLogin={handleLogin} />} />}
        {token && role === 'admin' && (
          <Route path="*" element={<AdminDashboard token={token} onLogout={logout} />} />
        )}
        {token && role !== 'admin' && (
          <>
            <Route path="/" element={<UserHome token={token} onLogout={logout} />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="*" element={<UserHome token={token} onLogout={logout} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
