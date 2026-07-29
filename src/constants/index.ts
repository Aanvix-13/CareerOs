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
  PUBLIC: ['/', '/sign-in', '/sign-up', '/features', '/pricing', '/about', '/contact', '/privacy', '/terms'],
  PROTECTED: [
    '/app/dashboard',
    '/app/resumes',
    '/app/applications',
    '/app/interviews',
    '/app/reminders',
    '/app/analytics',
    '/app/profile',
    '/app/settings',
  ],
};
