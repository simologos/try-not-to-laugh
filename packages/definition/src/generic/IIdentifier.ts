/**
 * Definition of a data model which identifies a specific entity by it's it.
 * This interface can be used as union type to limit the amount of models needed.
 *
 * For example:
 *
 * A request to update a video in the library namespace can be constructed by using
 * the IVideo interface and the IIdentifier interface: <model: IIdentifier & IVideo>
 */
interface IIdentifier {

  /**
   *  The identifier of the entity.
   */
  id: string;
}

export default IIdentifier;
