import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { SchemaTypes } from 'mongoose';

@Schema({
  collection: 'video_playlists',
})
export class VideoPlaylist {
  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.Mixed })
  video_ids: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  user_oid: mongoose.Types.ObjectId;
}

export const VideoPlaylistSchema = SchemaFactory.createForClass(VideoPlaylist);
