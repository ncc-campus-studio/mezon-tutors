import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  SubmitTutorProfileDto,
  TutorAvailabilitySlotDto,
  TutorLanguageDto,
} from '@mezon-tutors/shared';
import { Role } from '@mezon-tutors/db';

@Injectable()
export class TutorProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByUserId(userId: string, dto: SubmitTutorProfileDto): Promise<void> {
    const ratingAverage = 0;

    let profileId = '';

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== Role.TUTOR) {
        await tx.user.update({
          where: { id: userId },
          data: { role: Role.TUTOR },
        });
      }

      const profile = await tx.tutorProfile.upsert({
        where: { userId },
        update: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          avatar: dto.avatar ?? '',
          videoUrl: dto.videoUrl ?? '',
          country: dto.country,
          introduce: dto.introduce,
          experience: dto.specialization,
          motivate: dto.motivate,
          headline: dto.headline,
          pricePerHour: dto.pricePerHour,
          isProfessional: !!dto.teachingCertificateName,
          verificationStatus: 'pending',
        },
        create: {
          userId: userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          avatar: dto.avatar ?? '',
          videoUrl: dto.videoUrl ?? '',
          country: dto.country,
          introduce: dto.introduce,
          experience: dto.specialization,
          motivate: dto.motivate,
          headline: dto.headline,
          pricePerHour: dto.pricePerHour,
          ratingAverage,
          verificationStatus: 'pending',
        },
      });

      profileId = profile.id;
    });

    if (dto.languages?.length && profileId) {
      await this.upsertTutorLanguageByUserId(profileId, dto.languages);
    }

    if (dto.availability?.length && profileId) {
      await this.createTutorAvailabilitySlotByUserId(profileId, dto.availability);
    }
  }

  async upsertTutorLanguageByUserId(userId: string, dto: TutorLanguageDto[]): Promise<void> {
    const upserts = dto.map((l) =>
      this.prisma.tutorLanguage.upsert({
        where: {
          tutorId_languageCode: {
            tutorId: userId,
            languageCode: l.languageCode,
          },
        },
        update: {
          languageCode: l.languageCode,
          proficiency: l.proficiency,
        },
        create: {
          tutorId: userId,
          languageCode: l.languageCode,
          proficiency: l.proficiency,
        },
      })
    );
    await this.prisma.$transaction(upserts);
  }

  async createTutorAvailabilitySlotByUserId(userId: string, dto: TutorAvailabilitySlotDto[]) {
    await this.prisma.tutorAvailability.createMany({
      data: dto.map((a) => ({
        tutorId: userId,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        isActive: true,
      })),
      skipDuplicates: true,
    });
  }
}
