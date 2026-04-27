import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, CreateReviewDto, UpdateReviewDto } from '../../../services/review.service';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewDto) => reviewService.createReview(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['tutor-reviews', variables.tutorId] });
      await queryClient.cancelQueries({ queryKey: ['tutor-about', variables.tutorId] });

      const previousReviews = queryClient.getQueryData(['tutor-reviews', variables.tutorId]);
      const previousAbout = queryClient.getQueryData(['tutor-about', variables.tutorId]);

      return { previousReviews, previousAbout };
    },
    onError: (_err, variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(['tutor-reviews', variables.tutorId], context.previousReviews);
      }
      if (context?.previousAbout) {
        queryClient.setQueryData(['tutor-about', variables.tutorId], context.previousAbout);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews', variables.tutorId] });
      queryClient.invalidateQueries({ queryKey: ['tutor-about', variables.tutorId] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data, tutorId }: { reviewId: string; data: UpdateReviewDto; tutorId: string }) =>
      reviewService.updateReview(reviewId, data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['tutor-reviews', variables.tutorId] });
      await queryClient.cancelQueries({ queryKey: ['tutor-about', variables.tutorId] });

      const previousReviews = queryClient.getQueryData(['tutor-reviews', variables.tutorId]);
      const previousAbout = queryClient.getQueryData(['tutor-about', variables.tutorId]);

      return { previousReviews, previousAbout };
    },
    onError: (_err, variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(['tutor-reviews', variables.tutorId], context.previousReviews);
      }
      if (context?.previousAbout) {
        queryClient.setQueryData(['tutor-about', variables.tutorId], context.previousAbout);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutor-reviews', variables.tutorId] });
      queryClient.invalidateQueries({ queryKey: ['tutor-about', variables.tutorId] });
    },
  });
}
