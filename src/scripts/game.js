const config = new Object();

// HTML Rendering API
config.type = Phaser.CANVAS;

// World size
config.width = 32 * 24; // 32 px/tile * 96 tile/world
config.height = 32 * 16; // 32 px/tile * 16 tile/world

// Optimize for pixel art
config.pixelArt = true;

// Scenes in this game
config.scene = [EndlessLevel];

// Physics: collisions and gravity
config.physics = { default: "arcade" };

// Start game with these configs
const game = new Phaser.Game(config);
