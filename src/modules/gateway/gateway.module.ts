import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ServerGateway } from "./server.gateway";
import { SocketClientService } from "./socket-client.service";

@Module({
  exports:[SocketClientService],
  providers: [ChatGateway, ServerGateway, SocketClientService],
})
export class GatewayModule {}
