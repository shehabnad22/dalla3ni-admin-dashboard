import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import DriversPage from './pages/DriversPage';
import InvoicesPage from './pages/InvoicesPage';
import DisputesPage from './pages/DisputesPage';
import SettlementsPage from './pages/SettlementsPage';
import RatingsPage from './pages/RatingsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';
import { isAuthenticated } from './auth/auth';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAuthenticated(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'orders': return <OrdersPage />;
      case 'drivers': return <DriversPage />;
      case 'invoices': return <InvoicesPage />;
      case 'disputes': return <DisputesPage />;
      case 'settlements': return <SettlementsPage />;
      case 'ratings': return <RatingsPage />;
      case 'audit': return <AuditLogsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  if (!authenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} user={user} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

