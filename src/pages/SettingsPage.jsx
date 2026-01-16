import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    commissionAmount: 2500,
    storesEnabled: false,
    dailySettlementTime: '23:59',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/settings`);
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('تم حفظ الإعدادات بنجاح');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('حدث خطأ في الحفظ');
      }
    } catch (error) {
      setMessage('حدث خطأ في الحفظ');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <h1 style={{ marginBottom: '24px' }}>الإعدادات</h1>

      {message && (
        <div style={{
          padding: '12px 16px',
          background: message.includes('نجاح') ? '#4caf50' : '#e53935',
          color: 'white',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          {message}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '24px' }}>إعدادات العمولة</h2>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            قيمة العمولة (ل.س)
          </label>
          <input
            type="number"
            value={settings.commissionAmount}
            onChange={e => setSettings({ ...settings, commissionAmount: parseFloat(e.target.value) || 0 })}
            style={{ width: '100%', maxWidth: '300px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            min="0"
            step="0.01"
          />
          <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
            قيمة العمولة التي تُضاف لكل طلب مكتمل
          </p>
        </div>

        <h2 style={{ marginBottom: '24px', marginTop: '32px' }}>Feature Flags</h2>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.storesEnabled}
              onChange={e => setSettings({ ...settings, storesEnabled: e.target.checked })}
              style={{ marginLeft: '12px', width: '20px', height: '20px' }}
            />
            <span style={{ fontWeight: 'bold' }}>تفعيل المتاجر (stores_enabled)</span>
          </label>
          <p style={{ marginTop: '8px', color: '#666', fontSize: '14px', marginRight: '32px' }}>
            تفعيل ميزة المتاجر في التطبيق
          </p>
        </div>

        <h2 style={{ marginBottom: '24px', marginTop: '32px' }}>إعدادات التسوية اليومية</h2>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            وقت التسوية اليومية
          </label>
          <input
            type="time"
            value={settings.dailySettlementTime}
            onChange={e => setSettings({ ...settings, dailySettlementTime: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
            الوقت الذي يتم فيه فحص المستحقات وحظر السائقين
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            background: '#FF6B35',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  );
}

