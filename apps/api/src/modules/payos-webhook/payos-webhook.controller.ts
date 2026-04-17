import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { PayosWebhookService } from './payos-webhook.service'

@ApiExcludeController()
@Controller('webhooks')
export class PayosWebhookController {
  constructor(private readonly payosWebhookService: PayosWebhookService) {}

  @Post('payos')
  @HttpCode(HttpStatus.OK)
  async payosPayment(@Body() body: unknown) {
    return this.payosWebhookService.handlePaymentWebhook(body)
  }
}
