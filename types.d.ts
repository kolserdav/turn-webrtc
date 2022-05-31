declare global {
  type LogLevel = 'info' | 'warn' | 'error';
  export enum MessageType {
    candidate,
    offer,
    answer,
  }

  export interface Message {
    type: MessageType;
    id: string;
    resource: '/peer' | '/message';
    key: string;
  }
}

export {};
