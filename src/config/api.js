const API_CONFIG = {
  // Production server apna URL .env .
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    DASHBOARD: '/api/dashboard/',
    PLANT2_LIVE: '/api/plant2-live/',
    PLANT1_LIVE: '/api/plant1-live/',
    MACHINES: '/api/machines/',
    AVAILABLE_DATES: '/api/available-dates/',
    MESSAGES: '/api/messages/',
  }
};

export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG;