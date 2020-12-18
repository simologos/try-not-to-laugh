import { IVideo } from './IVideo';

export interface IPlayListItem {

  round: number;
  id: string;
  addedBy: string;
  gameId: string;
  video: IVideo;

}
