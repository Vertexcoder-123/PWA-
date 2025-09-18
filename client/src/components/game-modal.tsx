import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Gamepad2 } from "lucide-react";
import { initializeGame } from "@/lib/game-engine";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function GameModal({ isOpen, onClose, onComplete }: GameModalProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Simple fallback: auto-complete after 3 seconds with click handler
      const timeoutId = setTimeout(() => {
        console.log("Auto-completing Play phase after 3 seconds");
        onComplete();
      }, 3000);

      // Add click handler to the container for immediate completion
      const handleClick = () => {
        console.log("Play phase clicked - advancing to Conquer");
        clearTimeout(timeoutId);
        onComplete();
      };

      const container = gameContainerRef.current;
      if (container) {
        container.addEventListener('click', handleClick);
      }

      return () => {
        clearTimeout(timeoutId);
        if (container) {
          container.removeEventListener('click', handleClick);
        }
      };
    }
  }, [isOpen, onComplete]);

  const handleClose = () => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.destroy(true);
      gameInstanceRef.current = null;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="p-4 border-b border-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Play Phase: Water Purifier Simulation</DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleClose} data-testid="button-close-game">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>
        
        <div 
          ref={gameContainerRef}
          className="w-full h-96 bg-gradient-to-b from-blue-100 to-blue-200"
          data-testid="game-container"
          style={{ position: 'relative' }}
        >
          {/* Play Phase Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center cursor-pointer">
            <div>
              <div className="w-20 h-20 play-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Water Purifier Simulation</h3>
              <p className="text-muted-foreground mb-4">Coming Soon</p>
              <p className="text-sm text-gray-600 max-w-md mb-4">
                Build your own water purification system by selecting filters, 
                testing water quality, and optimizing your design for maximum efficiency.
              </p>
              <p className="text-xs text-muted-foreground">
                Click anywhere to continue or wait 3 seconds
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
