/**
 * Data model which can be used in conjunction with any given other model
 * to add a field indicating that this record is owned by a given user.
 */
interface IOwnership {
  
  /**
   * Unique identifier of the user who owns the given record.
   */
  addedBy: string;
}

export default IOwnership;
