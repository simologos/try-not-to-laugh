import ICheckpointBase from './ICheckpointBase';

/**
 * Definition of the model used to update a given checkpoint in a given game.
 */
interface ICheckpointUpdate extends ICheckpointBase {

  /**
   * The unique identifier for the game.
   */
  gameId: string,

  /**
   * The unique identifier for the checkpoint to update.
   */
  checkpointId: string
}

export default ICheckpointUpdate;
