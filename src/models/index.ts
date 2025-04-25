import { Channel } from "./channel";
import { CommentReply } from "./commentReply.model";
import { Comments } from "./comments.model";
import { DeviceInfo } from "./device.model";
import { DisLikes } from "./disLikes.model";
import { Likes } from "./like.model";
import { User } from "./user.model";
import { Videos } from "./videos.model";

export const Models = [DeviceInfo, User, Videos, Likes, DisLikes, Comments, CommentReply, Channel]

export { DeviceInfo, User, Videos, Likes, DisLikes, Comments, CommentReply, Channel }