import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X, Gamepad2 } from "lucide-react";

interface LearnCard {
  title: string;
  content: string;
  image: string;
}

interface Mission {
  id: string;
  title: string;
  learnCards: LearnCard[];
}

interface LearnPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  mission?: Mission;
}

export function LearnPhaseModal({ isOpen, onClose, onComplete, mission }: LearnPhaseModalProps) {
  const [currentCard, setCurrentCard] = useState(0);

  const learnCards: LearnCard[] = mission?.learnCards || [
    {
      title: "Understanding Water Contamination",
      content: "Water contamination occurs when harmful substances make water unsafe for drinking, cooking, or other uses. Common contaminants include bacteria, viruses, chemicals, and heavy metals. In rural areas, contamination often comes from agricultural runoff, improper waste disposal, and lack of sanitation infrastructure.",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      title: "Physical Filtration Methods",
      content: "Physical filtration removes particles and sediments from water using barriers like sand, gravel, and cloth filters. These methods are effective for removing larger contaminants but may not eliminate bacteria or chemicals. Multi-stage filtration systems combine different materials to improve effectiveness.",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      title: "Chemical Purification",
      content: "Chemical purification uses substances like chlorine, iodine, or water purification tablets to kill harmful microorganisms. This method is effective against bacteria and viruses but requires careful dosing to avoid harmful side effects. It's often combined with physical filtration for best results.",
      image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    },
    {
      title: "Advanced Purification Technologies",
      content: "Advanced methods include UV sterilization, reverse osmosis, and distillation. UV light kills microorganisms without chemicals, while reverse osmosis removes almost all contaminants. These technologies are more expensive but provide the highest level of purification.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
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
              <DialogTitle>Learn Phase: Water Purification</DialogTitle>
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
            <img 
              src={learnCards[currentCard]?.image}
              alt={learnCards[currentCard]?.title}
              className="w-full h-48 object-cover rounded-lg mb-4" 
            />
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
