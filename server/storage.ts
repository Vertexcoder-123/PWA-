import { 
  type User, 
  type InsertUser,
  type Mission,
  type InsertMission,
  type UserMissionProgress,
  type InsertUserMissionProgress
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMission(id: string): Promise<Mission | undefined>;
  createMission(mission: InsertMission): Promise<Mission>;
  getUserMissionProgress(userId: string, missionId: string): Promise<UserMissionProgress | undefined>;
  updateMissionProgress(progress: InsertUserMissionProgress): Promise<UserMissionProgress>;
  updateUserStats(userId: string, xpGained: number): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private missions: Map<string, Mission>;
  private userMissionProgress: Map<string, UserMissionProgress>;

  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.userMissionProgress = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Create a default user
    const defaultUser: User = {
      id: "user-1",
      username: "alex_kumar",
      password: "password123",
      name: "Alex Kumar",
      level: 3,
      totalXp: 1250,
      streak: 12,
      badges: 8,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create the water purifier mission
    const waterPurifierMission: Mission = {
      id: "water-purifier",
      title: "Mission: Water Purifier",
      description: "Learn how water purification systems work and help design a clean water solution for your village.",
      difficulty: 3,
      xpReward: 500,
      content: {
        learnCards: [
          {
            title: "Understanding Water Contamination",
            content: "Water contamination occurs when harmful substances make water unsafe for drinking, cooking, or other uses...",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
          },
          {
            title: "Physical Filtration Methods",
            content: "Physical filtration removes particles and sediments from water using barriers like sand, gravel, and cloth filters...",
            image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
          },
          {
            title: "Chemical Purification",
            content: "Chemical purification uses substances like chlorine, iodine, or water purification tablets...",
            image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
          },
          {
            title: "Advanced Purification Technologies",
            content: "Advanced methods include UV sterilization, reverse osmosis, and distillation...",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
          }
        ],
        quizQuestions: [
          {
            question: "What is the most common cause of water contamination in rural areas?",
            options: [
              "Industrial pollution from factories",
              "Agricultural runoff and improper waste disposal",
              "Natural mineral deposits",
              "Excessive rainfall"
            ],
            correct: 1,
            explanation: "Agricultural runoff and improper waste disposal are the primary causes of water contamination in rural areas..."
          },
          {
            question: "Which filtration method is most effective for removing bacteria and viruses?",
            options: [
              "Sand filtration only",
              "Cloth filtration", 
              "Combined chemical treatment and UV sterilization",
              "Boiling water for 1 minute"
            ],
            correct: 2,
            explanation: "Combined chemical treatment and UV sterilization provides the most comprehensive protection..."
          },
          {
            question: "What is the main advantage of UV sterilization over chemical treatment?",
            options: [
              "It's much cheaper to implement",
              "It doesn't require electricity",
              "It kills microorganisms without adding chemicals to the water",
              "It works faster than chemical treatment"
            ],
            correct: 2,
            explanation: "UV sterilization's main advantage is that it effectively kills microorganisms without introducing chemicals..."
          }
        ]
      },
      isActive: true,
      createdAt: new Date(),
    };
    this.missions.set(waterPurifierMission.id, waterPurifierMission);

    // Create initial progress for the user
    const initialProgress: UserMissionProgress = {
      id: randomUUID(),
      userId: "user-1",
      missionId: "water-purifier",
      currentPhase: "learn",
      learnProgress: 0,
      playProgress: 0,
      conquerProgress: 0,
      quizAnswers: null,
      score: null,
      completed: false,
      completedAt: null,
      updatedAt: new Date(),
    };
    this.userMissionProgress.set(`user-1:water-purifier`, initialProgress);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      level: 1,
      totalXp: 0,
      streak: 0,
      badges: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getMission(id: string): Promise<Mission | undefined> {
    return this.missions.get(id);
  }

  async createMission(insertMission: InsertMission): Promise<Mission> {
    const id = randomUUID();
    const mission: Mission = {
      ...insertMission,
      id,
      difficulty: insertMission.difficulty ?? 1,
      xpReward: insertMission.xpReward ?? 100,
      isActive: insertMission.isActive ?? true,
      createdAt: new Date()
    };
    this.missions.set(id, mission);
    return mission;
  }

  async getUserMissionProgress(userId: string, missionId: string): Promise<UserMissionProgress | undefined> {
    const key = `${userId}:${missionId}`;
    return this.userMissionProgress.get(key);
  }

  async updateMissionProgress(progress: InsertUserMissionProgress): Promise<UserMissionProgress> {
    const key = `${progress.userId}:${progress.missionId}`;
    const existing = this.userMissionProgress.get(key);
    
    const updated: UserMissionProgress = {
      id: existing?.id || randomUUID(),
      ...progress,
      currentPhase: progress.currentPhase ?? "learn",
      learnProgress: progress.learnProgress ?? 0,
      playProgress: progress.playProgress ?? 0,
      conquerProgress: progress.conquerProgress ?? 0,
      quizAnswers: progress.quizAnswers ?? null,
      score: progress.score ?? null,
      completedAt: progress.completedAt ?? null,
      completed: progress.completed ?? false,
      updatedAt: new Date(),
    };
    
    this.userMissionProgress.set(key, updated);
    
    // If mission is completed, update user stats
    if (updated.completed && !existing?.completed) {
      const mission = await this.getMission(updated.missionId);
      if (mission) {
        await this.updateUserStats(updated.userId, mission.xpReward);
      }
    }
    
    return updated;
  }

  async updateUserStats(userId: string, xpGained: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const updatedUser: User = {
      ...user,
      totalXp: user.totalXp + xpGained,
      level: Math.floor((user.totalXp + xpGained) / 500) + 1, // Level up every 500 XP
      badges: user.badges + 1, // Add a badge for mission completion
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
