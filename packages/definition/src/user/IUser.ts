/**
 * Definition of a user which plays Try Not To Laugh.
 */
interface IUser {

  /**
   * The users Nickname.
   */
  displayName: string;

  /**
   * The users first name
   */
  firstName: string;

  /**
   * The users last name
   */
  lastName: string;

  /**
   * The picture / avatar of the user
   */
  avatar: string;

  /**
   * The Google ID received when using google for authentication.
   */
  googleId: string;

  /**
   * Field to check if this user was validated by a third party IDP.
   */
  isValidated: boolean;

  /**
   * The current score of this user (one point for every video where the user did not laugh)
   */
  score: number;
}

export default IUser;
