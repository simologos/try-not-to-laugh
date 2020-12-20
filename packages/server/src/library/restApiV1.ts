import IVideo from '@tntl/definition/src/library/IVideo';
import { Express, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bodyParser from 'body-parser';
import { publishCommand } from '../commandPublisher';
import { addVideo, removeVideo, updateVideo } from './commands';
import { registerAddVideoHandler } from './commandHandlers/addVideoHandler';
import { registerUpdateVideoHandler } from './commandHandlers/updateVideoHandler';
import { registerRemoveVideoHandler } from './commandHandlers/deleteVideoHandler';
import { isAuthenticated } from '../_middleware/authMiddleware';
import { listVideos } from './queries/videoList';

const registerCommandHandlers = () => {
  registerAddVideoHandler();
  registerUpdateVideoHandler();
  registerRemoveVideoHandler();
};

const registerRestEndpoints = (app: Express) => {
  const jsonParser = bodyParser.json();

  app.get('/v1/videos', isAuthenticated, jsonParser, async (req: Request, res: Response) => {
    const { page, limit } = req.body;

    res.setHeader('Content-Type', 'application/json');

    const result = await listVideos(
      parseInt(page, 10) || 0,
      parseInt(limit, 10) || 10,
      // @ts-ignore
      req.session.passport.user,
    );

    if (result.success) {
      res.status(StatusCodes.OK);
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res
      .end(JSON.stringify(result));
  });

  app.post('/v1/videos', isAuthenticated, jsonParser, (req: Request<{}, {}, IVideo>, res: Response) => {
    const { name, url, start } = req.body;

    publishCommand(addVideo(
      {
        name,
        url,
        start,
      },
      // @ts-ignore
      req.session.passport.user,
    ));

    res
      .status(StatusCodes.ACCEPTED)
      .send(ReasonPhrases.ACCEPTED);
  });

  app.put('/v1/videos/:videoId', isAuthenticated, jsonParser, (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { name, url, start } = req.body;

    publishCommand(updateVideo(
      {
        name,
        url,
        start,
        id: videoId,
      },
      // @ts-ignore
      req.session.passport.user,
    ));

    res
      .status(StatusCodes.ACCEPTED)
      .send(ReasonPhrases.ACCEPTED);
  });

  app.delete('/v1/videos/:videoId', isAuthenticated, jsonParser, (req: Request, res: Response) => {
    const { videoId } = req.params;

    publishCommand(removeVideo(
      {
        id: videoId,
      },
      // @ts-ignore
      req.session.passport.user,
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

export { initModule as initLibraryModule };
