import IGame from "@tntl/definition/src/game/IGame";
import IError from "@tntl/definition/src/generic/IError";
import IResponse from "@tntl/definition/src/generic/IResponse";
import { gameModel } from "../repository/model";

export const getGameById = async (id: string): Promise<IResponse & (IGame | IError)> => {
  try {
    const game = await gameModel.findById(id).exec();

    return {
      success: true,
      chat: game.chat,
      currentRound: game.currentRound,
      players: game.players,
      playlist: game.playlist,
      state: game.state
    };
  } catch(e){
    return {
      success: false,
      error: e.message
    }
  }
};