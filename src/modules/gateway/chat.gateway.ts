import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'node:net';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    setTimeout(() => {
      client.emit('pong', {
        id: client.id,
      });
      const { room_id, token } = client.handshake.auth;
      client.join(room_id);
      console.log(token, room_id);
    }, 500);
  }

  afterInit(server: any) {
    // throw new Error('Method not implemented.');
  }

  handleDisconnect(client: any) {
    // throw new Error('Method not implemented.');
  }

  @SubscribeMessage('SEND_MESSAGE')
  async handlerSendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
    const { room_id, token } = client.handshake.auth;
    client.to(room_id, data);
  }
}
