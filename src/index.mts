import http from 'http';
import dotenv from 'dotenv';
import nodeStatic from 'node-static';
import { server as WebSocketServer, connection } from 'websocket';
dotenv.config();
import { log } from './utils/index.mjs';

const {
  env: { WS_PORT },
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
{ env: Record<string, string> } = process as any;

const connectionArray: connection[] = [];

const fileServer = new nodeStatic.Server('cloud');

const httpServer = http.createServer({}, function (request, response) {
  fileServer.serve(request, response);
});

httpServer.listen(parseInt(WS_PORT, 10), function () {
  log('info', `Server is listening on port ${WS_PORT}`);
});

const wsServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false,
});

wsServer.on('request', function (request) {
  console.log('request', request.key);

  const connection = request.accept('json', request.origin);

  connection.on('message', function (message) {
    console.log('message', message);
  });

  connection.on('close', function (reason, description) {
    console.log('close', reason, description);
  });
});
