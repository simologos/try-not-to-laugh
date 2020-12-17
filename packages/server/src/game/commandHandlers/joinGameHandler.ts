import { Command } from "../../_definition/commands/Command";
import { publishCommand, subscribe } from "../../commandPublisher"
import { onGameJoined } from "../events";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventWithRecipients } from "../../_helpers/eventGenerator";
import { joinGame, setGameState } from "../commands";
import { gameModel } from "../repository/model";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import { maxPlayerPerGame, serverSubmitterId } from "../../config";
import IPlayerUpdate from "@tntl/definition/src/game/IPlayerUpdate";
import { userModel } from "../../user/repository/model";
import GameState from "@tntl/definition/src/game/GameState";

const processCommand = async (command: Command<IIdentifier>) => {

  try {
    const game = await gameModel.findById(command.payload.id).exec();

    if (game === null) {
      publishEvent(getErrorEvent('Game not found.', command));
      return
    }

    if (game.players.length >= maxPlayerPerGame) {
      publishEvent(getErrorEvent(`Cannot join came because there are already ${maxPlayerPerGame} players`, command));
      return;
    }

    if (game.players.indexOf(command.submitterId) > -1) {
      publishEvent(getErrorEvent(`You already joined this game.`, command));
      return;
    }

    const user = await userModel.findById(command.submitterId).exec();

    game.players.push(command.submitterId);
    console.log(`adding ${user.id} to game ${game.id}`)

    await game.save();

    publishEvent(getEventWithRecipients<IPlayerUpdate>(onGameJoined, command, game.players, {
      gameId: game.id,
      user: {
        id: user._id,
        avatar: user.avatar,
        displayName: user.displayName,
        firstName: user.firstName,
        googleId: user.googleId,
        isValidated: user.isValidated,
        lastName: user.lastName,
        score: user.score
      }
    }));

    if (game.players.length === maxPlayerPerGame) {
      publishCommand(setGameState(
        {
          state: GameState.Active,
          id: game.id
        },
        serverSubmitterId
      ))
    }

  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }

};

export const registerJoinGameHandler = () => {
  subscribe(joinGame.type, processCommand);
};