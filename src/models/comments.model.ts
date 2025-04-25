import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { Videos } from "./videos.model";
import { User } from "./user.model";

@Table({ tableName: ModelName.comments, paranoid: true })
export class Comments extends Model<Comments, Partial<Comments>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.STRING
    })
    declare comment: string

    @Column({
        type: DataType.INTEGER
    })
    declare like: number

    @Column({
        type: DataType.INTEGER
    })
    declare dislike: number

    @ForeignKey(() => Videos)
    @Column({
        type: DataType.UUID
    })
    declare videoId: string

    @BelongsTo(() => Videos)
    declare video: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare commentedById: string

    @BelongsTo(() => User)
    declare commentedBy: string
}