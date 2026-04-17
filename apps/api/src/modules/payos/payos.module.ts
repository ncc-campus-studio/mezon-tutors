import { Module } from '@nestjs/common'
import { PrismaModule } from '../../prisma/prisma.module'
import { PayosService } from './payos.service'

@Module({
  imports: [PrismaModule],
  providers: [PayosService],
  exports: [PayosService],
})
export class PayosModule {}
