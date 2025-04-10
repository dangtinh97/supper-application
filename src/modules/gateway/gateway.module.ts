import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ServerGateway } from './server.gateway';
import { SocketClientService } from './socket-client.service';
import { P2PConnectGateway } from './p2p-connect.gateway';

@Module({
  exports: [SocketClientService],
  providers: [
    ChatGateway,
    ServerGateway,
    SocketClientService,
    P2PConnectGateway,
  ],
})
export class GatewayModule {}
