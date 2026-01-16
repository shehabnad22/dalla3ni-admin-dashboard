import React, { useState, useEffect } from 'react';
import { API_URL, BASE_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/invoices?location=${filter}`);
      const data = await res.json();
      if (data.success) {
        // Flatten the grouped object for the table or adapt UI. 
        // The API returns grouped by location: { "Location A": [...], "Location B": [...] }
        // Let's flatten for this table view
        const allInvoices = [];
        Object.keys(data.invoices).forEach(loc => {
          data.invoices[loc].forEach(inv => {
            allInvoices.push({ ...inv, location: loc });
          });
        });
        setInvoices(allInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">الفواتير</h1>

      <div className="filters">
        <select onChange={e => setFilter(e.target.value)} value={filter}>
          <option value="all">جميع المناطق</option>
          {/* Add more locations dynamically if needed */}
        </select>
        <button className="btn btn-sm btn-secondary" onClick={fetchInvoices}>
          <i className="fas fa-sync"></i> تحديث
        </button>
      </div>

      <div className="card">
        {loading ? <p className="text-center p-3">جاري التحميل...</p> : (
          <table>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>السائق</th>
                <th>الموقع</th>
                <th>التاريخ</th>
                <th>الصورة</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>#{invoice.orderId?.slice(0, 8)}</td>
                  <td>{invoice.driver}</td>
                  <td>{invoice.location}</td>
                  <td>
                    {new Date(invoice.time).toLocaleString('ar-EG', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => setSelectedInvoice(invoice)}>
                      <i className="fas fa-eye"></i> عرض
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">لا توجد فواتير</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Invoice Image Modal */}
      {selectedInvoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setSelectedInvoice(null)}>
          <div style={{ background: 'white', padding: 24, borderRadius: 16, maxWidth: 600, width: '90%' }} onClick={e => e.stopPropagation()}>
            <h3>فاتورة طلب #{selectedInvoice.orderId?.slice(0, 8)}</h3>
            <div style={{
              marginTop: 16,
              textAlign: 'center'
            }}>
              {selectedInvoice.image ? (
                <img
                  src={selectedInvoice.image.startsWith('http') ? selectedInvoice.image : `${BASE_URL}/${selectedInvoice.image.replace(/^uploads\//, '')}`}
                  alt="Invoice"
                  style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: 8 }}
                />
              ) : (
                <div style={{ padding: 40, background: '#f5f5f5', borderRadius: 8 }}>لا توجد صورة</div>
              )}
            </div>
            <button
              className="btn btn-danger btn-block mt-3"
              onClick={() => setSelectedInvoice(null)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

