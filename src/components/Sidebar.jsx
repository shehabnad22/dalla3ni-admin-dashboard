import React from 'react';
import './Sidebar.css';

const menuItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: 'fas fa-chart-line' },
  { id: 'orders', label: 'الطلبات', icon: 'fas fa-box' },
  { id: 'customers', label: 'الزبائن', icon: 'fas fa-users' },
  { id: 'drivers', label: 'السائقين', icon: 'fas fa-motorcycle' },
  { id: 'invoices', label: 'الفواتير', icon: 'fas fa-file-invoice-dollar' },
  { id: 'disputes', label: 'النزاعات', icon: 'fas fa-exclamation-triangle' },
  { id: 'settlements', label: 'التسويات', icon: 'fas fa-money-bill-wave' },
  { id: 'ratings', label: 'التقييمات', icon: 'fas fa-star' },
  { id: 'audit', label: 'سجل العمليات', icon: 'fas fa-clipboard-list' },
  { id: 'settings', label: 'الإعدادات', icon: 'fas fa-cog' },
];

export default function Sidebar({ currentPage, onPageChange, user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-motorcycle"></i>
        </div>
        <h1>دلّعني</h1>
        <span className="subtitle">لوحة الإدارة</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <i className={`nav-icon ${item.icon}`}></i>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">م</div>
          <div>
            <div className="admin-name">{user?.name || 'المدير'}</div>
            <div className="admin-role">مدير النظام</div>
          </div>
        </div>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('admin_token');
            window.location.reload();
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

