import { Request } from 'express';
import { User } from 'src/user/user.entity';

export interface JwtRequest extends Request {
  user: User;
}