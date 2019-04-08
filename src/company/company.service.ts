import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async create(company: Company): Promise<Company> {
    if ( company.name && await this.companyRepository.findOne({ name: company.name }) ) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'Company already exists',
      }, 403);
    }
    return await this.companyRepository.save(company);
  }

}
