import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(1),
  totalXp: integer("total_xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  badges: integer("badges").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: integer("difficulty").notNull().default(1),
  xpReward: integer("xp_reward").notNull().default(100),
  content: jsonb("content").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const userMissionProgress = pgTable("user_mission_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  missionId: varchar("mission_id").notNull().references(() => missions.id),
  currentPhase: text("current_phase").notNull().default("learn"), // learn, play, conquer, completed
  learnProgress: integer("learn_progress").notNull().default(0),
  playProgress: integer("play_progress").notNull().default(0),
  conquerProgress: integer("conquer_progress").notNull().default(0),
  quizAnswers: jsonb("quiz_answers"),
  score: integer("score"),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
});

export const insertUserMissionProgressSchema = createInsertSchema(userMissionProgress).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertUserMissionProgress = z.infer<typeof insertUserMissionProgressSchema>;
export type UserMissionProgress = typeof userMissionProgress.$inferSelect;
