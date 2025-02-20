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
    const dataInsert = await this.insertFromListData(data);
    return dataInsert.map((item) => {
      return {
        ...item,
        thumbnail: _.get(item, 'thumbnails.0.url', ''),
      };
    });
  }

  async insertFromListData(data: any[]) {
    let dataInsert = _.map(data, (item) => {
      const timeText = _.get(item, 'videoRenderer.lengthText.simpleText', '');
      let view = _.get(item, 'videoRenderer.viewCountText.simpleText', ',', '');
      view = !/\d/.test(view) ? 0 : parseInt(view);
      return {
        video_id: _.get(item, 'videoRenderer.videoId'),
        thumbnails: _.get(item, 'videoRenderer.thumbnail.thumbnails', []),
        title: _.get(item, 'videoRenderer.title.runs[0].text', ''),
        duration: this.convertToSeconds(timeText),
        view_of_ytb: view,
        channel: {
          name: _.get(item, 'videoRenderer.ownerText.runs[0].text', ''),
          channel_id: _.get(
            item,
            'videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl',
            '',
          ),
          browser_id: _.get(
            item,
            'videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId',
            '',
          ),
          thumbnail: _.get(
            item,
            'videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.0.url',
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
    return dataInsert;
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

  async recentlyVideo(userOid: string) {
    const finds = await this.recentlyVideoModel
      .aggregate([
        {
          $match: {
            user_oid: userOid
              ? new ObjectId(userOid)
              : {
                  $exists: true,
                },
          },
        },
        {
          $limit: 20,
        },
        {
          $lookup: {
            from: 'ytb_video',
            localField: 'video_id',
            foreignField: 'video_id',
            as: 'video',
          },
        },
        {
          $sort: {
            updated_at: -1,
          },
        },
      ])
      .exec();
    return finds
      .map((item) => {
        if (!item.video[0]) {
          return null;
        }
        const itemSet: any = item.video[0];
        itemSet.thumbnail = itemSet.thumbnails
          ? itemSet.thumbnails[itemSet.thumbnails.length - 1].url
          : '';
        return itemSet;
      })
      .filter((item) => {
        return item !== null;
      });
  }

  async topChannelList() {
    let all = await this.youtubeModel.aggregate([
      { $sort: { view_of_app: -1 } }, // Sort by view_of_app in descending order
      {
        $group: {
          _id: '$channel.channel_id',
          channel_info: { $first: '$channel' }, // Capture the entire channel object
          total_views: { $sum: '$view_of_app' },
        },
      },
      { $sort: { total_views: -1 } }, // Sort by total_views in descending order
      { $limit: 20 }, // Limit to top 10 channels
    ]);

    return all.map((item) => {
      const itemEnd = item.channel_info;
      itemEnd.thumbnail = itemEnd.thumbnail ?? '';
      itemEnd.total_views = item.total_views;
      return itemEnd;
    });
  }

  async musicNew(data: any) {
    const dataInsert = await this.insertFromListData(data);
    return dataInsert.map((item: any) => {
      return {
        ...item,
        thumbnail: _.get(item, 'thumbnails.0.url', ''),
      };
    });
  }

  async top10() {
    const dataInsert = await this.youtubeModel.aggregate([
      {
        $sort: {
          view_of_app: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    return dataInsert.map((item) => {
      return {
        ...item,
        thumbnail: _.get(item, 'thumbnails.0.url', ''),
      };
    });
  }

  async saveAndFilterVideoSuggest(data: []) {
    let dataInsert = _.map(data, (item: any) => {
      const timeText = _.get(
        item,
        'compactVideoRenderer.lengthText.simpleText',
        '',
      );
      let view = _.get(
        item,
        'compactVideoRenderer.viewCountText.simpleText',
        ',',
        '',
      );
      view = !/\d/.test(view) ? 0 : parseInt(view);
      return {
        video_id: _.get(item, 'compactVideoRenderer.videoId'),
        thumbnails: _.get(
          item,
          'compactVideoRenderer.thumbnail.thumbnails',
          [],
        ),
        title: _.get(item, 'compactVideoRenderer.title.simpleText', ''),
        duration: this.convertToSeconds(timeText),
        view_of_ytb: view,
        channel: {
          name: _.get(
            item,
            'compactVideoRenderer.longBylineText.runs[0].text',
            '',
          ),
          channel_id: _.get(
            item,
            'compactVideoRenderer.longBylineText.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl',
            '',
          ),
          browser_id: _.get(
            item,
            'compactVideoRenderer.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId',
            '',
          ),
          thumbnail: _.get(
            item,
            'compactVideoRenderer.channelThumbnail.thumbnails.0.url',
            '',
          ),
        },
        thumbnail:_.get(
          item,
          'compactVideoRenderer.thumbnail.thumbnails.0.url',
          [],
        ),
      };
    });
    dataInsert = _.filter(dataInsert, (item: { title: any }) => item.title);
    console.log(dataInsert.length);
    for (const item of dataInsert) {
      await this.youtubeModel.findOneAndUpdate(
        {
          video_id: item.video_id,
        },
        { ...item },
        { upsert: true },
      );
    }
    return dataInsert;
  }
}
