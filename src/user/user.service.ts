import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string) {
    const user: User = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    return await this.userRepository.save(user);
  }

  async login( email: string, password: string ): Promise<User> {
    const users = await this.userRepository.find({
      where: {
        email,
        password: crypto.createHmac('sha256', password).digest('hex')
      }
    });
    return users && users.length ? users[0] : null;
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }
  
}
