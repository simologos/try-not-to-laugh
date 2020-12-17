import IPlaylistBase from "./IPlaylistBase";

interface IPlayRound {
  gameId: string;

  playlist: IPlaylistBase[];
}

export default IPlayRound;