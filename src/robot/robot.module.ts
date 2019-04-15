import { Module } from '@nestjs/common';
import { LinkedinService } from './linkedin/linkedin.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [LinkedinService],
  exports: [LinkedinService]
})
export class RobotModule {}
