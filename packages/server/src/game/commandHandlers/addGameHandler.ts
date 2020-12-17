import { Command } from "../../_definition/commands/Command";
import { subscribe } from "../../commandPublisher"
import { onGameAdded } from "../events";
import { publishEvent } from "../../eventPublisher";
import { getErrorEvent, getEventFromCommand } from "../../_helpers/eventGenerator";
import { addGame } from "../commands";
import { gameModel } from "../repository/model";
import IGame from "@tntl/definition/src/game/IGame";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import GameState from "@tntl/definition/src/game/GameState";

const processCommand = async (command: Command<null>) => {

  try {
    const newGame = await gameModel.create({
      state: GameState.Prepare,
      players: [],
      playlist: [],
      chat: [],
      currentRound: 0
    });

    publishEvent(getEventFromCommand<IGame & IIdentifier>(onGameAdded, command, {
      state: newGame.state,
      id: newGame.id,
      players: newGame.players,
      playlist: newGame.playlist,
      chat: [],
      currentRound: 0
    }));
  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }

};

export const registerAddGameHandler = () => {
  subscribe(addGame.type, processCommand);
};