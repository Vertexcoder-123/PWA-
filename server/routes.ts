import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserMissionProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get mission progress for a user
  app.get("/api/mission-progress/:userId/:missionId", async (req, res) => {
    try {
      const { userId, missionId } = req.params;
      const progress = await storage.getUserMissionProgress(userId, missionId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get mission progress" });
    }
  });

  // Update mission progress
  app.post("/api/mission-progress", async (req, res) => {
    try {
      const validatedData = insertUserMissionProgressSchema.parse(req.body);
      const progress = await storage.updateMissionProgress(validatedData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update mission progress" });
      }
    }
  });

  // Get user stats
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        totalXp: user.totalXp,
        streak: user.streak,
        badges: user.badges,
        level: user.level
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });

  // Get mission content
  app.get("/api/mission/:missionId", async (req, res) => {
    try {
      const { missionId } = req.params;
      const mission = await storage.getMission(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.json(mission);
    } catch (error) {
      res.status(500).json({ message: "Failed to get mission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
