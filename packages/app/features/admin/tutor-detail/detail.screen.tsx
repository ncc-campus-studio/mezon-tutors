'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Container,
  Paragraph,
  Screen,
  ScrollView,
  Text,
  XStack,
  YStack,
  Card,
  Textarea,
  ConfirmModal,
} from '@mezon-tutors/app/ui';
import { EditListIcon } from '@mezon-tutors/app/ui/icons';
import { DocumentsTab } from './documents-tab';

import { useParams } from 'solito/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminTutorApplicationService } from '@mezon-tutors/app/services/admin-tutor-application.service';
import { FullApplicationTab } from './full-application-tab';
import { StatusBadge } from '@mezon-tutors/app/ui/StatusBadge';
import { useToastController } from '@mezon-tutors/app/ui';
import { useAtomValue } from 'jotai';
import { userAtom } from '@mezon-tutors/app/store/auth.atom';

type DetailTab = 'full-application' | 'documents';

export function AdminTutorApplicationDetailScreen() {
  const t = useTranslations('AdminTutorApplications.Detail');
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<DetailTab>('full-application');
  const [noteContent, setNoteContent] = useState('');
  const queryClient = useQueryClient();
  const toast = useToastController();
  const user = useAtomValue(userAtom);

  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [isWaitlistConfirmOpen, setIsWaitlistConfirmOpen] = useState(false);
  const [isSaveNoteConfirmOpen, setIsSaveNoteConfirmOpen] = useState(false);

  const {
    data: fullData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-tutor-application', id],
    queryFn: () => adminTutorApplicationService.getTutorProfile(id!),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: (tutorId: string) => adminTutorApplicationService.approveTutorApplication(tutorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tutor-application', id] });
      toast.show('Application approved successfully', { variant: 'success' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (tutorId: string) => adminTutorApplicationService.rejectTutorApplication(tutorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tutor-application', id] });
      toast.show('Application rejected', { variant: 'success' });
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: (tutorId: string) => adminTutorApplicationService.waitlistTutorApplication(tutorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tutor-application', id] });
      toast.show('Application moved to waitlist', { variant: 'success' });
    },
  });

  const noteMutation = useMutation({
    mutationFn: (content: string) =>
      adminTutorApplicationService.createAdminNote({
        tutorId: id!,
        reviewerId: user?.id || 'dummy-admin-id',
        reviewerName: user?.username || 'Admin',
        content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tutor-application', id] });
      setNoteContent('');
      toast.show('Note added', { variant: 'success' });
    },
  });

  if (isLoading) {
    return (
      <Screen backgroundColor="$background">
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Text>{t('loading')}</Text>
        </YStack>
      </Screen>
    );
  }

  if (error || !fullData) {
    return (
      <Screen backgroundColor="$background">
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Text color="$red10">{t('error')}</Text>
        </YStack>
      </Screen>
    );
  }

  const { profile, adminNotes } = fullData;

  const adminNotesFormatted =
    adminNotes?.map((note) => ({
      id: note.id,
      author: note.reviewerName,
      date: new Date(note.createdAt).toLocaleDateString(),
      content: note.content,
    })) || [];

  return (
    <Screen backgroundColor="$background">
      <YStack flex={1}>
        <ScrollView
          flex={1}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 96,
          }}
        >
          <YStack
            flex={1}
            paddingVertical="$5"
            paddingHorizontal="$0"
            $xs={{ paddingVertical: '$4', paddingHorizontal: '$3' }}
            backgroundColor="$background"
          >
            <Container
              padded
              maxWidth={1200}
              width="100%"
              gap="$5"
              $xs={{ gap: '$4' }}
            >
              {/* Header */}
              <Card
                padding="$5"
                borderRadius="$4"
              >
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap="$4"
                >
                  <XStack
                    alignItems="center"
                    gap="$4"
                    flex={1}
                    flexWrap="wrap"
                  >
                    <YStack
                      width={72}
                      height={72}
                      borderRadius={999}
                      backgroundColor="$backgroundMuted"
                      borderWidth={2}
                      borderColor="$borderSubtle"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize={28}
                        fontWeight="600"
                        color="$appTextMuted"
                      >
                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                      </Text>
                    </YStack>
                    <YStack
                      gap="$2"
                      flex={1}
                      minWidth={200}
                    >
                      <XStack
                        alignItems="center"
                        gap="$3"
                        flexWrap="wrap"
                      >
                        <Paragraph
                          fontSize={26}
                          fontWeight="700"
                        >
                          {profile.firstName} {profile.lastName}
                        </Paragraph>
                        <StatusBadge status={profile.verificationStatus} />
                      </XStack>
                      <Text variant="muted">
                        {profile.headline}{profile.subject ? ` • ${profile.subject}` : ''} • {profile.country}
                      </Text>
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        {t('submittedAt', {
                          date: new Date(profile.createdAt).toLocaleDateString(),
                          id: profile.userId,
                        })}
                      </Text>
                    </YStack>
                  </XStack>

                  <XStack
                    gap="$3"
                    flexWrap="wrap"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    {profile.verificationStatus === 'PENDING' && (
                      <>
                        <Button
                          variant="secondary"
                          onPress={() => setIsRejectConfirmOpen(true)}
                          disabled={rejectMutation.isPending}
                        >
                          {t('actions.reject')}
                        </Button>
                        <Button
                          variant="outline"
                          onPress={() => setIsWaitlistConfirmOpen(true)}
                          disabled={waitlistMutation.isPending}
                        >
                          {t('actions.waitlist')}
                        </Button>
                        <Button
                          variant="primary"
                          onPress={() => setIsApproveConfirmOpen(true)}
                          disabled={approveMutation.isPending}
                        >
                          {t('actions.approve')}
                        </Button>
                      </>
                    )}
                  </XStack>
                </XStack>
              </Card>

              <XStack
                alignItems="flex-start"
                gap="$4"
                $xs={{ flexDirection: 'column' }}
                $sm={{ flexDirection: 'column' }}
              >
                {/* Left column */}
                <YStack
                  flex={3}
                  gap="$4"
                  width="100%"
                >
                  {/* Tabs */}
                  <XStack
                    gap="$5"
                    borderBottomWidth={1}
                    borderColor="$borderSubtle"
                    paddingBottom="$2"
                  >
                    <Text
                      fontWeight={activeTab === 'full-application' ? '600' : '400'}
                      color={activeTab === 'full-application' ? '$appPrimary' : '$color10'}
                      cursor="pointer"
                      onPress={() => setActiveTab('full-application')}
                    >
                      {t('tabs.fullApplication')}
                    </Text>
                    <Text
                      fontWeight={activeTab === 'documents' ? '600' : '400'}
                      color={activeTab === 'documents' ? '$appPrimary' : '$color10'}
                      cursor="pointer"
                      onPress={() => setActiveTab('documents')}
                    >
                      {t('tabs.documents')}
                    </Text>
                  </XStack>

                  {activeTab === 'full-application' && <FullApplicationTab fullData={fullData} />}

                  {activeTab === 'documents' && <DocumentsTab fullData={fullData} />}
                </YStack>

                {/* Right column – Admin notes & meta */}
                {activeTab === 'full-application' && (
                  <YStack
                    flex={2}
                    gap="$4"
                    minWidth={280}
                  >
                    <Card
                      padding="$4"
                      borderRadius="$8"
                      backgroundColor="$backgroundCard"
                    >
                      <YStack gap="$3">
                        <XStack
                          gap={'$2'}
                          alignItems="center"
                        >
                          <EditListIcon size={20} />
                          <Paragraph fontWeight="600">{t('sidebar.adminNotes.title')}</Paragraph>
                        </XStack>
                        <Textarea
                          placeholder={t('sidebar.adminNotes.title')}
                          multiline
                          textAlignVertical="top"
                          value={noteContent}
                          onChangeText={setNoteContent}
                        ></Textarea>
                        <Button
                          variant="primary"
                          size="sm"
                          onPress={() => noteContent.trim() && setIsSaveNoteConfirmOpen(true)}
                          disabled={noteMutation.isPending || !noteContent.trim()}
                        >
                          {t('sidebar.adminNotes.save')}
                        </Button>
                        <YStack gap="$2">
                          <Text
                            size="sm"
                            variant="muted"
                          >
                            {t('sidebar.adminNotes.previousNotes')}
                          </Text>
                          <YStack gap="$2">
                            {adminNotesFormatted.map((note) => (
                              <YStack
                                key={note.id}
                                borderRadius="$6"
                                padding="$3"
                                backgroundColor="$backgroundMuted"
                                gap="$1"
                              >
                                <Text
                                  size="sm"
                                  fontWeight="600"
                                >
                                  {note.author} • {note.date}
                                </Text>
                                <Text
                                  size="sm"
                                  variant="muted"
                                >
                                  “{note.content}”
                                </Text>
                              </YStack>
                            ))}
                          </YStack>
                        </YStack>
                      </YStack>
                    </Card>
                  </YStack>
                )}
              </XStack>
            </Container>
          </YStack>
        </ScrollView>
        <XStack
          justifyContent="center"
          paddingVertical="$4"
          borderTopWidth={1}
          borderColor="$borderSubtle"
          backgroundColor="$background"
        >
          <Text
            size="sm"
            variant="muted"
          >
            {t('footer')}
          </Text>
        </XStack>
      </YStack>

      {/* Confirmation Modals */}
      <ConfirmModal
        open={isApproveConfirmOpen}
        onOpenChange={setIsApproveConfirmOpen}
        title={t('modals.approve.title')}
        description={t('modals.approve.description', { name: `${profile.firstName} ${profile.lastName}` })}
        confirmLabel={t('modals.approve.confirm')}
        onConfirm={async () => {
          if (id) await approveMutation.mutateAsync(id);
        }}
        isLoading={approveMutation.isPending}
      />

      <ConfirmModal
        open={isRejectConfirmOpen}
        onOpenChange={setIsRejectConfirmOpen}
        title={t('modals.reject.title')}
        description={t('modals.reject.description', { name: `${profile.firstName} ${profile.lastName}` })}
        confirmLabel={t('modals.reject.confirm')}
        destructive
        onConfirm={async () => {
          if (id) await rejectMutation.mutateAsync(id);
        }}
        isLoading={rejectMutation.isPending}
      />

      <ConfirmModal
        open={isWaitlistConfirmOpen}
        onOpenChange={setIsWaitlistConfirmOpen}
        title={t('modals.waitlist.title')}
        description={t('modals.waitlist.description', { name: `${profile.firstName} ${profile.lastName}` })}
        confirmLabel={t('modals.waitlist.confirm')}
        onConfirm={async () => {
          if (id) await waitlistMutation.mutateAsync(id);
        }}
        isLoading={waitlistMutation.isPending}
      />

      <ConfirmModal
        open={isSaveNoteConfirmOpen}
        onOpenChange={setIsSaveNoteConfirmOpen}
        title={t('modals.saveNote.title')}
        description={t('modals.saveNote.description')}
        confirmLabel={t('modals.saveNote.confirm')}
        onConfirm={async () => {
          await noteMutation.mutateAsync(noteContent);
        }}
        isLoading={noteMutation.isPending}
      />
    </Screen>
  );
}
