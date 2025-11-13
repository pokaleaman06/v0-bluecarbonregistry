// Brand Colors
export const COLORS = {
  DEEP_OCEAN_BLUE: '#005F73',
  TEAL: '#0A9396',
  SAND_BEIGE: '#E9D8A6',
  WHITE: '#FFFFFF',
  
  // Extended palette
  LIGHT_BLUE: '#94D3E0',
  DARK_BLUE: '#003D47',
  LIGHT_TEAL: '#4FBDBA',
  DARK_TEAL: '#087F7F',
  LIGHT_BEIGE: '#F4EDD4',
  DARK_BEIGE: '#D4C18A',
  
  // Status colors
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6'
} as const;

// Supported Languages
export const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  gu: 'ગુજરાતી',
  or: 'ଓଡ଼ିଆ',
  as: 'অসমীয়া',
  ur: 'اردو'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    VERIFY: '/api/auth/verify',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout'
  },
  USERS: {
    ME: '/api/users/me',
    PERMISSIONS: '/api/users/me/permissions',
    LANGUAGE: '/api/users/me/language',
    CREDITS: '/api/users/me/credits'
  },
  PROJECTS: {
    LIST: '/api/projects',
    DETAIL: '/api/projects/:id',
    MAP: '/api/projects/:id/map'
  },
  SUBMISSIONS: {
    CREATE: '/api/submissions',
    LIST: '/api/submissions',
    DETAIL: '/api/submissions/:id'
  },
  VERIFICATIONS: {
    LIST: '/api/verifications',
    ACTION: '/api/verifications/:id/action'
  },
  TASKS: {
    LIST: '/api/tasks'
  }
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'BlueCarbon Registry',
  VERSION: '1.0.0',
  DESCRIPTION: 'Blockchain-powered MRV platform for India\'s blue carbon restoration',
  
  // Map Configuration
  MAP: {
    DEFAULT_ZOOM: 10,
    MIN_ZOOM: 5,
    MAX_ZOOM: 18,
    DEFAULT_CENTER: {
      latitude: 20.5937, // India center
      longitude: 78.9629
    }
  },
  
  // File Upload Limits
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mov']
  },
  
  // Offline Configuration
  OFFLINE: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // ms
    CACHE_DURATION: 24 * 60 * 60 * 1000 // 24 hours
  }
} as const;

// User Roles and Permissions
export const PERMISSIONS = {
  NGO: ['submit_data', 'view_projects', 'view_credits'],
  PANCHAYAT: ['submit_data', 'view_projects', 'view_credits'],
  VERIFIER: ['verify_data', 'view_submissions', 'approve_reject'],
  ADMIN: ['manage_users', 'manage_projects', 'view_analytics', 'export_data'],
  INDUSTRY: ['buy_credits', 'view_marketplace', 'view_compliance'],
  GOVERNMENT: ['view_analytics', 'export_data', 'manage_schemes']
} as const;

// Carbon Calculation Constants
export const CARBON_CONSTANTS = {
  // Mangrove carbon sequestration rates (tons CO2/hectare/year)
  MANGROVE_SEQUESTRATION_RATE: 3.14,
  
  // Tree biomass calculation constants
  WOOD_DENSITY: 0.6, // g/cm³ for mangroves
  CARBON_FRACTION: 0.47, // Carbon fraction in dry biomass
  CO2_TO_C_RATIO: 3.67, // Conversion factor from C to CO2
  
  // Allometric equation constants for mangroves
  ALLOMETRIC_A: 0.251,
  ALLOMETRIC_B: 2.46
} as const;
