class Credits extends Phaser.Scene {
  constructor() {
    super('credits');
  }

  create() {
    const width = this.game.config.width;
    const height = this.game.config.height;

    this.add.text(width / 2, 60, 'Credits', { fontSize: '36px', fill: '#FFFFFF' }).setOrigin(0.5);

    const lines = [
      'Game: Dodger Game',
      'Created by: John (jtn9701)',
      'Art: placeholder assets',
      'Engine: Phaser 3'
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
