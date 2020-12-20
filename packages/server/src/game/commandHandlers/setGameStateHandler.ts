import { Command } from "../../_definition/commands/Command";
import { subscribe } from "../../commandPublisher"
import { onGameStateChanged } from "../events";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventWithRecipients } from "../../_helpers/eventGenerator";
import { setGameState } from "../commands";
import { gameModel } from "../repository/model";
import GameState from "@tntl/definition/src/game/GameState";
import IGameStateUpdate from "@tntl/definition/src/game/IGameStateUpdate";
import { userModel } from "../../user/repository/model";
import { Types } from "mongoose";
import IExtendedPlayerList from "@tntl/definition/dist/game/IExtendedPlayerList";

const isTransitionValid = (currentState: GameState, nextState: GameState) => {
  switch(currentState){
    case GameState.Prepare:
      return nextState === GameState.Active || 
        nextState === GameState.Canceled;
    case GameState.Active:
      return nextState === GameState.Finished || 
        nextState === GameState.Canceled;
    case GameState.Finished:
      return false;
    case GameState.Canceled:
      return false;
  }
}

const processCommand = async (command: Command<IGameStateUpdate>) => {

  try {
    const game = await gameModel.findById(command.payload.id).exec();

    if (game === null) {
      publishEvent(getErrorEvent('Game not found.', command));
      return;
    }

    if(!isTransitionValid(game.state, command.payload.state)){
      publishEvent(getErrorEvent(`Cannot enter state ${GameState[command.payload.state]} from state ${GameState[game.state]}`, command));
      return;
    }

    game.state = command.payload.state;

    if(command.payload.state === GameState.Finished) {

      const results = {};

      game.playlist.forEach(e => {
        e.checkpoints.forEach(f => {
          if(!f.laughed){
            results[f.userId] = (results[f.userId] || 0) + 1;
          }
        });
      });

      for(let i = 0, il = game.players.length; i < il; i++) {
        if (results[game.players[i]]) {
          const user = await userModel.findById(game.players[i]).exec();
          user.score = user.score + results[game.players[i]];
          await user.save();
        }
      }
    }

    await game.save();

    const players = await userModel.find({
      '_id': {
        $in: game.players.map(e => Types.ObjectId(e))
      }
    }).sort({'score': -1}).exec();

    publishEvent(getEventWithRecipients<IGameStateUpdate & IExtendedPlayerList>(onGameStateChanged, command, game.players, {
      state: game.state,
      id: game.id,
      users: players.map(e => ({
        id: e.id,
        avatar: e.avatar,
        displayName: e.displayName,
        firstName: e.firstName,
        googleId: e.googleId,
        isValidated: e.isValidated,
        lastName: e.lastName,
        score: e.score
      }))
    }));

  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }

};

export const registerSetGameStateHandler = () => {
  subscribe(setGameState.type, processCommand);
};