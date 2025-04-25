import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DeviceInfo, User } from "src/models";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "./jwt.strategy";

@Module({
    imports: [
        SequelizeModule.forFeature([User, DeviceInfo]),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory:jwtConfig
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule { }