export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const FILE_LIMITS = {
  RESUME: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['application/pdf'],
  },
  PROFILE_IMAGE: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  },
};

export const ROUTES = {
  PUBLIC: ['/', '/login', '/register', '/forgot-password'],
  PROTECTED: [
    '/dashboard',
    '/profile',
    '/resumes',
    '/applications',
    '/interviews',
    '/reminders',
    '/analytics',
    '/feedback',
    '/settings',
  ],
};
