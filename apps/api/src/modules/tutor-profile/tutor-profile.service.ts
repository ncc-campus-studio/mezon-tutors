import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { SubmitTutorProfileDto } from '@mezon-tutors/shared';

@Injectable()
export class TutorProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByUserId(userId: string, dto: SubmitTutorProfileDto): Promise<void> {
    const pricePerHour = dto.pricePerHour;
    const ratingAverage = 0;

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { role: 'tutor' },
      });

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
          pricePerHour,
          isProfessional: !!dto.teachingCertificateName,
          verificationStatus: 'pending',
        },
        create: {
          userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          avatar: dto.avatar ?? '',
          videoUrl: dto.videoUrl ?? '',
          country: dto.country,
          introduce: dto.introduce,
          experience: dto.specialization,
          motivate: dto.motivate,
          headline: dto.headline,
          pricePerHour,
          ratingAverage,
          verificationStatus: 'pending',
        },
      });

      await tx.tutorLanguage.deleteMany({ where: { tutorId: profile.id } });
      if (dto.languages?.length) {
        await tx.tutorLanguage.createMany({
          data: dto.languages.map((l) => ({
            tutorId: profile.id,
            languageCode: l.languageCode,
            proficiency: l.proficiency,
          })),
        });
      }

      await tx.tutorAvailability.deleteMany({ where: { tutorId: profile.id } });
      if (dto.availability?.length) {
        await tx.tutorAvailability.createMany({
          data: dto.availability.map((a) => ({
            tutorId: profile.id,
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
            isActive: true,
          })),
        });
      }
    });
  }
}
