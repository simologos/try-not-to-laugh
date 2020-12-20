import IEventCreator from './IEventCreator';

export function eventCreator<P>(type: string): IEventCreator<P> {
  return Object.assign(
    (payload: P, submitterId: string, startTimestamp: number, recipients: string[], id: string) => ({
      type,
      submitterId,
      payload,
      recipients,
      id,
      duration: new Date().getTime() - startTimestamp,
      timestamp: new Date().getTime(),
    }),
    { type },
  ) as IEventCreator<P>;
}
