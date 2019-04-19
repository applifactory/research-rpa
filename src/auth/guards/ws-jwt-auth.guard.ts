import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {

  constructor(private readonly authService: AuthService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const client: any = context.switchToWs().getClient();
    let user: User;
    if ( !client.handshake.query.hasOwnProperty('token') ) {
      client.error( (new ForbiddenException('You are not allowed to access this resource')).getResponse() );
      return false;
    }
    if ( user = await this.authService.validate(client.handshake.query.token) ) {
      client.handshake.user = user;
      return true;
    }
    return false;
  }

}
