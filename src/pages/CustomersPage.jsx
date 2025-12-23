import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { authenticatedFetch } from '../auth/auth';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchCustomers();
  }, [sort, searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/admin/users?sort=${sort}&search=${encodeURIComponent(searchTerm)}`;
      const res = await authenticatedFetch(url);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.users || []);
      } else {
        console.error('Error fetching customers:', data.message);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCustomer = async (userId) => {
    if (!window.confirm('هل أنت متأكد من حظر هذا الزبون؟')) return;
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/users/${userId}/block`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'حظر يدوي من الإدارة' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم حظر الزبون بنجاح');
        fetchCustomers();
      } else {
        alert(data.message || 'حدث خطأ ما');
      }
    } catch (error) {
      alert('خطأ في الاتصال بالسيرفر');
    }
  };

  const handleUnblockCustomer = async (userId) => {
    if (!window.confirm('هل تريد رفع الحظر عن هذا الزبون؟')) return;
    try {
      const res = await authenticatedFetch(`${API_URL}/admin/users/${userId}/unblock`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        alert('تم رفع الحظر بنجاح');
        fetchCustomers();
      } else {
        alert(data.message || 'حدث خطأ ما');
      }
    } catch (error) {
      alert('خطأ في الاتصال بالسيرفر');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchCustomers();
    }, 500);
  };

  const filteredCustomers = customers.filter(customer => {
    if (filter === 'all') return true;
    if (filter === 'with-orders') return customer.ordersCount > 0;
    if (filter === 'no-orders') return customer.ordersCount === 0;
    if (filter === 'blocked') return customer.isBlocked;
    if (filter === 'active') return !customer.isBlocked;
    return true;
  });

  if (loading) {
    return (
      <div>
        <h1 className="page-title">الزبائن</h1>
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">الزبائن</h1>

      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">جميع الزبائن</option>
          <option value="with-orders">زبائن لديهم طلبات</option>
          <option value="no-orders">زبائن بدون طلبات</option>
          <option value="active">زبائن نشطين</option>
          <option value="blocked">زبائن محظورين</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">الأحدث أولاً</option>
          <option value="oldest">الأقدم أولاً</option>
          <option value="name-asc">الاسم (أ-ي)</option>
          <option value="name-desc">الاسم (ي-أ)</option>
        </select>
        <input
          type="text"
          placeholder="بحث بالاسم أو الهاتف..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الهاتف</th>
              <th>عدد الطلبات</th>
              <th>تاريخ التسجيل</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  <p>لا يوجد زبائن</p>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex">
                      <div className="avatar">{(customer.name || 'ز')[0]}</div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{customer.name || 'غير معروف'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{customer.phone || '-'}</td>
                  <td>
                    <span className="badge badge-info">{customer.ordersCount || 0}</span>
                  </td>
                  <td>
                    {customer.registerTime
                      ? new Date(customer.registerTime).toLocaleDateString('ar', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      : '-'}
                  </td>
                  <td>
                    {customer.isBlocked ? (
                      <span className="badge badge-danger">محظور</span>
                    ) : (
                      <span className="badge badge-success">نشط</span>
                    )}
                  </td>
                  <td>
                    {!customer.isBlocked ? (
                      <button className="btn btn-sm btn-danger" onClick={() => handleBlockCustomer(customer.id)}>حظر</button>
                    ) : (
                      <button className="btn btn-sm btn-primary" onClick={() => handleUnblockCustomer(customer.id)}>رفع الحظر</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '20px', padding: '20px' }}>
        <h3>إحصائيات الزبائن</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">إجمالي الزبائن</div>
            <div className="stat-value">{customers.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">زبائن لديهم طلبات</div>
            <div className="stat-value">{customers.filter(c => c.ordersCount > 0).length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">زبائن بدون طلبات</div>
            <div className="stat-value">{customers.filter(c => c.ordersCount === 0).length}</div>
          </div>
        </div>
      </div>
    </div >
  );
}

