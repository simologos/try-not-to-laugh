enum GameState {
  /**
   * Awaiting players to join the game.
   */
  Prepare,

  /**
   * The game is running and players are playing.
   */
  Active,

  /**
   * The game has finished.
   */
  Finished,

  /**
   * The game was cancelled.
   * This can happen if all users quite prior to finishing the game.
   */
  Canceled
}

export default GameState;
