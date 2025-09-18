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
    // Set background
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB);

    // Title
    const title = this.add.text(400, 150, 'Water Purifier Simulation', {
      fontSize: '28px',
      color: '#333333',
      fontFamily: 'Inter, Arial, sans-serif'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(400, 200, 'Coming Soon', {
      fontSize: '18px',
      color: '#666666',
      fontFamily: 'Inter, Arial, sans-serif'
    });
    subtitle.setOrigin(0.5);

    // Description
    const description = this.add.text(400, 280, 
      'Build your own water purification system by selecting filters,\ntesting water quality, and optimizing your design for maximum efficiency.', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'Inter, Arial, sans-serif',
      align: 'center'
    });
    description.setOrigin(0.5);

    // Game icon placeholder
    const gameIcon = this.add.circle(400, 350, 30, 0x2563EB);
    const iconText = this.add.text(400, 350, '🎮', {
      fontSize: '24px'
    });
    iconText.setOrigin(0.5);

    // Auto-complete after 3 seconds for demo
    this.time.delayedCall(3000, () => {
      if (this.onComplete) {
        this.onComplete();
      }
    });

    // Add click to continue
    const continueText = this.add.text(400, 450, 'Click anywhere to continue', {
      fontSize: '12px',
      color: '#999999',
      fontFamily: 'Inter, Arial, sans-serif'
    });
    continueText.setOrigin(0.5);

    this.input.on('pointerdown', () => {
      if (this.onComplete) {
        this.onComplete();
      }
    });
  }
}

export function initializeGame(container: HTMLElement, onComplete: () => void) {
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

  const game = new Phaser.Game(config);
  
  // Pass the onComplete callback to the scene
  game.scene.start('WaterPurifierScene', { onComplete });

  return game;
}
