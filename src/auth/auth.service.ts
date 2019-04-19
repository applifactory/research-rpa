import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validate(jwtToken: string): Promise<User> {
    try {
      const jwtPayload: JwtPayload = this.jwtService.verify(jwtToken);
      return await this.userService.findById( jwtPayload._id );
    } catch(e) {
      return null;
    }
  }

}
