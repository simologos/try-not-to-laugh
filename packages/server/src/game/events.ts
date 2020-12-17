import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import IGame from "@tntl/definition/src/game/IGame";
import { eventCreator } from "../_definition/events/eventCreator";
import IEventCreator from "../_definition/events/IEventCreator";
import IPlayerUpdate from "@tntl/definition/src/game/IPlayerUpdate";
import IGameStateUpdate from "@tntl/definition/src/game/IGameStateUpdate";
import IPlaylistUpdate from "@tntl/definition/src/game/IPlaylistUpdate";
import IChatMessage from "@tntl/definition/src/game/IChatMessage";
import IPlayRound from "@tntl/definition/src/game/IPlayRound";
import ICheckpointUpdate from "@tntl/definition/src/game/ICheckpointUpdate";

/**
 * Event which informs about the creation of a new video.
 */
export const onGameAdded: IEventCreator<IGame> =
  eventCreator<IGame & IIdentifier>('ON_GAME_ADDED');

export const onGameJoined: IEventCreator<IPlayerUpdate> =
  eventCreator<IPlayerUpdate>('ON_GAME_JOINED');

export const onGameLeft: IEventCreator<IPlayerUpdate> =
  eventCreator<IPlayerUpdate>('ON_GAME_LEFT');

export const onGameStateChanged: IEventCreator<IGameStateUpdate> =
  eventCreator<IGameStateUpdate>('ON_GAME_STATE_CHANGED');

export const onPlaylistItemAdded: IEventCreator<IPlaylistUpdate & IIdentifier> =
  eventCreator<IPlaylistUpdate & IIdentifier>('ON_PLAYLIST_ITEM_ADDED');

export const onPlaylistItemUpdated: IEventCreator<IPlaylistUpdate & IIdentifier> =
  eventCreator<IPlaylistUpdate & IIdentifier>('ON_PLAYLIST_ITEM_UPDATED');

export const onCheckpointUpdated: IEventCreator<ICheckpointUpdate & IIdentifier> =
  eventCreator<ICheckpointUpdate & IIdentifier>('ON_CHECKPOINT_UPDATED');

export const onNextRoundStarted: IEventCreator<IPlayRound> =
  eventCreator<IPlayRound>('ON_NEXT_ROUND_STARTED');

export const onChatMessageSent: IEventCreator<IChatMessage & IIdentifier> =
  eventCreator<IChatMessage & IIdentifier>('ON_CHAT_MESSAGE_SENT');