import React, { useState } from 'react';

export default function RatingsPage() {
  const [ratings] = useState([
    { id: '1', orderId: '1001', customer: 'محمد أحمد', driver: 'أحمد محمد', rating: 5, comment: 'خدمة ممتازة وسريعة', createdAt: '2025-11-26T11:00:00' },
    { id: '2', orderId: '998', customer: 'سارة خالد', driver: 'محمود سعيد', rating: 4, comment: 'جيد جداً', createdAt: '2025-11-26T09:30:00' },
    { id: '3', orderId: '995', customer: 'علي حسن', driver: 'خالد علي', rating: 2, comment: 'تأخر كثيراً والطلب وصل بارد', createdAt: '2025-11-25T20:00:00' },
    { id: '4', orderId: '990', customer: 'نور محمد', driver: 'أحمد محمد', rating: 5, comment: '', createdAt: '2025-11-25T18:00:00' },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredRatings = filter === 'all' 
    ? ratings 
    : ratings.filter(r => {
        if (filter === 'positive') return r.rating >= 4;
        if (filter === 'negative') return r.rating <= 2;
        return true;
      });

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const avgRating = (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1);

  return (
    <div>
      <h1 className="page-title">التقييمات</h1>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card primary">
          <div className="stat-label">متوسط التقييم</div>
          <div className="stat-value">⭐ {avgRating}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">إجمالي التقييمات</div>
          <div className="stat-value">{ratings.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">تقييمات إيجابية</div>
          <div className="stat-value" style={{ color: '#4caf50' }}>
            {ratings.filter(r => r.rating >= 4).length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">تقييمات سلبية</div>
          <div className="stat-value" style={{ color: '#e53935' }}>
            {ratings.filter(r => r.rating <= 2).length}
          </div>
        </div>
      </div>

      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">جميع التقييمات</option>
          <option value="positive">إيجابية (4-5)</option>
          <option value="negative">سلبية (1-2)</option>
        </select>
        <input type="text" placeholder="بحث بالسائق أو الزبون..." />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>الزبون</th>
              <th>السائق</th>
              <th>التقييم</th>
              <th>التعليق</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filteredRatings.map(r => (
              <tr key={r.id}>
                <td>#{r.orderId}</td>
                <td>{r.customer}</td>
                <td>{r.driver}</td>
                <td style={{ color: r.rating >= 4 ? '#4caf50' : r.rating <= 2 ? '#e53935' : '#ff9800' }}>
                  {renderStars(r.rating)}
                </td>
                <td style={{ maxWidth: 250 }}>
                  {r.comment || <span className="text-muted">بدون تعليق</span>}
                </td>
                <td>{new Date(r.createdAt).toLocaleString('ar')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

