import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState('all');

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
                  <button className="btn btn-sm" style={{ marginRight: 8 }}>عرض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

