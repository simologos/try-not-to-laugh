import IIdentifier from '../generic/IIdentifier';
import IUser from '../user/IUser';

/**
 * Interface used to extend any given data model with a list of users.
 */
interface IExtendedPlayerList {

  /**
   * List of users including their unique identifier.
   */
  users: (IUser & IIdentifier)[];
}

export default IExtendedPlayerList;
