class PlayerAttack extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, position, animKey) {
    super(scene, position.x, position.y, animKey);
    this.depth = 2;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.play(animKey);
    this.setOrigin(0.5, 1);

    this.body.setAllowGravity(false);
    this.on("animationcomplete", () => this.destroy());
  }
}
