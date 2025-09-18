import { useQuery } from "@tanstack/react-query";
import missionContent from "@/data/content.json";

interface LearnCard {
  title: string;
  content: string;
  image: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  learnCards: LearnCard[];
  quizQuestions: QuizQuestion[];
}

export function useMissionData(missionId: string) {
  return useQuery<Mission>({
    queryKey: ['/api/mission', missionId],
    queryFn: async () => {
      // In a real app, this would fetch from the backend API
      // For now, return the mission data from the imported JSON
      if (missionId === "water-purifier") {
        return missionContent as Mission;
      }
      throw new Error(`Mission ${missionId} not found`);
    },
    staleTime: Infinity, // Mission content rarely changes
  });
}
