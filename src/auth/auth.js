// Authentication utilities for Admin Panel

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Store token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('admin_token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('admin_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('admin_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.accessToken) {
      setAuthToken(data.accessToken);
      return { success: true, user: data.user };
    }

    return { success: false, message: data.message || 'فشل تسجيل الدخول' };
  } catch (error) {
    return { success: false, message: 'خطأ في الاتصال بالخادم' };
  }
};

// Logout function
export const logout = () => {
  removeAuthToken();
  window.location.href = '/';
};

// Get auth headers for API calls
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Make authenticated API call
export const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, redirect to login
  if (response.status === 401) {
    logout();
    throw new Error('Unauthorized');
  }

  return response;
};

