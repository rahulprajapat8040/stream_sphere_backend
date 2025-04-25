import { Column, DataType, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { DeviceInfo } from "./device.model";
import { Likes } from "./like.model";
import { DisLikes } from "./disLikes.model";
import { Comments } from "./comments.model";
import { CommentReply } from "./commentReply.model";
import { Videos } from "./videos.model";
import { Channel } from "./channel";

@Table({ tableName: ModelName.user, paranoid: true })
export class User extends Model<User, Partial<User>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.STRING,
    })
    declare name: string

    @Column({
        type: DataType.STRING
    })
    declare email: string

    @Column({
        type: DataType.STRING
    })
    declare phone: string

    @Column({
        type: DataType.STRING
    })
    declare password: string

    @Column({
        type: DataType.STRING
    })
    declare profilePhoto: string

    @HasMany(() => DeviceInfo)
    declare deviceInfo: DeviceInfo

    @HasMany(() => Likes)
    declare likedVideos: Likes[]

    @HasMany(() => DisLikes)
    declare disLikedVideos: DisLikes[]

    @HasMany(() => Comments)
    declare comments: Comments[]

    @HasMany(() => CommentReply)
    declare commentReplies: CommentReply[]

    @HasMany(() => Videos)
    declare videos: Videos[]

    @HasOne(() => Channel, 'followById') // user2 ---> follow user 1 -- user2Id
    declare channel: Channel;
    
    @HasOne(() => Channel, 'followedToId') // user1 id
    declare followedChannel: Channel;
}