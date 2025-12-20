import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState({ type: 'no-action', notes: '' });

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/disputes`);
      const data = await res.json();
      if (data.success) {
        setDisputes(data.disputes || []);
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
    }
  };

  const statusLabels = {
    DISPUTE: { label: 'نزاع', class: 'badge-danger' },
    investigating: { label: 'قيد التحقيق', class: 'badge-warning' },
    resolved: { label: 'تم الحل', class: 'badge-success' },
  };

  const handleResolve = async (disputeId) => {
    if (!window.confirm('هل تريد حل هذا النزاع؟')) return;
    
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/disputes/${disputeId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({
          resolution: resolution.type,
          notes: resolution.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم حل النزاع بنجاح');
        fetchDisputes();
        setSelectedDispute(null);
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  return (
    <div>
      <h1 className="page-title">النزاعات</h1>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderRight: '4px solid #e53935' }}>
          <div className="stat-label">نزاعات مفتوحة</div>
          <div className="stat-value">{disputes.filter(d => d.status === 'open').length}</div>
        </div>
        <div className="stat-card" style={{ borderRight: '4px solid #ff9800' }}>
          <div className="stat-label">قيد التحقيق</div>
          <div className="stat-value">{disputes.filter(d => d.status === 'investigating').length}</div>
        </div>
        <div className="stat-card" style={{ borderRight: '4px solid #4caf50' }}>
          <div className="stat-label">تم حلها</div>
          <div className="stat-value">{disputes.filter(d => d.status === 'resolved').length}</div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>رقم الطلب</th>
              <th>الزبون</th>
              <th>السائق</th>
              <th>نوع المشكلة</th>
              <th>الوصف</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map(dispute => (
              <tr key={dispute.id}>
                <td>#{dispute.id?.slice(0, 8)}</td>
                <td>#{dispute.orderId?.slice(0, 8) || dispute.Order?.id?.slice(0, 8)}</td>
                <td>{dispute.Order?.customer?.name || '-'}</td>
                <td>{dispute.Order?.Driver?.User?.name || '-'}</td>
                <td>{dispute.disputeReason || 'غير محدد'}</td>
                <td style={{ maxWidth: 200 }}>{dispute.disputeReason || '-'}</td>
                <td>
                  <span className={`badge ${statusLabels[dispute.status || 'DISPUTE']?.class || 'badge-danger'}`}>
                    {statusLabels[dispute.status || 'DISPUTE']?.label || 'نزاع'}
                  </span>
                </td>
                <td>
                  {dispute.status !== 'resolved' && (
                    <button className="btn btn-sm btn-success" onClick={() => setSelectedDispute(dispute)}>
                      حل النزاع
                    </button>
                  )}
                  <button 
                    className="btn btn-sm" 
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      if (dispute.Order?.invoiceImageUrl) {
                        window.open(dispute.Order.invoiceImageUrl, '_blank');
                      }
                    }}
                  >
                    عرض الأدلة
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resolution Modal */}
      {selectedDispute && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setSelectedDispute(null)}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '90%',
          }} onClick={e => e.stopPropagation()}>
            <h2>حل النزاع #{selectedDispute.id?.slice(0, 8)}</h2>
            <div style={{ marginTop: '16px' }}>
              <p><strong>السبب:</strong> {selectedDispute.disputeReason}</p>
              {selectedDispute.Order?.invoiceImageUrl && (
                <div style={{ marginTop: '16px' }}>
                  <strong>صورة الفاتورة:</strong>
                  <img 
                    src={selectedDispute.Order.invoiceImageUrl} 
                    alt="Invoice" 
                    style={{ maxWidth: '100%', marginTop: '8px', borderRadius: '8px' }}
                  />
                </div>
              )}
              <div style={{ marginTop: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>القرار:</label>
                <select
                  value={resolution.type}
                  onChange={e => setResolution({ ...resolution, type: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="no-action">لا إجراء</option>
                  <option value="refund">استرداد للزبون</option>
                  <option value="penalty">غرامة للسائق</option>
                </select>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ملاحظات:</label>
                <textarea
                  value={resolution.notes}
                  onChange={e => setResolution({ ...resolution, notes: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                  placeholder="ملاحظات إضافية..."
                />
              </div>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedDispute(null)}
                style={{ padding: '8px 24px', background: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                إلغاء
              </button>
              <button 
                onClick={() => handleResolve(selectedDispute.id)}
                style={{ padding: '8px 24px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                تأكيد الحل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

