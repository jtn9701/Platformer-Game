class ScoreManager {
  constructor(time) {
    this.time_alive = time;
    this.num_enemies_killed = 0;
    this.final_score = 0;
  }

  get_final_score() {
    return 0.2 * this.num_enemies_killed * (this.time_alive / 10);
  }

  update_time_alive(current_time) {
    this.time_alive = this.time_alive + current_time;
  }

  increment_num_enemies_killed() {
    this.num_enemies_killed++;
  }

  reset() {
    this.time_alive = 0;
    this.num_enemies_killed = 0;
  }
}
