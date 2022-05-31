import type { connection } from 'websocket';

export const log = (type: 'info' | 'warn' | 'error', text: string, data?: any) => {
  console[type](type, text, data);
};

export const sendMessage = ({ data, connection }: { data: Message; connection: connection }) => {
  connection.sendUTF(JSON.stringify(data));
};
