import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";

@Table({ tableName: ModelName.videoData, paranoid: true })
export class VideoData extends Model<VideoData, Partial<VideoData>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.INTEGER
    })
    declare views: number

    @Column({
        type: DataType.INTEGER
    })
    declare like: number

    @Column({
        type: DataType.NUMBER
    })
    declare dislike: number

    @Column({
        type: DataType.INTEGER
    })
    declare share: number


}