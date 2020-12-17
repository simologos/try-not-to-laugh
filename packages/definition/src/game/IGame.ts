import GameState from "./GameState";
import IChatMessage from "./IChatMessage";
import IPlaylistItem from "./IPlaylistItem";

interface IGame {

  state: GameState;

  players: string[];

  playlist: IPlaylistItem[];

  currentRound: number;

  chat: IChatMessage[];
}

export default IGame;
