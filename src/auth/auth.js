// Authentication utilities for Admin Panel
import { API_URL } from '../config/api';

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
    // Validate input
    if (!email || !password) {
      return { success: false, message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' };
    }

    const loginUrl = `${API_URL}/auth/admin/login`;
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });

    // Handle rate limiting
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || 'تم تجاوز الحد المسموح من المحاولات. يرجى الانتظار قليلاً والمحاولة مرة أخرى.' 
      };
    }

    if (!response.ok) {
      // If response is not ok, try to get error message
      let errorMessage = 'خطأ في الاتصال بالخادم';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If can't parse JSON, use default message
        errorMessage = `خطأ في الاتصال بالخادم (Status: ${response.status})`;
      }
      return { success: false, message: errorMessage };
    }

    const data = await response.json();

    if (data.success && data.accessToken) {
      setAuthToken(data.accessToken);
      return { success: true, user: data.user };
    }

    return { success: false, message: data.message || 'فشل تسجيل الدخول' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: `خطأ في الاتصال بالخادم: ${error.message}` };
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
