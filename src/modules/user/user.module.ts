import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule { }