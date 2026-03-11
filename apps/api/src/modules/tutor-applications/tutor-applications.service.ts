import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, VerificationStatus } from '@mezon-tutors/db';
import type { TutorApplicationApiItem, TutorApplicationMetricsApi } from '@mezon-tutors/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { toTutorApplicationApiItem } from './tutor-applications.mapper';

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

  async approve(id: string, body?: { feedback?: string }): Promise<{ success: boolean }> {
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
          reviewFeedback: body?.feedback ?? '',
        },
      }),
      this.prisma.user.update({
        where: { id: profile.userId },
        data: { role: Role.TUTOR },
      }),
    ]);
    return { success: true };
  }

  async reject(id: string, body?: { feedback?: string }): Promise<{ success: boolean }> {
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
        reviewFeedback: body?.feedback ?? '',
      },
    });
    return { success: true };
  }

  async getMetrics(): Promise<TutorApplicationMetricsApi> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    const [totalPending, approvedToday, approvedYesterday, reviewedProfiles] = await Promise.all([
      this.prisma.tutorProfile.count({
        where: { verificationStatus: VerificationStatus.PENDING },
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
          updatedAt: { gte: startOfYesterday, lt: startOfToday },
        },
      }),
      this.prisma.tutorProfile.findMany({
        where: {
          verificationStatus: { in: [VerificationStatus.APPROVED, VerificationStatus.REJECTED] },
        },
        select: { createdAt: true, updatedAt: true },
      }),
    ]);

    const avgReviewTimeHours =
      reviewedProfiles.length > 0
        ? reviewedProfiles.reduce((sum, p) => {
            const hours = (p.updatedAt.getTime() - p.createdAt.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }, 0) / reviewedProfiles.length
        : 0;

    const approvedTodayChangePercent =
      approvedYesterday > 0
        ? Math.round(((approvedToday - approvedYesterday) / approvedYesterday) * 100)
        : approvedToday > 0
          ? 100
          : 0;

    return {
      total_pending: totalPending,
      approved_today: approvedToday,
      avg_review_time_hours: Math.round(avgReviewTimeHours * 10) / 10,
      total_pending_change_percent: 0,
      approved_today_change_percent: approvedTodayChangePercent,
      avg_review_time_change_percent: 0,
    };
  }
}
