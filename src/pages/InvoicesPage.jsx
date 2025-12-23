import React, { useState } from 'react';

export default function InvoicesPage() {
  const [invoices] = useState([
    { id: '1001', orderId: '1001', driver: 'أحمد محمد', amount: 5.50, imageUrl: '/invoice1.jpg', uploadedAt: '2025-11-26T10:35:00', verified: true },
    { id: '1002', orderId: '1003', driver: 'محمود سعيد', amount: 4.50, imageUrl: '/invoice2.jpg', uploadedAt: '2025-11-26T11:50:00', verified: false },
    { id: '1003', orderId: '1004', driver: 'أحمد محمد', amount: 12.00, imageUrl: '/invoice3.jpg', uploadedAt: '2025-11-26T12:15:00', verified: false },
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div>
      <h1 className="page-title">الفواتير</h1>

      <div className="filters">
        <select>
          <option value="all">جميع الفواتير</option>
          <option value="verified">موثقة</option>
          <option value="pending">بانتظار التوثيق</option>
        </select>
        <input type="date" />
        <input type="text" placeholder="بحث برقم الطلب..." />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>رقم الطلب</th>
              <th>السائق</th>
              <th>المبلغ</th>
              <th>تاريخ الرفع</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>#{invoice.id}</td>
                <td>#{invoice.orderId}</td>
                <td>{invoice.driver}</td>
                <td>{invoice.amount.toFixed(2)} د</td>
                <td>{new Date(invoice.uploadedAt).toLocaleString('ar')}</td>
                <td>
                  {invoice.verified ? (
                    <span className="badge badge-success">موثقة ✓</span>
                  ) : (
                    <span className="badge badge-warning">بانتظار التوثيق</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => setSelectedInvoice(invoice)}>
                    عرض الصورة
                  </button>
                  {!invoice.verified && (
                    <button className="btn btn-sm btn-success" style={{ marginRight: 8 }}>
                      توثيق
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <div style={{ background: 'white', padding: 24, borderRadius: 16, maxWidth: 500 }}>
            <h3>فاتورة #{selectedInvoice.id}</h3>
            <div style={{
              width: 400,
              height: 300,
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              marginTop: 16,
            }}>
              🧾 صورة الفاتورة
            </div>
            <div style={{ marginTop: 16 }}>
              <p><strong>المبلغ:</strong> {selectedInvoice.amount.toFixed(2)} ل.س</p>
              <p><strong>السائق:</strong> {selectedInvoice.driver}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

