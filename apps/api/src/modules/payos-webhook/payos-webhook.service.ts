import { Injectable, UnauthorizedException } from '@nestjs/common'
import { WebhookError } from '@payos/node'
import type { Webhook } from '@payos/node/lib/resources/webhooks/webhook'
import {
  EPaymentStatus,
  EWalletTransactionDirection,
  EWalletTransactionType,
  Prisma,
} from '@mezon-tutors/db'
import { PrismaService } from '../../prisma/prisma.service'
import { PayosService } from '../payos/payos.service'

@Injectable()
export class PayosWebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payosService: PayosService
  ) {}

  async handlePaymentWebhook(body: unknown): Promise<{ received: true }> {
    const payload = body as Webhook
    const orderCodeRaw = payload?.data?.orderCode
    const orderCodeStr =
      orderCodeRaw !== undefined && orderCodeRaw !== null ? String(orderCodeRaw) : 'unknown'

    const log = await this.prisma.webhookLog.create({
      data: {
        orderCode: orderCodeStr,
        eventType: 'payos.payment',
        rawPayload: body as Prisma.InputJsonValue,
      },
    })

    // Idempotency guard: if this orderCode was already processed, do not apply side effects again.
    if (orderCodeStr !== 'unknown') {
      const alreadyProcessed = await this.prisma.webhookLog.findFirst({
        where: {
          id: { not: log.id },
          orderCode: orderCodeStr,
          eventType: 'payos.payment',
          isProcessed: true,
        },
        select: { id: true },
      })
      if (alreadyProcessed) {
        await this.prisma.webhookLog.update({
          where: { id: log.id },
          data: { isProcessed: true, processedAt: new Date() },
        })
        return { received: true }
      }
    }

    let verifiedData: { orderCode: number; amount: number; code: string }
    try {
      verifiedData = await this.payosService.verifyWebhook(payload)
    } catch (err) {
      if (err instanceof WebhookError) {
        throw new UnauthorizedException('Invalid PayOS webhook signature')
      }
      throw err
    }

    const paymentOk =
      payload.success === true && payload.code === '00' && verifiedData.code === '00'

    if (!paymentOk) {
      if (orderCodeStr !== 'unknown') {
        await this.prisma.trialLessonBooking
          .updateMany({
            where: {
              payosOrderCode: orderCodeStr,
              paymentStatus: EPaymentStatus.PENDING,
            },
            data: {
              paymentStatus: EPaymentStatus.FAILED,
              failedAt: new Date(),
            },
          })
      }

      await this.prisma.webhookLog.update({
        where: { id: log.id },
        data: { isProcessed: true, processedAt: new Date() },
      })

      return { received: true }
    }

    const booking = await this.prisma.trialLessonBooking.findFirst({
      where: { payosOrderCode: orderCodeStr },
    })

    if (!booking) {
      await this.prisma.webhookLog.update({
        where: { id: log.id },
        data: { isProcessed: true, processedAt: new Date() },
      })
      return { received: true }
    }

    if (Number(booking.grossAmount) !== verifiedData.amount) {
      await this.prisma.webhookLog.update({
        where: { id: log.id },
        data: { isProcessed: true, processedAt: new Date() },
      })
      return { received: true }
    }

    if (booking.paymentStatus === EPaymentStatus.SUCCEEDED) {
      await this.prisma.webhookLog.update({
        where: { id: log.id },
        data: { isProcessed: true, processedAt: new Date() },
      })
      return { received: true }
    }

    await this.prisma.$transaction(async (tx) => {
      // Update only when still pending. If count=0, another webhook already processed it.
      const updated = await tx.trialLessonBooking.updateMany({
        where: {
          id: booking.id,
          paymentStatus: EPaymentStatus.PENDING,
        },
        data: {
          paymentStatus: EPaymentStatus.SUCCEEDED,
          paidAt: new Date(),
        },
      })

      await tx.webhookLog.update({
        where: { id: log.id },
        data: { isProcessed: true, processedAt: new Date() },
      })

      if (updated.count === 0) {
        return
      }

      // Sau khi thanh toán thành công: cộng tiền vào pending balance của tutor.
      // Chưa cộng vào balance thực, vì sẽ release sau khi lesson hoàn tất.
      const tutorProfile = await tx.tutorProfile.findUnique({
        where: { id: booking.tutorId },
        select: { userId: true },
      })
      if (!tutorProfile) {
        return
      }

      const wallet = await tx.wallet.upsert({
        where: { userId: tutorProfile.userId },
        create: {
          userId: tutorProfile.userId,
          pendingBalance: booking.tutorAmount,
        },
        update: {
          pendingBalance: { increment: booking.tutorAmount },
        },
        select: { id: true },
      })

      const existingBookingPaymentTx = await tx.transaction.findFirst({
        where: {
          bookingId: booking.id,
          type: EWalletTransactionType.BOOKING_PAYMENT,
          direction: EWalletTransactionDirection.CREDIT,
        },
        select: { id: true },
      })

      if (!existingBookingPaymentTx) {
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            bookingId: booking.id,
            type: EWalletTransactionType.BOOKING_PAYMENT,
            amount: verifiedData.amount,
            direction: EWalletTransactionDirection.CREDIT,
            description: `Trial lesson payment pending release for booking ${booking.id}`,
          },
        })
      }
    })
    return { received: true }
  }
}
