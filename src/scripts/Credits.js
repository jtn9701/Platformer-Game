class Credits extends Phaser.Scene {
  constructor() {
    super('credits');
  }

  preload() {
    this.load.path = 'src/assets/';
    // use a matching key for the credits scene
    this.load.image('credits-bg', 'dark-mountain-forest-3.png');
  }

  create() {
    const bg = this.add.image(0, 0, 'credits-bg').setOrigin(0);
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    bg.setScrollFactor(0);
    bg.setDepth(-1);

    const width = this.game.config.width;
    const height = this.game.config.height;

    this.add.text(width / 2, 60, 'Credits', { fontSize: '36px', fill: '#FFFFFF' }).setOrigin(0.5);

    const lines = [
      'Game: THE PLATFORMER GAME',
      'Created by: Jason Nguyen and Johnny Vu',
      'Art: AI and ufotable (Kimetsu no Yaiba)',
    ];

  // Create the multiline credits text and a translucent black background behind it
  const content = this.add.text(width / 2, height / 3, lines.join('\n\n'), { fontSize: '20px', fill: '#FFFFFF', align: 'center' }).setOrigin(0.5);
  const padding = 16;
  const bounds = content.getBounds();
  const rect = this.add.rectangle(bounds.centerX, bounds.centerY, bounds.width + padding * 2, bounds.height + padding * 2, 0x000000, 0.6);
  rect.setOrigin(0.5);
  rect.setScrollFactor(0);
  content.setScrollFactor(0);
  rect.setDepth(content.depth - 1);

    const back = this.add.text(width / 2, height - 80, 'Back', { fontSize: '24px', fill: '#FFFFFF' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => this.scene.start('title'));
    back.on('pointerover', () => back.setStyle({ fill: '#FFFF00' }));
    back.on('pointerout', () => back.setStyle({ fill: '#FFFFFF' }));

    // Keyboard: ESC returns to title
    this.input.keyboard.on('keydown-ESC', () => { this.scene.start('title'); });
  }
}
