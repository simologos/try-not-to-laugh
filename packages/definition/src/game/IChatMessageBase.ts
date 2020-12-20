/**
 * Base definition of a Chat message which can be send
 * from one player to all others during a game.
 */
interface IChatMessageBase {

  /**
   * The message to send.
   */
  message: string;
}

export default IChatMessageBase;
