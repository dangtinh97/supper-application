import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Youtube } from './schemas/youtube.schema';
import { Model, Types } from 'mongoose';
import { RecentlyVideo } from './schemas/recently_video';
import { ObjectId } from 'mongodb';
const _ = require('lodash');

@Injectable()
export class YoutubeService {
  constructor(
    @InjectModel(Youtube.name)
    private readonly youtubeModel: Model<Youtube>,
    @InjectModel(RecentlyVideo.name)
    private readonly recentlyVideoModel: Model<RecentlyVideo>,
  ) {}

  async getVideo(videoId: string) {
    return {};
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
    const data = _.get(
      json,
      'contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.0.itemSectionRenderer.contents',
      [],
    );
    let dataInsert = _.map(data, (item) => {
      const timeText = _.get(item, 'videoRenderer.lengthText.simpleText', '');
      return {
        video_id: _.get(item, 'videoRenderer.videoId'),
        thumbnails: _.get(item, 'videoRenderer.thumbnail.thumbnails', []),
        title: _.get(item, 'videoRenderer.title.runs[0].text', ''),
        duration: this.convertToSeconds(timeText),
        view_of_ytb: parseInt(
          _.get(item, 'videoRenderer.viewCountText.simpleText', '').replaceAll(
            ',',
            '',
          ),
        ),
        channel: {
          name: _.get(item, 'videoRenderer.ownerText.runs[0].text', ''),
          channel_id: _.get(
            item,
            'videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId',
            '',
          ),
        },
      };
    });
    dataInsert = _.filter(dataInsert, (item: { title: any }) => item.title);
    for (const item of dataInsert) {
      await this.youtubeModel.findOneAndUpdate(
        {
          video_id: item.video_id,
        },
        { ...item },
        { upsert: true },
      );
    }
    return dataInsert.map((item) => {
      return {
        ...item,
        thumbnail: _.get(item, 'thumbnails.0.url', ''),
      };
    });
  }

  convertToSeconds(time: string) {
    const parts = time.split(':').map(Number);

    // If the time includes hours
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }

    // If the time does not include hours
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  async viewVideo(videoId: string, userOid: string) {
    await Promise.all([
      await this.youtubeModel.findOneAndUpdate(
        {
          video_id: videoId,
        },
        {
          $inc: {
            view_of_app: 1,
          },
        },
      ),
      this.recentlyVideoModel.findOneAndUpdate(
        {
          video_id: videoId,
          user_oid: new ObjectId(userOid),
        },
        {
          $set: {
            video_id: videoId,
            user_oid: new ObjectId(userOid),
            updated_at: new Date(),
          },
          $inc: {
            count: 1,
          },
        },
        {
          upsert: true,
        },
      ),
    ]);

    return {};
  }
}
