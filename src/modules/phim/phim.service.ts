import { Injectable } from "@nestjs/common";

@Injectable()
export class PhimService {
  constructor() {
  }

  async curlData(url: string){
    const curl = await fetch(url);
    return await curl.json();
  }
}