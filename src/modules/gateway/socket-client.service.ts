import { Injectable, OnModuleInit } from "@nestjs/common";
import { Socket, io } from "socket.io-client";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "../../app.config";

@Injectable()
export class SocketClientService implements OnModuleInit {
  private socket: Socket;
  constructor(
    private configService: ConfigService
  ) {
  }
  onModuleInit() {
    this.createConnect();
    //throw new Error('Method not implemented.');
  }


  createConnect(){
    const base = this.configService.get<AppConfig['BASE_URL']>('BASE_URL') || 'https://tool.myoupip.com';
    this.socket = io(`${base}/server`);
  }

  pushClient(data:any){
    this.socket.emit('SEND_ACTION', data);
  }
}
