import IChatMessageBase from './IChatMessageBase';

/**
 * Definition of a chat message which can be send from
 * one player to all others during a game.
 */
interface IChatMessage extends IChatMessageBase {

  /**
   * The ID of the user who was sending the message.
   */
  sender: string;

  /**
   * The timestamp showing when the message was send.
   */
  createdAt: number;
}

export default IChatMessage;
