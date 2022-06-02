/* eslint-disable no-case-declarations */
import http from 'http';
import dotenv from 'dotenv';
import nodeStatic from 'node-static';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import stringToStream from 'string-to-stream';
import { server as WebSocketServer, connection as Connection } from 'websocket';
dotenv.config();
import { log, sendMessage } from './utils';
import { PeerMessageType, PeerMessageValue, Resource } from './client';

const {
  env: { WS_PORT },
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
{ env: Record<string, string> } = process as any;

const connections: Record<string, { id: number; connection: Connection }> = {};
const users: Record<number, string> = {};

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
  const { key } = request;
  const connection = request.accept('json', request.origin);
  connections[key] = {
    id: 0,
    connection,
  };
  sendMessage<PeerMessageType.getId>({
    connection,
    data: { type: PeerMessageType.getId, resource: Resource.message },
  });
  connection.on('message', async function (message) {
    if (message.type === 'utf8') {
      const msg = JSON.parse(message.utf8Data);
      const { targetUserId, type }: PeerMessageValue<PeerMessageType.all> = msg;
      switch (type) {
        case PeerMessageType.setId:
          connections[key].id = msg.id;
          users[msg.id] = request.key;
          sendMessage<PeerMessageType.idSaved>({
            connection,
            data: {
              type: PeerMessageType.idSaved,
              resource: Resource.message,
            },
          });
          break;
        case PeerMessageType.offer:

        default:
          sendMessage({ connection: connections[users[targetUserId]].connection, data: msg });
      }
    }
  });

  connection.on('close', function (reason, description) {
    console.log('close', reason, description);
  });
});
