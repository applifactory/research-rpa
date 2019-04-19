import { WsJwtGuard } from './ws-jwt-auth.guard';

describe('WsJwtGuardGuard', () => {
  it('should be defined', () => {
    expect(new WsJwtGuard()).toBeDefined();
  });
});
