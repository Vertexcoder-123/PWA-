import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LearnPhaseModal } from "@/components/learn-phase-modal";
import { ConquerPhaseModal } from "@/components/conquer-phase-modal";
import { GameModal } from "@/components/game-modal";
import { useMissionData } from "@/hooks/use-mission-data";
import { Trophy, BookOpen, Gamepad2, Star, Medal, CheckCircle, Leaf, Sprout } from "lucide-react";

export default function StudentDashboard() {
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isConquerModalOpen, setIsConquerModalOpen] = useState(false);
  const { data: mission, isLoading } = useMissionData("water-purifier");

  const mockUser = {
    name: "Alex Kumar",
    level: 3,
    title: "Explorer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80",
    totalXp: 1250,
    streak: 12,
    badges: 8,
  };

  const completedMissions = [
    {
      id: "solar-power",
      title: "Solar Power Systems",
      completedDate: "2 days ago",
      xpEarned: 500,
      badgeIcon: Medal,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    },
    {
      id: "wind-energy",
      title: "Wind Energy Basics", 
      completedDate: "5 days ago",
      xpEarned: 450,
      badgeIcon: Leaf,
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    },
    {
      id: "organic-farming",
      title: "Organic Farming",
      completedDate: "1 week ago", 
      xpEarned: 300,
      badgeIcon: Sprout,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80",
    },
  ];

  const handleStartLearn = () => {
    setIsLearnModalOpen(true);
  };

  const handleLearnComplete = () => {
    setIsLearnModalOpen(false);
    setIsGameModalOpen(true);
  };

  const handleGameComplete = () => {
    setIsGameModalOpen(false);
    setIsConquerModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading mission data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 quest-gradient rounded-lg flex items-center justify-center">
                <BookOpen className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EduQuest</h1>
                <p className="text-sm text-muted-foreground">Rural Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium" data-testid="text-username">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground">Level {mockUser.level} {mockUser.title}</p>
              </div>
              <img 
                src={mockUser.avatar}
                alt="Student profile picture" 
                className="w-10 h-10 rounded-full border-2 border-primary" 
                data-testid="img-avatar"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Quest Progress</h2>
              <div className="text-sm text-muted-foreground">3 of 5 missions completed</div>
            </div>
            <Progress value={60} className="mb-4 h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="text-total-xp">{mockUser.totalXp}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary" data-testid="text-streak">{mockUser.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent" data-testid="text-badges">{mockUser.badges}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Mission */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Current Mission</h2>
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Study Guide
            </Button>
          </div>

          <Card className="overflow-hidden card-hover" data-testid="card-current-mission">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-400 relative">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
                alt="Water treatment facility with large filtration tanks" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium">
                Mission 4
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2" data-testid="text-mission-title">Mission: Water Purifier</h3>
                  <p className="text-muted-foreground text-sm" data-testid="text-mission-description">
                    Learn how water purification systems work and help design a clean water solution for your village.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                  <div className="flex space-x-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <Star className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Mission Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Mission Progress</span>
                  <span className="text-sm text-muted-foreground">1 of 3 phases</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>

              {/* Learn-Play-Conquer Loop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 learn-gradient rounded-lg flex items-center justify-center">
                      <BookOpen className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Learn</h4>
                      <p className="text-xs text-muted-foreground">Study concepts</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Understand water contamination, filtration methods, and purification technologies.
                  </p>
                  <div className="text-xs text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    In Progress
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 relative opacity-60">
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 play-gradient rounded-lg flex items-center justify-center">
                      <Gamepad2 className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Play</h4>
                      <p className="text-xs text-muted-foreground">Interactive simulation</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Build and test your water purification system in our virtual lab.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    🔒 Locked
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 relative opacity-60">
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 conquer-gradient rounded-lg flex items-center justify-center">
                      <Trophy className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Conquer</h4>
                      <p className="text-xs text-muted-foreground">Master the challenge</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Take the final quiz and earn your Water Purification Expert badge.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    🔒 Locked
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleStartLearn}
                className="w-full learn-gradient text-white hover:opacity-90"
                data-testid="button-start-learn"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Completed Missions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Missions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedMissions.map((mission, index) => {
              const BadgeIcon = mission.badgeIcon;
              return (
                <Card key={mission.id} className="card-hover" data-testid={`card-completed-mission-${index}`}>
                  <CardContent className="p-4">
                    <div className="h-32 bg-gradient-to-r rounded-lg mb-3 relative">
                      <img 
                        src={mission.image}
                        alt={`${mission.title} completed mission`}
                        className="w-full h-full object-cover rounded-lg" 
                      />
                      <div className="absolute top-2 right-2 bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{mission.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Completed {mission.completedDate}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-accent font-medium">+{mission.xpEarned} XP</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <BadgeIcon className="text-white w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <LearnPhaseModal 
        isOpen={isLearnModalOpen}
        onClose={() => setIsLearnModalOpen(false)}
        onComplete={handleLearnComplete}
        mission={mission}
      />

      <GameModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        onComplete={handleGameComplete}
      />

      <ConquerPhaseModal
        isOpen={isConquerModalOpen}
        onClose={() => setIsConquerModalOpen(false)}
        mission={mission}
      />
    </div>
  );
}
