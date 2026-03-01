import { Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';
@Injectable()
export class TrendingService {
  constructor() {}

  async crawlTrending(region: string) {
    const url = `https://us-central1-ytb-trending.cloudfunctions.net/trendingProxy/api/trending/${region}.html`;
    const curl = await fetch(url, {
      method: 'GET',
    });
    const text = await curl.text();
    const root = parse(text);

    const table = root.querySelector('.music > #trendingcountry');
    const links = table.querySelectorAll('tbody > tr > td.text > div > a');
    links.forEach((a)=>{
      const url=a.getAttribute('href')
      const title = a.text.trim();
      const match = url.match(/(?:v=|\/)([A-Za-z0-9_-]{11})/);
      const id = match ? match[1] : null;
      if(id!=null){
        this.getAndSaveInfoVideo({
          id, title, url
        })
      }
    });
  }

  async getAndSaveInfoVideo({id, url, title}){

  }
}
