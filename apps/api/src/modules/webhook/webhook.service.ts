import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  EPaymentStatus,
  ETrialLessonStatus,
  EWalletTransactionDirection,
  EWalletTransactionType,
  Prisma,
} from '@mezon-tutors/db';
import { PrismaService } from '../../prisma/prisma.service';
import { VnpayService } from '../vnpay/vnpay.service';

type VnpayQuery = Record<string, string | string[] | undefined>;

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vnpayService: VnpayService
  ) {}

  async handleVnpayReturn(query: VnpayQuery) {
    const verification = this.vnpayService.verifyReturnUrl(query);
    if (!verification.isVerified) {
      throw new BadRequestException('Invalid VNPay return signature');
    }
    return this.applyVnpayPaymentResult(query);
  }

  async handleVnpayIpn(query: VnpayQuery) {
    const verification = this.vnpayService.verifyIpnCall(query);
    if (!verification.isVerified) {
      return { RspCode: '97', Message: 'Invalid checksum' };
    }

    const result = await this.applyVnpayPaymentResult(query);
    if (!result.updated) {
      return { RspCode: '00', Message: 'Already processed' };
    }
    return { RspCode: '00', Message: 'Confirm Success' };
  }

  private async applyVnpayPaymentResult(query: VnpayQuery) {
    const txnRef = this.getScalarQueryValue(query.vnp_TxnRef);
    const responseCode = this.getScalarQueryValue(query.vnp_ResponseCode);
    const transactionStatus = this.getScalarQueryValue(query.vnp_TransactionStatus);

    if (!txnRef) {
      throw new BadRequestException('Missing vnp_TxnRef');
    }

    const booking = await this.prisma.trialLessonBooking.findFirst({
      where: { paymentRef: txnRef },
      select: {
        id: true,
        paymentStatus: true,
        tutorAmount: true,
        tutor: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!booking) {
      throw new NotFoundException(`Booking not found for payment ref ${txnRef}`);
    }

    const isSucceeded = responseCode === '00' && (!transactionStatus || transactionStatus === '00');
    const now = new Date();
    const eventType = isSucceeded ? 'vnpay.payment.succeeded' : 'vnpay.payment.failed';
    const processed = await this.prisma.$transaction(async (tx) => {
      const webhookLog = await this.upsertWebhookLog(tx, {
        orderCode: txnRef,
        eventType,
        rawPayload: query,
        isProcessed: false,
      });

      const updateBookingResult = await tx.trialLessonBooking.updateMany({
        where: {
          id: booking.id,
          paymentStatus: EPaymentStatus.PENDING,
        },
        data: isSucceeded
          ? {
              paymentStatus: EPaymentStatus.SUCCEEDED,
              paidAt: now,
              failedAt: null,
              status: ETrialLessonStatus.CONFIRMED,
            }
          : {
              paymentStatus: EPaymentStatus.FAILED,
              failedAt: now,
              paidAt: null,
              status: ETrialLessonStatus.CANCELLED,
            },
      });
      const didUpdateBooking = updateBookingResult.count > 0;

      if (didUpdateBooking && isSucceeded) {
        const wallet = await tx.wallet.upsert({
          where: { userId: booking.tutor.userId },
          update: {
            pendingBalance: { increment: booking.tutorAmount },
            totalEarned: { increment: booking.tutorAmount },
          },
          create: {
            userId: booking.tutor.userId,
            balance: 0n,
            pendingBalance: booking.tutorAmount,
            totalEarned: booking.tutorAmount,
            totalWithdrawn: 0n,
          },
          select: {
            id: true,
          },
        });

        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            bookingId: booking.id,
            type: EWalletTransactionType.BOOKING_PAYMENT,
            direction: EWalletTransactionDirection.CREDIT,
            amount: booking.tutorAmount,
            description: `Trial lesson payment settled for booking ${booking.id}`,
          },
        });
      }

      await tx.webhookLog.update({
        where: { id: webhookLog.id },
        data: {
          rawPayload: query,
          isProcessed: true,
          processedAt: now,
        },
      });

      const bookingAfter = await tx.trialLessonBooking.findUnique({
        where: { id: booking.id },
        select: {
          id: true,
          paymentStatus: true,
          status: true,
        },
      });
      if (!bookingAfter) {
        throw new NotFoundException(`Booking not found for id ${booking.id}`);
      }

      return {
        booking: bookingAfter,
        updated: didUpdateBooking,
      };
    });

    return {
      updated: processed.updated,
      bookingId: processed.booking.id,
      paymentStatus: processed.booking.paymentStatus,
      status: processed.booking.status,
      responseCode,
      transactionStatus,
    };
  }

  private getScalarQueryValue(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  }

  private async upsertWebhookLog(
    tx: Prisma.TransactionClient,
    payload: {
      orderCode: string;
      eventType: string;
      rawPayload: VnpayQuery;
      isProcessed: boolean;
      processedAt?: Date;
    }
  ) {
    const existing = await tx.webhookLog.findFirst({
      where: {
        orderCode: payload.orderCode,
        eventType: payload.eventType,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      await tx.webhookLog.update({
        where: { id: existing.id },
        data: {
          rawPayload: payload.rawPayload,
          isProcessed: payload.isProcessed,
          processedAt: payload.processedAt ?? null,
        },
      });
      return existing;
    }

    return tx.webhookLog.create({
      data: {
        orderCode: payload.orderCode,
        eventType: payload.eventType,
        rawPayload: payload.rawPayload,
        isProcessed: payload.isProcessed,
        processedAt: payload.processedAt ?? null,
      },
    });
  }
}
