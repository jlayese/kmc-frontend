export const getPath = (path: string, params: URLSearchParams): string => `${path}?${params.toString()}`;

export const getRootPath = (params?: URLSearchParams): string => (params ? `/?${params.toString()}` : '/');

export const getAccountSignInPath = (params?: URLSearchParams): string =>
  params ? `/account/sign-in?${params.toString()}` : '/account/sign-in';

export const getAccountSignInEmailPath = (params?: URLSearchParams): string =>
  params ? `/account/sign-in-email?${params.toString()}` : '/account/sign-in-email';

export const getAccountSignUpPath = (params?: URLSearchParams): string =>
  params ? `/account/sign-up?${params.toString()}` : '/account/sign-up';

export const getAccountChangePasswordPath = (params?: URLSearchParams): string =>
  params ? `/account/change-password?${params.toString()}` : '/account/change-password';

export const getAccountResetPasswordPath = (params?: URLSearchParams): string =>
  params ? `/account/reset-password?${params.toString()}` : '/account/reset-password';

export const getAccountSettingsPath = (params?: URLSearchParams): string =>
  params ? `/account/settings?${params.toString()}` : '/account/settings';

export const getAppsPath = (params?: URLSearchParams): string => (params ? `/apps?${params.toString()}` : '/apps');

export const getApiAccountCallback = (): string => '/api/account/callback';

export const getDashboardPath = (params?: URLSearchParams): string =>
  params ? `/dashboard?${params.toString()}` : '/dashboard';

export const getOnboardingPath = (params?: URLSearchParams): string =>
  params ? `/onboarding?${params.toString()}` : '/onboarding';

export const getAdminDashboardPath = (params?: URLSearchParams): string =>
  params ? `/admin/dashboard?${params.toString()}` : '/admin/dashboard';

export const getAdminUsersPath = (params?: URLSearchParams): string =>
  params ? `/admin/users?${params.toString()}` : '/admin/users';
