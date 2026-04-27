'use client';

import { XStack, YStack } from '@mezon-tutors/app/ui';
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
  const inactiveColor = theme.tutorsDetailStarOutline?.get();

  const handleStarClick = (star: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(star);
    }
  };

  const renderStar = (index: number) => {
    const star = index + 1;
    const fillPercentage = Math.min(Math.max(rating - index, 0), 1);

    if (readonly && fillPercentage > 0 && fillPercentage < 1) {
      return (
        <YStack
          key={star}
          position="relative"
          width={size}
          height={size}
        >
          <YStack position="absolute" top={0} left={0}>
            <StarOutlineIcon size={size} color={inactiveColor} />
          </YStack>
          <YStack
            position="absolute"
            top={0}
            left={0}
            width={size}
            height={size}
            overflow="hidden"
            style={{
              clipPath: `inset(0 ${100 - fillPercentage * 100}% 0 0)`,
            }}
          >
            <StarFilledIcon size={size} color={activeColor} />
          </YStack>
        </YStack>
      );
    }

    const isActive = star <= Math.ceil(rating);
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
  };

  return (
    <XStack gap={gap} alignItems="center">
      {Array.from({ length: REVIEW_VALIDATION.MAX_RATING }).map((_, index) => renderStar(index))}
    </XStack>
  );
}
