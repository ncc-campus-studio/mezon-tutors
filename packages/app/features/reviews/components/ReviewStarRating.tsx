'use client';

import { XStack } from '@mezon-tutors/app/ui';
import { StarFilledIcon, StarOutlineIcon } from '@mezon-tutors/app/ui/icons';
import { REVIEW_VALIDATION } from '@mezon-tutors/shared';
import { useTheme } from 'tamagui';

interface ReviewStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  gap?: number;
}

export function ReviewStarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 24,
  gap = 4,
}: ReviewStarRatingProps) {
  const theme = useTheme();
  const activeColor = theme.tutorsDetailStarGold?.get();
  const inactiveColor = theme.tutorsDetailStarGold?.get();

  const handleStarClick = (star: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(star);
    }
  };

  return (
    <XStack gap={gap} alignItems="center">
      {Array.from({ length: REVIEW_VALIDATION.MAX_RATING }).map((_, index) => {
        const star = index + 1;
        const isActive = star <= rating;
        return (
          <XStack
            key={star}
            cursor={readonly ? 'default' : 'pointer'}
            onPress={() => handleStarClick(star)}
            pressStyle={readonly ? {} : { opacity: 0.7 }}
            hoverStyle={readonly ? {} : { scale: 1.1 }}
          >
            {isActive ? (
              <StarFilledIcon size={size} color={activeColor} />
            ) : (
              <StarOutlineIcon size={size} color={inactiveColor} />
            )}
          </XStack>
        );
      })}
    </XStack>
  );
}
