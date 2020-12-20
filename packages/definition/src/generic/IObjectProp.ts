/**
 * Definition of an object, that contains a property of {@type PropType}.
 *
 * This is used in order to prevent the need to define a model for each and every update action,
 * that contains just one property.
 *
 * This means: When defining an Action Payload, you can use Typescript intersection types
 * feature to define (for example) a workitem update: IObjectProp & IAnyDefinition.
 */
interface IObjectProp<PropType> {

  /**
   * The property of type {@typedef PropType},
   * which is defined on the given object.
   */
  prop: PropType;
}

export default IObjectProp;
