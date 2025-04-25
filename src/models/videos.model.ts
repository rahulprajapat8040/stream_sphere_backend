import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { Likes } from "./like.model";
import { DisLikes } from "./disLikes.model";
import { Comments } from "./comments.model";
import { User } from "./user.model";

@Table({ tableName: ModelName.videos, paranoid: true })
export class Videos extends Model<Videos, Partial<Videos>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.STRING
    })
    declare videoUrl: string

    @Column({
        type: DataType.STRING
    })
    declare title: string

    @Column({
        type: DataType.TEXT
    })
    declare description: string

    @Column({
        type: DataType.STRING
    })
    declare thumbnail: string

    @Column({
        type: DataType.STRING,
        defaultValue: "Video"
    })
    declare videoType: 'Video' | 'Short' | 'Live'

    @Column({
        type: DataType.DATE
    })
    declare premierDate: string

    @Column({
        type: DataType.STRING,
        defaultValue: 'public'
    })
    declare visibility: 'public' | 'private' | 'primier'

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare uploadedById: string

    @BelongsTo(() => User)
    declare uploadedBy: User

    @HasMany(() => Likes)
    declare likes: Likes[]

    @HasMany(() => DisLikes)
    declare disLikes: DisLikes[]

    @HasMany(() => Comments)
    declare comments: Comments[]

}