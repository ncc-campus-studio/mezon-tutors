import { useTranslations } from 'next-intl';
import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { BOOKING_REQUEST_TABLE_COLUMN_WIDTHS } from '@mezon-tutors/shared';
import { BookingRequestActions } from './BookingRequestActions';
import type {
  BookingRequestTableProps,
  BookingRequestRowProps,
  StudentCellProps,
  StudentAvatarProps,
  StatusBadgeProps,
  BookingRequestViewModel,
} from '../types';
import { getStatusTone, getStudentInitials } from '../utils';

const COLUMN_WIDTHS = BOOKING_REQUEST_TABLE_COLUMN_WIDTHS;

function StudentAvatar({ studentName, studentAvatarUrl }: StudentAvatarProps) {
  if (studentAvatarUrl) {
    return (
      <img
        src={studentAvatarUrl}
        alt={studentName}
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          border: '2px solid rgba(20,44,89,0.15)',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <YStack
      width={44}
      height={44}
      borderRadius={999}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$dashboardTutorSummaryIconBackground"
      flexShrink={0}
    >
      <Text color="$dashboardTutorSummaryIconColor" fontSize={14} fontWeight="800">
        {getStudentInitials(studentName)}
      </Text>
    </YStack>
  );
}

function StudentCell({ studentName, studentLevelKey, studentAvatarUrl }: StudentCellProps) {
  const t = useTranslations('Dashboard.bookingRequests');

  return (
    <XStack alignItems="center" gap="$3">
      <StudentAvatar studentName={studentName} studentAvatarUrl={studentAvatarUrl} />
      <YStack flex={1} minWidth={0} gap="$0.5">
        <Text color="$dashboardTutorTextPrimary" fontSize={15} lineHeight={20} fontWeight="700" numberOfLines={1}>
          {studentName}
        </Text>
        <Text color="$dashboardTutorTextSecondary" fontSize={11} lineHeight={15} numberOfLines={1} opacity={0.8}>
          {t(`levels.${studentLevelKey}`)}
        </Text>
      </YStack>
    </XStack>
  );
}

function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations('Dashboard.bookingRequests');
  const statusTone = getStatusTone(status);

  return (
    <YStack
      borderRadius={8}
      paddingHorizontal="$2.5"
      paddingVertical="$1.5"
      backgroundColor={statusTone.backgroundColor}
    >
      <Text color={statusTone.color} fontSize={9} lineHeight={12} fontWeight="800" textTransform="uppercase" letterSpacing={0.5}>
        {t(`status.${status}`)}
      </Text>
    </YStack>
  );
}

function SubjectPill({ label }: { label: string }) {
  return (
    <YStack
      borderWidth={1}
      borderColor="$dashboardTutorFilterInactiveBorder"
      borderRadius={999}
      backgroundColor="$dashboardTutorFilterInactiveBg"
      paddingHorizontal="$2.5"
      paddingVertical="$1"
      alignSelf="flex-start"
    >
      <Text color="$myLessonsPrimaryButton" fontSize={12} lineHeight={16} fontWeight="700">
        {label}
      </Text>
    </YStack>
  );
}

function CompactRow({ item, actions }: BookingRequestRowProps) {
  const t = useTranslations('Dashboard.bookingRequests');

  return (
    <XStack
      width="100%"
      paddingVertical="$3.5"
      paddingHorizontal="$3"
      borderTopWidth={1}
      borderTopColor="$dashboardTutorTableDivider"
      flexDirection="column"
      gap="$3"
    >
      <XStack alignItems="center" gap="$3" width="100%">
        <StudentAvatar studentName={item.studentName} studentAvatarUrl={item.studentAvatarUrl} />
        <YStack flex={1} gap="$0.5">
          <Text color="$dashboardTutorTextPrimary" fontSize={15} lineHeight={20} fontWeight="700">
            {item.studentName}
          </Text>
          <Text color="$dashboardTutorTextSecondary" fontSize={11} lineHeight={15} opacity={0.8}>
            {t(`levels.${item.studentLevelKey}`)}
          </Text>
        </YStack>
      </XStack>

      <YStack gap="$2" width="100%">
        <SubjectPill label={t(`subjects.${item.subjectKey}`)} />
        
        <YStack gap="$1">
          <Text color="$dashboardTutorTextPrimary" fontSize={13} lineHeight={18} fontWeight="700">
            {t(`dates.${item.requestedDateKey}`)}
          </Text>
          <Text color="$dashboardTutorTextSecondary" fontSize={11} lineHeight={16} opacity={0.8}>
            {t(`times.${item.requestedTimeKey}`)} {item.durationLabel}
          </Text>
        </YStack>

        <YStack gap="$0.75">
          <Text color="$dashboardTutorTextPrimary" fontSize={20} lineHeight={24} fontWeight="800" letterSpacing={-0.5}>
            {item.rateLabel}
          </Text>
          <Text color="$dashboardTutorTextSecondary" fontSize={11} lineHeight={14} opacity={0.7}>
            {item.rateSubLabel}
          </Text>
        </YStack>

        <XStack alignItems="center" justifyContent="space-between">
          <StatusBadge status={item.status} />
          <BookingRequestActions
            actionContext={{ requestId: item.id, status: item.status }}
            handlers={actions}
          />
        </XStack>
      </YStack>
    </XStack>
  );
}

