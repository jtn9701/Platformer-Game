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
    // Enemy Assets
    this.load.image("enemy", "enemy.png");
  }

  // Create game data
  create() {
    this.create_map();
    this.create_attack_animation();
    this.create_player();
    this.create_enemies();
    this.create_gravity();
    this.create_camera();
    this.create_collisions();
    this.create_player_attack_collision_handler();
  }

  // Update game data
  update(time) {
    this.update_player(time);
    this.update_enemy(time);
    this.game_over();
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
    this.player_attacks = this.physics.add.group();
  }

  create_gravity() {
    this.physics.world.gravity.y = 400;
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
    this.physics.add.collider(this.group_enemies, this.groundLayer);
    this.physics.add.collider(
      this.player,
      this.group_enemies,
      this.game_over,
      null,
      this
    );
  }

  create_attack_animation() {
    let FRAME_INFO = { frameRate: 30, repeat: 0 };
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

  create_enemies() {
    this.group_enemies = this.physics.add.group();

    const spawnCallback = (x, y) => {
      if (typeof Enemy === "function") {
        const new_enemy = new Enemy(this, { x: x, y: y });
        this.add.existing(new_enemy);
        this.group_enemies.add(new_enemy);
        return new_enemy;
      }
      return null;
    };

    const bounds = { map: this.map, layer: this.groundLayer };
    this.enemy_spawn_manager = new EnemySpawnManager(this, {
      bounds: bounds,
      spawnCallback: spawnCallback,
    });

    this.enemy_spawn_manager.start_spawn_loop();
  }

  create_player_attack_collision_handler() {
    this.physics.add.overlap(
      this.player_attacks,
      this.group_enemies,
      (attack, enemy) => {
        if (enemy.isDead === true) {
          return;
        }
        enemy.isDead = true;

        if (enemy.body) enemy.body.enable = false;

        // Upward bounce with down attack on enemy
        if (
          attack.anims.currentAnim.key === "attack-down" &&
          attack &&
          attack.anims &&
          attack.anims.currentAnim
        ) {
          // Check if player exist
          if (this.player && this.player.body) {
            const BOUNCE_VELOCITY = -350;
            this.player.body.velocity.y = BOUNCE_VELOCITY;
          }
        }

        enemy.destroy();

        if (attack && attack.destroy) attack.destroy();
      },
      null,
      this
    );
  }

  //######################################UPDATES#########################################//
  update_player(time) {
    this.player.move();
    this.player.attack(time);
  }

  update_enemy(time) {
    this.group_enemies.getChildren().forEach((enemy) => {
      enemy.update_ai(time);
    });
  }

  game_over(hazard = null) {
    if (this.player.y > this.map.heightInPixels) {
      this.scene.restart();
    }
    if (hazard !== null) {
      this.scene.restart();
    }
  }
}
