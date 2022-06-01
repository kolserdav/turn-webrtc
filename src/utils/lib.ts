import type { connection as Connection } from 'websocket';
import type { PeerMessageType, PeerMessageValue } from '../client';

export const log = (type: 'info' | 'warn' | 'error', text: string, data?: any) => {
  console[type](type, text, data);
};

export function sendMessage<T extends PeerMessageType>({
  data,
  connection,
}: {
  data: PeerMessageValue<T>;
  connection: Connection;
}) {
  connection.sendUTF(JSON.stringify(data));
}
