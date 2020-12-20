import { Command } from './Command';

interface ICommandCreator<P> {
  type: string;
  timestamp: number;
  (payload: P, submitterId: string): Command<P>;
}

export default ICommandCreator;
