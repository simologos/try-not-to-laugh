import ICheckpoint from "./ICheckpoint";
import IPlaylistBase from "./IPlaylistBase";

interface IPlaylistItem extends IPlaylistBase {

  checkpoints: ICheckpoint[];

  createdAt: number;
}

export default IPlaylistItem;
