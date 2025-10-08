class EndlessLevel extends Phaser.Scene {
  constructor(key = "Endless") {
    super(key);
    // TODO: adjust for custom map
    this.map_key = "map1";
    this.map_json = "level1.json";
  }

  // Preload external assets
  preload() {
    this.load.path = "src/assets/";
    this.load.tilemapTiledJSON(this.map_key, this.map_json);
    const tile_size = { frameWidth: 32, frameHeight: 32 };
    this.load.spritesheet("tiles", "tiles.png", tile_size);
    this.load.image("player", "player.png");
  }

  // Create game data
  create() {
    this.create_map();
    this.create_player();
    this.create_gravity();
    this.create_camera();
    this.create_collisions();
  }

  // Update game data
  update() {
    this.update_player();
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

  //######################################UPDATES#########################################//
  update_player() {
    this.player.move();
  }

  update_if_game_over() {}
}
