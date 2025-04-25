import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { Comments } from "./comments.model";
import { User } from "./user.model";

@Table({ tableName: ModelName.commentReply, paranoid: true })
export class CommentReply extends Model<CommentReply, Partial<CommentReply>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.STRING
    })
    declare reply: string

    @Column({
        type: DataType.INTEGER
    })
    declare likes: number

    @Column({
        type: DataType.INTEGER
    })
    declare disLikes: number

    @ForeignKey(() => Comments)
    @Column({
        type: DataType.UUID
    })
    declare commentId: string


    @Column({
        type: DataType.ENUM('like', 'dislike'),
    })
    declare reaction: 'like' | 'dislike';

    @BelongsTo(() => Comments)
    declare comment: Comments

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare replyById: string

    @BelongsTo(() => User)
    declare user: User

}