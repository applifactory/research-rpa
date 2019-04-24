import { Controller, Get, UseGuards, Logger, Body, Post, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { pick } from 'lodash';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  @Post()
  public async login(@Body() data: any): Promise<any> {
    if ( !data.email || !data.password ) {
      throw new BadRequestException(`Missing ${!data.email ? 'email' : 'password'} parameter`);
    }
    const user: User = await this.userService.login( data.email, data.password );
    if ( !user ) {
      throw new UnauthorizedException('Wrong email or password');
    }
    const jwtPayload: JwtPayload = { _id: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(jwtPayload);
    return {
      accessToken,
      expiresIn: parseInt(this.config.get('JWT_EXPIRES')),
    }
  }

  @Post('register')
  public async register(@Body() data: any): Promise<any> {
    // TODO: add fields validation
    if ( !data.name ) {
      throw new BadRequestException('Bad `name` parameter');
    }
    if ( !data.email ) {
      throw new BadRequestException('Bad `email` parameter');
    }
    if ( !data.password ) {
      throw new BadRequestException('Bad `password` parameter');
    }
    const newUser: User = await this.userService.create( data.name, data.email, data.password );
    return pick(newUser, ['_id']);
  }

}
