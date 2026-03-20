'use client';

import { useTranslations } from 'next-intl';
import { StatusCard, Text } from './index';

export type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED' | 'NEW';

export const VALID_STATUSES: Status[] = ['PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED', 'NEW'];

export function isStatus(status: unknown): status is Status {
  return typeof status === 'string' && VALID_STATUSES.includes(status as Status);
}

export function normalizeStatus(status: unknown): Status {
  if (isStatus(status)) return status;
  return 'PENDING';
}

export function StatusBadge({ status, label: customLabel }: { status: unknown; label?: string }) {
  const normalizedStatus = normalizeStatus(status);
  const t = useTranslations('AdminTutorApplications.Detail.status');

  const label = customLabel || t(normalizedStatus);

  switch (normalizedStatus) {
    case 'NEW':
      return (
        <StatusCard
          variant="info"
          borderWidth={0}
          paddingHorizontal="$2"
          paddingVertical="$1"
        >
          <Text
            fontWeight="600"
            color="$statusInfoBorder"
          >
            • {label}
          </Text>
        </StatusCard>
      );
    case 'APPROVED':
      return (
        <StatusCard
          variant="success"
          borderWidth={0}
          paddingHorizontal="$2"
          paddingVertical="$1"
        >
          <Text
            fontWeight="600"
            color="$statusSuccessBorder"
          >
            • {label}
          </Text>
        </StatusCard>
      );
    case 'REJECTED':
      return (
        <StatusCard
          variant="danger"
          borderWidth={0}
          paddingHorizontal="$2"
          paddingVertical="$1"
        >
          <Text
            fontWeight="600"
            color="$statusErrorBorder"
          >
            • {label}
          </Text>
        </StatusCard>
      );
    case 'PENDING':
    case 'WAITLISTED':
      return (
        <StatusCard
          variant="warning"
          borderWidth={0}
          paddingHorizontal="$2"
          paddingVertical="$1"
          alignSelf="flex-start"
          borderRadius={999}
        >
          <Text
            fontWeight="700"
            fontSize={12}
            color="$statusWarningBorder"
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            • {label}
          </Text>
        </StatusCard>
      );
    default:
      return null;
  }
}
