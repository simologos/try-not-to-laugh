import ICommandCreator from './ICommandCreator';
import { v4 as uuidV4 } from 'uuid';

export function commandCreator<P>(type: string): ICommandCreator<P> {
  
  return Object.assign(
    (payload: P, submitterId: string) => ({
      type,
      submitterId,
      payload,
      timestamp: new Date().getTime(),
      id: uuidV4()
    }),
    {type}
  ) as ICommandCreator<P>;
};
