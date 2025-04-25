import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'rahul123',
            database: 'postgres',
            autoLoadModels: true,
            logging: false,
            sync: { alter: true },
            models: Models,
        })
    ]
})
export class DatabaseModule { }