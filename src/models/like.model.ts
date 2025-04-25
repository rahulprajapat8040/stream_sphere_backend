import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { Videos } from "./videos.model";
import { User } from "./user.model";

@Table({ tableName: ModelName.likes, paranoid: true })
export class Likes extends Model<Likes, Partial<Likes>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @ForeignKey(() => Videos)
    @Column({
        type: DataType.UUID
    })
    declare videoId: string

    @BelongsTo(() => Videos)
    declare video: Videos

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare likedById: string

    @BelongsTo(() => User)
    declare likedBy: User
}