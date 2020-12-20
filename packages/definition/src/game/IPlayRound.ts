import IOwnership from '../generic/IOwnership';
import IVideo from '../library/IVideo';

/**
 * Data model which contains all playlist items for a given play round
 * of a given game.
 */
interface IPlayRound {

  /**
   *  Unique identifier of the game.
   */
  gameId: string;

  /**
   * List of playlist items which are part of the current play round.
   */
  playlist: (IVideo & IOwnership)[];
}

export default IPlayRound;
