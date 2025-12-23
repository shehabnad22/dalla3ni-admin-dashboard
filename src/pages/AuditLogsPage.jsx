import React, { useState } from 'react';

export default function AuditLogsPage() {
  const [logs] = useState([
    { id: '1', action: 'settlement_paid', admin: 'المدير', target: 'أحمد محمد', details: 'تسوية بقيمة 25.50 ل.س', createdAt: '2025-11-26T12:00:00' },
    { id: '2', action: 'driver_blocked', admin: 'النظام', target: 'خالد علي', details: 'حظر تلقائي - ديون متراكمة 52.50 ل.س', createdAt: '2025-11-26T00:00:00' },
    { id: '3', action: 'driver_unblocked', admin: 'المدير', target: 'محمود سعيد', details: 'رفع الحظر بعد التسوية', createdAt: '2025-11-25T16:30:00' },
    { id: '4', action: 'driver_approved', admin: 'المدير', target: 'عمر حسن', details: 'تمت الموافقة على طلب التسجيل', createdAt: '2025-11-25T14:00:00' },
    { id: '5', action: 'dispute_resolved', admin: 'المدير', target: 'نزاع #3', details: 'تم تحذير السائق', createdAt: '2025-11-25T11:00:00' },
    { id: '6', action: 'order_cancelled', admin: 'المدير', target: 'طلب #1010', details: 'إلغاء الطلب بسبب عدم توفر سائق', createdAt: '2025-11-24T20:00:00' },
  ]);

  const actionLabels = {
    settlement_paid: { label: 'تسوية', icon: '💰', color: '#4caf50' },
    driver_blocked: { label: 'حظر سائق', icon: '🚫', color: '#e53935' },
    driver_unblocked: { label: 'رفع حظر', icon: '✅', color: '#4caf50' },
    driver_approved: { label: 'موافقة سائق', icon: '👤', color: '#2196f3' },
    dispute_resolved: { label: 'حل نزاع', icon: '⚖️', color: '#ff9800' },
    order_cancelled: { label: 'إلغاء طلب', icon: '❌', color: '#e53935' },
  };

  const [filter, setFilter] = useState('all');

  return (
    <div>
      <h1 className="page-title">سجل العمليات</h1>

      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">جميع العمليات</option>
          <option value="settlement_paid">التسويات</option>
          <option value="driver_blocked">حظر السائقين</option>
          <option value="driver_unblocked">رفع الحظر</option>
          <option value="driver_approved">موافقات السائقين</option>
          <option value="dispute_resolved">حل النزاعات</option>
        </select>
        <input type="date" />
        <input type="text" placeholder="بحث..." />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>العملية</th>
              <th>المنفذ</th>
              <th>الهدف</th>
              <th>التفاصيل</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {logs
              .filter(l => filter === 'all' || l.action === filter)
              .map(log => (
                <tr key={log.id}>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      color: actionLabels[log.action]?.color
                    }}>
                      <span>{actionLabels[log.action]?.icon}</span>
                      <span>{actionLabels[log.action]?.label}</span>
                    </span>
                  </td>
                  <td>
                    <span className={log.admin === 'النظام' ? 'text-muted' : ''}>
                      {log.admin}
                    </span>
                  </td>
                  <td>{log.target}</td>
                  <td style={{ maxWidth: 300 }}>{log.details}</td>
                  <td>{new Date(log.createdAt).toLocaleString('ar')}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

