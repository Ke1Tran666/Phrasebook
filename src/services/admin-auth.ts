import type { GoogleAccount } from '@/services/google-drive';

export const ADMIN_EMAIL = 'ke1tran666@gmail.com';

/**
 * Checks whether the given Google account belongs to the system administrator.
 */
export const isAdminAccount = (account?: GoogleAccount | null): boolean => {
  if (!account || !account.email) return false;
  return account.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
};
