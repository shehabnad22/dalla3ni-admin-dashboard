// API Configuration
// Uses REACT_APP_API_URL environment variable
// Defaults to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const API_URL = API_BASE_URL;

// Helper function to build full API endpoint
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default API_URL;

