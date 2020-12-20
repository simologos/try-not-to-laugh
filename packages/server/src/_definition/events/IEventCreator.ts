import { Event } from './Event';

interface IEventCreator<P> {
  type: string;
  timestamp: number;
  duration: number;
  (payload: P, submitterId: string, startTimestamp: number, recipients: string[], id: string): Event<P>;
}

export default IEventCreator;
