class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "player");

    const start = scene.map.findObject("items", (obj) => obj.name === "player");
    this.x = start.x;
    this.y = start.y;
    this.setOrigin(0.5, 1);
    this.depth = 1;
    this.speed = 200;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.movement_keys = scene.input.keyboard.addKeys({
      UP: Phaser.Input.Keyboard.KeyCodes.W,
      JUMP: Phaser.Input.Keyboard.KeyCodes.A,
      LEFT: Phaser.Input.Keyboard.KeyCodes.A,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  move() {
    // Verify player has physics body
    if (this.body === undefined) return;

    //reset velocity
    this.body.velocity.x = 0;

    if (
      this.body.blocked.down &&
      (this.movement_keys.UP.isDown || this.movement_keys.JUMP.isDown)
    ) {
      this.body.velocity.y = -this.speed * 2;
    }
    if (this.movement_keys.LEFT.isDown) {
      this.body.velocity.x = -this.speed;
    }
    if (this.movement_keys.RIGHT.isDown) {
      this.body.velocity.x = this.speed;
    }
  }
}