function DesktopRow({ item, actions }: BookingRequestRowProps) {
  const t = useTranslations('Dashboard.bookingRequests');

  return (
    <XStack
      width="100%"
      minHeight={80}
      paddingVertical="$3"
      paddingHorizontal="$5"
      borderTopWidth={1}
      borderTopColor="$dashboardTutorTableDivider"
      alignItems="center"
    >
      <XStack alignItems="center" gap="$3" width={COLUMN_WIDTHS.student} flexShrink={0}>
        <StudentCell
          studentName={item.studentName}
          studentLevelKey={item.studentLevelKey}
          studentAvatarUrl={item.studentAvatarUrl}
        />
      </XStack>

      <XStack width={COLUMN_WIDTHS.subject} flexShrink={0} alignItems="center">
        <SubjectPill label={t(`subjects.${item.subjectKey}`)} />
      </XStack>

      <YStack width={COLUMN_WIDTHS.requestedTime} flexShrink={0} gap="$0.75" justifyContent="center">
        <Text color="$dashboardTutorTextPrimary" fontSize={13} lineHeight={18} fontWeight="700">
          {t(`dates.${item.requestedDateKey}`)}
        </Text>
        <Text color="$dashboardTutorTextSecondary" fontSize={11} lineHeight={16} opacity={0.8}>
          {t(`times.${item.requestedTimeKey}`)} {item.durationLabel}
        </Text>
      </YStack>

      <YStack width={COLUMN_WIDTHS.rate} flexShrink={0} gap="$0.75" justifyContent="center">
        <Text color="$dashboardTutorTextPrimary" fontSize={20} lineHeight={24} fontWeight="800" letterSpacing={-0.5}>
          {item.rateLabel}
        </Text>
        <Text color="$dashboardTutorTextSecondary" fontSize={11} lineHeight={14} opacity={0.7}>
          {item.rateSubLabel}
        </Text>
      </YStack>

      <XStack width={COLUMN_WIDTHS.status} flexShrink={0} justifyContent="center" alignItems="center">
        <StatusBadge status={item.status} />
      </XStack>

      <XStack width={COLUMN_WIDTHS.actions} flexShrink={0} justifyContent="center" alignItems="center">
        <BookingRequestActions
          actionContext={{ requestId: item.id, status: item.status }}
          handlers={actions}
        />
      </XStack>
    </XStack>
  );
}

function BookingRequestRow(props: BookingRequestRowProps) {
  return props.isCompact ? <CompactRow {...props} /> : <DesktopRow {...props} />;
}

function TableHeader() {
  const t = useTranslations('Dashboard.bookingRequests');

  return (
    <XStack
      paddingHorizontal="$5"
      paddingVertical="$3"
      backgroundColor="$dashboardTutorTableHeaderBackground"
      borderBottomWidth={1}
      borderBottomColor="$dashboardTutorTableDivider"
    >
      <Text color="$dashboardTutorTextSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" width={COLUMN_WIDTHS.student} letterSpacing={0.8}>
        {t('table.student')}
      </Text>
      <Text color="$dashboardTutorTextSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" width={COLUMN_WIDTHS.subject} letterSpacing={0.8}>
        {t('table.subject')}
      </Text>
      <Text color="$dashboardTutorTextSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" width={COLUMN_WIDTHS.requestedTime} letterSpacing={0.8}>
        {t('table.requestedTime')}
      </Text>
      <Text color="$dashboardTutorTextSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" width={COLUMN_WIDTHS.rate} letterSpacing={0.8}>
        {t('table.rate')}
      </Text>
      <Text color="$dashboardTutorTextSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" width={COLUMN_WIDTHS.status} textAlign="center" letterSpacing={0.8}>
        {t('table.status')}
      </Text>
      <Text color="$dashboardTutorTextSecondary" fontSize={10} fontWeight="700" textTransform="uppercase" width={COLUMN_WIDTHS.actions} textAlign="center" letterSpacing={0.8}>
        {t('table.actions')}
      </Text>
    </XStack>
  );
}

function EmptyState() {
  const t = useTranslations('Dashboard.bookingRequests');

  return (
    <YStack padding="$5" alignItems="center">
      <Text color="$dashboardTutorTextSecondary" fontSize={13}>
        {t('table.noResults')}
      </Text>
    </YStack>
  );
}

export function BookingRequestTable({
  requests,
  isCompact,
  actions,
}: BookingRequestTableProps) {
  return (
    <YStack
      borderWidth={1}
      borderColor="$dashboardTutorCardBorder"
      borderRadius={16}
      overflow="hidden"
      backgroundColor="$dashboardTutorCardBackground"
    >
      {!isCompact && <TableHeader />}

      {requests.length > 0 ? (
        requests.map((item) => (
          <BookingRequestRow
            key={item.id}
            item={item}
            isCompact={isCompact}
            actions={actions}
          />
        ))
      ) : (
        <EmptyState />
      )}
    </YStack>
  );
}
