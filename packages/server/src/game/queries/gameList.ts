
import IGame from "@tntl/definition/src/game/IGame";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import { gameModel } from "../repository/model";
import IQueryResult from "../../_definition/rest/IQueryResult";

export const listGames = async (page: number, limit: number)
: Promise<IQueryResult<IGame & IIdentifier>> => {

  try {
    const result = await gameModel
      .find()
      .skip(page * limit)
      .limit(limit)
      .exec();

    return {
      success: true,
      result: {
        limit,
        page,
        search: '',
        result: result.map(e => ({
          id: e.id,
          state: e.state,
          players: e.players,
          playlist: e.playlist,
          chat: e.chat,
          currentRound: e.currentRound
        }))
      }
    }

  } catch (e) {
    return {
      success: false,
      result: {      
        error: e.message
      }
    }
  }
}