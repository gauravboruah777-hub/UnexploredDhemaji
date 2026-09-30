export const ADMIN_EMAILS = [
  'boruahborajen2019@gmail.com',
  'gauravboruah777@gmail.com'
];

export const ADMIN_EMAIL = ADMIN_EMAILS[0];

export const isConfiguredAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some(e => e.toLowerCase() === normalized);
};

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
  provider: 'google' | 'password';
  role: 'admin' | 'user';
  isAdminClaim?: boolean;
}

export interface GoogleAccountOption {
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AdminActionLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  action:
    | 'APPROVE_PLACE'
    | 'REJECT_PLACE'
    | 'EDIT_PLACE'
    | 'DELETE_PLACE'
    | 'APPROVE_CULTURE'
    | 'REJECT_CULTURE'
    | 'EDIT_CULTURE'
    | 'DELETE_CULTURE'
    | 'DELETE_IMAGE';
  contentType: 'place' | 'culture';
  contentId: string;
  contentTitle?: string;
  timestamp: string;
  notes?: string;
}
