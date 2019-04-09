import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { LinkedinService } from 'src/robot/linkedin/linkedin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompanyService, LinkedinService],
  controllers: [CompanyController],
})
export class CompanyModule {}
