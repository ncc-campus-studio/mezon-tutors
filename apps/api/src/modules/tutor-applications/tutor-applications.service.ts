import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, VerificationStatus } from '@mezon-tutors/db';
import type { TutorApplicationApiItem, TutorApplicationMetricsApi } from '@mezon-tutors/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { toTutorApplicationApiItem } from './tutor-applications.mapper';
import { calculateAverageDurationHours } from '../../common/utils/time.util';

@Injectable()
export class TutorApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listApplications(): Promise<TutorApplicationApiItem[]> {
    const profiles = await this.prisma.tutorProfile.findMany({
      include: {
        languages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return profiles.map(toTutorApplicationApiItem);
  }

  async approve(id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.tutorProfile.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!profile) {
      throw new NotFoundException(`Tutor application not found: ${id}`);
    }
    await this.prisma.$transaction([
      this.prisma.tutorProfile.update({
        where: { id },
        data: {
          verificationStatus: VerificationStatus.APPROVED,
        },
      }),
      this.prisma.user.update({
        where: { id: profile.userId },
        data: { role: Role.TUTOR },
      }),
    ]);
    return { success: true };
  }

  async reject(id: string): Promise<{ success: boolean }> {
    const profile = await this.prisma.tutorProfile.findUnique({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException(`Tutor application not found: ${id}`);
    }
    await this.prisma.tutorProfile.update({
      where: { id },
      data: {
        verificationStatus: VerificationStatus.REJECTED,
      },
    });
    return { success: true };
  }

  async getMetrics(): Promise<TutorApplicationMetricsApi> {
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOfToday.getDate() - 7);

    const startOf14DaysAgo = new Date(startOfToday);
    startOf14DaysAgo.setDate(startOfToday.getDate() - 14);

    const [
      totalPending,
      pendingLastWeek,
      approvedToday,
      approvedLast7Days,
      approvedPrevious7Days,
      last10Reviewed,
      previous10Reviewed,
    ] = await Promise.all([
      this.prisma.tutorProfile.count({
        where: { verificationStatus: VerificationStatus.PENDING },
      }),

      this.prisma.tutorProfile.count({
        where: {
          verificationStatus: VerificationStatus.PENDING,
          createdAt: { lt: startOf7DaysAgo },
        },
      }),

      this.prisma.tutorProfile.count({
        where: {
          verificationStatus: VerificationStatus.APPROVED,
          updatedAt: { gte: startOfToday },
        },
      }),

      this.prisma.tutorProfile.count({
        where: {
          verificationStatus: VerificationStatus.APPROVED,
          updatedAt: { gte: startOf7DaysAgo },
        },
      }),

      this.prisma.tutorProfile.count({
        where: {
          verificationStatus: VerificationStatus.APPROVED,
          updatedAt: { gte: startOf14DaysAgo, lt: startOf7DaysAgo },
        },
      }),

      this.prisma.tutorProfile.findMany({
        where: {
          verificationStatus: {
            in: [VerificationStatus.APPROVED, VerificationStatus.REJECTED],
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 10,
        select: {
          createdAt: true,
          updatedAt: true,
        },
      }),

      this.prisma.tutorProfile.findMany({
        where: {
          verificationStatus: {
            in: [VerificationStatus.APPROVED, VerificationStatus.REJECTED],
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip: 10,
        take: 10,
        select: {
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const avgReviewTimeLast10 = calculateAverageDurationHours(last10Reviewed);
    const avgReviewTimePrevious10 = calculateAverageDurationHours(previous10Reviewed);

    const approvedChangePercent =
      approvedPrevious7Days > 0
        ? Math.round(((approvedLast7Days - approvedPrevious7Days) / approvedPrevious7Days) * 100)
        : approvedLast7Days > 0
          ? 100
          : 0;

    const avgReviewTimeChangePercent =
      avgReviewTimePrevious10 > 0
        ? Math.round(
            ((avgReviewTimeLast10 - avgReviewTimePrevious10) / avgReviewTimePrevious10) * 100
          )
        : 0;

    const totalPendingChangePercent =
      pendingLastWeek > 0
        ? Math.round(((totalPending - pendingLastWeek) / pendingLastWeek) * 100)
        : totalPending > 0
          ? 100
          : 0;

    return {
      total_pending: totalPending,
      approved_today: approvedToday,
      avg_review_time_hours: Math.round(avgReviewTimeLast10 * 10) / 10,

      total_pending_change_percent: totalPendingChangePercent,
      approved_today_change_percent: approvedChangePercent,
      avg_review_time_change_percent: avgReviewTimeChangePercent,
    };
  }
}
