import Phaser from 'phaser';

class WaterPurifierScene extends Phaser.Scene {
  private onComplete?: () => void;

  constructor() {
    super({ key: 'WaterPurifierScene' });
  }

  init(data: { onComplete?: () => void }) {
    this.onComplete = data.onComplete;
  }

  preload() {
    // Create colored rectangles as placeholders for game assets
    this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    console.log("Phaser scene created, setting up auto-complete");
    
    // Set background
    this.add.rectangle(400, 200, 800, 400, 0x87CEEB);

    // Title
    const title = this.add.text(400, 100, 'Water Purifier Simulation', {
      fontSize: '28px',
      color: '#333333',
      fontFamily: 'Inter, Arial, sans-serif'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(400, 140, 'Coming Soon', {
      fontSize: '18px',
      color: '#666666',
      fontFamily: 'Inter, Arial, sans-serif'
    });
    subtitle.setOrigin(0.5);

    // Description
    const description = this.add.text(400, 200, 
      'Build your own water purification system by selecting filters,\ntesting water quality, and optimizing your design for maximum efficiency.', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'Inter, Arial, sans-serif',
      align: 'center'
    });
    description.setOrigin(0.5);

    // Game icon placeholder
    const gameIcon = this.add.circle(400, 270, 30, 0x2563EB);
    const iconText = this.add.text(400, 270, '🎮', {
      fontSize: '24px'
    });
    iconText.setOrigin(0.5);

    // Add click to continue
    const continueText = this.add.text(400, 340, 'Click anywhere to continue or wait 3 seconds', {
      fontSize: '12px',
      color: '#999999',
      fontFamily: 'Inter, Arial, sans-serif'
    });
    continueText.setOrigin(0.5);

    // Make the entire scene clickable
    this.input.on('pointerdown', () => {
      console.log("Game clicked, advancing to Conquer phase");
      if (this.onComplete) {
        this.onComplete();
      }
    });

    // Auto-complete after 3 seconds for demo
    console.log("Setting up 3-second auto-complete timer");
    this.time.delayedCall(3000, () => {
      console.log("Auto-complete timer triggered, advancing to Conquer phase");
      if (this.onComplete) {
        this.onComplete();
      }
    });
  }
}

export function initializeGame(container: HTMLElement, onComplete: () => void) {
  console.log("initializeGame called with container:", container, "onComplete:", typeof onComplete);
  
  try {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 400,
      parent: container,
      backgroundColor: '#87CEEB',
      scene: WaterPurifierScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      }
    };

    console.log("Creating Phaser.Game with config:", config);
    const game = new Phaser.Game(config);
    console.log("Phaser.Game created:", game);
    
    // Pass the onComplete callback to the scene
    console.log("Starting WaterPurifierScene with onComplete callback");
    game.scene.start('WaterPurifierScene', { onComplete });

    return game;
  } catch (error) {
    console.error("Error in initializeGame:", error);
    throw error;
  }
}
