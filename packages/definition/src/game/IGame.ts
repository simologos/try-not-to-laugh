import GameState from "./GameState";
import IChatMessage from "./IChatMessage";
import IPlaylistItem from "./IPlaylistItem";

/**
 * Data model used to describe the complete state of a game.
 */
interface IGame {

  /**
   * The state in which the current game is in.
   */
  state: GameState;

  /**
   * List of unique identifiers of all users who are playing this game.
   */
  players: string[];

  /**
   * List of videos which players have to watch in this game.
   */
  playlist: IPlaylistItem[];

  /**
   * The current round of this game.
   */
  currentRound: number;

  /**
   * List of chat messages which were send while playing this game.
   */
  chat: IChatMessage[];
}

export default IGame;
