import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';

export interface UserProgress {
  userId: string;
  username: string;
  level: number;
  totalXp: number;
  streak: number;
  badges: number;
  completedTreasures: string[];
  currentTreasure?: string;
  createdAt: any;
  updatedAt: any;
}

export interface MissionProgress {
  userId: string;
  treasureId: string;
  completedClues: string[];
  score?: number;
  completedAt?: any;
  xpEarned?: number;
}

export class FirebaseService {
  // User Management
  static async createUser(userId: string, username: string): Promise<UserProgress> {
    const userRef = doc(db, 'users', userId);
    const userData: UserProgress = {
      userId,
      username,
      level: 1,
      totalXp: 0,
      streak: 0,
      badges: 0,
      completedTreasures: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(userRef, userData);
    return userData;
  }

  static async getUser(userId: string): Promise<UserProgress | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProgress;
    }
    return null;
  }

  static async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  // Mission Progress Management
  static async saveMissionProgress(userId: string, treasureId: string, data: Partial<MissionProgress>): Promise<void> {
    const progressRef = doc(db, 'mission_progress', `${userId}_${treasureId}`);
    const progressData: MissionProgress = {
      userId,
      treasureId,
      completedClues: [],
      ...data,
      completedAt: data.completedAt || serverTimestamp(),
    };
    
    await setDoc(progressRef, progressData, { merge: true });
  }

  static async getMissionProgress(userId: string, treasureId: string): Promise<MissionProgress | null> {
    const progressRef = doc(db, 'mission_progress', `${userId}_${treasureId}`);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return progressSnap.data() as MissionProgress;
    }
    return null;
  }

  static async getUserMissions(userId: string): Promise<MissionProgress[]> {
    const q = query(
      collection(db, 'mission_progress'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as MissionProgress);
  }

  // Complete a treasure hunt
  static async completeTreasure(userId: string, treasureId: string, score: number, xpEarned: number): Promise<void> {
    // Save mission progress
    await this.saveMissionProgress(userId, treasureId, {
      completedClues: ['🌊', '☁️', '🌧️'], // All clues completed
      score,
      xpEarned,
      completedAt: serverTimestamp(),
    });

    // Update user progress
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalXp: increment(xpEarned),
      badges: increment(1),
      completedTreasures: treasureId, // This would need array union in real implementation
      streak: increment(1),
      updatedAt: serverTimestamp(),
    });
  }

  // Offline sync support
  static async savePendingData(data: any): Promise<void> {
    try {
      localStorage.setItem('pendingMissionData', JSON.stringify(data));
      console.log('Data saved for offline sync');
    } catch (error) {
      console.error('Failed to save pending data:', error);
    }
  }

  static async syncPendingData(): Promise<void> {
    try {
      const pendingData = localStorage.getItem('pendingMissionData');
      if (pendingData) {
        const data = JSON.parse(pendingData);
        // Sync with Firebase
        await this.completeTreasure(
          data.userId,
          data.treasureId,
          data.score,
          data.xpEarned
        );
        localStorage.removeItem('pendingMissionData');
        console.log('Pending data synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync pending data:', error);
    }
  }
}