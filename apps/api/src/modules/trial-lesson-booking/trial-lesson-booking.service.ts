import { PLATFORM_FEE_PERCENTAGE, ROUTES } from '@mezon-tutors/shared'
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common'
import { randomInt } from 'node:crypto'
import { APIError } from '@payos/node'
import { EPaymentStatus, ETrialLessonStatus, VerificationStatus } from '@mezon-tutors/db'
import { timeToMinutes, utcDateToHHmm, utcDateToMinutes } from '@mezon-tutors/shared'
import type { PaginatedResponse } from '@mezon-tutors/shared'
import dayjs = require('dayjs')
import { PrismaService } from '../../prisma/prisma.service'
import { AppConfigService } from '../../shared/services/app-config.service'
import { PayosService } from '../payos/payos.service'
import { CreateTrialLessonBookingDto } from './dto/create-trial-lesson-booking.dto'
import type { TutorTrialLessonBookingRequestDto } from './dto/tutor-trial-lesson-booking-request.dto'

@Injectable()
export class TrialLessonBookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payosService: PayosService,
    private readonly appConfig: AppConfigService
  ) {}

  async getTutorBookingRequests(
    tutorUserId: string,
    options?: {
      status?: ETrialLessonStatus
      page?: number
      limit?: number
    }
  ): Promise<PaginatedResponse<TutorTrialLessonBookingRequestDto>> {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorUserId },
      select: { id: true },
    })

    if (!tutor) {
      throw new NotFoundException('Tutor profile not found for current user')
    }

    const page = Math.max(1, options?.page ?? 1)
    const limit = Math.max(10, Math.min(100, options?.limit ?? 10))
    const where = {
      tutorId: tutor.id,
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.trialLessonBooking.count({ where }),
      this.prisma.trialLessonBooking.findMany({
        where,
        include: {
          student: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])
    const totalPages = Math.ceil(total / limit)
    return {
      data: {
        items: items.map((item) => ({
          id: item.id,
          studentName: item.student.username,
          studentAvatarUrl: item.student.avatar,
          startAt: item.startAt.toISOString(),
          durationMinutes: item.durationMinutes,
          grossAmount: Number(item.grossAmount),
          platformFee: Number(item.platformFee),
          tutorAmount: Number(item.tutorAmount),
          status: item.status,
          createdAt: item.createdAt.toISOString(),
        })),
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      error: null,
    }
  }

  async hasStudentBookedTutor(studentId: string, tutorId: string) {
    const booking = await this.prisma.trialLessonBooking.findFirst({
      where: {
        studentId,
        tutorId,
        status: {
          not: ETrialLessonStatus.CANCELLED,
        },
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        startAt: true,
        durationMinutes: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      hasBooked: Boolean(booking),
      bookingId: booking?.id ?? null,
      status: booking?.status ?? null,
      paymentStatus: booking?.paymentStatus ?? null,
      startAt: booking?.startAt?.toISOString() ?? null,
      durationMinutes: booking?.durationMinutes ?? null,
    }
  }

  async getCurrentStudentTutorBooking(studentId: string, tutorId: string) {
    const booking = await this.prisma.trialLessonBooking.findFirst({
      where: {
        studentId,
        tutorId,
        status: {
          not: ETrialLessonStatus.CANCELLED,
        },
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        payosPaymentLink: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      hasBooked: Boolean(booking),
      bookingId: booking?.id ?? null,
      status: booking?.status ?? null,
      paymentStatus: booking?.paymentStatus ?? null,
      payosPaymentLink: booking?.payosPaymentLink ?? null,
    }
  }

  async getAcceptedByTutorAndDate(tutorId: string, date: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: { id: true },
    })

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${tutorId} not found`)
    }

    const dayStart = dayjs(`${date}T00:00:00Z`)
    if (!dayStart.isValid()) {
      throw new BadRequestException('Invalid date')
    }

    const dayEnd = dayStart.add(1, 'day')

    const bookings = await this.prisma.trialLessonBooking.findMany({
      where: {
        tutorId,
        status: ETrialLessonStatus.CONFIRMED,
        startAt: {
          gte: dayStart.toDate(),
          lt: dayEnd.toDate(),
        },
      },
      select: {
        id: true,
        startAt: true,
        durationMinutes: true,
      },
      orderBy: {
        startAt: 'asc',
      },
    })

    return {
      items: bookings.map((booking) => ({
        id: booking.id,
        startTime: utcDateToHHmm(booking.startAt),
        durationMinutes: booking.durationMinutes,
      })),
    }
  }

  async createTrialLessonBooking(studentId: string, dto: CreateTrialLessonBookingDto) {
    const bookingStatus = await this.hasStudentBookedTutor(studentId, dto.tutorId)
    if (bookingStatus.hasBooked) {
      if (bookingStatus.status === ETrialLessonStatus.PENDING) {
        throw new ConflictException('Request already sent. Please wait for confirmation')
      }
      throw new ConflictException('You have already booked a trial lesson with this tutor')
    }

    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: dto.tutorId },
      select: { id: true, pricePerHour: true, verificationStatus: true },
    })

    if (!tutor || tutor.verificationStatus !== VerificationStatus.APPROVED) {
      throw new NotFoundException(`Tutor with ID ${dto.tutorId} not found`)
    }

    const startAt = dayjs(dto.startAt)
    if (!startAt.isValid()) {
      throw new BadRequestException('Invalid date or startTime')
    }

    if (startAt.isBefore(dayjs())) {
      throw new BadRequestException('Cannot book lesson in the past')
    }

    const startMinutes = utcDateToMinutes(startAt.toDate())
    const endMinutes = startMinutes + dto.durationMinutes

    const availability = await this.prisma.tutorAvailability.findMany({
      where: {
        tutorId: dto.tutorId,
        dayOfWeek: dto.dayOfWeek,
        isActive: true,
      },
      orderBy: { startTime: 'asc' },
    })

    const matchedAvailability = availability.find((slot) => {
      const slotStart = timeToMinutes(slot.startTime)
      const slotEnd = timeToMinutes(slot.endTime)
      return startMinutes >= slotStart && endMinutes <= slotEnd
    })

    if (!matchedAvailability) {
      throw new BadRequestException('Selected time is not available for this tutor')
    }

    const dayStart = startAt.startOf('day')
    const dayEnd = dayStart.add(1, 'day')
    const existingBookings = await this.prisma.trialLessonBooking.findMany({
      where: {
        tutorId: dto.tutorId,
        status: {
          in: [ETrialLessonStatus.PENDING, ETrialLessonStatus.CONFIRMED],
        },
        startAt: {
          gte: dayStart.toDate(),
          lt: dayEnd.toDate(),
        },
      },
      select: {
        id: true,
        startAt: true,
        durationMinutes: true,
      },
    })

    const hasOverlap = existingBookings.some((booking) => {
      const bookedStartMinutes = utcDateToMinutes(booking.startAt)
      const bookedEndMinutes = bookedStartMinutes + booking.durationMinutes
      return startMinutes < bookedEndMinutes && endMinutes > bookedStartMinutes
    })

    if (hasOverlap) {
      throw new ConflictException('Selected time overlaps an existing booking')
    }

    const grossAmount = (tutor.pricePerHour * BigInt(dto.durationMinutes)) / 60n
    const platformFeeBps = BigInt(Math.round(PLATFORM_FEE_PERCENTAGE * 10_000))
    const platformFee = (grossAmount * platformFeeBps) / 10_000n
    const tutorAmount = grossAmount - platformFee

    const amountVnd = Number(grossAmount)
    if (!Number.isFinite(amountVnd) || amountVnd < 1) {
      throw new BadRequestException('Invalid payment amount for this lesson')
    }

    if (!this.payosService.isConfigured()) {
      throw new ServiceUnavailableException(
        'PayOS is not configured; cannot create trial lesson payment'
      )
    }

    const orderCode = await this.allocatePayosOrderCode()
    const baseFrontend = this.appConfig.frontendUrl.replace(/\/$/, '')
    const checkoutPath = ROUTES.CHECKOUT.TRIAL_LESSON

    const booking = await this.prisma.trialLessonBooking.create({
      data: {
        tutorId: dto.tutorId,
        studentId,
        startAt: startAt.toDate(),
        durationMinutes: dto.durationMinutes,
        grossAmount,
        platformFee,
        tutorAmount,
        status: ETrialLessonStatus.PENDING,
        paymentStatus: EPaymentStatus.PENDING,
      },
      select: { id: true },
    })

    const returnUrl = `${baseFrontend}${checkoutPath}?tutorId=${dto.tutorId}&startAt=${dto.startAt}&durationMinutes=${dto.durationMinutes}&dayOfWeek=${dto.dayOfWeek}`
    const cancelUrl = `${baseFrontend}${checkoutPath}?tutorId=${dto.tutorId}&startAt=${dto.startAt}&durationMinutes=${dto.durationMinutes}&dayOfWeek=${dto.dayOfWeek}`
    const description = `Trial ${booking.id.slice(0, 8)}`

    try {
      const { checkoutUrl } = await this.payosService.createPaymentLink({
        orderCode,
        amount: amountVnd,
        description,
        returnUrl,
        cancelUrl,
      })

      const updated = await this.prisma.trialLessonBooking.update({
        where: { id: booking.id },
        data: {
          payosOrderCode: String(orderCode),
          payosPaymentLink: checkoutUrl,
        },
        select: {
          id: true,
          tutorId: true,
          studentId: true,
          startAt: true,
          durationMinutes: true,
          status: true,
          paymentStatus: true,
          grossAmount: true,
          platformFee: true,
          tutorAmount: true,
          payosOrderCode: true,
          payosPaymentLink: true,
        },
      })

      return this.serializeTrialLessonBookingResponse(updated)
    } catch (err) {
      if (err instanceof APIError) {
        throw new BadGatewayException(
          err.message || 'PayOS could not create the payment link'
        )
      }
      throw err
    }
  }

  private async allocatePayosOrderCode(): Promise<number> {
    for (let attempt = 0; attempt < 12; attempt++) {
      const orderCode = randomInt(1_000_000_000, 2_147_483_647)
      const existing = await this.prisma.trialLessonBooking.findFirst({
        where: { payosOrderCode: String(orderCode) },
        select: { id: true },
      })
      if (!existing) {
        return orderCode
      }
    }
    throw new InternalServerErrorException('Could not allocate a unique PayOS order code')
  }

  private serializeTrialLessonBookingResponse(booking: {
    id: string
    tutorId: string
    studentId: string
    startAt: Date
    durationMinutes: number
    status: ETrialLessonStatus
    paymentStatus: EPaymentStatus
    grossAmount: bigint
    platformFee: bigint
    tutorAmount: bigint
    payosOrderCode: string | null
    payosPaymentLink: string | null
  }) {
    return {
      id: booking.id,
      tutorId: booking.tutorId,
      studentId: booking.studentId,
      startAt: booking.startAt.toISOString(),
      durationMinutes: booking.durationMinutes,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      grossAmount: Number(booking.grossAmount),
      platformFee: Number(booking.platformFee),
      tutorAmount: Number(booking.tutorAmount),
      payosOrderCode: booking.payosOrderCode,
      payosPaymentLink: booking.payosPaymentLink,
    }
  }
}
