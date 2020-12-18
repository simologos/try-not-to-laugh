import { Express, Request, Response } from "express";
import { publishCommand } from "../commandPublisher";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bodyParser from "body-parser";
import { isAuthenticated } from "../_middleware/authMiddleware";
import { registerAddGameHandler } from "./commandHandlers/addGameHandler";
import {
  addGame,
  addPlaylistItem,
  joinGame,
  leaveGame,
  sendChatMessage,
  setGameState,
  updateCheckpoint,
  updatePlaylistItem
} from "./commands";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import { registerJoinGameHandler } from "./commandHandlers/joinGameHandler";
import { registerLeaveGameHandler } from "./commandHandlers/leaveGameHandler";
import GameState from "@tntl/definition/src/game/GameState";
import { registerSetGameStateHandler } from "./commandHandlers/setGameStateHandler";
import IPlaylistUpdate from "@tntl/definition/src/game/IPlaylistUpdate";
import ICheckpointUpdate from "@tntl/definition/src/game/ICheckpointUpdate";
import { registerAddPlaylistItemHandler } from "./commandHandlers/addPlaylistItemHandler";
import { registerUpdatePlaylistItemHandler } from "./commandHandlers/updatePlaylistItemHandler";
import { registerSendChatMessageHandler } from "./commandHandlers/sendChatMessageHandler";
import IChatMessage from "@tntl/definition/src/game/IChatMessage";
import { registerStartNextRound } from "./commandHandlers/startNextRoundHandler";
import { registerUpdateCheckpointHandler } from "./commandHandlers/updateCheckpointHandler";
import { listGames } from "./queries/gameList";
import { getGameById } from "./queries/findGame";

const registerCommandHandlers = () => {
  registerAddGameHandler();
  registerJoinGameHandler();
  registerLeaveGameHandler();
  registerSetGameStateHandler();
  registerAddPlaylistItemHandler();
  registerUpdatePlaylistItemHandler();
  registerSendChatMessageHandler();
  registerStartNextRound();
  registerUpdateCheckpointHandler();
};

const registerRestEndpoints = (app: Express) => {

  const jsonParser = bodyParser.json()

  app.get('/v1/games', isAuthenticated, jsonParser, async (req: Request, res: Response) => {
    const { page, limit } = req.body;

    res.setHeader('Content-Type', 'application/json');

    const result = await listGames(parseInt(page, 10) || 0, parseInt(limit, 10) || 10);

    if (result.success) {
      res.status(StatusCodes.OK)
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    res.end(JSON.stringify(result));
  });

  app.get(
    '/v1/games/:id',
    isAuthenticated,
    jsonParser,
    async (req: Request, res: Response) => {
      const { id } = req.params;

      res.setHeader('Content-Type', 'application/json');

      const result = await getGameById(id);

      if (result.success) {
        res.status(StatusCodes.OK)
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      }

      res.end(JSON.stringify(result));
    });

  app.post(
    '/v1/games',
    isAuthenticated,
    jsonParser,
    (req: Request<{}, {}, null>, res: Response) => {
      const command = addGame(
        null,
        // @ts-ignore
        req.session.passport.user
      );

      publishCommand(command);

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });

  app.put(
    '/v1/games/:gameId',
    isAuthenticated,
    jsonParser,
    (req: Request<{ gameId: string }, {}, { state: GameState }>, res: Response) => {

      const { gameId } = req.params;
      const { state } = req.body;

      console.log(req.body)

      const command = setGameState(
        {
          state,
          id: gameId
        },
        // @ts-ignore
        req.session.passport.user
      );

      publishCommand(command);

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });

  app.post(
    '/v1/games/:gameId/players',
    isAuthenticated,
    jsonParser,
    (req: Request<{ gameId: string }, {}, IIdentifier>, res: Response) => {

      const { gameId } = req.params;

      publishCommand(joinGame(
        {
          id: gameId
        },
        // @ts-ignore
        req.session.passport.user
      ));

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });

  app.delete(
    '/v1/games/:gameId/players',
    isAuthenticated,
    jsonParser,
    (req: Request<{ gameId: string }, {}, IIdentifier>, res: Response) => {

      const { gameId } = req.params;

      publishCommand(leaveGame(
        {
          id: gameId
        },
        // @ts-ignore
        req.session.passport.user
      ));

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });

  app.post(
    '/v1/games/:gameId/playlist',
    isAuthenticated,
    jsonParser,
    (req: Request<{ gameId: string }, {}, IPlaylistUpdate>, res: Response) => {
      console.log(req.body)
      const { gameId } = req.params;
      const { name, url, start } = req.body;

      publishCommand(addPlaylistItem(
        {
          name,
          url,
          gameId,
          start,
          // @ts-ignore
          addedBy: req.session.passport.user
        },
        // @ts-ignore
        req.session.passport.user
      ));

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });

  app.put(
    '/v1/games/:gameId/playlist/:itemId',
    isAuthenticated,
    jsonParser,
    (req: Request<{ gameId: string, itemId: string }, {}, IPlaylistUpdate>, res: Response) => {

      const { gameId, itemId } = req.params;
      const { name, url, start } = req.body;

      publishCommand(updatePlaylistItem(
        {
          name,
          url,
          gameId,
          start,
          id: itemId,
          // @ts-ignore
          addedBy: req.session.passport.user
        },
        // @ts-ignore
        req.session.passport.user
      ));

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });

  app.put(
    '/v1/games/:gameId/playlist/:itemId/:checkpointId',
    isAuthenticated,
    jsonParser,
    (req: Request<{
      gameId: string,
      itemId: string,
      checkpointId: string
    }, {}, ICheckpointUpdate>, res: Response) => {

      const { gameId, itemId, checkpointId } = req.params;
      const { state, laughed } = req.body;

      publishCommand(updateCheckpoint(
        {
          state,
          laughed,
          gameId,
          checkpointId,
          id: itemId
        },
        // @ts-ignore
        req.session.passport.user
      ));

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });

  app.post(
    '/v1/games/:gameId/chats',
    isAuthenticated,
    jsonParser,
    (req: Request<{
      gameId: string
    }, {}, IChatMessage>, res: Response) => {

      const { gameId } = req.params;
      const { message } = req.body;

      publishCommand(sendChatMessage(
        {
          message,
          id: gameId
        },
        // @ts-ignore
        req.session.passport.user
      ));

      res
        .status(StatusCodes.ACCEPTED)
        .send(ReasonPhrases.ACCEPTED);
    });
};

const initModule = (app: Express) => {
  registerCommandHandlers();
  registerRestEndpoints(app);
};

export { initModule as initGameModule };
