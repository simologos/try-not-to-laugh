import IOwnership from '../generic/IOwnership';
import IVideo from '../library/IVideo';

/**
 * Definition of an update model used to update a play list entry.
 */
interface IPlaylistUpdate extends IOwnership, IVideo {

  /**
   * The unique identifier of the game.
   */
  gameId: string;
}

export default IPlaylistUpdate;
