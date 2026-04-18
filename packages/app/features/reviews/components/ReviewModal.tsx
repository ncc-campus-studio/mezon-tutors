'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, Text, Textarea, YStack, XStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { REVIEW_VALIDATION, REVIEW_MODAL_CONFIG, REVIEW_STAR_SIZE, REVIEW_STAR_GAP } from '@mezon-tutors/shared';
import { ReviewStarRating } from './ReviewStarRating';
import { useCreateReview, useUpdateReview } from '../hooks/useSubmitReview';
import type { ReviewDto } from '../../../services/review.service';
import type { TextInput } from 'react-native';

interface ReviewModalProps {
  tutorId: string;
  tutorName: string;
  existingReview?: (ReviewDto | {
    id: string;
    reviewerId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
  }) | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({
  tutorId,
  tutorName,
  existingReview,
  isOpen,
  onClose,
}: ReviewModalProps) {
  const t = useTranslations('Tutors.Detail');
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [error, setError] = useState('');
  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(undefined);
  const textareaRef = useRef<TextInput | null>(null);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      if (isOpen) {
        const length = existingReview.comment.length;
        setSelection({ start: length, end: length });
      }
    } else {
      setRating(5);
      setComment('');
      setSelection(undefined);
    }
  }, [existingReview, isOpen]);

  const validateComment = (text: string): boolean => {
    const trimmed = text.trim();
    if (trimmed.length < REVIEW_VALIDATION.MIN_COMMENT_LENGTH) {
      setError(t('reviewModal.errors.commentTooShort', { min: REVIEW_VALIDATION.MIN_COMMENT_LENGTH }));
      return false;
    }
    if (trimmed.length > REVIEW_VALIDATION.MAX_COMMENT_LENGTH) {
      setError(t('reviewModal.errors.commentTooLong', { max: REVIEW_VALIDATION.MAX_COMMENT_LENGTH }));
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateComment(comment)) return;

    try {
      if (existingReview) {
        await updateReview.mutateAsync({
          reviewId: existingReview.id,
          data: { rating, comment: comment.trim() },
          tutorId,
        });
      } else {
        await createReview.mutateAsync({
          tutorId,
          rating,
          comment: comment.trim(),
        });
      }
      onClose();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message;
      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError(t('reviewModal.errors.submitFailed'));
      }
    }
  };

  const isLoading = createReview.isPending || updateReview.isPending;

  return (
    <Dialog modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="black"
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          maxWidth={REVIEW_MODAL_CONFIG.MAX_WIDTH}
          width="90%"
          backgroundColor="$tutorsDetailReviewModalBackground"
          borderColor="$tutorsDetailReviewModalBorder"
          padding="$5"
          borderRadius={16}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 8 }}
          shadowOpacity={0.15}
          shadowRadius={24}
          elevation={8}
        >
          <Dialog.Title
            color="$tutorsDetailReviewModalTitle"
            fontSize={24}
            fontWeight="700"
          >
            {existingReview ? t('reviewModal.editTitle') : t('reviewModal.postTitle')}
          </Dialog.Title>
          <Text color="$tutorsDetailSecondaryText" fontSize={14}>
            {t('reviewModal.forTutor', { tutorName })}
          </Text>

          <YStack gap="$4" marginTop="$2">
            <YStack gap="$3">
              <Text color="$tutorsDetailReviewModalLabel" fontWeight="600" fontSize={15}>
                {t('reviewModal.ratingLabel')}
              </Text>
              <ReviewStarRating 
                rating={rating} 
                onRatingChange={setRating} 
                size={REVIEW_STAR_SIZE.LARGE}
                gap={REVIEW_STAR_GAP.MEDIUM}
              />
            </YStack>

            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text color="$tutorsDetailReviewModalLabel" fontWeight="600" fontSize={15}>
                  {t('reviewModal.commentLabel')}
                </Text>
                <Text fontSize={12} color="$tutorsDetailMutedText">
                  {comment.trim().length}/{REVIEW_VALIDATION.MAX_COMMENT_LENGTH}
                </Text>
              </XStack>
              <Textarea
                ref={textareaRef}
                value={comment}
                selection={selection}
                onChangeText={(text) => {
                  setComment(text);
                  setSelection(undefined);
                  if (error) validateComment(text);
                }}
                placeholder={t('reviewModal.placeholderComment', {
                  min: REVIEW_VALIDATION.MIN_COMMENT_LENGTH,
                  max: REVIEW_VALIDATION.MAX_COMMENT_LENGTH,
                })}
                minHeight={REVIEW_MODAL_CONFIG.TEXTAREA_MIN_HEIGHT}
                maxLength={REVIEW_VALIDATION.MAX_COMMENT_LENGTH}
                backgroundColor="$fieldBackground"
                borderColor="$tutorsDetailReviewModalBorder"
                color="$tutorsDetailPrimaryText"
                fontSize={14}
                padding="$3"
                borderRadius={12}
              />
              {error && (
                <Text fontSize={13} color="$red10" marginTop="$1">
                  {error}
                </Text>
              )}
            </YStack>
          </YStack>

          <XStack gap="$3" justifyContent="flex-end" marginTop="$3">
            <Dialog.Close asChild>
              <Button
                variant="outline"
                disabled={isLoading}
                paddingHorizontal="$5"
                paddingVertical="$3"
                borderRadius={10}
              >
                {t('reviewModal.cancel')}
              </Button>
            </Dialog.Close>
            <Button
              onPress={handleSubmit}
              disabled={isLoading || !comment.trim()}
              backgroundColor="$tutorsDetailReviewPostButtonBg"
              color="$tutorsDetailReviewPostButtonText"
              paddingHorizontal="$5"
              paddingVertical="$3"
              borderRadius={10}
              hoverStyle={{
                backgroundColor: '$tutorsDetailReviewPostButtonHover',
                opacity: 1,
              }}
              pressStyle={{
                backgroundColor: '$tutorsDetailReviewPostButtonHover',
                opacity: 1,
              }}
            >
              {isLoading ? t('reviewModal.submitting') : existingReview ? t('reviewModal.update') : t('reviewModal.submit')}
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
