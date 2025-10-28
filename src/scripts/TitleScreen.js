class TitleScene extends Phaser.Scene {
    constructor() {
        super('title'); // Register scene with key 'title'
    }

    preload(){
        // ensure path matches project layout (assets live in src/assets)
        this.load.path = 'src/assets/';
        this.load.image('title-bg', 'dark-mountain-forest-1.png');
    }

    create() {
        const bg = this.add.image(0, 0, 'title-bg').setOrigin(0);
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        bg.setScrollFactor(0);
        bg.setDepth(-1);

        this.create_title();
        this.create_game_data();
        this.create_topscore();
        this.create_buttons();

        // Keyboard shortcuts: SPACE to play, ESC to open credits
        this.input.keyboard.on('keydown-SPACE', () => { this.scene.start('Endless'); });
        this.input.keyboard.on('keydown-ESC', () => { this.scene.start('credits'); });

    }

    // Create interactive menu buttons: Play, How To Play, Credits
    create_buttons() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        const buttonStyle = { fontSize: '24px', fill: '#FFFFFF' };
        const hoverStyle = { fontSize: '24px', fill: '#FFFF00' };

        const menu = [
            { label: 'Play', scene: 'Endless' },
            { label: 'How To Play', scene: 'howto' },
            { label: 'Credits', scene: 'credits' }
        ];

        const startY = height / 2 + 80;
        const spacing = 48;

        menu.forEach((item, idx) => {
            const y = startY + idx * spacing;
            const txt = this.add.text(width / 2, y, item.label, buttonStyle).setOrigin(0.5).setInteractive({ useHandCursor: true });
            txt.on('pointerover', () => txt.setStyle(hoverStyle));
            txt.on('pointerout', () => txt.setStyle(buttonStyle));
            txt.on('pointerdown', () => this.scene.start(item.scene));
        });
    }

    // src/TitleScene.js → create()
    create_title() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        // Game Title
        this.add.text(width / 2, height / 3, 'DODGER GAME', {
            fontSize: '48px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(width / 2, height / 2, 'Arrow Keys to Move\nSpacebar to Fire', {
            fontSize: '24px',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

    }

    create_game_data() {
        // Set default values in the registry only if they don't already exist
        this.registry.set('top_score', this.registry.get('top_score') || 100);
        this.registry.set('winner', this.registry.get('winner') || 'Top Score');
    }

    create_topscore(){
        // Get the top score and winner from the registry
        const topScore = this.registry.get('top_score');
        const winner = this.registry.get('winner');

        // Display the top score
        const x = this.game.config.width / 2;
        const y = this.game.config.height - 50;
        this.add.text(x,y, `Leader: ${winner} - ${topScore}`, {
            fontSize: '20px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
    }
}