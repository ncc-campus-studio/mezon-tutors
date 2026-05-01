import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { WebhookService } from './webhook.service'

@Controller('webhook')
@ApiTags('Webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get('vnpay/return')
  handleVnpayReturn(@Query() query: Record<string, string | string[] | undefined>) {
    return this.webhookService.handleVnpayReturn(query)
  }

  @Get('vnpay/ipn')
  handleVnpayIpn(@Query() query: Record<string, string | string[] | undefined>) {
    return this.webhookService.handleVnpayIpn(query)
  }
}
