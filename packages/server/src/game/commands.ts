import IGameStateUpdate from "@tntl/definition/src/game/IGameStateUpdate";
import IPlaylistUpdate from "@tntl/definition/src/game/IPlaylistUpdate";
import ICheckpointUpdate from "@tntl/definition/src/game/ICheckpointUpdate";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import { commandCreator } from "../_definition/commands/commandCreator";
import ICommandCreator from "../_definition/commands/ICommandCreator";
import IChatMessageBase from "@tntl/definition/src/game/IChatMessageBase";

export const addGame: ICommandCreator<null> =
  commandCreator<null>('ADD_GAME');

export const joinGame: ICommandCreator<IIdentifier> =
  commandCreator<IIdentifier>('JOIN_GAME');

export const leaveGame: ICommandCreator<IIdentifier> =
  commandCreator<IIdentifier>('LEAVE_GAME');

export const setGameState: ICommandCreator<IGameStateUpdate> =
  commandCreator<IGameStateUpdate>('SET_GAME_STATE');

export const addPlaylistItem: ICommandCreator<IPlaylistUpdate> =
  commandCreator<IPlaylistUpdate>('ADD_PLAYLIST_ITEM');

export const startNextRound: ICommandCreator<IIdentifier> =
  commandCreator<IIdentifier>('START_NEXT_ROUND');

export const updatePlaylistItem: ICommandCreator<IPlaylistUpdate & IIdentifier> =
  commandCreator<IPlaylistUpdate & IIdentifier>('UPDATE_PLAYLIST_ITEM');

export const updateCheckpoint: ICommandCreator<ICheckpointUpdate & IIdentifier> =
  commandCreator<ICheckpointUpdate & IIdentifier>('UPDATE_CHECKPOINT');

export const sendChatMessage: ICommandCreator<IChatMessageBase & IIdentifier> =
  commandCreator<IChatMessageBase & IIdentifier>('SEND_CHAT_MESSAGE');
