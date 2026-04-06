import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CountryLabel,
  ECountry,
  ESubject,
  ETutorSortBy,
  SubjectLabel,
  PaginatedResponse,
  SubmitTutorProfileDto,
  TutorAvailabilitySlotDto,
  TutorLanguageDto,
  VerifiedTutorProfileDto,
} from '@mezon-tutors/shared';
import { LessonStatus, Prisma, Role, VerificationStatus } from '@mezon-tutors/db';
import dayjs = require('dayjs');
import { toTutorReviewDto, toVerifiedTutorProfileDto } from './tutor-profile.mapper';
import { VerifiedTutorQueryDto } from './dto/verified-tutor-query.dto';

@Injectable()
export class TutorProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(tutorId: string, reviewerId: string, rating: number, comment: string): Promise<void> {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: { ratingCount: true, ratingAverage: true },
    })

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${tutorId} not found`)
    }

    const newCount = tutor.ratingCount + 1
    const newAverage = (Number(tutor.ratingCount) * Number(tutor.ratingAverage) + rating) / newCount

    await this.prisma.$transaction(async (tx) => {
      await tx.tutorReview.create({
        data: {
          tutorId,
          reviewerId,
          rating,
          comment,
        },
      })

      await tx.tutorProfile.update({
        where: { id: tutorId },
        data: {
          ratingCount: newCount,
          ratingAverage: newAverage,
        },
      })
    })
  }

  async createByUserId(userId: string, dto: SubmitTutorProfileDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === Role.TUTOR) {
      throw new Error('User is already tutor yet!');
    }

    const profile = await this.prisma.tutorProfile.create({
      data: {
        userId: userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatar: dto.avatar ?? '',
        videoUrl: dto.videoUrl ?? '',
        country: dto.country,
        phone: dto.phone,
        email: dto.email,
        subject: dto.subject,
        introduce: dto.introduce,
        experience: dto.specialization,
        motivate: dto.motivate,
        headline: dto.headline,
        pricePerHour: dto.pricePerHour,
        ratingAverage: 0,
        verificationStatus: VerificationStatus.PENDING,
      },
    });

    if (dto.languages?.length && profile) {
      await this.upsertTutorLanguageByUserId(profile.id, dto.languages);
    }

    if (dto.availability?.length && profile) {
      await this.upsertTutorAvailabilitySlotByUserId(profile.id, dto.availability);
    }
  }

  async updateByUserId(userId: string, dto: SubmitTutorProfileDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await this.prisma.tutorProfile.update({
      where: { userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatar: dto.avatar ?? '',
        videoUrl: dto.videoUrl ?? '',
        country: dto.country,
        phone: dto.phone,
        email: dto.email,
        subject: dto.subject,
        introduce: dto.introduce,
        experience: dto.specialization,
        motivate: dto.motivate,
        headline: dto.headline,
        pricePerHour: dto.pricePerHour,
        isProfessional: !!dto.teachingCertificateName,
      },
    });

    if (dto.languages?.length && profile) {
      await this.upsertTutorLanguageByUserId(profile.id, dto.languages);
    }

    if (dto.availability?.length && profile) {
      await this.upsertTutorAvailabilitySlotByUserId(profile.id, dto.availability);
    }
  }

  async upsertTutorLanguageByUserId(userId: string, dto: TutorLanguageDto[]): Promise<void> {
    const current = await this.prisma.tutorLanguage.findMany({
      where: { tutorId: userId },
    });
    await this.prisma.$transaction(async (tx) => {
      const currentMap = new Map(current.map((l) => [l.languageCode, l]));
      const dtoMap = new Map(dto.map((l) => [l.languageCode, l]));
      const toCreate = dto.filter((l) => !currentMap.has(l.languageCode));
      const toUpdate = dto.filter((l) => currentMap.has(l.languageCode));
      const toDelete = current.filter((l) => !dtoMap.has(l.languageCode));

      if (toCreate.length) {
        await tx.tutorLanguage.createMany({
          data: toCreate.map((l) => ({
            tutorId: userId,
            languageCode: l.languageCode,
            proficiency: l.proficiency,
          })),
        });
      }

      for (const l of toUpdate) {
        await tx.tutorLanguage.update({
          where: {
            tutorId_languageCode: {
              tutorId: userId,
              languageCode: l.languageCode,
            },
          },
          data: {
            proficiency: l.proficiency,
          },
        });
      }

      if (toDelete.length) {
        await tx.tutorLanguage.deleteMany({
          where: {
            tutorId: userId,
            languageCode: {
              in: toDelete.map((l) => l.languageCode),
            },
          },
        });
      }
    });
  }

  async upsertTutorAvailabilitySlotByUserId(
    userId: string,
    dto: TutorAvailabilitySlotDto[]
  ): Promise<void> {
    const current = await this.prisma.tutorAvailability.findMany({
      where: { tutorId: userId },
    });

    await this.prisma.$transaction(async (tx) => {
      const currentMap = new Map(
        current.map((s) => [`${s.dayOfWeek}_${s.startTime}_${s.endTime}`, s])
      );

      const dtoMap = new Map(dto.map((s) => [`${s.dayOfWeek}_${s.startTime}_${s.endTime}`, s]));

      const toCreate = dto.filter(
        (s) => !currentMap.has(`${s.dayOfWeek}_${s.startTime}_${s.endTime}`)
      );

      const toDelete = current.filter(
        (s) => !dtoMap.has(`${s.dayOfWeek}_${s.startTime}_${s.endTime}`)
      );

      if (toCreate.length) {
        await tx.tutorAvailability.createMany({
          data: toCreate.map((s) => ({
            tutorId: userId,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isActive: true,
          })),
        });
      }

      if (toDelete.length) {
        await tx.tutorAvailability.deleteMany({
          where: {
            tutorId: userId,
            OR: toDelete.map((s) => ({
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
            })),
          },
        });
      }
    });
  }

  private getVerifiedTutorOrderBy(sortBy: ETutorSortBy) {
    switch (sortBy) {
      case ETutorSortBy.HIGHEST_PRICE:
        return [{ pricePerHour: 'desc' as const }]
      case ETutorSortBy.LOWEST_PRICE:
        return [{ pricePerHour: 'asc' as const }]
      case ETutorSortBy.NUMBER_OF_REVIEWS:
        return [{ ratingCount: 'desc' as const }]
      case ETutorSortBy.BEST_RATING:
        return [{ ratingAverage: 'desc' as const }]
      case ETutorSortBy.TOP_PICKS:
        return [{ totalStudents: 'desc' as const }]
      case ETutorSortBy.POPULARITY:
      default:
        return [
          { ratingAverage: 'desc' as const },
          { ratingCount: 'desc' as const },
        ]
    }
  }

  private getPricePerLessonFilter(pricePerLesson: string) {
    const [minStr, maxStr] = pricePerLesson.split('_')

    const min = Number(minStr)
    const max = Number(maxStr)
    
    if (!isNaN(min) && !isNaN(max)) {
      return {
        gte: min,
        lte: max,
      }
    }
    return undefined
  }

  async getVerifiedTutors(
    query: VerifiedTutorQueryDto
  ): Promise<PaginatedResponse<VerifiedTutorProfileDto>> {
    const {
      page,
      limit,
      sortBy = ETutorSortBy.POPULARITY,
      subject = ESubject.ANY_SUBJECT,
      country = ECountry.ANY_COUNTRY,
      pricePerLesson = '',
    } = query

    const orderBy = this.getVerifiedTutorOrderBy(sortBy)

    const where: Prisma.TutorProfileWhereInput = {
      verificationStatus: VerificationStatus.APPROVED,
    }

    if (subject && subject !== ESubject.ANY_SUBJECT) {
      where.subject = SubjectLabel[subject]
    }

    if (pricePerLesson && pricePerLesson !== '') {
      where.pricePerHour = this.getPricePerLessonFilter(pricePerLesson)
    }

    if (country && country !== ECountry.ANY_COUNTRY) {
      where.country = CountryLabel[country]
    }

    const [data, total] = await Promise.all([
      this.prisma.tutorProfile.findMany({
        where,
        include: {
          languages: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      this.prisma.tutorProfile.count({
        where,
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: {
        items: data.map((item) => toVerifiedTutorProfileDto(item)),
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

  async getVerifiedTutorAbout(id: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        languages: true,
      },
    })

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${id} not found`)
    }

    const bookedLessonsLast48h = await this.prisma.lesson.count({
      where: {
        tutorId: tutor.id,
        status: LessonStatus.BOOKED,
        startsAt: {
          gte: dayjs().subtract(48, 'hour').toDate(),
        },
      },
    })

    return {
      ...toVerifiedTutorProfileDto(tutor),
      stats: {
        bookedLessonsLast48h,
        totalLessonsTaught: tutor.totalLessonsTaught,
        totalStudents: tutor.totalStudents,
      },
    }
  }

  async getVerifiedTutorSchedule(id: string) {
    const availability = await this.prisma.tutorAvailability.findMany({
      where: {
        tutorId: id,
        isActive: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })

    return {
      availability: availability.map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive,
      })),
    }
  }

  async getVerifiedTutorReviews(id: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id },
      select: {
        id: true,
        ratingCount: true,
        ratingAverage: true,
      },
    })

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${id} not found`)
    }

    const reviews = await this.prisma.tutorReview.findMany({
      where: {
        tutorId: id,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      reviews: reviews.map(toTutorReviewDto),
      ratingCount: tutor.ratingCount,
      ratingAverage: Number(tutor.ratingAverage),
    }
  }

  async getVerifiedTutorResources(id: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id },
      select: {
        id: true,
        videoUrl: true,
      },
    })

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${id} not found`)
    }

    return {
      resources: tutor.videoUrl
        ? [
            {
              id: `${tutor.id}-intro-video`,
              title: 'Intro video',
              type: 'video' as const,
              url: tutor.videoUrl,
            },
          ]
        : [],
    }
  }
}
