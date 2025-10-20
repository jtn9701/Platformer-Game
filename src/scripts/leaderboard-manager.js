// Import all db scripts here
import { jsonBinAdapter } from "../db/adapters/jsonBinAdapter.js";
// Advanced helpers exported from ../scripts/db.js
import { useAdapter, getDoc, boot, transact, uid } from "../db/db.js";

class LeaderboardManager {
  constructor() {
    // NOTE: ID's USUALLY SHOULD NOT BE STORED LIKE THIS!!!
    this.bin_id = "68f57bbb43b1c97be9722688";

    this.booted = false;

    this.boot_promise = this.boot_db();
  }

  async boot_db() {
    useAdapter(jsonBinAdapter(this.bin_id));
    const doc = await boot();
    this.booted = true;
  }

  async get_top_scorers() {
    await this.boot_promise;
    if (!this.booted) {
      console.log("DB is not booted to get top scorers.");
      return [];
    }

    try {
      const doc = getDoc();

      const leaderboard = doc?.EndlessLevelLeaderboard || [];

      return leaderboard.slice(0, 10);
    } catch (error) {
      console.error("Error fetching leaderboard: ", error);
      return [];
    }
  }

  async add_new_top_scorer(score, player_name = "Anonymous") {
    await this.boot_promise;
    if (!this.booted) {
      console.log("DB is not booted to modify leaderboard.");
    }

    try {
      let new_entry;
      let is_on_leaderboard;
      let position;

      const result = await transact((doc) => {
        const leaderboard = doc.EndlessLevelLeaderboard || [];

        new_entry = {
          id: uid(),
          name: player_name,
          score: score,
        };

        leaderboard.push(new_entry);

        // Descending sort of scores
        leaderboard.sort((a, b) => b.score - a.score);

        // Keep top 10
        doc.EndlessLevelLeaderboard = leaderboard.slice(0, 10);

        is_on_leaderboard = leaderboard
          .slice(0, 10)
          .some((entry) => entry.id === new_entry.id);

        position = is_on_leaderboard
          ? leaderboard.findIndex((entry) => entry.id === new_entry.id) + 1
          : null;
      });

      if (is_on_leaderboard) {
        console.log("New High Score!");
      } else {
        console.log("No New High Score.");
      }

      return {
        new_entry,
        is_on_leaderboard,
        position,
      };
    } catch (error) {
      console.error("Error adding new score: ", error);
      return false;
    }
  }
}

export { LeaderboardManager };
