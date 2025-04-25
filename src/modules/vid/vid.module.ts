import { Module } from "@nestjs/common";
import { VidController } from "./vid.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";
import { VidService } from "./vid.service";
import { FileService } from "../files/file.service";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [VidController],
    providers: [VidService, FileService]
})
export class VidModule { }