'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Container, Paragraph, Screen, Text, XStack, YStack, ScrollView, InputField } from '@mezon-tutors/app/ui';
import { VerifiedIcon, InfoIcon, UploadIcon, WalletIcon } from '@mezon-tutors/app/ui/icons';
import { TutorProfileProgress } from './components/tutor-profile-progress';
import { TutorProfileHeader } from './components/tutor-profile-header';
import { TutorProfileStickyActions } from './components/tutor-profile-sticky-actions';
import {
  tutorProfileCertificationAtom,
  markStepCompletedAtom,
} from '@mezon-tutors/app/store/tutor-profile.atom';
import { tutorProfileLastSavedAtAtom } from '@mezon-tutors/app/store/tutor-profile.atom';
import { z } from 'zod';

const CURRENT_STEP = 3;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;

const MAX_FILE_SIZE_MB = 5;
const ACCEPT_CERT = '.pdf,.jpg,.jpeg,.png';

function formatLastSavedTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function TutorProfileCertificationScreen() {
  const t = useTranslations('TutorProfile.Certification');
  const router = useRouter();
  const certInputRef = useRef<HTMLInputElement>(null);
  const educationInputRef = useRef<HTMLInputElement>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [educationFile, setEducationFile] = useState<File | null>(null);
  const [certification, setCertification] = useAtom(tutorProfileCertificationAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);

  const certificationSchema = useMemo(
    () =>
      z.object({
        teachingCertificateName: z.string().min(1, t('validation.certificateRequired')),
        teachingYear: z
          .string()
          .min(4, t('validation.yearRequired'))
          .regex(/^\d{4}$/, t('validation.yearInvalid')),
        university: z.string().min(1, t('validation.universityRequired')),
        degree: z.string().min(1, t('validation.degreeRequired')),
        specialization: z.string().min(1, t('validation.specializationRequired')),
      }),
    [t]
  );

  type CertificationFormValues = z.infer<typeof certificationSchema>;

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

  const form = useForm<CertificationFormValues>({
    defaultValues: certification,
    resolver: zodResolver(certificationSchema),
    mode: 'onChange',
  });

  const { control, handleSubmit, setFocus } = form;
  const teachingCardRef = useRef<HTMLDivElement>(null);
  const educationCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    form.reset(certification);
  }, [
    certification.teachingCertificateName,
    certification.teachingYear,
    certification.university,
    certification.degree,
    certification.specialization,
  ]);

  const onSubmit = (values: CertificationFormValues) => {
    setCertification(values);
    setLastSavedAt(new Date().toISOString());
    markStepCompleted(CURRENT_STEP);
    router.push('/become-tutor/video');
  };

  const teachingFields = ['teachingCertificateName', 'teachingYear'];
  const onValidationError = (errors: Partial<Record<keyof CertificationFormValues, { message?: string }>>) => {
    const firstError = (Object.keys(errors) as (keyof CertificationFormValues)[])[0];
    if (!firstError) return;
    if (teachingFields.includes(firstError)) {
      teachingCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      educationCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setFocus(firstError);
  };

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) setCertFile(file);
    e.target.value = '';
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) setEducationFile(file);
    e.target.value = '';
  };

  const handleDrop = (
    e: React.DragEvent,
    setFile: (f: File | null) => void
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.size <= MAX_FILE_SIZE_MB * 1024 * 1024) setFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <Screen backgroundColor="$background">
      <YStack flex={1}>
        <ScrollView
          flex={1}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
          }}
        >
        <YStack
          flex={1}
          paddingVertical="$5"
          paddingHorizontal="$0"
          $xs={{ paddingVertical: '$4', paddingHorizontal: '$3' }}
          backgroundColor="$background"
        >
          <Container padded maxWidth={960} width="100%" gap="$5" $xs={{ gap: '$4' }}>
            <TutorProfileHeader draftSavedLabel={draftSavedLabel} saveExitLabel={t('saveExit')} />

            <TutorProfileProgress
              currentStepIndex={CURRENT_STEP}
              stepLabel={t('stepLabel')}
              rightLabel={t('progressPercentLabel', { percent: PROGRESS_PERCENT })}
              caption={t('currentLabel')}
              percentOverride={PROGRESS_PERCENT}
            />

            <YStack
              backgroundColor="$backgroundCard"
              borderRadius="$4"
              padding="$6"
              gap="$5"
              borderWidth={1}
              borderColor="$borderSubtle"
              $xs={{ padding: '$4', gap: '$4' }}
            >
              <XStack
                alignItems="center"
                gap="$2"
              >
                <VerifiedIcon
                  size={24}
                  color="#1253D5"
                />
                <Paragraph
                  fontSize={20}
                  fontWeight="700"
                >
                  {t('teachingTitle')}
                </Paragraph>
              </XStack>

              <YStack gap="$4">
                <XStack
                  gap="$4"
                  $xs={{
                    flexDirection: 'column',
                  }}
                >
                  <InputField
                    control={control}
                    name="teachingCertificateName"
                    label={t('teaching.certificateLabel')}
                    placeholder={t('teaching.certificatePlaceholder')}
                    flex={1}
                  />
                  <InputField
                    control={control}
                    name="teachingYear"
                    label={t('teaching.yearLabel')}
                    placeholder={t('teaching.yearPlaceholder')}
                    flex={1}
                  />
                </XStack>

                <YStack gap="$2">
                  <Text
                    size="sm"
                    fontWeight="600"
                  >
                    {t('teaching.uploadTitle')}
                  </Text>

                  <input
                    ref={certInputRef}
                    type="file"
                    accept={ACCEPT_CERT}
                    onChange={handleCertChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                    onClick={() => certInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && certInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, setCertFile)}
                  >
                    <YStack
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor="$borderSubtle"
                      borderStyle="dashed"
                      padding="$6"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="$fieldBackground"
                      gap="$2"
                    >
                      <UploadIcon
                        size={32}
                        color="#6B7280"
                      />
                      <Text
                        size="sm"
                        variant="muted"
                        textAlign="center"
                      >
                        {t('teaching.uploadPrompt')}
                      </Text>
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        {t('teaching.uploadHint')}
                      </Text>
                      {certFile && (
                        <Text size="sm" color="$appPrimary" fontWeight="500">
                          {certFile.name}
                        </Text>
                      )}
                    </YStack>
                  </div>

                  <XStack
                    marginTop="$2"
                    borderRadius="$4"
                    padding="$3"
                    backgroundColor="$backgroundMuted"
                    gap="$2"
                    alignItems="flex-start"
                  >
                    <InfoIcon
                      size={20}
                      color="#1253D5"
                    />
                    <YStack
                      gap="$1"
                      flex={1}
                    >
                      <Text
                        size="sm"
                        fontWeight="600"
                        color="$appPrimary"
                      >
                        {t('teaching.reviewTitle')}
                      </Text>
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        {t('teaching.reviewDescription')}
                      </Text>
                    </YStack>
                  </XStack>
                </YStack>
              </YStack>
            </YStack>

            <YStack
              ref={educationCardRef as React.RefObject<unknown>}
              backgroundColor="$backgroundCard"
              borderRadius="$4"
              padding="$6"
              gap="$5"
              borderWidth={1}
              borderColor="$borderSubtle"
              $xs={{ padding: '$4', gap: '$4' }}
            >
              <XStack
                alignItems="center"
                gap="$2"
              >
                <WalletIcon
                  size={24}
                  color="#1253D5"
                />
                <Paragraph
                  fontSize={20}
                  fontWeight="700"
                >
                  {t('educationTitle')}
                </Paragraph>
              </XStack>

              <YStack gap="$4">
                <XStack
                  gap="$4"
                  $xs={{
                    flexDirection: 'column',
                  }}
                >
                  <InputField
                    control={control}
                    name="university"
                    label={t('education.universityLabel')}
                    placeholder={t('education.universityPlaceholder')}
                    flex={1}
                  />
                  <InputField
                    control={control}
                    name="degree"
                    label={t('education.degreeLabel')}
                    placeholder={t('education.degreePlaceholder')}
                    flex={1}
                  />
                </XStack>

                <InputField
                  control={control}
                  name="specialization"
                  label={t('education.specializationLabel')}
                  placeholder={t('education.specializationPlaceholder')}
                />

                <YStack gap="$2">
                  <Text
                    size="sm"
                    fontWeight="600"
                  >
                    {t('education.uploadTitle')}
                  </Text>
                  <input
                    ref={educationInputRef}
                    type="file"
                    accept={ACCEPT_CERT}
                    onChange={handleEducationChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                    onClick={() => educationInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && educationInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, setEducationFile)}
                  >
                    <YStack
                      borderRadius="$4"
                      borderWidth={1}
                      borderColor="$borderSubtle"
                      borderStyle="dashed"
                      padding="$6"
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor="$fieldBackground"
                      gap="$2"
                    >
                      <UploadIcon
                        size={32}
                        color="#6B7280"
                      />
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        {t('education.uploadPrompt')}
                      </Text>
                      {educationFile && (
                        <Text size="sm" color="$appPrimary" fontWeight="500">
                          {educationFile.name}
                        </Text>
                      )}
                    </YStack>
                  </div>
                </YStack>
              </YStack>
            </YStack>

            {/* Navigation - moved to sticky bar */}
          </Container>
        </YStack>
      </ScrollView>
      <TutorProfileStickyActions>
        <Button
          variant="outline"
          onPress={() => router.push('/become-tutor/photo')}
        >
          {t('back')}
        </Button>
        <Button
          variant="primary"
          onPress={handleSubmit(onSubmit, onValidationError)}
        >
          {t('continue')}
        </Button>
      </TutorProfileStickyActions>
      </YStack>
    </Screen>
  );
}
