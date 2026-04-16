'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import {
  Button,
  Container,
  Paragraph,
  Screen,
  Text,
  XStack,
  YStack,
  ScrollView,
  InputField,
  UploadFile,
} from '@mezon-tutors/app/ui';
import { VerifiedIcon, InfoIcon, UploadIcon, WalletIcon } from '@mezon-tutors/app/ui/icons';
import { TutorProfileProgress } from './components/tutor-profile-progress';
import { TutorProfileHeader } from './components/tutor-profile-header';
import { TutorProfileStickyActions } from './components/tutor-profile-sticky-actions';
import {
  tutorProfileCertificationAtom,
  markStepCompletedAtom,
  defaultCertificationState,
} from '@mezon-tutors/app/store/tutor-profile.atom';
import { tutorProfileLastSavedAtAtom } from '@mezon-tutors/app/store/tutor-profile.atom';
import { formatLastSavedTime } from '@mezon-tutors/shared';
import { z } from 'zod';

const CURRENT_STEP = 3;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;

const MAX_FILE_SIZE_MB = 5;
const ACCEPT_CERT = '.pdf,.jpg,.jpeg,.png';

export function TutorProfileCertificationScreen() {
  const t = useTranslations('TutorProfile.Certification');
  const locale = useLocale();
  const router = useRouter();
  const [certification, setCertification] = useAtom(tutorProfileCertificationAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);
  const teachingCardRef = useRef<HTMLDivElement>(null);
  const educationCardRef = useRef<HTMLDivElement | null>(null);

  const certificationMerged = useMemo(
    () => ({ ...defaultCertificationState, ...certification }),
    [certification]
  );

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
          teachingCertificateFile: z.instanceof(File).nullable(),
          educationFile: z.instanceof(File).nullable(),
        })
        .superRefine((data, ctx) => {
          const allowedExt = new Set(['pdf', 'jpg', 'jpeg', 'png']);
          const bytesLimit = MAX_FILE_SIZE_MB * 1024 * 1024;

          const validateFile = (
            file: File,
            path: 'teachingCertificateFile' | 'educationFile',
            invalidTypeMsg: string,
            tooLargeMsg: string
          ) => {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            if (!allowedExt.has(ext)) {
              ctx.addIssue({
                path: [path],
                code: z.ZodIssueCode.custom,
                message: invalidTypeMsg,
              });
              return;
            }
            if (file.size > bytesLimit) {
              ctx.addIssue({
                path: [path],
                code: z.ZodIssueCode.custom,
                message: tooLargeMsg,
              });
            }
          };

          const hasTeaching =
            data.teachingCertificateFile !== null ||
            !!certificationMerged.teachingCertificateFileDataUrl;
          if (!hasTeaching) {
            ctx.addIssue({
              path: ['teachingCertificateFile'],
              code: z.ZodIssueCode.custom,
              message: t('validation.certificateFileRequired'),
            });
          } else if (data.teachingCertificateFile) {
            validateFile(
              data.teachingCertificateFile,
              'teachingCertificateFile',
              t('validation.certificateFileInvalidType'),
              t('validation.certificateFileTooLarge', { max: MAX_FILE_SIZE_MB })
            );
          }

          const hasEducation =
            data.educationFile !== null || !!certificationMerged.educationFileDataUrl;
          if (!hasEducation) {
            ctx.addIssue({
              path: ['educationFile'],
              code: z.ZodIssueCode.custom,
              message: t('validation.educationFileRequired'),
            });
          } else if (data.educationFile) {
            validateFile(
              data.educationFile,
              'educationFile',
              t('validation.educationFileInvalidType'),
              t('validation.educationFileTooLarge', { max: MAX_FILE_SIZE_MB })
            );
          }
        }),
    [
      t,
      locale,
      certificationMerged.teachingCertificateFileDataUrl,
      certificationMerged.educationFileDataUrl,
    ]
  );

  type CertificationFormValues = z.infer<typeof certificationSchema>;

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

  const form = useForm<CertificationFormValues>({
    defaultValues: {
      teachingCertificateName: certificationMerged.teachingCertificateName,
      teachingYear: certificationMerged.teachingYear,
      university: certificationMerged.university,
      degree: certificationMerged.degree,
      specialization: certificationMerged.specialization,
      teachingCertificateFile: null,
      educationFile: null,
    },
    resolver: zodResolver(certificationSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const { control, handleSubmit, setFocus, getValues } = form;
  const { touchedFields, submitCount } = useFormState({ control });

  const prevLocaleRef = useRef(locale);
  useEffect(() => {
    if (prevLocaleRef.current === locale) return;
    prevLocaleRef.current = locale;
    if (submitCount > 0) {
      void form.trigger();
      return;
    }
    const names = Object.keys(touchedFields);
    if (names.length > 0) {
      void form.trigger(names as (keyof CertificationFormValues)[]);
    }
  }, [locale, form, touchedFields, submitCount]);

  const teachingCertificateFile = useWatch({ control, name: 'teachingCertificateFile' });
  const educationFile = useWatch({ control, name: 'educationFile' });

  useEffect(() => {
    if (!teachingCertificateFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCertification((prev) => ({
        ...prev,
        teachingCertificateFileDataUrl: reader.result as string,
        teachingCertificateFileName: teachingCertificateFile.name,
      }));
      setLastSavedAt(new Date().toISOString());
    };
    reader.readAsDataURL(teachingCertificateFile);
  }, [teachingCertificateFile, setCertification, setLastSavedAt]);

  useEffect(() => {
    if (!educationFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCertification((prev) => ({
        ...prev,
        educationFileDataUrl: reader.result as string,
        educationFileName: educationFile.name,
      }));
      setLastSavedAt(new Date().toISOString());
    };
    reader.readAsDataURL(educationFile);
  }, [educationFile, setCertification, setLastSavedAt]);

  useEffect(() => {
    const currentTeachingFile = getValues('teachingCertificateFile');
    const currentEducationFile = getValues('educationFile');
    form.reset({
      teachingCertificateName: certificationMerged.teachingCertificateName,
      teachingYear: certificationMerged.teachingYear,
      university: certificationMerged.university,
      degree: certificationMerged.degree,
      specialization: certificationMerged.specialization,
      teachingCertificateFile: currentTeachingFile,
      educationFile: currentEducationFile,
    });
  }, [
    certificationMerged.teachingCertificateName,
    certificationMerged.teachingYear,
    certificationMerged.university,
    certificationMerged.degree,
    certificationMerged.specialization,
    getValues,
  ]);

  const onSubmit = (values: CertificationFormValues) => {
    const { teachingCertificateFile: _tcf, educationFile: _ef, ...textFields } = values;
    setCertification((prev) => ({
      ...prev,
      ...textFields,
    }));
    setLastSavedAt(new Date().toISOString());
    markStepCompleted(CURRENT_STEP);
    router.push('/become-tutor/video');
  };

  const teachingFields = new Set<keyof CertificationFormValues>([
    'teachingCertificateName',
    'teachingYear',
    'teachingCertificateFile',
  ]);
  const focusableFields = new Set<keyof CertificationFormValues>([
    'teachingCertificateName',
    'teachingYear',
    'university',
    'degree',
    'specialization',
  ]);

  const onValidationError = (
    errors: Partial<Record<keyof CertificationFormValues, { message?: string }>>
  ) => {
    const firstError = Object.keys(errors)[0] as keyof CertificationFormValues | undefined;
    if (!firstError) return;

    const targetSectionRef = teachingFields.has(firstError) ? teachingCardRef : educationCardRef;
    targetSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (focusableFields.has(firstError)) setFocus(firstError);
  };

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
            <Container
              padded
              maxWidth={960}
              width="100%"
              gap="$5"
              $xs={{ gap: '$4' }}
            >
              <TutorProfileHeader
                draftSavedLabel={draftSavedLabel}
                saveExitLabel={t('saveExit')}
              />

              <TutorProfileProgress
                currentStepIndex={CURRENT_STEP}
                stepLabel={t('stepLabel')}
                rightLabel={t('progressPercentLabel', { percent: PROGRESS_PERCENT })}
                caption={t('currentLabel')}
                percentOverride={PROGRESS_PERCENT}
              />

              <YStack
                ref={teachingCardRef}
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

                    <UploadFile
                      control={control}
                      name="teachingCertificateFile"
                      accept={ACCEPT_CERT}
                      icon={<UploadIcon size={32} color="#6B7280" />}
                      prompt={t('teaching.uploadPrompt')}
                      hint={t('teaching.uploadHint')}
                      persistedFileName={
                        certificationMerged.teachingCertificateFileDataUrl
                          ? certificationMerged.teachingCertificateFileName || undefined
                          : undefined
                      }
                    />

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
                ref={educationCardRef}
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

                    <UploadFile
                      control={control}
                      name="educationFile"
                      accept={ACCEPT_CERT}
                      icon={<UploadIcon size={32} color="#6B7280" />}
                      prompt={t('education.uploadPrompt')}
                      hint={t('education.uploadHint')}
                      persistedFileName={
                        certificationMerged.educationFileDataUrl
                          ? certificationMerged.educationFileName || undefined
                          : undefined
                      }
                    />
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
