// Configuration constants and environment variables
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'NewsSnapAI Client',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // API Endpoints
  endpoints: {
    summarize: '/api/summarize',
    health: '/api/health',
  },

  // UI Configuration
  ui: {
    debounceDelay: 300,
    maxUrlLength: 2048,
    loadingTimeout: 30000, // 30 seconds
  },

  // Validation
  validation: {
    urlPattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  },
} as const;

export default config;
