import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { ConfigModule } from './config/config.module';
import { RobotModule } from './robot/robot.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    CompanyModule,
    ConfigModule,
    RobotModule,
    AuthModule,
    UserModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
