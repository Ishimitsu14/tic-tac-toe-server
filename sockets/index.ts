import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import path from 'path';
import fs from 'fs';

const cors = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

const getRoute = (http: Server, routePath: string): SocketServer => new SocketServer(http, {
  cors,
  path: `/socket.io${routePath}`,
});

const itemsLoop = (route: { route: string; path: string }, http: Server) => {
  // Reads all the files in a directory
  const items = fs.readdirSync(route.path);
  const listeners: any[] = [];
  const io = getRoute(http, route.route ? route.route : '/');
  for (const item of items) {
    const fullPath = `${route.path}/${item}`;
    if (fs.lstatSync(fullPath).isFile() && fullPath.split('.').pop() !== 'map') {
      // Requires all the files in the directory that is not a index.js.
      // eslint-disable-next-line global-require,import/no-dynamic-require
      listeners.push(require(fullPath));
    }
    if (fs.lstatSync(fullPath).isDirectory()) {
      itemsLoop({ route: `${route.route}/${item}`, path: fullPath }, http);
    }
  }

  for (const listener of listeners) {
    if (typeof listener === 'function') {
      listener(io);
    }
  }
};

export default (http: Server) => {
  const indexRoute = {
    route: '',
    path: `${path.resolve(__dirname)}/routes`,
  };
  itemsLoop(indexRoute, http);
};
