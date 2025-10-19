class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, start, speed = 120) {
    super(scene, start.x, start.y, "enemy");

    this.start = start;
    this.depth = 1;
    this.speed = speed;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.velocity.x = -this.speed;
    this.body.bounce.x = 1;

    // Jump data for AI
    this.jump_force = -300;
    this.detection_range = 200;
    this.jump_distance = 150;
    this.last_jump_time = 0;
    this.jump_cool_down = 2000;
  }

  update_ai(time) {
    if (this.isDead) return;

    const default_behavior = () => {
      if (this.body.blocked.left) {
        this.body.velocity.x = this.speed;
      } else if (this.body.blocked.right) {
        this.body.velocity.x = -this.speed;
      } else {
        this.body.velocity.x = -this.speed;
      }
    };

    default_behavior();

    const distance_from_player = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );

    const check_if_player_visible = new Phaser.Geom.Line(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );

    // Check if a tile blocks enemy line of sight
    const tiles = this.scene.groundLayer.getTilesWithinShape(
      check_if_player_visible
    );
    const isVisible = !tiles.some((tile) => tile.collides);

    if (isVisible && distance_from_player < this.detection_range) {
      // Targetting player behavior
      const direction = this.scene.player.x < this.x ? -1 : 1;
      this.body.velocity.x = this.speed * direction;

      if (
        distance_from_player < this.jump_distance &&
        this.body.blocked.down &&
        time - this.last_jump_time > this.jump_cool_down
      ) {
        this.body.velocity.y = this.jump_force;
        this.lastJumpTime = time;
      }
    } else {
      default_behavior();
    }
  }
}
