import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import VideoState from '@tntl/definition/src/game/VideoState';
import IPlayRound from '@tntl/definition/src/game/IPlayRound';
import GameState from '@tntl/definition/src/game/GameState';
import { Command } from '../../_definition/commands/Command';
import { publishCommand, subscribe } from '../../commandPublisher';
import { onNextRoundStarted } from '../events';
import { publishEvent } from '../../eventPublisher';
import { getErrorEvent, getEventWithRecipients } from '../../_helpers/eventGenerator';
import { setGameState, startNextRound } from '../commands';
import { gameModel } from '../repository/model';
import { roundsPerGame, serverSubmitterId } from '../../config';

const groupByKey = (list: any[], key:string) => list.reduce(
  (hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }),
  {},
);

const processCommand = async (command: Command<IIdentifier>) => {
  try {
    const game = await gameModel.findById(command.payload.id).exec();

    if (game === null) {
      publishEvent(getErrorEvent('Game not found.', command));
      return;
    }

    const playlistGroup = groupByKey(game.playlist, 'addedBy');
    const currentRound = game.currentRound || 0;

    let currentRoundFinished = true;

    const nextRound: IPlayRound = {
      gameId: game._id,
      playlist: [],
    };

    game.players.forEach((e) => {
      if (!playlistGroup[e]) {
        currentRoundFinished = false;
        return;
      }

      const playlist = [...playlistGroup[e]].sort((a, b) => a.createdAt - b.createdAt);

      if (!playlist[currentRound]) {
        currentRoundFinished = false;
        return;
      }

      const cpGroup = groupByKey(playlist[currentRound].checkpoints, 'userId');

      game.players.forEach((f) => {
        if (!cpGroup[f]) {
          currentRoundFinished = false;
          return;
        }

        if (cpGroup[f][0].state < VideoState.Played) {
          currentRoundFinished = false;
        }
      });
    });

    if (!currentRoundFinished) {
      return;
    }

    if (currentRound >= roundsPerGame - 1) {
      publishCommand(setGameState(
        {
          state: GameState.Finished,
          id: game.id,
        },
        serverSubmitterId,
      ));
      return;
    }

    game.currentRound = currentRound + 1;
    await game.save();

    publishEvent(getEventWithRecipients<IPlayRound>(onNextRoundStarted, command, game.players, nextRound));
  } catch (e) {
    // Todo.
  }
};

export const registerStartNextRound = () => {
  subscribe(startNextRound.type, processCommand);
};
