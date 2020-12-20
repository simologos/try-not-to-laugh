import IOwnership from '../generic/IOwnership';
import IVideo from '../library/IVideo';
import ICheckpoint from './ICheckpoint';

/**
 * Definition of a play list entry.
 * This model defines a video which got added to a game
 * and will be watched by all players.
 */
interface IPlaylistItem extends IVideo, IOwnership {

  /**
   * List of checkpoints for the given playlist item.
   */
  checkpoints: ICheckpoint[];

  /**
   * Timestamp showing when the play list item was added to the game.
   */
  createdAt: number;
}

export default IPlaylistItem;
