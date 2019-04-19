import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { JwtRequest } from '../interfaces/jwt-request.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    return new Promise<boolean>( async (resolve) => {
      const request: JwtRequest = context.switchToHttp().getRequest();
      const headers: { [ key: string ]: string } = <any>request.headers;
      if ( headers && Object.keys(headers).includes('authorization') && !headers.authorization.indexOf('JWT ') ) {
        const jwtToken: string = headers.authorization.split(' ')[1];
        const user = await this.authService.validate(jwtToken);
        if ( user ) {
          request.user = user;
          return resolve(true);
        }
      }
      resolve(false);
    });
  }
  
}
