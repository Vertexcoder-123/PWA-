import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Puzzle, CheckCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface PuzzlePosition {
  id: string;
  clue: string;
  label: string;
}

interface WordPuzzleData {
  positions: PuzzlePosition[];
  connections: string[];
}

export function GameModal({ isOpen, onClose, onComplete }: GameModalProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [placedClues, setPlacedClues] = useState<Record<string, string>>({});
  const [connectionWords, setConnectionWords] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  // Water Cycle Word Puzzle data matching content.json
  const puzzleData: WordPuzzleData = {
    positions: [
      { id: "evaporation", clue: "🌊", label: "Water rises as vapor" },
      { id: "condensation", clue: "☁️", label: "Vapor forms clouds" },
      { id: "precipitation", clue: "🌧️", label: "Water falls to Earth" }
    ],
    connections: ["collection", "runoff", "infiltration"]
  };

  const availableClues = ["🌊", "☁️", "🌧️"];

  useEffect(() => {
    if (isOpen) {
      setPlacedClues({});
      setConnectionWords({});
      setIsComplete(false);
    }
  }, [isOpen]);

  const handleDragStart = (event: React.DragEvent, clue: string) => {
    setDraggedItem(clue);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: React.DragEvent, positionId: string) => {
    event.preventDefault();
    if (!draggedItem) return;

    const correctClue = puzzleData.positions.find(p => p.id === positionId)?.clue;
    if (draggedItem === correctClue) {
      setPlacedClues(prev => ({ ...prev, [positionId]: draggedItem }));
      toast({
        title: "Correct!",
        description: "Clue placed successfully!",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "This clue doesn't belong here. Try again!",
        variant: "destructive",
      });
    }
    setDraggedItem(null);
  };

  const handleConnectionWordChange = (connection: string, value: string) => {
    setConnectionWords(prev => ({ ...prev, [connection]: value.toLowerCase() }));
  };

  const handleSubmit = () => {
    const allCluesPlaced = puzzleData.positions.every(pos => placedClues[pos.id]);
    const allConnectionsFilled = puzzleData.connections.every(conn => connectionWords[conn]?.trim());
    
    if (!allCluesPlaced) {
      toast({
        title: "Incomplete Puzzle",
        description: "Please place all clues in their correct positions first.",
        variant: "destructive",
      });
      return;
    }

    if (!allConnectionsFilled) {
      toast({
        title: "Missing Connections", 
        description: "Please fill in all the connecting words to complete the water cycle.",
        variant: "destructive",
      });
      return;
    }

    // Check connection words (basic validation - could be expanded)
    const correctConnections = {
      "collection": ["collection", "gather", "accumulation"],
      "runoff": ["runoff", "flow", "drainage"], 
      "infiltration": ["infiltration", "seepage", "absorption"]
    };

    let correctCount = 0;
    puzzleData.connections.forEach(conn => {
      const userAnswer = connectionWords[conn]?.toLowerCase();
      if (correctConnections[conn as keyof typeof correctConnections].includes(userAnswer)) {
        correctCount++;
      }
    });

    const score = (correctCount / puzzleData.connections.length) * 100;
    
    toast({
      title: "Water Cycle Puzzle Complete!",
      description: `You got ${correctCount}/${puzzleData.connections.length} connections correct!`,
    });
    
    setIsComplete(true);
    
    // Auto advance after 2 seconds to show success
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleReset = () => {
    setPlacedClues({});
    setConnectionWords({});
    setIsComplete(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="p-4 border-b border-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5" />
                Water Cycle Word Puzzle
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-game">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Drag the clues to their correct positions and fill in the connecting words to complete the water cycle!
            </p>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Available Clues */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Available Clues (Drag to place)</h3>
            <div className="flex gap-3">
              {availableClues.map(clue => {
                const isUsed = Object.values(placedClues).includes(clue);
                return (
                  <div
                    key={clue}
                    draggable={!isUsed}
                    onDragStart={(e) => handleDragStart(e, clue)}
                    className={`w-16 h-16 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center text-2xl cursor-move transition-all ${
                      isUsed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'
                    } ${draggedItem === clue ? 'opacity-75 rotate-2' : ''}`}
                  >
                    {!isUsed ? clue : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Puzzle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {puzzleData.positions.map(position => (
              <div key={position.id} className="text-center">
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, position.id)}
                  className={`w-20 h-20 mx-auto mb-3 border-2 border-dashed rounded-lg flex items-center justify-center text-3xl transition-all ${
                    placedClues[position.id] 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {placedClues[position.id] || '?'}
                  {placedClues[position.id] && (
                    <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
                  )}
                </div>
                <h4 className="font-semibold capitalize text-sm">{position.id}</h4>
                <p className="text-xs text-muted-foreground">{position.label}</p>
              </div>
            ))}
          </div>

          {/* Connection Words */}
          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Complete the Water Cycle</h3>
            <p className="text-sm text-muted-foreground">
              Fill in the connecting processes that complete the water cycle:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {puzzleData.connections.map(connection => (
                <div key={connection}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {connection}
                  </label>
                  <Input
                    placeholder={`Enter ${connection}...`}
                    value={connectionWords[connection] || ''}
                    onChange={(e) => handleConnectionWordChange(connection, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Puzzle
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isComplete}
              className="play-gradient text-white"
            >
              {isComplete ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Puzzle Complete!
                </>
              ) : (
                'Complete Puzzle'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
