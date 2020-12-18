import connectToDb from "./mongoose";
import express from "express";
import * as http from 'http';
import { initUserModule } from "./user/restApiV1";
import { initLibraryModule } from "./library/restApiV1";
import { getNamespace, startNotificationServer } from "./notification/socket";
import { initGameModule } from "./game/restApiV1";
import path from "path";
import { port } from "./config";

const staticDir = path.join(path.resolve(__dirname, '..'), 'node_modules/@tntl/client/dist/client');

const startUp = async () => {

  /**
   * 1. Check if we can connect to the database
   */
  await connectToDb();

  const app = express();
  const server = http.createServer(app);
  app.set('view engine', 'html');
  app.use('/', express.static(staticDir));

  startNotificationServer(server);

  initUserModule(app, getNamespace());

  initLibraryModule(app);

  initGameModule(app);

  server.listen(port, () => {
    console.log(`listening on *:${port}`);
  });
};

startUp();
