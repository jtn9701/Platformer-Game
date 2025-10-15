class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "player");

    const start = scene.map.findObject("items", (obj) => obj.name === "player");
    // Player start position
    this.x = start.x;
    this.y = start.y;
    this.setOrigin(0.5, 1);
    this.depth = 1;
    // Default speed
    this.speed = 200;

    // Player Attack variables
    this.last_attack = 0;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.movement_keys = scene.input.keyboard.addKeys({
      UP: Phaser.Input.Keyboard.KeyCodes.W,
      JUMP: Phaser.Input.Keyboard.KeyCodes.SPACE,
      LEFT: Phaser.Input.Keyboard.KeyCodes.A,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.attack_keys = scene.input.keyboard.addKeys("up,down,left,right");
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

  attack(time) {
    let ATTACK_POSITION_OFFSET = 60;
    let ATTACK_DELAY = 400;

    if (time - this.last_attack > ATTACK_DELAY) {
      if (this.attack_keys.up.isDown) {
        const position = { x: this.x, y: this.y - ATTACK_POSITION_OFFSET };
        this.scene.player_attacks.add(
          new PlayerAttack(this.scene, position, "attack-up")
        );
      }
      // TODO: will make this one only possible if in air
      if (!this.body.blocked.down && this.attack_keys.down.isDown) {
        const position = { x: this.x, y: this.y + ATTACK_POSITION_OFFSET };
        this.scene.player_attacks.add(
          new PlayerAttack(this.scene, position, "attack-down")
        );
      }
      if (this.attack_keys.left.isDown) {
        const position = { x: this.x - ATTACK_POSITION_OFFSET, y: this.y };
        this.scene.player_attacks.add(
          new PlayerAttack(this.scene, position, "attack-left")
        );
      }
      if (this.attack_keys.right.isDown) {
        const position = { x: this.x + ATTACK_POSITION_OFFSET, y: this.y };
        this.scene.player_attacks.add(
          new PlayerAttack(this.scene, position, "attack-right")
        );
      }

      this.last_attack = time;
    }

    // Reset attack timer
    if (
      this.attack_keys.up.isDown &&
      this.attack_keys.down.isDown &&
      this.attack_keys.left.isDown &&
      this.attack_keys.right.isDown
    ) {
      this.last_attack = 0;
    }
  }
}
