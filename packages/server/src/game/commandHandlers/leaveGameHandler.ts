import { Command } from "../../_definition/commands/Command";
import { subscribe } from "../../commandPublisher"
import { onGameLeft } from "../events";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventWithRecipients } from "../../_helpers/eventGenerator";
import { leaveGame } from "../commands";
import { gameModel } from "../repository/model";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import IPlayerUpdate from "@tntl/definition/src/game/IPlayerUpdate";
import { userModel } from "../../user/repository/model";

const processCommand = async (command: Command<IIdentifier>) => {

  try {
    const game = await gameModel.findById(command.payload.id).exec();

    if (game === null) {
      publishEvent(getErrorEvent('Game not found.', command));
      return;
    }

    if (game.players.indexOf(command.submitterId) === -1) {
      publishEvent(getErrorEvent(`Cannot leave a game you did not join.`, command));
      return;
    }

    const user = await userModel.findById(command.submitterId).exec();
    const remainingPlayers = game.players.filter(e => e.toString() !== command.submitterId);

    const recipients = [...game.players];

    game.players = remainingPlayers;

    await game.save();

    publishEvent(getEventWithRecipients<IPlayerUpdate>(onGameLeft, command, recipients, {
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

  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }

};

export const registerLeaveGameHandler = () => {
  subscribe(leaveGame.type, processCommand);
};