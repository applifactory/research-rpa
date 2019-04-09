import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { LinkedinService } from './robot/linkedin/linkedin.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService, LinkedinService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
