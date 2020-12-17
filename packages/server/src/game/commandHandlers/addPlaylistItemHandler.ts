import { Command } from "../../_definition/commands/Command";
import { publishCommand, subscribe } from "../../commandPublisher"
import { onPlaylistItemAdded } from "../events";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventWithRecipients } from "../../_helpers/eventGenerator";
import { addPlaylistItem, startNextRound } from "../commands";
import { gameModel } from "../repository/model";
import IPlaylistUpdate from "@tntl/definition/src/game/IPlaylistUpdate";
import { roundsPerGame, serverSubmitterId } from "../../config";
import { isValidUrl } from "../../_helpers/youTube";
import { isValidName } from "../../_helpers/nameValidator";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import IPlaylistItem from "@tntl/definition/src/game/IPlaylistItem";
import GameState from "@tntl/definition/src/game/GameState";
import VideoState from "@tntl/definition/src/game/VideoState";

const processCommand = async (command: Command<IPlaylistUpdate>) => {

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
      publishEvent(getErrorEvent(`Cannot add to playlist because game is not joined.`, command));
      return;
    }

    const currentPlayList = game.playlist.filter(e => e.addedBy === command.submitterId);

    if (currentPlayList.length >= roundsPerGame) {
      publishEvent(getErrorEvent(`You already added enough videos.`, command));
      return;
    }

    if (game.playlist.find(e => e.url === command.payload.url)) {
      publishEvent(getErrorEvent(`This video was already added. Please at a different one`, command));
      return;
    }

    const item: IPlaylistItem = {
      addedBy: command.submitterId,
      checkpoints: game.players.map(e => ({
        userId: e,
        laughed: false,
        state: VideoState.Queued
      })),
      name: command.payload.name,
      url: command.payload.url,
      start: command.payload.start,
      createdAt: new Date().getTime()
    };

    game.playlist.push(item)

    const result = await game.save();

    const storedItem = result.playlist.find(e => e.url === item.url && e.createdAt === item.createdAt);

    publishEvent(
      getEventWithRecipients<IPlaylistUpdate & IIdentifier>(
        onPlaylistItemAdded,
        command,
        game.players,
        {
          ...command.payload,
          id: (storedItem as IPlaylistItem & IIdentifier).id
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

export const registerAddPlaylistItemHandler = () => {
  subscribe(addPlaylistItem.type, processCommand);
};