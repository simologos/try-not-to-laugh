/**
 * Enumeration of possible states a video can be in a given game.
 */
enum VideoState {

  /**
   * The video is queued and ready to be watched by players.
   */
  Queued,

  /**
   * The current video is being player by players.
   */
  Playing,

  /**
   * The video is watched.
   */
  Played
};

export default VideoState;
