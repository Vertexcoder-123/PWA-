import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X, Gamepad2 } from "lucide-react";

interface ClueTrailLesson {
  lessonId: number;
  title: string;
  content: string;
  clue: {
    name: string;
    description: string;
    emoji: string;
  };
}

interface TreasureHunt {
  treasureId: string;
  title: string;
  clueTrail: ClueTrailLesson[];
}

interface LearnPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  treasure?: TreasureHunt;
}

export function LearnPhaseModal({ isOpen, onClose, onComplete, treasure }: LearnPhaseModalProps) {
  const [currentCard, setCurrentCard] = useState(0);

  const learnCards: ClueTrailLesson[] = treasure?.clueTrail || [
    {
      lessonId: 1,
      title: "Evaporation: Water's Journey Upward",
      content: "Evaporation is the first step in the water cycle. When the sun heats water in rivers, lakes, and oceans, it transforms from liquid to invisible water vapor that rises into the atmosphere. This process is crucial for moving water from Earth's surface to the sky, where it can form clouds.",
      clue: {
        name: "The Sun's Power",
        description: "Look for how heat energy transforms liquid water",
        emoji: "🌊"
      }
    },
    {
      lessonId: 2,
      title: "Condensation: Clouds Are Born",
      content: "As water vapor rises high in the atmosphere, it cools down and transforms back into tiny water droplets. These droplets cluster together to form clouds. This process is called condensation, and it's how nature prepares water to return to Earth.",
      clue: {
        name: "Cloud Formation",
        description: "Watch how cooling vapor becomes visible again",
        emoji: "☁️"
      }
    },
    {
      lessonId: 3,
      title: "Precipitation: Nature's Gift Returns",
      content: "When water droplets in clouds become too heavy, they fall back to Earth as precipitation - rain, snow, sleet, or hail. This completes the water cycle and brings fresh water back to the land, rivers, and oceans where the cycle begins again.",
      clue: {
        name: "Water's Return",
        description: "Discover how water comes back to Earth",
        emoji: "🌧️"
      }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentCard(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentCard < learnCards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const progress = ((currentCard + 1) / learnCards.length) * 100;
  const isLastCard = currentCard === learnCards.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <div className="sticky top-0 bg-background border-b p-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Clue Trail: {treasure?.title || "The Water Cycle Treasure"}</DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-learn">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground whitespace-nowrap" data-testid="text-learn-progress">
                {currentCard + 1} of {learnCards.length}
              </span>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-cyan-300 to-green-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl">{learnCards[currentCard]?.clue?.emoji}</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4" data-testid="text-card-title">
            {learnCards[currentCard]?.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed" data-testid="text-card-content">
            {learnCards[currentCard]?.content}
          </p>
        </div>

        <div className="p-4 border-t bg-muted/50">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentCard === 0}
              data-testid="button-previous-card"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              className={isLastCard ? "learn-gradient text-white" : "learn-gradient text-white"}
              data-testid="button-next-card"
            >
              {isLastCard ? (
                <>
                  Start Game
                  <Gamepad2 className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
