import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";

@Table({ tableName: ModelName.channel, paranoid: true })
export class Channel extends Model<Channel, Partial<Channel>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare followById: string

    @BelongsTo(() => User, 'followById')
    declare followBy: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare followedToId: string;

    @BelongsTo(() => User, 'followedToId')
    declare followTo: User;

}