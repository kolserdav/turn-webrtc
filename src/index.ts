import http from 'http';
import dotenv from 'dotenv';
import nodeStatic from 'node-static';
import { server as WebSocketServer } from 'websocket';
dotenv.config();
import { log, sendMessage } from './utils';
import { PeerMessageType, PeerMessageValue } from './client';

const {
  env: { WS_PORT },
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
{ env: Record<string, string> } = process as any;

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
  sendMessage<PeerMessageType.getId>({ connection, data: { type: PeerMessageType.getId } });
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      const msg = JSON.parse(message.utf8Data);
      const { targetUserId, type }: PeerMessageValue<PeerMessageType.all> = msg;
      switch (type) {
        case PeerMessageType.setId:
          console.log(1, msg);
          break;
        default:
          console.log(2, targetUserId);
        // connection.sendUTF(JSON.stringify(msg));
      }
    }
  });

  connection.on('close', function (reason, description) {
    console.log('close', reason, description);
  });
});
