import { Injectable } from '@nestjs/common';

const youtubedl = require('youtube-dl-exec');

@Injectable()
export class YoutubeService {
  constructor() {}

  async getVideo(videoId: string) {
    return new Promise((resolve, reject) => {
      youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: [
          'referer:youtube.com',
          'user-agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.3',
          'cookie:GPS=1; YSC=78jX5rIbZuM; __Secure-ROLLOUT_TOKEN=CPmjo43ox_e_iwEQ4LuA-MbnigMY4LuA-MbnigM%3D; VISITOR_INFO1_LIVE=V2vW6i-sY7k; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgIg%3D%3D; PREF=f6=40000000&tz=Asia.Saigon',
        ],
      })
        .then((output) => {
          const selected = (({
            url,
            title,
            thumbnail,
            description,
            duration,
            view_count,
            channel_url,
          }) => ({
            url,
            title,
            thumbnail,
            description,
            duration,
            view_count,
            channel_url,
          }))(output);

          resolve(selected);
        })
        .catch((err) => reject(err));
    });
  }

  async suggest(query: string) {
    const time = Math.round(new Date().getTime() / 1000);
    const url = `https://suggestqueries.google.com/complete/search?json=suggestCallBack&q=${encodeURIComponent(query)}&hl=vi&ds=yt&client=youtube&_=${time}`;
    console.log(url);
    const curl = await fetch(url, {
      headers: this.headerCurl(),
      method: 'GET',
    });

    const body = await curl.text();
    // return body;
    return this.parseDataSuggest(body);
  }

  headerCurl(): any {
    return {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'accept-language': 'vi-VN,vi;q=0.9',
      cookie:
        'GPS=1; YSC=8O5Dqkbfe3I; VISITOR_INFO1_LIVE=ZTRgRstulEA; PREF=tz=Asia.Saigon',
    };
  }

  parseDataSuggest(dataString: string) {
    const jsonString = dataString
      .replace(/^window\.google\.ac\.h\(/, '')
      .replace(/\)$/, '');
    const data = JSON.parse(jsonString);
    const suggestions = data[1]; // Danh sách các gợi ý
    const results: any = [];
    suggestions.forEach((suggestion: any) => {
      results.push(suggestion[0]);
    });
    return results;
  }
}
