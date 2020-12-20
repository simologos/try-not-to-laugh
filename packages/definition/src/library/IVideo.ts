/**
 * Data model describing a video which can be added to a game
 * or the library.
 */
interface IVideo {

  /**
   * The name of the video.
   */
  name: string;

  /**
   * The Youtube URL.
   */
  url: string;

  /**
   * The number of seconds from where the video should be played.
   */
  start: number;
}

export default IVideo;
