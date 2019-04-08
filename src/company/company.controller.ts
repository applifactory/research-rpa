import { Controller, Get, Post, Body } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { pick } from 'lodash';

@Controller('company')
export class CompanyController {

  constructor(private readonly companyService: CompanyService) {}

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

}
