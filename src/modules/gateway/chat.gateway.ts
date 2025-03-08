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

@WebSocketGateway({ namespace: '/chat', cors: true })
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
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(
        Buffer.from(payloadBase64, 'base64').toString('utf-8'),
      );
      console.log('Sub:', payload.sub);
      client.join(payload.sub);
      // console.log(token, room_id);
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
    const roomId = data['room_id'] || room_id;
    client.to(roomId).emit('SEND_MESSAGE', data);
  }

  @SubscribeMessage('CONNECT_CHAT')
  async connectChat(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
    const { room_id, token } = client.handshake.auth;
    console.log('Connect Chat');
    // client.to(room_id).emit('SEND_MESSAGE', data);
  }

  @SubscribeMessage("JOIN_ROOM")
  async joinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
    const { room_id } = data;
    console.log('Connect Chat');
    client.join(room_id);
  }
}
