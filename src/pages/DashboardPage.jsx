import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/stats`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="page-title">لوحة التحكم</h1>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">إجمالي الطلبات</div>
          <div className="stat-value">{stats.totalOrders || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">طلبات معلقة</div>
          <div className="stat-value">{stats.pendingOrders || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">السائقين النشطين</div>
          <div className="stat-value">{stats.activeDrivers || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">سائقين محظورين</div>
          <div className="stat-value" style={{ color: '#e53935' }}>{stats.blockedDrivers || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">إجمالي السائقين</div>
          <div className="stat-value">{stats.totalDrivers || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">مستحقات معلقة</div>
          <div className="stat-value">{stats.totalPendingSettlement?.toFixed(2) || '0.00'} د</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">نظرة سريعة</h3>
        <p style={{ color: '#666' }}>
          مرحباً بك في لوحة تحكم دلّعني. يمكنك إدارة الطلبات، السائقين، الفواتير، والتسويات من هنا.
        </p>
      </div>
    </div>
  );
}

