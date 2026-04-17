import { Module } from '@nestjs/common'
import { PrismaModule } from '../../prisma/prisma.module'
import { PayosModule } from '../payos/payos.module'
import { PayosWebhookController } from './payos-webhook.controller'
import { PayosWebhookService } from './payos-webhook.service'

@Module({
  imports: [PrismaModule, PayosModule],
  controllers: [PayosWebhookController],
  providers: [PayosWebhookService],
  exports: [PayosWebhookService],
})
export class PayosWebhookModule {}
