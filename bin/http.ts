import express from 'express';
import bootstrap from '@config/bootstrap';
import { config } from 'dotenv';
import { createServer } from 'http';
import app from '../app';

const expressApp = express();
const http = createServer(expressApp);
config();
bootstrap()
  .then(async () => {
    http.listen(`${process.env.SERVER_PORT}`, () => {
      // eslint-disable-next-line no-console
      console.log(`http listening on *:${process.env.SERVER_PORT}`);
      app(expressApp, express, http);
    });
  })
  .catch((e) => {
    throw new Error(e);
  });
