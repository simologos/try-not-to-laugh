import IGame from "@tntl/definition/src/game/IGame";
import IExtendedPlayerList from "@tntl/definition/src/game/IExtendedPlayerList";
import IError from "@tntl/definition/src/generic/IError";
import IResponse from "@tntl/definition/src/generic/IResponse";
import { gameModel } from "../repository/model";
import { userModel } from "../../user/repository/model";
import { Types } from "mongoose";

export const getGameById = async (id: string)
: Promise<IResponse & (IGame & IExtendedPlayerList | IError)> => {

  try {
    const game = await gameModel.findById(id).exec();
    const users = await userModel.find({
      '_id': {
        $in: game.players.map(e => Types.ObjectId(e))
      }
    }).exec();

    return {
      success: true,
      chat: game.chat,
      currentRound: game.currentRound,
      players: game.players,
      playlist: game.playlist,
      state: game.state,
      users: users.map(e => ({
        id: e.id,
        displayName: e.displayName,
        firstName: e.firstName,
        lastName: e.lastName,
        avatar: e.avatar,
        googleId: e.googleId,
        isValidated: e.isValidated,
        score: e.score
      }))
    };
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
};