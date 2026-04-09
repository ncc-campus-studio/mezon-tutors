import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import {
  BOOKING_REQUEST_ACTIONS_BY_STATUS,
  type TutorBookingRequestActionKind,
} from '@mezon-tutors/shared';
import { Button, Text, XStack } from '@mezon-tutors/app/ui';
import { CheckIcon, CloseIcon, SeamlessVirtualClassroomIcon } from '@mezon-tutors/app/ui/icons';
import { useTheme } from 'tamagui';
import type {
  BookingRequestActionContext,
  BookingRequestActionHandlers,
} from '../types';

type BookingRequestActionsProps = {
  actionContext: BookingRequestActionContext;
  handlers?: BookingRequestActionHandlers;
};

type IconActionButtonProps = {
  bg: string;
  icon: ReactNode;
  onPress?: () => void;
  borderColor?: string;
};

function IconActionButton({ bg, icon, onPress, borderColor }: IconActionButtonProps) {
  return (
    <Button
      width={48}
      height={48}
      borderRadius={14}
      backgroundColor={bg}
      borderWidth={borderColor ? 1 : 0}
      borderColor={borderColor}
      padding={0}
      alignItems="center"
      justifyContent="center"
      style={{
        cursor: 'pointer',
      }}
      hoverStyle={{
        opacity: 0.94,
      }}
      pressStyle={{
        opacity: 0.82,
      }}
      focusStyle={{
        borderColor: borderColor ?? '$dashboardTutorActionGhostBorder',
        outlineWidth: 0,
        outlineColor: 'transparent',
        shadowColor: 'transparent',
      }}
      onPress={onPress}
    >
      {icon}
    </Button>
  );
}

export function BookingRequestActions({
  actionContext,
  handlers,
}: BookingRequestActionsProps) {
  const t = useTranslations('Dashboard.bookingRequests.actions');
  const theme = useTheme();
  const actionColor = theme.dashboardTutorActionGhostText?.val;
  const { requestId, status } = actionContext;

  const actionHandlers: Record<TutorBookingRequestActionKind, (() => void) | undefined> = {
    approve: handlers?.onApprove ? () => handlers.onApprove?.(requestId) : undefined,
    decline: handlers?.onDecline ? () => handlers.onDecline?.(requestId) : undefined,
    message: handlers?.onMessage ? () => handlers.onMessage?.(requestId) : undefined,
    feedback: handlers?.onFeedback ? () => handlers.onFeedback?.(requestId) : undefined,
  };

  const iconByAction: Record<TutorBookingRequestActionKind, (size: number) => ReactNode> = {
    approve: (size) => <CheckIcon size={size} color={actionColor} />,
    decline: (size) => <CloseIcon size={size} color={actionColor} />,
    message: (size) => <SeamlessVirtualClassroomIcon size={size} color={actionColor} />,
    feedback: (size) => <SeamlessVirtualClassroomIcon size={size} color={actionColor} />,
  };

  return (
    <XStack gap="$2.5" alignItems="center" justifyContent="center">
      {BOOKING_REQUEST_ACTIONS_BY_STATUS[status].map((action, index) => {
        if (action.variant === 'icon') {
          return (
            <IconActionButton
              key={`${status}-${action.kind}-${index}`}
              bg="$dashboardTutorActionGhostBg"
              borderColor="$dashboardTutorActionGhostBorder"
              onPress={actionHandlers[action.kind]}
              icon={iconByAction[action.kind](action.iconSize)}
            />
          );
        }

        return (
          <Button
            key={`${status}-${action.kind}-${index}`}
            height={48}
            minWidth={132}
            borderRadius={14}
            paddingHorizontal="$4"
            backgroundColor="$dashboardTutorActionGhostBg"
            borderColor="$dashboardTutorActionGhostBorder"
            borderWidth={1}
            alignItems="center"
            justifyContent="center"
            style={{
              cursor: 'pointer',
            }}
            hoverStyle={{
              opacity: 0.94,
            }}
            pressStyle={{
              opacity: action.pressOpacity,
            }}
            focusStyle={{
              borderColor: '$dashboardTutorActionGhostBorder',
              outlineWidth: 0,
              outlineColor: 'transparent',
              shadowColor: 'transparent',
            }}
            onPress={actionHandlers[action.kind]}
          >
            <XStack alignItems="center" gap="$2.5">
              {iconByAction[action.kind](action.iconSize)}
              <Text color="$dashboardTutorActionGhostText" fontSize={14} fontWeight="700" lineHeight={20}>
                {t(action.textKey)}
              </Text>
            </XStack>
          </Button>
        );
      })}
    </XStack>
  );
}
