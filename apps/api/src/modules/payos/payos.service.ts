import { Injectable } from '@nestjs/common'
import { PayOS } from '@payos/node'
import type { Webhook, WebhookData } from '@payos/node/lib/resources/webhooks/webhook'
import { AppConfigService } from '../../shared/services/app-config.service'

export type CreatePayosPaymentLinkInput = {
  orderCode: number
  amount: number
  description: string
  returnUrl: string
  cancelUrl: string
}

@Injectable()
export class PayosService {
  constructor(private readonly appConfig: AppConfigService) {}

  isConfigured(): boolean {
    const id = this.appConfig.payosConfig.clientId
    const key = this.appConfig.payosConfig.apiKey
    const checksum = this.appConfig.payosConfig.checksumKey
    return Boolean(id && key && checksum)
  }

  private getCredentials(): { clientId: string; apiKey: string; checksumKey: string } | null {
    if (!this.isConfigured()) {
      return null
    }
    return {
      clientId: this.appConfig.payosConfig.clientId,
      apiKey: this.appConfig.payosConfig.apiKey,
      checksumKey: this.appConfig.payosConfig.checksumKey,
    }
  }

  async createPaymentLink(input: CreatePayosPaymentLinkInput): Promise<{ checkoutUrl: string }> {
    const creds = this.getCredentials()
    if (!creds) {
      throw new Error('PayOS credentials are missing')
    }

    const payos = new PayOS({
      clientId: creds.clientId,
      apiKey: creds.apiKey,
      checksumKey: creds.checksumKey,
    })

    const result = await payos.paymentRequests.create({
      orderCode: input.orderCode,
      amount: input.amount,
      description: input.description,
      returnUrl: input.returnUrl,
      cancelUrl: input.cancelUrl,
    })

    const checkoutUrl =
      typeof result === 'object' && result !== null && 'checkoutUrl' in result
        ? (result as { checkoutUrl?: string }).checkoutUrl
        : undefined

    if (!checkoutUrl) {
      throw new Error('PayOS response did not include checkoutUrl')
    }

    return { checkoutUrl }
  }

  verifyWebhook(webhook: Webhook): Promise<WebhookData> {
    const creds = this.getCredentials()
    if (!creds) {
      throw new Error('PayOS credentials are missing')
    }
    const payos = new PayOS({
      clientId: creds.clientId,
      apiKey: creds.apiKey,
      checksumKey: creds.checksumKey,
    })
    return payos.webhooks.verify(webhook)
  }
}
