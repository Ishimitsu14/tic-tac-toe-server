import { Application, Express } from 'express';
import { Server } from 'http';
import fileUpload from 'express-fileupload';
import cors from '@middleware/cors';
import routes from './http';
import sockets from './sockets';

export default async (
  app: Application,
  express: (() => Express),
  http: Server,
): Promise<void> => {
  const init = async () => {
    await routes(app);
    await sockets(http);
  };
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');
  app.use(cors);
  app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  await init();
  // jobs();
};
