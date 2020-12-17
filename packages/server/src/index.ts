import connectToDb from "./mongoose";
import express from "express";
import * as http from 'http';
import { initUserModule } from "./user/restApiV1";
import { initLibraryModule } from "./library/restApiV1";
import { getNamespace, startNotificationServer } from "./notification/socket";
import { initGameModule } from "./game/restApiV1";

const startUp = async () => {

  /**
   * 1. Check if we can connect to the database
   */
  await connectToDb();

  const app = express();
  const server = http.createServer(app);

  app.get('/', (_req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
  });

  startNotificationServer(server);

  initUserModule(app, getNamespace());

  initLibraryModule(app);

  initGameModule(app);

  server.listen(8000, () => {
    console.log('listening on *:8000');
  });
};

startUp();
