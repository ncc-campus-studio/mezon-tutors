import {
  Button,
  Card,
  StatusBadge,
  Text,
  XStack,
  YStack,
  ConfirmModal,
} from '@mezon-tutors/app/ui';
import { Separator } from '@mezon-tutors/app/ui';
import { DownloadIcon, DocumentIcon, EyeIcon, VerifiedIcon } from '@mezon-tutors/app/ui/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'solito/navigation';
import { adminTutorApplicationService } from '@mezon-tutors/app/services/admin-tutor-application.service';
import { useToastController } from '@mezon-tutors/app/ui';

import { type ProfessionalDocument, type ProfessionalDocumentStatus } from '@mezon-tutors/shared';

type ProfessionalDocumentsTableProps = {
  documents: ProfessionalDocument[];
  selectedProfessionalDocId: string | null;
  onSelectProfessionalDoc: (id: string | null) => void;
};

const NAME_COLUMN_BASIS = '40%';
const TYPE_COLUMN_BASIS = '15%';
const ISSUE_DATE_COLUMN_BASIS = '15%';
const STATUS_COLUMN_BASIS = '15%';
const ACTIONS_COLUMN_BASIS = '15%';

export function ProfessionalDocumentsTable({
  documents,
  selectedProfessionalDocId,
  onSelectProfessionalDoc,
}: ProfessionalDocumentsTableProps) {
  const t = useTranslations('AdminTutorApplications.Detail');
  const { id: tutorId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToastController();

  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: (status: ProfessionalDocumentStatus) => {
      if (!selectedProfessionalDocId) return Promise.reject('No document selected');
      return adminTutorApplicationService.updateProfessionalDocumentStatus(
        selectedProfessionalDocId,
        status
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tutor-application', tutorId] });
      toast.show(t('messages.docStatusUpdated'), { variant: 'success' });
    },
  });

  return (
    <YStack>
      <Card
        padding="$5"
        borderRadius="$8"
        backgroundColor="$backgroundCard"
      >
        <YStack gap="$4">
          <YStack gap="$2">
            {/* Header row */}
            <XStack
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor="$backgroundMuted"
              borderRadius="$6"
              $xs={{ display: 'none' }}
              $sm={{ display: 'none' }}
            >
              <XStack
                flexBasis={NAME_COLUMN_BASIS}
                flexGrow={0}
                flexShrink={1}
              >
                <Text variant="muted">
                  {t('sections.documents.professionalDocuments.headers.documentName')}
                </Text>
              </XStack>
              <XStack
                flexBasis={TYPE_COLUMN_BASIS}
                flexGrow={0}
                flexShrink={0}
              >
                <Text
                  size="sm"
                  variant="muted"
                >
                  {t('sections.documents.professionalDocuments.headers.type')}
                </Text>
              </XStack>
              <XStack
                flexBasis={ISSUE_DATE_COLUMN_BASIS}
                flexGrow={0}
                flexShrink={0}
              >
                <Text
                  size="sm"
                  variant="muted"
                >
                  {t('sections.documents.professionalDocuments.headers.issueDate')}
                </Text>
              </XStack>
              <XStack
                flexBasis={STATUS_COLUMN_BASIS}
                flexGrow={0}
                flexShrink={0}
              >
                <Text
                  size="sm"
                  variant="muted"
                >
                  {t('sections.documents.professionalDocuments.headers.status')}
                </Text>
              </XStack>
              <XStack
                flexBasis={ACTIONS_COLUMN_BASIS}
                flexGrow={0}
                flexShrink={0}
                justifyContent="flex-end"
              >
                <Text
                  size="sm"
                  variant="muted"
                >
                  {t('sections.documents.professionalDocuments.headers.actions')}
                </Text>
              </XStack>
            </XStack>

            {documents.map((doc, index) => {
              const isSelected = selectedProfessionalDocId === doc.id;

              return (
                <YStack key={doc.id}>
                  <YStack
                    borderRadius="$6"
                    borderWidth={1}
                    borderColor={isSelected ? '$borderStrong' : '$borderSubtle'}
                    backgroundColor={isSelected ? '$backgroundFocus' : '$background'}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    gap="$2"
                  >
                    <XStack
                      alignItems="flex-start"
                      width="100%"
                      cursor="pointer"
                      onPress={() => onSelectProfessionalDoc(isSelected ? null : doc.id)}
                      $xs={{ flexDirection: 'column', alignItems: 'flex-start' }}
                      $sm={{ flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <XStack
                        flexBasis={NAME_COLUMN_BASIS}
                        flexGrow={0}
                        flexShrink={1}
                        alignItems="flex-start"
                        gap="$2"
                        minWidth={0}
                      >
                        <YStack paddingTop="$1">
                          {doc.type === 'CERTIFICATE' ? (
                            <VerifiedIcon
                              size={16}
                              color="#1152D4"
                            />
                          ) : (
                            <DocumentIcon size={16} />
                          )}
                        </YStack>

                        <Text
                          fontWeight="500"
                          flex={1}
                          flexWrap="wrap"
                        >
                          {doc.name}
                        </Text>
                      </XStack>

                      <XStack
                        flexBasis={TYPE_COLUMN_BASIS}
                        flexGrow={0}
                        flexShrink={0}
                        minWidth={0}
                      >
                        <Text variant="muted">{doc.type}</Text>
                      </XStack>

                      <XStack
                        flexBasis={ISSUE_DATE_COLUMN_BASIS}
                        flexGrow={0}
                        flexShrink={0}
                        minWidth={0}
                      >
                        <Text variant="muted">{new Date(doc.uploadedAt).toLocaleDateString()}</Text>
                      </XStack>

                      <XStack
                        flexBasis={STATUS_COLUMN_BASIS}
                        flexGrow={0}
                        flexShrink={0}
                        alignItems="center"
                        minWidth={0}
                      >
                        {doc.status === 'APPROVED' && (
                          <StatusBadge
                            status="APPROVED"
                            label={t('sections.documents.professionalDocuments.status.verified')}
                          />
                        )}
                        {doc.status === 'PENDING' && <StatusBadge status="NEW" />}
                        {doc.status === 'REJECTED' && <StatusBadge status="REJECTED" />}
                      </XStack>

                      <XStack
                        flexBasis={ACTIONS_COLUMN_BASIS}
                        flexGrow={0}
                        flexShrink={0}
                        justifyContent="flex-end"
                        gap="$3"
                        $xs={{ width: '100%', justifyContent: 'flex-start', marginTop: '$2' }}
                        $sm={{ width: '100%', justifyContent: 'flex-start', marginTop: '$2' }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          circular
                        >
                          <EyeIcon size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          circular
                        >
                          <DownloadIcon size={16} />
                        </Button>
                      </XStack>
                    </XStack>
                  </YStack>

                  {isSelected && (
                    <XStack
                      gap="$3"
                      justifyContent="center"
                      paddingTop="$3"
                      paddingBottom="$3"
                    >
                      <Button
                        variant="primary"
                        onPress={() => setIsApproveConfirmOpen(true)}
                        disabled={updateStatusMutation.isPending}
                      >
                        {t('sections.documents.professionalDocuments.actions.approve')}
                      </Button>
                      <Button
                        variant="reject"
                        onPress={() => setIsRejectConfirmOpen(true)}
                        disabled={updateStatusMutation.isPending}
                      >
                        {t('sections.documents.professionalDocuments.actions.reject')}
                      </Button>
                    </XStack>
                  )}

                  {index < documents.length - 1 && <Separator />}
                </YStack>
              );
            })}
          </YStack>
        </YStack>
      </Card>

      {/* Confirmation Modals */}
      <ConfirmModal
        open={isApproveConfirmOpen}
        onOpenChange={setIsApproveConfirmOpen}
        title={t('sections.documents.professionalDocuments.actions.approve')}
        description={t('modals.approve.description', {
          name:
            documents.find((d) => d.id === selectedProfessionalDocId)?.name ||
            t('modals.defaultDocName'),
        })}
        confirmLabel={t('sections.documents.professionalDocuments.actions.approve')}
        onConfirm={() => updateStatusMutation.mutate('APPROVED')}
        isLoading={updateStatusMutation.isPending}
      />

      <ConfirmModal
        open={isRejectConfirmOpen}
        onOpenChange={setIsRejectConfirmOpen}
        title={t('sections.documents.professionalDocuments.actions.reject')}
        description={t('modals.reject.description', {
          name:
            documents.find((d) => d.id === selectedProfessionalDocId)?.name ||
            t('modals.defaultDocName'),
        })}
        confirmLabel={t('sections.documents.professionalDocuments.actions.reject')}
        destructive
        onConfirm={() => updateStatusMutation.mutate('REJECTED')}
        isLoading={updateStatusMutation.isPending}
      />
    </YStack>
  );
}
