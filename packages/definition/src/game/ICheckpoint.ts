import ICheckpointBase from "./ICheckpointBase";

/**
 * Extension to the ICheckpointBase model used to
 * assign a user identifier to the ICheckpointBase Model.
 */
interface ICheckpoint extends ICheckpointBase {

  /**
   * Unique identifier for a user.
   */  
  userId: string;
};

export default ICheckpoint;
