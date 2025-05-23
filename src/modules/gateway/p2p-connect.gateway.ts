import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/p2p-connect', cors: true })
export class P2PConnectGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: any, ...args: any[]) {
    const room_id = client.handshake.auth.room_id;
    setTimeout(() => {
      client.join(room_id);
    }, 200);
  }

  handleDisconnect(client: any) {
    //throw new Error('Method not implemented.');
  }

  @SubscribeMessage('JOIN')
  async join(@MessageBody() data: any, @ConnectedSocket() client: any) {
    const { room_id } = data;
    const my_room_id = client.handshake.auth.room_id;
    client.join(room_id);
    client.to(room_id).emit('JOIN', {
      room_id: my_room_id,
    });
    client.emit('JOIN', {
      room_id: room_id,
    });
  }

  @SubscribeMessage('SIGNALING')
  async sendDataConnect(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ) {
    const { room_id } = data;
    client.to(room_id).emit('SIGNALING', data);
  }
}
