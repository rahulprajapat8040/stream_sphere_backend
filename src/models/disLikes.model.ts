import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";
import { Videos } from "./videos.model";

@Table({ tableName: ModelName.disLikes, paranoid: true })
export class DisLikes extends Model<DisLikes, Partial<DisLikes>> {
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
    declare disLikeById: string

    @BelongsTo(() => User)
    declare disLikeBy: User
}