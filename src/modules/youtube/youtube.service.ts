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
          'cookie:GPS=1; YSC=mMyd1AuO_rE; VISITOR_INFO1_LIVE=JWPwxVW7pIs; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgVw%3D%3D; PREF=f6=40000000&tz=Asia.Saigon&f7=100; CONSISTENCY=AKreu9v7sGNQYrmytaWddhKPXkQXlTWS6fS7nY_rO5dT-L0wagY96E42KTB-cWOB_w7mdzklEdJXfawhUkkgmURaIpuTp7kTs7pkOIu4zC0YcsSYgAiMPZpgoFGgYJ7ktbFN5Ca7uqGu--8kK_8W8bE',
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

  async findVideoByKeyWord(keyword: string) {
    const body = {
      context: {
        client: {
          hl: 'en',
          gl: 'VN',
          remoteHost: '27.76.201.105',
          deviceMake: 'Apple',
          deviceModel: '',
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36,gzip(gfe)',
          clientName: 'WEB',
          clientVersion: '2.20250108.01.00',
          osName: 'Macintosh',
          osVersion: '10_15_7',
          originalUrl:
            'https://www.youtube.com/results?search_query=t%C3%A1i+sinh',
          platform: 'DESKTOP',
          clientFormFactor: 'UNKNOWN_FORM_FACTOR',
          userInterfaceTheme: 'USER_INTERFACE_THEME_DARK',
          timeZone: 'Asia/Saigon',
          browserName: 'Chrome',
          browserVersion: '131.0.0.0',
          acceptHeader:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          screenWidthPoints: 918,
          screenHeightPoints: 968,
          screenPixelDensity: 1,
          screenDensityFloat: 1,
          utcOffsetMinutes: 420,
          memoryTotalKbytes: '8000000',
        },
        user: {
          lockedSafetyMode: false,
        },
        request: {
          useSsl: true,
          consistencyTokenJars: [],
          internalExperimentFlags: [],
        },
      },
      query: keyword,
    };

    const curl = await fetch(
      'https://www.youtube.com/youtubei/v1/search?prettyPrint=false',
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await curl.json();
    return json;
  }
}
