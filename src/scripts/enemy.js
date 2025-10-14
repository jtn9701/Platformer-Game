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
  }
}
