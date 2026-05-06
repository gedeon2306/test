export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    EMAIL_SEND: '/auth/email-send',
    CONFIRM: '/auth/confirm',
    CONFIRM_CODE: '/auth/confirm-code',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    TASKS: '/dashboard/tasks',
    PROJECTS: '/dashboard/projects',
    CALENDAR: '/dashboard/calendar',
    TEAM: '/dashboard/team',
    SETTINGS: '/dashboard/settings',
    PROFIL: '/dashboard/profil',
  },
} as const;