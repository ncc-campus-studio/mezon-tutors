import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DmChannelController } from './dm-channel.controller';
import { DmChannelService } from './dm-channel.service';

@Module({
  imports: [PrismaModule],
  controllers: [DmChannelController],
  providers: [DmChannelService],
  exports: [DmChannelService],
})
export class DmChannelModule {}
