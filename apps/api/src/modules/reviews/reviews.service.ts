import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ETrialLessonStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(studentId: string, dto: CreateReviewDto) {
    const completedLesson = await this.prisma.trialLessonBooking.findFirst({
      where: {
        studentId,
        tutorId: dto.tutorId,
        status: ETrialLessonStatus.COMPLETED,
      },
    });

    if (!completedLesson) {
      throw new BadRequestException('You must complete a lesson with this tutor before reviewing');
    }

    const existingReview = await this.prisma.tutorReview.findFirst({
      where: {
        reviewerId: studentId,
        tutorId: dto.tutorId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this tutor');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const tutor = await tx.tutorProfile.findUnique({
          where: { id: dto.tutorId },
          select: { ratingCount: true, ratingAverage: true },
        });

        if (!tutor) {
          throw new NotFoundException('Tutor not found');
        }

        const newCount = tutor.ratingCount + 1;
        const newAverage =
          (Number(tutor.ratingCount) * Number(tutor.ratingAverage) + dto.rating) / newCount;

        const review = await tx.tutorReview.create({
          data: {
            reviewerId: studentId,
            tutorId: dto.tutorId,
            rating: dto.rating,
            comment: dto.comment,
          },
        });

        await tx.tutorProfile.update({
          where: { id: dto.tutorId },
          data: {
            ratingCount: newCount,
            ratingAverage: newAverage,
          },
        });

        return review;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('You have already reviewed this tutor');
        }
      }
      throw error;
    }
  }

  async updateReview(reviewId: string, studentId: string, dto: UpdateReviewDto) {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.tutorReview.findUnique({
        where: { id: reviewId },
      });

      if (!review || review.reviewerId !== studentId) {
        throw new NotFoundException('Review not found');
      }

      const tutor = await tx.tutorProfile.findUnique({
        where: { id: review.tutorId },
        select: { ratingCount: true, ratingAverage: true },
      });

      if (!tutor) {
        throw new NotFoundException('Tutor not found');
      }

      const oldRating = review.rating;
      const newRating = dto.rating;
      const currentSum = Number(tutor.ratingCount) * Number(tutor.ratingAverage);
      const newAverage = (currentSum - oldRating + newRating) / tutor.ratingCount;

      const updatedReview = await tx.tutorReview.update({
        where: { id: reviewId },
        data: {
          rating: dto.rating,
          comment: dto.comment,
        },
      });

      await tx.tutorProfile.update({
        where: { id: review.tutorId },
        data: {
          ratingAverage: newAverage,
        },
      });

      return updatedReview;
    });
  }
}
