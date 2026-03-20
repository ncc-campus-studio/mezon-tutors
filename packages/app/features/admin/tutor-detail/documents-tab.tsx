'use client';

import {
  Button,
  Card,
  ImagePreview,
  Paragraph,
  SkeletonCard,
  StatusBadge,
  Text,
  XStack,
  YStack,
  ConfirmModal,
} from '@mezon-tutors/app/ui';
import {
  BriefcaseUserIcon,
  CircleCheckIcon,
  CircleOutlineIcon,
  DownloadIcon,
  GraduationCapIcon,
} from '@mezon-tutors/app/ui/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'solito/navigation';
import { adminTutorApplicationService } from '@mezon-tutors/app/services/admin-tutor-application.service';
import { useToastController } from '@mezon-tutors/app/ui';
import { ProfessionalDocumentsTable } from './professional-documents-table';

import {
  type FullTutorApplication,
  type IdentityVerificationStatus,
} from '@mezon-tutors/shared';

export function DocumentsTab({ fullData }: { fullData: FullTutorApplication }) {
  const { identityVerification, professionalDocuments, profile } = fullData;
  const t = useTranslations('AdminTutorApplications.Detail');
  const [selectedProfessionalDocId, setSelectedProfessionalDocId] = useState<string | null>(null);
  const [identityChecklist, setIdentityChecklist] = useState({
    nameMatchesProfile: true,
    documentNotExpired: true,
    photoClarityVerified: false,
  });

  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

  const { id: tutorId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const toast = useToastController();

  const identityMutation = useMutation({
    mutationFn: (status: IdentityVerificationStatus) => {
      if (!identityVerification?.id) return Promise.reject('No identity document');
      return adminTutorApplicationService.updateIdentityVerificationStatus(
        identityVerification.id,
        {
          status,
          nameMatch: identityChecklist.nameMatchesProfile,
          notExpired: identityChecklist.documentNotExpired,
          photoClarity: identityChecklist.photoClarityVerified,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tutor-application', tutorId] });
      toast.show('Identity verification status updated', { variant: 'success' });
    },
  });

  return (
    <>
      {/* Page title */}
      <YStack
        gap="$1"
        marginBottom="$4"
      >
        <Paragraph
          fontSize={22}
          fontWeight="700"
        >
          {t('tabs.documents')}
        </Paragraph>
        <Text
          size="sm"
          variant="muted"
        >
          {t('sections.documents.identityVerification.subtitle')}
        </Text>
      </YStack>

      <YStack
        gap="$2"
        marginBottom="$1"
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
        >
          <YStack>
            <XStack
              gap={'$2'}
              alignItems="center"
            >
              <BriefcaseUserIcon size={22} />
              <Paragraph
                fontSize={18}
                fontWeight="700"
              >
                {t('sections.documents.identityVerification.title')}
              </Paragraph>
            </XStack>
          </YStack>

          {identityVerification?.status && (
            <StatusBadge status={identityVerification.status} />
          )}
        </XStack>
      </YStack>

      {/* Identity cards row */}
      <XStack
        gap="$7"
        marginTop="$3"
        $xs={{ flexDirection: 'column' }}
        $sm={{ flexDirection: 'column' }}
      >
        {/* Card 1 - ID preview & file info */}
        <YStack
          flex={1}
          minWidth={0}
        >
          <Card
            padding="$5"
            borderRadius="$8"
            backgroundColor="$backgroundCard"
          >
            {identityVerification ? (
              <YStack gap="$4">
                <YStack gap="$3">
                  <Text
                    variant="muted"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                  >
                    {t('sections.documents.identityVerification.idTypeLabel')}
                  </Text>
                  {identityVerification.fileKey && (
                    <ImagePreview
                      src={identityVerification.fileKey}
                      fallback={<SkeletonCard />}
                    />
                  )}

                  <XStack
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <YStack gap="$1">
                      <Text
                        fontWeight="600"
                        color="$color12"
                      >
                        {identityVerification.fileKey}
                      </Text>
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        {t('sections.documents.identityVerification.uploadedAt', {
                          date: new Date(identityVerification.uploadedAt).toLocaleDateString(),
                        })}
                      </Text>
                    </YStack>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <DownloadIcon size={22} />
                    </Button>
                  </XStack>
                </YStack>
              </YStack>
            ) : (
              <>
                <Text variant="muted">{t('sections.documents.identityVerification.noDocument')}</Text>
                <SkeletonCard />
              </>
            )}
          </Card>
        </YStack>

        {/* Card 2 - Verification checklist + actions under this card */}
        <YStack
          flex={1}
          minWidth={0}
        >
          <Card
            padding="$5"
            borderRadius="$8"
            backgroundColor="$backgroundCard"
          >
            <YStack gap="$3">
              <Text
                fontWeight="600"
                fontSize={20}
              >
                {t('sections.documents.identityVerification.checklist.title')}
              </Text>

              <YStack gap="$2">
                <XStack
                  alignItems="center"
                  gap="$2"
                  cursor="pointer"
                  onPress={() =>
                    setIdentityChecklist((current) => ({
                      ...current,
                      nameMatchesProfile: !current.nameMatchesProfile,
                    }))
                  }
                >
                  <Text fontWeight="700">
                    {identityChecklist.nameMatchesProfile ? (
                      <CircleCheckIcon
                        size={24}
                        color="#4ade80"
                      />
                    ) : (
                      <CircleOutlineIcon size={24} />
                    )}
                  </Text>
                  <Text fontSize={16}>
                    {t('sections.documents.identityVerification.checklist.nameMatchesProfile')}
                  </Text>
                </XStack>

                <XStack
                  alignItems="center"
                  gap="$2"
                  cursor="pointer"
                  onPress={() =>
                    setIdentityChecklist((current) => ({
                      ...current,
                      documentNotExpired: !current.documentNotExpired,
                    }))
                  }
                >
                  <Text fontWeight="700">
                    {identityChecklist.documentNotExpired ? (
                      <CircleCheckIcon
                        size={24}
                        color="#4ade80"
                      />
                    ) : (
                      <CircleOutlineIcon size={24} />
                    )}
                  </Text>
                  <Text fontSize={16}>
                    {t('sections.documents.identityVerification.checklist.documentNotExpired')}
                  </Text>
                </XStack>

                <XStack
                  alignItems="center"
                  gap="$2"
                  cursor="pointer"
                  onPress={() =>
                    setIdentityChecklist((current) => ({
                      ...current,
                      photoClarityVerified: !current.photoClarityVerified,
                    }))
                  }
                >
                  <Text fontWeight="700">
                    {identityChecklist.photoClarityVerified ? (
                      <CircleCheckIcon
                        size={24}
                        color="#4ade80"
                      />
                    ) : (
                      <CircleOutlineIcon size={24} />
                    )}
                  </Text>
                  <Text fontSize={16}>
                    {t('sections.documents.identityVerification.checklist.photoClarity')}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>
          <XStack
            gap="$3"
            marginTop="$3"
            justifyContent="center"
          >
            <Button
              variant="primary"
              onPress={() => setIsApproveConfirmOpen(true)}
              disabled={identityMutation.isPending}
            >
              {t('sections.documents.identityVerification.approve')}
            </Button>
            <Button
              variant="reject"
              onPress={() => setIsRejectConfirmOpen(true)}
              disabled={identityMutation.isPending}
            >
              {t('sections.documents.identityVerification.reject')}
            </Button>
          </XStack>
        </YStack>
      </XStack>

      <YStack
        gap="$2"
        marginTop="$5"
        marginBottom="$2"
      >
        <XStack
          gap={'$2'}
          alignItems="center"
        >
          <GraduationCapIcon
            size={22}
            color="#1253D5"
          />
          <Paragraph
            fontSize={18}
            fontWeight="700"
          >
            {t('sections.documents.professionalDocuments.title')}
          </Paragraph>
        </XStack>

        <Text variant="muted">{t('sections.documents.professionalDocuments.subtitle')}</Text>
      </YStack>

      <ProfessionalDocumentsTable
        documents={professionalDocuments}
        selectedProfessionalDocId={selectedProfessionalDocId}
        onSelectProfessionalDoc={setSelectedProfessionalDocId}
      />

      {/* Confirmation Modals */}
      <ConfirmModal
        open={isApproveConfirmOpen}
        onOpenChange={setIsApproveConfirmOpen}
        title={t('modals.idApproval.title')}
        description={t('modals.idApproval.description', {
          name: `${profile.firstName} ${profile.lastName}`,
        })}
        confirmLabel={t('modals.idApproval.confirm')}
        onConfirm={() => identityMutation.mutate('APPROVED')}
        isLoading={identityMutation.isPending}
      />

      <ConfirmModal
        open={isRejectConfirmOpen}
        onOpenChange={setIsRejectConfirmOpen}
        title={t('modals.idRejection.title')}
        description={t('modals.idRejection.description', {
          name: `${profile.firstName} ${profile.lastName}`,
        })}
        confirmLabel={t('modals.idRejection.confirm')}
        destructive
        onConfirm={() => identityMutation.mutate('REJECTED')}
        isLoading={identityMutation.isPending}
      />
    </>
  );
}
