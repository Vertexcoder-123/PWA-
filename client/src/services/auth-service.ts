import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase-config';

export type UserRole = 'student' | 'teacher';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: any;
  level?: number;
  totalXp?: number;
  streak?: number;
  badges?: number;
  completedTreasures?: string[];
}

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, displayName: string, role: UserRole): Promise<AppUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userData: AppUser = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        createdAt: serverTimestamp(),
        ...(role === 'student' && {
          level: 1,
          totalXp: 0,
          streak: 0,
          badges: 0,
          completedTreasures: []
        })
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string): Promise<AppUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      return userDoc.data() as AppUser;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Sign out user
  static async signOutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  // Get current user profile
  static async getCurrentUserProfile(): Promise<AppUser | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as AppUser;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AppUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as AppUser);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Failed to get user profile on auth change:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Check if current user has specific role
  static async hasRole(role: UserRole): Promise<boolean> {
    const user = await this.getCurrentUserProfile();
    return user?.role === role;
  }
}