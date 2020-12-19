import { Command } from "../../_definition/commands/Command";
import { publishCommand, subscribe } from "../../commandPublisher"
import { onCheckpointUpdated } from "../events";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventWithRecipients } from "../../_helpers/eventGenerator";
import { startNextRound, updateCheckpoint } from "../commands";
import { gameModel } from "../repository/model";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import IPlaylistItem from "@tntl/definition/src/game/IPlaylistItem";
import GameState from "@tntl/definition/src/game/GameState";
import ICheckpointUpdate from "@tntl/definition/src/game/ICheckpointUpdate";
import ICheckpoint from "@tntl/definition/src/game/ICheckpoint";
import { serverSubmitterId } from "../../config";

const processCommand = async (command: Command<ICheckpointUpdate & IIdentifier>) => {

  try {

    const game = await gameModel.findById(command.payload.gameId).exec();

    if (game === null) {
      publishEvent(getErrorEvent('Game not found.', command));
      return;
    }

    if (game.state !== GameState.Active) {
      publishEvent(getErrorEvent(`Cannot update a checkpoint of a game which is not in state active.`, command));
      return;
    }

    if (game.players.indexOf(command.submitterId) === -1) {
      publishEvent(getErrorEvent(`Cannot update the checkpoint because this game is not joined.`, command));
      return;
    }

    const item = game.playlist.find((e: IPlaylistItem & IIdentifier) => e.id === command.payload.id);

    if (!item) {
      publishEvent(getErrorEvent(`This playlist item could not be found.`, command));
      return;
    }

    const checkpoint = item.checkpoints.find((e: ICheckpoint & IIdentifier) => e.id === command.payload.checkpointId);

    if (!checkpoint) {
      publishEvent(getErrorEvent(`This checkpoint could not be found.`, command));
      return;
    }

    checkpoint.state = command.payload.state;
    checkpoint.laughed = command.payload.laughed;

    await game.save();

    publishEvent(
      getEventWithRecipients<ICheckpointUpdate & IIdentifier>(
        onCheckpointUpdated,
        command,
        game.players,
        {
          ...command.payload
        }
      )
    );

    publishCommand(startNextRound({
      id: game.id
    }, serverSubmitterId));

  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }
};

export const registerUpdateCheckpointHandler = () => {
  subscribe(updateCheckpoint.type, processCommand);
};
