import { useQuery } from "@tanstack/react-query";
import treasureContent from "@/data/content.json";

interface Clue {
  name: string;
  description: string;
  emoji: string;
}

interface ChallengeData {
  type: string;
  instruction?: string;
  steps?: string[];
  questions?: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>;
}

interface ClueTrailLesson {
  lessonId: number;
  title: string;
  objective: string;
  content: string;
  clue: Clue;
  challengeType: string;
  challengeData: ChallengeData;
}

interface FinalChallenge {
  type: string;
  title: string;
  description: string;
  instructions: string;
  requiredClues: string[];
  puzzle: {
    positions: Array<{
      id: string;
      clue: string;
      label: string;
    }>;
    connections: string[];
  };
}

interface Treasure {
  name: string;
  badge: string;
  description: string;
  unlocks: string[];
}

interface TreasureHunt {
  subject: string;
  treasureMap: string;
  treasureId: string;
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  clueTrail: ClueTrailLesson[];
  finalChallenge: FinalChallenge;
  treasure: Treasure;
}

export function useTreasureData(treasureId: string) {
  return useQuery<TreasureHunt>({
    queryKey: ['/api/treasure', treasureId],
    queryFn: async () => {
      // In a real app, this would fetch from Firebase Firestore
      // For now, return the treasure data from the imported JSON
      if (treasureId === "water-cycle") {
        return treasureContent as TreasureHunt;
      }
      throw new Error(`Treasure ${treasureId} not found`);
    },
    staleTime: Infinity, // Treasure content rarely changes
  });
}

// Legacy function for backward compatibility 
export function useMissionData(missionId: string) {
  return useTreasureData(missionId === "water-purifier" ? "water-cycle" : missionId);
}
