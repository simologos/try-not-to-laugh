import IVideo from "@tntl/definition/src/library/IVideo";

interface IPlaylistBase extends IVideo {

  addedBy: string;
}

export default IPlaylistBase;
