import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-config';
import { AuthService, type AppUser } from '@/services/auth-service';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role: 'student' | 'teacher') => Promise<AppUser>;
  signIn: (email: string, password: string) => Promise<AppUser>;
  signOut: () => Promise<void>;
  hasRole: (role: 'student' | 'teacher') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as AppUser);
          } else {
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Failed to get user profile:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string, role: 'student' | 'teacher') => {
    const user = await AuthService.signUp(email, password, displayName, role);
    setCurrentUser(user);
    return user;
  };

  const signIn = async (email: string, password: string) => {
    const user = await AuthService.signIn(email, password);
    setCurrentUser(user);
    return user;
  };

  const signOut = async () => {
    await AuthService.signOutUser();
    setCurrentUser(null);
  };

  const hasRole = (role: 'student' | 'teacher') => {
    return currentUser?.role === role;
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}