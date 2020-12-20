import GameState from './GameState';

/**
 * Data model used to update the state of a given game.
 */
interface IGameStateUpdate {

  /**
   * The unique identifier of the game.
   */
  id: string;

  /**
   * The state in which the game should be set into.
   */
  state: GameState;
}

export default IGameStateUpdate;
