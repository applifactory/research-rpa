import { Controller, UseGuards, Get, Req, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { JwtRequest } from 'src/auth/interfaces/jwt-request.interface';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  async currentUser(@Req() request: JwtRequest) {
    const user = await this.userService.findById(request.user._id.toString());
    if ( !user ) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

}
