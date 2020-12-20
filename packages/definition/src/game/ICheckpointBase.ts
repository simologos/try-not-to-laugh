import VideoState from "./VideoState";

/**
 * Definition of the data model used to describe the current state of one
 * player for one video.
 * 
 * A checkpoint basically describes what the current player is doing with a given
 * video in a given play round.
 */
interface ICheckpointBase {
    
  /**
   * The current state describing what the player has done
   * to a given video.
   */
  state: VideoState;
  
  /**
   * Flag to determine if the user laughed while watching the video.
   */
  laughed: boolean;
};

export default ICheckpointBase;
