import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { Server } from 'socket.io';
import { WsJwtAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { SocketEvent } from './models/socket-event';
import { SocketEventType } from './models/socket-event-type';


@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection {

  private server: Server;

  constructor(private readonly authService: AuthService) {}

  async afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(client: any) {
    let user: User;
    if ( 
      !client.handshake.query.hasOwnProperty('token') || 
      !await this.authService.validate(client.handshake.query.token)
    ) {
      client.error( (new UnauthorizedException('You are not authorized')).getResponse() );
      client.client.close();
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('event')
  handleMessage(client: any, event: SocketEvent) {
    if ( event.type == SocketEventType.MESSAGE ) {
      client.emit('event', { type: SocketEventType.MESSAGE, message: `hello! [${event.message}]` });
    }
  }

}
