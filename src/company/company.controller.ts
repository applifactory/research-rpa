import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { pick } from 'lodash';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { LinkedinService } from '../robot/linkedin/linkedin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {

  constructor(
    private readonly companyService: CompanyService,
    private readonly linkedInService: LinkedinService
  ) {}

  @Get()
  public findAll() {
    return this.companyService.findAll();
  }

  @Post()
  public async create(@Body() data: any): Promise<any> {
    const newCompany: Company = await this.companyService.create(
      <Company>pick(data, ['name', 'linkedinUrl', 'websiteUrl'])
    );
    return pick(newCompany, ['_id']);
  }

  @Get('fetch')
  public async fetch(): Promise<any> {
    return this.linkedInService.getCompanyDetails([
      'https://www.linkedin.com/company/leocode/',
      'https://www.linkedin.com/in/mateuszwitalinski/'
    ]);
  }

}
