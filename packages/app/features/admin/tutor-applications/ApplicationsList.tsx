import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMedia } from 'tamagui';
import {
  AdminTable,
  type AdminTableColumn,
  type AdminTableRow,
  Text,
  YStack,
} from '@mezon-tutors/app/ui';
import type { TutorApplication } from './types';
import {
  ApplicationNameCell,
  ApplicationSubjectCell,
  ApplicationActionsCell,
  ApplicationsListHeader,
  ApplicationsListPagination,
} from './components';

export type TutorApplicationsListProps = {
  applications: TutorApplication[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onFilterClick?: () => void;
  onExportCsvClick?: () => void;
};

export function TutorApplicationsList({
  applications,
  selectedId,
  onSelect,
  onFilterClick,
  onExportCsvClick,
}: TutorApplicationsListProps) {
  const t = useTranslations('Admin.TutorApplications');
  const media = useMedia();
  const isNarrow = media.sm || media.xs;

  const fullColumns: AdminTableColumn[] = [
    { id: 'tutorName', label: t('list.columns.tutorName'), flex: 2, align: 'left' },
    { id: 'subject', label: t('list.columns.subject'), flex: 1, align: 'left' },
    { id: 'date', label: t('list.columns.date'), flex: 1, align: 'left' },
    { id: 'actions', label: t('list.columns.actions'), width: 88, align: 'right' },
  ];

  const narrowColumns: AdminTableColumn[] = [
    { id: 'tutorName', label: t('list.columns.tutorName'), flex: 1, align: 'left' },
    { id: 'actions', label: t('list.columns.actions'), width: 88, align: 'right' },
  ];

  const columns = isNarrow ? narrowColumns : fullColumns;

  const PAGE_SIZE = 10;
  const total = applications.length;
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;
  const [currentPage, setCurrentPage] = useState(1);

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, total);
  const visibleCount = endIndex - startIndex;

  const pagedApplications = applications.slice(startIndex, endIndex);

  const rows: AdminTableRow[] = pagedApplications.map((app) => {
    const isSelected = app.id === selectedId;

    const nameCell = (
      <ApplicationNameCell
        key="name"
        name={app.name}
        subject={app.subject}
        date={app.date}
        isSelected={isSelected}
        isNarrow={isNarrow}
      />
    );

    const subjectCell = (
      <ApplicationSubjectCell
        key="subject"
        subject={app.subject}
      />
    );

    const dateCell = (
      <Text
        key="date"
        size="sm"
        variant="muted"
      >
        {app.date}
      </Text>
    );

    const actionsCell = (
      <ApplicationActionsCell
        key="actions"
        applicationId={app.id}
        isSelected={isSelected}
      />
    );

    const cells = isNarrow
      ? [nameCell, actionsCell]
      : [nameCell, subjectCell, dateCell, actionsCell];

    return {
      id: app.id,
      isSelected,
      onPress: () => onSelect(app.id),
      cells,
    };
  });

  return (
    <YStack
      flexBasis={380}
      flexGrow={1}
      minWidth={0}
      gap={16}
    >
      <ApplicationsListHeader
        title={t('list.title')}
        filterLabel={t('list.filters')}
        exportLabel={t('list.exportCsv')}
        onFilterClick={onFilterClick}
        onExportCsvClick={onExportCsvClick}
      />

      <YStack
        minWidth={0}
        maxWidth="100%"
      >
        <AdminTable
          columns={columns}
          rows={rows}
          footer={
            <ApplicationsListPagination
              subtitle={t('list.subtitle', { count: visibleCount, total })}
              safePage={safePage}
              totalPages={totalPages}
              prevLabel={t('list.pagination.prev')}
              nextLabel={t('list.pagination.next')}
              onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              onPage={setCurrentPage}
            />
          }
        />
      </YStack>
    </YStack>
  );
}
