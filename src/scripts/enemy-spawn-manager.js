class EnemySpawnManager {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.min_interval = config.minInterval || 1000;
    this.max_interval = config.maxInterval || 5000;

    this.max_enemies = config.maxEnemies || 10;
    this.spawn_callback = config.spawnCallback;
    this.bounds = config.bounds || {
      x: 0,
      y: 0,
      width: scene.scale.width,
      height: scene.scale.height,
    };

    this.SAFE_SPAWN_DISTANCE = 120;

    this.is_position_free = config.isPositionFree || null;
    this.spawn_attempts = config.spawnAttempts || 8;
    this.current_enemies = new Set();
    this.timer_event = null;

    if (typeof this.spawn_callback !== "function") {
      throw new Error(
        "EnemySpawnManager requires a spawnCallback(scene, x, y) function in config"
      );
    }
  }

  start_spawn_loop() {
    if (this.timer_event) return;
    this.schedule_next_spawn_event();
  }

  stop_spawn_loop() {
    if (this.timer_event) {
      this.timer_event.remove(false);
      this.timer_event = null;
    }
  }

  clear_tracked_enemies() {
    this.current_enemies.clear();
  }

  on_Enemy_Destroyed(enemy) {
    this.current_enemies.delete(enemy);
  }

  schedule_next_spawn_event() {
    const delay = Phaser.Math.Between(this.min_interval, this.max_interval);
    this.timer_event = this.scene.time.addEvent({
      delay: delay,
      callback: this.try_spawn,
      callbackScope: this,
      loop: false,
    });
  }

  try_spawn() {
    this.timer_event = null;

    if (this.current_enemies.size >= this.max_enemies) {
      this.schedule_next_spawn_event();
      return;
    }

    const spawn_position = this.find_spawn_position();
    if (spawn_position) {
      const enemy = this.spawn_callback(spawn_position.x, spawn_position.y);
      if (enemy) {
        this.current_enemies.add(enemy);
      }

      if (enemy.on && typeof enemy.on === "function") {
        enemy.once("destroy", () => this.on_Enemy_Destroyed(enemy));
      } else if (enemy.once && typeof enemy.once === "function") {
        enemy.once("destroy", () => this.on_Enemy_Destroyed(enemy));
      } else if (
        enemy.on_Enemy_Destroyed &&
        typeof enemy.on_Enemy_Destroyed === "function"
      ) {
        const original = enemy.onDestroy;
        enemy.onDestroy = (...args) => {
          original.apply(enemy, args);
          this.on_Enemy_Destroyed(enemy);
        };
      }
    }

    this.schedule_next_spawn_event();
  }

  find_spawn_position() {
    const bounds = this.bounds;

    for (let attempt = 0; attempt < this.spawn_attempts; attempt++) {
      let x, y;
      if (bounds.map && bounds.map.widthInPixels && bounds.map.heightInPixels) {
        x = Phaser.Math.Between(0, bounds.map.widthInPixels - 1);
        y = Phaser.Math.Between(0, bounds.map.heightInPixels - 1);
      } else {
        x = Phaser.Math.Between(bounds.x, bounds.x + bounds.width - 1);
        y = Phaser.Math.Between(bounds.y, bounds.y + bounds.height - 1);
      }

      // Validates if position is free
      if (this.is_position_free) {
        if (this.is_position_free(x, y)) return { x, y };
        continue;
      }

      // Avoids spawning in solid blocks
      if (bounds.layer && bounds.map) {
        const tile = bounds.map.getTileAtWorldXY(
          x,
          y,
          true,
          bounds.layer,
          this.scene.cameras.main
        );
        if (tile && tile.index !== -1 && tile.collides) {
          continue;
        }
      }

      // Prevents spawning too close to player
      const player = this.scene.player || this.scene.playerSprite || null;
      if (player && player.x !== undefined && player.y !== undefined) {
        const dist_x = x - player.x;
        const dist_y = y - player.y;
        const dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
        if (dist < this.SAFE_SPAWN_DISTANCE) {
          continue;
        }
      }

      // return if passed checks
      return { x, y };
    }
    // reutrn if failed checks
    return null;
  }
}
