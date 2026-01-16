import React, { useState, useEffect } from 'react';
import { API_URL, BASE_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

const statusLabels = {
  REQUESTED: { label: 'معلق', class: 'badge-warning' },
  ASSIGNED: { label: 'مقبول', class: 'badge-info' },
  PICKED_UP: { label: 'تم الاستلام', class: 'badge-info' },
  EN_ROUTE: { label: 'في الطريق', class: 'badge-info' },
  DELIVERED: { label: 'تم التوصيل', class: 'badge-success' },
  COMPLETED: { label: 'مكتمل', class: 'badge-success' },
  CANCELED: { label: 'ملغي', class: 'badge-danger' },
  DISPUTE: { label: 'نزاع', class: 'badge-danger' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dateFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (dateFilter) params.append('date', dateFilter);

      const res = await authenticatedFetch(`${API_URL}/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        order.id?.toLowerCase().includes(term) ||
        order.itemsText?.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div>
      <h1 className="page-title">الطلبات</h1>

      <div className="filters" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <option value="all">جميع الطلبات</option>
          <option value="REQUESTED">معلقة</option>
          <option value="ASSIGNED">مقبولة</option>
          <option value="PICKED_UP">تم الاستلام</option>
          <option value="EN_ROUTE">في الطريق</option>
          <option value="DELIVERED">تم التوصيل</option>
          <option value="COMPLETED">مكتملة</option>
          <option value="CANCELED">ملغية</option>
          <option value="DISPUTE">نزاعات</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          placeholder="بحث برقم الطلب أو المحتوى..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, minWidth: '200px' }}
        />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الزبون</th>
              <th>الطلب</th>
              <th>السائق</th>
              <th>السعر</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id?.slice(0, 8)}</td>
                <td>{order.customer?.name || '-'}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.itemsText}</td>
                <td>{order.Driver?.User?.name || <span className="text-muted">-</span>}</td>
                <td>{parseFloat(order.estimatedPrice || 0).toFixed(2)} د</td>
                <td>
                  <span className={`badge ${statusLabels[order.status]?.class || 'badge-info'}`}>
                    {statusLabels[order.status]?.label || order.status}
                  </span>
                </td>
                <td>
                  {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'غير متوفر'}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    عرض
                  </button>
                  {order.invoiceImageUrl && (
                    <button
                      className="btn btn-sm btn-success"
                      style={{ marginRight: '8px' }}
                      onClick={() => window.open(order.invoiceImageUrl.startsWith('http') ? order.invoiceImageUrl : `${BASE_URL}/${order.invoiceImageUrl}`, '_blank')}
                    >
                      <i className="fas fa-file-invoice"></i> فاتورة
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
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
        }} onClick={() => setSelectedOrder(null)}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <h2>تفاصيل الطلب #{selectedOrder.id?.slice(0, 8)}</h2>
            <div style={{ marginTop: '16px' }}>
              <p><strong>الزبون:</strong> {selectedOrder.customer?.name} ({selectedOrder.customer?.phone})</p>
              <p><strong>الطلب:</strong> {selectedOrder.itemsText}</p>
              <p><strong>السائق:</strong> {selectedOrder.Driver?.User?.name || '-'}</p>
              <p><strong>السعر:</strong> {parseFloat(selectedOrder.estimatedPrice || 0).toFixed(2)} ل.س</p>
              <p><strong>رسوم التوصيل:</strong> {parseFloat(selectedOrder.deliveryFee || 0).toFixed(2)} ل.س</p>
              <p><strong>الحالة:</strong> {statusLabels[selectedOrder.status]?.label}</p>
              {selectedOrder.invoiceImageUrl && (
                <div style={{ marginTop: '16px' }}>
                  <strong>صورة الفاتورة:</strong>
                  <img
                    src={selectedOrder.invoiceImageUrl.startsWith('http') ? selectedOrder.invoiceImageUrl : `${BASE_URL}/${selectedOrder.invoiceImageUrl}`}
                    alt="Invoice"
                    style={{ maxWidth: '100%', marginTop: '8px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{ marginTop: '16px', padding: '8px 24px', background: '#FF6B35', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

