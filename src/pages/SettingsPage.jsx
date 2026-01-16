import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    commissionAmount: 1.5,
    storesEnabled: false,
    pointsEnabled: false,
    pointsPerOrder: 10,
    pointsForFreeOrder: 100,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/settings`);
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('فشل تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await authenticatedFetch(`${API_URL}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('تم تحديث الإعدادات بنجاح');
      } else {
        setError(data.message || 'فشل التحديث');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('فشل الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-5">جاري التحميل...</div>;

  return (
    <div className="container-fluid p-4">
      <h1 className="page-title mb-4">إعدادات النظام</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-white font-weight-bold">
                <i className="fas fa-cogs ml-2"></i> إعدادات عامة
              </div>
              <div className="card-body">
                <div className="form-group mb-3">
                  <label>قيمة العمولة (ل.س)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="commissionAmount"
                    value={settings.commissionAmount}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <small className="text-muted">المبلغ المقتطع من السائق عن كل طلب</small>
                </div>

                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    name="storesEnabled"
                    checked={settings.storesEnabled}
                    onChange={handleChange}
                    className="form-check-input"
                    id="storesCheck"
                  />
                  <label className="form-check-label" htmlFor="storesCheck">
                    تفعيل نظام المتاجر
                  </label>
                </div>
              </div>
            </div>

            {/* Points System Settings */}
            <div className="card mb-4 shadow-sm" style={{ borderLeft: '4px solid #FF6B35' }}>
              <div className="card-header bg-white font-weight-bold text-orange">
                <i className="fas fa-gift ml-2"></i> نظام النقاط والمكافآت
              </div>
              <div className="card-body">
                <div className="form-group form-check mb-4">
                  <input
                    type="checkbox"
                    name="pointsEnabled"
                    checked={settings.pointsEnabled}
                    onChange={handleChange}
                    className="form-check-input"
                    id="pointsCheck"
                  />
                  <label className="form-check-label font-weight-bold" htmlFor="pointsCheck">
                    تفعيل نظام النقاط
                  </label>
                  <small className="d-block text-muted">عند التفعيل، سيكسب الزبائن نقاطاً ويمكنهم استخدامها لطلبات مجانية.</small>
                </div>

                {settings.pointsEnabled && (
                  <div className="pl-4 border-right border-secondary">
                    <div className="form-group mb-3">
                      <label>نقاط مكتسبة لكل طلب</label>
                      <input
                        type="number"
                        name="pointsPerOrder"
                        value={settings.pointsPerOrder}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <small className="text-muted">عدد النقاط التي يكسبها الزبون عند إكمال طلب</small>
                    </div>

                    <div className="form-group mb-3">
                      <label>تكلفة الطلب المجاني (نقاط)</label>
                      <input
                        type="number"
                        name="pointsForFreeOrder"
                        value={settings.pointsForFreeOrder}
                        onChange={handleChange}
                        className="form-control"
                      />
                      <small className="text-muted">عدد النقاط المطلوبة للحصول على طلب مجاني</small>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg px-5"
              disabled={saving}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
