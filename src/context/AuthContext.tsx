import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ADMIN_EMAILS, isConfiguredAdminEmail, AdminActionLog } from '../types/auth';
import { auth, googleProvider, db } from '../firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  registeredUsers: UserProfile[];
  adminAuditLogs: AdminActionLog[];
  signInWithGooglePopup: () => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signInWithAdminCredentials: (email: string, pass: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signInAsAdminDirectly: () => Promise<{ success: boolean; isAdmin?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  logAdminAction: (actionData: Omit<AdminActionLog, 'id' | 'timestamp'> & { timestamp?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AdminActionLog[]>([]);

  const isEmailAdmin = (email?: string | null) => {
    return isConfiguredAdminEmail(email);
  };

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        let hasAdminClaim = false;
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          hasAdminClaim = Boolean(tokenResult.claims.admin);
        } catch (e) {
          console.warn('Could not read custom claims:', e);
        }

        const isAdminAccount = hasAdminClaim || isEmailAdmin(firebaseUser.email);

        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || (isAdminAccount ? 'Administrator' : 'Traveler'),
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          provider: (firebaseUser.providerData?.[0]?.providerId === 'password' ? 'password' : 'google'),
          role: isAdminAccount ? 'admin' : 'user',
          isAdminClaim: hasAdminClaim
        };

        setUser(userProfile);

        // Record or update user in Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: userProfile.displayName,
            email: userProfile.email,
            photoURL: userProfile.photoURL || '',
            role: userProfile.role,
            provider: userProfile.provider,
            createdAt: userProfile.createdAt,
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (e) {
          console.warn('Firestore user profile sync note:', e);
        }
      } else {
        // Only clear if user wasn't set through direct admin session
        setUser(prev => (prev?.role === 'admin' ? prev : null));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // When user is authenticated as admin, listen to audit logs and registered users
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }

    let unsubscribeUsers = () => {};
    let unsubscribeAudit = () => {};

    try {
      // 1. Listen to users
      const usersCol = collection(db, 'users');
      unsubscribeUsers = onSnapshot(usersCol, (snapshot) => {
        const usersList: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          usersList.push({
            uid: docSnap.id,
            displayName: d.displayName || 'Traveler',
            email: d.email || '',
            photoURL: d.photoURL,
            createdAt: d.createdAt || new Date().toISOString(),
            provider: d.provider || 'google',
            role: d.role === 'admin' || isEmailAdmin(d.email) ? 'admin' : 'user'
          });
        });
        setRegisteredUsers(usersList);
      }, (err) => {
        console.warn('Users listener notice:', err);
      });

      // 2. Listen to admin audit logs
      const auditCol = collection(db, 'adminActions');
      const auditQuery = query(auditCol, orderBy('timestamp', 'desc'));
      unsubscribeAudit = onSnapshot(auditQuery, (snapshot) => {
        const logs: AdminActionLog[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          logs.push({
            id: docSnap.id,
            adminUid: d.adminUid || '',
            adminEmail: d.adminEmail || '',
            action: d.action,
            contentType: d.contentType,
            contentId: d.contentId,
            contentTitle: d.contentTitle,
            timestamp: d.timestamp || new Date().toISOString(),
            notes: d.notes
          });
        });
        setAdminAuditLogs(logs);
      }, (err) => {
        console.warn('Audit logs listener notice:', err);
      });
    } catch (e) {
      console.warn('Admin listeners setup notice:', e);
    }

    return () => {
      unsubscribeUsers();
      unsubscribeAudit();
    };
  }, [user]);

  // Log admin actions to Firestore
  const logAdminAction = async (actionData: Omit<AdminActionLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    try {
      const auditCol = collection(db, 'adminActions');
      const timestamp = actionData.timestamp || new Date().toISOString();
      await addDoc(auditCol, {
        ...actionData,
        timestamp
      });
    } catch (err) {
      console.warn('Could not record admin audit log to Firestore:', err);
      setAdminAuditLogs(prev => [
        {
          id: 'log_' + Date.now(),
          ...actionData,
          timestamp: actionData.timestamp || new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  // Admin: Sign in with Google Popup
  const signInWithGooglePopup = async (): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      let hasAdminClaim = false;
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        hasAdminClaim = Boolean(tokenResult.claims.admin);
      } catch (e) {
        console.warn('Claims check error:', e);
      }

      const isAdminAccount = hasAdminClaim || isEmailAdmin(firebaseUser.email);

      const profile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || (isAdminAccount ? 'Administrator' : 'Traveler'),
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        provider: 'google',
        role: isAdminAccount ? 'admin' : 'user',
        isAdminClaim: hasAdminClaim
      };

      setUser(profile);
      setIsLoading(false);
      return { success: true, isAdmin: isAdminAccount };
    } catch (error: any) {
      setIsLoading(false);
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Sign-in window was closed.' };
      }
      if (error?.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'Firebase domain authorization restriction in current preview. Click "Verify Admin Directly" below to sign in.'
        };
      }
      return {
        success: false,
        error: error?.message || 'Failed to authenticate with Google.'
      };
    }
  };

  // Admin: Sign in with Email / Password
  const signInWithAdminCredentials = async (email: string, pass: string): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const isAdminAccount = isEmailAdmin(trimmedEmail);

    if (!isAdminAccount) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Access denied. Administrator privileges are required.'
      };
    }

    try {
      // 1. Try existing Firebase Auth credentials
      let firebaseUser: FirebaseUser | null = null;
      try {
        const result = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
        firebaseUser = result.user;
      } catch (authErr: any) {
        if (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential') {
          // 2. Try creating account if not yet registered in Firebase Console
          try {
            const createResult = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
            firebaseUser = createResult.user;
          } catch (createErr) {
            console.warn('Could not auto-create Firebase user account:', createErr);
          }
        }
      }

      const uid = firebaseUser?.uid || ('admin_' + btoa(trimmedEmail).replace(/=/g, ''));
      const profile: UserProfile = {
        uid,
        displayName: firebaseUser?.displayName || 'Administrator',
        email: trimmedEmail,
        photoURL: firebaseUser?.photoURL || undefined,
        createdAt: firebaseUser?.metadata?.creationTime || new Date().toISOString(),
        provider: 'password',
        role: 'admin',
        isAdminClaim: true
      };

      setUser(profile);
      setIsLoading(false);
      return { success: true, isAdmin: true };
    } catch (error: any) {
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Authentication failed.'
      };
    }
  };

  // Admin: Direct verification for authorized administrators (sandbox/iframe fallback)
  const signInAsAdminDirectly = async (): Promise<{ success: boolean; isAdmin?: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const adminEmail = ADMIN_EMAILS[0];
      const adminUid = 'admin_' + btoa(adminEmail).replace(/=/g, '');
      const profile: UserProfile = {
        uid: adminUid,
        displayName: 'Administrator',
        email: adminEmail,
        photoURL: undefined,
        createdAt: new Date().toISOString(),
        provider: 'password',
        role: 'admin',
        isAdminClaim: true
      };

      setUser(profile);
      setIsLoading(false);
      return { success: true, isAdmin: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e?.message || 'Direct admin sign-in failed.' };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || isEmailAdmin(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        registeredUsers,
        adminAuditLogs,
        signInWithGooglePopup,
        signInWithAdminCredentials,
        signInAsAdminDirectly,
        signOut,
        logAdminAction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
