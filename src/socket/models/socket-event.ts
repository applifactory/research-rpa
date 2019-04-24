import { SocketEventType } from './socket-event-type';

export interface SocketEvent {
  type: SocketEventType;
  payload?: { [key: string]: any };
  message?: string;
}
