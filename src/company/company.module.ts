import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { RobotModule } from 'src/robot/robot.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]), 
    RobotModule, 
    AuthModule
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
