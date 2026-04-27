import { apiClient } from './api-client';

export interface CreateReviewDto {
  tutorId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating: number;
  comment: string;
}

export interface ReviewDto {
  id: string;
  tutorId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewService = {
  createReview: (data: CreateReviewDto) =>
    apiClient.post<ReviewDto>('/reviews', data),

  updateReview: (reviewId: string, data: UpdateReviewDto) =>
    apiClient.patch<ReviewDto>(`/reviews/${reviewId}`, data),
};
