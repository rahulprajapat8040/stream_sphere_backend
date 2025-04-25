import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { VidController } from './modules/vid/vid.controller';
import { VidModule } from './modules/vid/vid.module';
import { AuthMiddleWare } from './middlewares/auth.middleware';
import { User } from './models';
import { UserModule } from './modules/user/user.module';
import { ChatGateway } from './modules/chat/chat.gateway';

@Module({
  imports: [SequelizeModule.forFeature([User]), DatabaseModule, AuthModule, VidModule, UserModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes('*')
  }
}
