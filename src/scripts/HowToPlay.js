class HowToPlay extends Phaser.Scene {
  constructor() {
    super('howto');
  }

  preload(){
    // ensure path matches project layout
    this.load.path = 'src/assets/';
    // use a matching key for the how-to scene
    this.load.image('howto-bg', 'dark-mountain-forest-2.png');
    }

  create() {
  const bg = this.add.image(0, 0, 'howto-bg').setOrigin(0);
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    bg.setScrollFactor(0);
    bg.setDepth(-1);

    const width= this.game.config.width;
    const height = this.game.config.height;

    this.add.text(width / 2, 60, 'How To Play', { fontSize: '36px', fill: '#FFFFFF' }).setOrigin(0.5);

    const lines = [
      'Use WASD to move your character.',
      'Press Spacebar to attack in the facing direction.',
      'Defeat enemies and survive as long as you can.',
      'Collect points for each enemy defeated.'
    ];

    this.add.text(width / 2, height / 3, lines.join('\n\n'), { fontSize: '20px', fill: '#FFFFFF', align: 'center' }).setOrigin(0.5);

    const back = this.add.text(width / 2, height - 80, 'Back', { fontSize: '24px', fill: '#FFFFFF' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => this.scene.start('title'));
    back.on('pointerover', () => back.setStyle({ fill: '#FFFF00' }));
    back.on('pointerout', () => back.setStyle({ fill: '#FFFFFF' }));

    // Keyboard: ESC returns to title
    this.input.keyboard.on('keydown-ESC', () => { this.scene.start('title'); });
  }
}
