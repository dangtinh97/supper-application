import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Namespace, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'server', cors: true })
export class ServerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  @WebSocketServer()
  chat: Namespace;

  handleConnection(client: any, ...args: any[]) {
    //throw new Error('Method not implemented.');
  }

  handleDisconnect(client: any) {
    //throw new Error('Method not implemented.');
  }

  afterInit(server: any) {
    if (this.server) {
      this.chat = this.chat.server.of('/chat');
    }
  }

  @SubscribeMessage('SEND_ACTION')
  async onAction(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ){
    console.log('SEND_ACTION', data);
    this.chat.to(data.room_id).emit(data.event, data);
  }
}
