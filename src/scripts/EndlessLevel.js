class EndlessLevel extends Phaser.Scene {
  constructor(key = "Endless") {
    super(key);
    // TODO: adjust for custom map
    this.map_key = "map1";
    this.map_json = "level1.json";
  }

  // Preload external assets
  preload() {
    let ATTACK_FRAME = {
      frameWidth: 32,
      frameHeight: 32,
    };
    this.load.path = "src/assets/";
    // Tile Assets
    this.load.tilemapTiledJSON(this.map_key, this.map_json);
    const tile_size = { frameWidth: 32, frameHeight: 32 };
    this.load.spritesheet("tiles", "tiles.png", tile_size);
    // Player Assets
    this.load.image("player", "player.png");
    this.load.spritesheet("attack-up", "up-attack-temp.png", ATTACK_FRAME);
    this.load.spritesheet("attack-down", "down-attack-temp.png", ATTACK_FRAME);
    this.load.spritesheet("attack-left", "left-attack-temp.png", ATTACK_FRAME);
    this.load.spritesheet(
      "attack-right",
      "right-attack-temp.png",
      ATTACK_FRAME
    );
  }

  // Create game data
  create() {
    this.create_map();
    this.create_attack_animation();
    this.create_player();
    this.create_gravity();
    this.create_camera();
    this.create_collisions();
  }

  // Update game data
  update(time) {
    this.update_player(time);
    this.update_if_game_over();
  }

  //--------------------------------------HELPERS-----------------------------------------//
  //######################################CREATES#########################################//
  create_map() {
    this.map = this.make.tilemap({ key: this.map_key });

    // Arg 1: Tiled tileset name
    // Arg 2: image key loaded
    const groundTiles = this.map.addTilesetImage("tiles", "tiles");

    // Arg 1: Tiles layer name or index
    // Arg 2: Tileset
    // Arg 3: x offset px
    // Arg 4: y offset px
    this.groundLayer = this.map.createLayer("tiles", groundTiles, 0, 0);

    const ground_block = { terrain: "block" };
    this.groundLayer.setCollisionByProperty(ground_block);
  }

  create_player() {
    this.player = new Player(this);
  }

  create_gravity() {
    this.physics.world.gravity.y = 600;
  }

  create_camera() {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.setBackgroundColor("rgb(204, 207, 255)");
  }

  create_collisions() {
    this.physics.add.collider(this.player, this.groundLayer);
  }

  create_attack_animation() {
    let FRAME_INFO = { frameRate: 60, repeat: 0 };
    this.anims.create({
      ...FRAME_INFO,
      key: "attack-up",
      frames: this.anims.generateFrameNumbers("attack-up"),
    });
    this.anims.create({
      ...FRAME_INFO,
      key: "attack-down",
      frames: this.anims.generateFrameNumbers("attack-down"),
    });
    this.anims.create({
      ...FRAME_INFO,
      key: "attack-left",
      frames: this.anims.generateFrameNumbers("attack-left"),
    });
    this.anims.create({
      ...FRAME_INFO,
      key: "attack-right",
      frames: this.anims.generateFrameNumbers("attack-right"),
    });
  }
  //######################################UPDATES#########################################//
  update_player(time) {
    this.player.move();
    this.player.attack(time);
  }

  update_if_game_over() {}
}
