import { Command } from "../../_definition/commands/Command";
import { publishCommand, subscribe } from "../../commandPublisher"
import { onPlaylistItemUpdated } from "../events";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventWithRecipients } from "../../_helpers/eventGenerator";
import { startNextRound, updatePlaylistItem } from "../commands";
import { gameModel } from "../repository/model";
import IPlaylistUpdate from "@tntl/definition/src/game/IPlaylistUpdate";
import { isValidUrl } from "../../_helpers/youTube";
import { isValidName } from "../../_helpers/nameValidator";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import IPlaylistItem from "@tntl/definition/src/game/IPlaylistItem";
import GameState from "@tntl/definition/src/game/GameState";
import { serverSubmitterId } from "../../config";

const processCommand = async (command: Command<IPlaylistUpdate & IIdentifier>) => {

  try {

    if (!isValidName(command.payload.name)) {
      publishEvent(getErrorEvent('This is not a valid video name.', command));
      return;
    }

    if (!isValidUrl(command.payload.url)) {
      publishEvent(getErrorEvent('This is not a valid youtube video.', command));
      return;
    }

    const game = await gameModel.findById(command.payload.gameId).exec();

    if (game === null) {
      publishEvent(getErrorEvent('Game not found.', command));
      return;
    }
   
    if (game.state !== GameState.Active) {
      publishEvent(getErrorEvent(`Cannot add a playlist item to a game which is not in state active.`, command));
      return;
    }

    if (game.players.indexOf(command.submitterId) === -1) {
      publishEvent(getErrorEvent(`Cannot update the playlist because game is not joined.`, command));
      return;
    }

    const item = game.playlist.find((e: IPlaylistItem & IIdentifier) => e.id === command.payload.id);

    if (!item) {
      publishEvent(getErrorEvent(`This playlist item could not be found.`, command));
      return;
    }

    if (item.addedBy.toString() !== command.submitterId) {
      publishEvent(getErrorEvent(`This playlist item cannot be changed because it was not added by you.`, command));
      return;
    }

    item.name = command.payload.name;
    item.url = command.payload.url;

    await game.save();

    publishEvent(
      getEventWithRecipients<IPlaylistUpdate & IIdentifier>(
        onPlaylistItemUpdated,
        command,
        game.players,
        {
          ...command.payload
        }
      )
    );

    publishCommand(startNextRound({
      id: command.id
    }, serverSubmitterId));

  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }
};

export const registerUpdatePlaylistItemHandler = () => {
  subscribe(updatePlaylistItem.type, processCommand);
};