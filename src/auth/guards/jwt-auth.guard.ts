import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { JwtRequest } from '../interfaces/jwt-request.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    return new Promise<boolean>( async (resolve) => {
      const request: JwtRequest = context.switchToHttp().getRequest();
      const headers: { [ key: string ]: string } = <any>request.headers;
      if ( headers && Object.keys(headers).includes('authorization') && !headers.authorization.indexOf('JWT ') ) {
        const jwtToken: string = headers.authorization.split(' ')[1];
        try {
          const jwtPayload: JwtPayload = this.jwtService.verify(jwtToken);
          const user: User = await this.userService.findById( jwtPayload._id );
          if ( user ) {
            request.user = user;
            return resolve(true);
          }
        } catch (e) {
          resolve(false);
        }
      }
      resolve(false);
    });
  }
  
}
