import React, { useState, useEffect } from 'react';
import { API_URL, BASE_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, [filter]);

  const fetchDrivers = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/drivers`);
      const data = await res.json();
      if (data.success) {
        setDrivers(data.drivers || []);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const getStatusBadge = (driver) => {
    if (!driver.isApproved || driver.accountStatus === 'PENDING_REVIEW') {
      return <span className="badge badge-warning">بانتظار الموافقة</span>;
    }
    if (driver.isBlocked) return <span className="badge badge-danger">محظور</span>;
    if (driver.isAvailable) return <span className="badge badge-success">متصل</span>;
    return <span className="badge badge-info">غير متصل</span>;
  };

  const handleApprove = async (driverId) => {
    if (!window.confirm('هل تريد الموافقة على هذا السائق؟')) return;
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/drivers/${driverId}/approve`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        alert('تمت الموافقة بنجاح');
        fetchDrivers();
      } else {
        alert(data.message || 'حدث خطأ');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleBlock = async (driverId) => {
    if (!window.confirm('هل تريد حظر هذا السائق؟')) return;
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/drivers/${driverId}/block`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'حظر يدوي من الإدارة' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم الحظر بنجاح');
        fetchDrivers();
      } else {
        alert(data.message || 'حدث خطأ');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleUnblock = async (driverId) => {
    if (!window.confirm('هل تريد رفع الحظر عن هذا السائق؟')) return;
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/drivers/${driverId}/unblock`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم رفع الحظر بنجاح');
        fetchDrivers();
      } else {
        alert(data.message || 'حدث خطأ');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const filteredDrivers = drivers.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'online') return d.isAvailable;
    if (filter === 'blocked') return d.isBlocked;
    if (filter === 'pending') return !d.isApproved || d.accountStatus === 'PENDING_REVIEW';
    return true;
  });

  return (
    <div>
      <h1 className="page-title">السائقين</h1>

      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">جميع السائقين</option>
          <option value="online">متصلين</option>
          <option value="blocked">محظورين</option>
          <option value="pending">بانتظار الموافقة</option>
        </select>
        <input type="text" placeholder="بحث بالاسم أو الهاتف..." />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>السائق</th>
              <th>رقم اللوحة</th>
              <th>التقييم</th>
              <th>التوصيلات</th>
              <th>المستحقات</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map(driver => (
              <tr key={driver.id}>
                <td>
                  <div className="flex">
                    <div className="avatar">{(driver.User?.name || 'س')[0]}</div>
                    <div>
                      <div>{driver.User?.name || '-'}</div>
                      <div className="text-muted">{driver.User?.phone || '-'}</div>
                    </div>
                  </div>
                </td>
                <td>{driver.plateNumber || '-'}</td>
                <td>⭐ {parseFloat(driver.rating || 0).toFixed(1)}</td>
                <td>{driver.totalDeliveries || 0}</td>
                <td style={{ color: parseFloat(driver.pendingSettlement || 0) > 0 ? '#e53935' : '#333' }}>
                  {parseFloat(driver.pendingSettlement || 0).toFixed(2)} د
                </td>
                <td>{getStatusBadge(driver)}</td>
                <td>
                  {(!driver.isApproved || driver.accountStatus === 'PENDING_REVIEW') && (
                    <button className="btn btn-sm btn-success" onClick={() => handleApprove(driver.id)}>
                      موافقة
                    </button>
                  )}
                  {!driver.isBlocked && driver.isApproved && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleBlock(driver.id)}>
                      حظر
                    </button>
                  )}
                  {driver.isBlocked && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleUnblock(driver.id)}>
                      رفع الحظر
                    </button>
                  )}
                  <button className="btn btn-sm" style={{ marginRight: 8 }} onClick={() => setSelectedDriver(driver)}>عرض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>تفاصيل السائق</h2>
              <button className="modal-close" onClick={() => setSelectedDriver(null)}>&times;</button>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">الاسم الكامل</span>
                <span className="detail-value">{selectedDriver.User?.name || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">رقم الهاتف</span>
                <span className="detail-value">{selectedDriver.User?.phone || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">رقم اللوحة</span>
                <span className="detail-value">{selectedDriver.plateNumber || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">موديل الدراجة</span>
                <span className="detail-value">{selectedDriver.bikeModel || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ساعات العمل</span>
                <span className="detail-value">
                  {selectedDriver.workStartTime || '-'} إلى {selectedDriver.workEndTime || '-'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">الحالة</span>
                <span className="detail-value">{getStatusBadge(selectedDriver)}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">مناطق العمل</span>
              <div className="working-areas">
                {(Array.isArray(selectedDriver.workingAreas) ? selectedDriver.workingAreas : []).map((area, i) => (
                  <span key={i} className="area-tag">{area}</span>
                ))}
                {(!selectedDriver.workingAreas || selectedDriver.workingAreas.length === 0) && <span>-</span>}
              </div>
            </div>

            <div className="image-preview-group">
              <div className="image-card">
                {selectedDriver.idImage ? (
                  <img src={selectedDriver.idImage.startsWith('http') ? selectedDriver.idImage : `${BASE_URL}/${selectedDriver.idImage}`} alt="ID" />
                ) : (
                  <div style={{ height: 150, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>لا توجد صورة</div>
                )}
                <div className="image-label">صورة الهوية</div>
              </div>
              <div className="image-card">
                {selectedDriver.motorImage ? (
                  <img src={selectedDriver.motorImage.startsWith('http') ? selectedDriver.motorImage : `${BASE_URL}/${selectedDriver.motorImage}`} alt="Bike" />
                ) : (
                  <div style={{ height: 150, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>لا توجد صورة</div>
                )}
                <div className="image-label">صورة الدراجة</div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setSelectedDriver(null)}>إغلاق</button>
              {(!selectedDriver.isApproved || selectedDriver.accountStatus === 'PENDING_REVIEW') && (
                <button className="btn btn-success" onClick={() => { handleApprove(selectedDriver.id); setSelectedDriver(null); }}>
                  موافقة على الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

