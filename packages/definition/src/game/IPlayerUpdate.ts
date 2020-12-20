import IIdentifier from '../generic/IIdentifier';
import IUser from '../user/IUser';

/**
 * Data model used to describe that a player joined or left
 * a given game.
 */
interface IPlayerUpdate {

  /**
   * The unique identifier of the game.
   */
  gameId: string;

  /**
   * The player who joined or left the game.
   */
  user: IUser & IIdentifier;
}

export default IPlayerUpdate;
