'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { CLOUDINARY_FOLDER, formatLastSavedTime, MAX_FILE_SIZE_MB } from '@mezon-tutors/shared';
import { cloudinaryService } from '@mezon-tutors/app/services';
import { z } from 'zod';

const CURRENT_STEP = 3;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;

const ACCEPT_CERT = '.pdf,.jpg,.jpeg,.png';

export function TutorProfileCertificationScreen() {
  const t = useTranslations('TutorProfile.Certification');
  const locale = useLocale();
  const router = useRouter();
  const [certification, setCertification] = useAtom(tutorProfileCertificationAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const [isUploading, setIsUploading] = useState(false);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);
  const teachingCardRef = useRef<HTMLDivElement>(null);
  const educationCardRef = useRef<HTMLDivElement | null>(null);
  const teachingUploadSeqRef = useRef(0);
  const educationUploadSeqRef = useRef(0);

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
            !!certificationMerged.teachingCertificate.file.dataUrl ||
            !!certificationMerged.teachingCertificate.file.uploadedUrl;
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
            data.educationFile !== null ||
            !!certificationMerged.higherEducation.file.dataUrl ||
            !!certificationMerged.higherEducation.file.uploadedUrl;
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
      certificationMerged.teachingCertificate.file.dataUrl,
      certificationMerged.teachingCertificate.file.uploadedUrl,
      certificationMerged.higherEducation.file.dataUrl,
      certificationMerged.higherEducation.file.uploadedUrl,
    ]
  );

  type CertificationFormValues = z.infer<typeof certificationSchema>;

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

  const form = useForm<CertificationFormValues>({
    defaultValues: {
      teachingCertificateName: certificationMerged.teachingCertificate.name,
      teachingYear: certificationMerged.teachingCertificate.year,
      university: certificationMerged.higherEducation.university,
      degree: certificationMerged.higherEducation.degree,
      specialization: certificationMerged.higherEducation.specialization,
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
    const bytesLimit = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (teachingCertificateFile.size > bytesLimit) {
      form.setError('teachingCertificateFile', {
        type: 'manual',
        message: t('validation.certificateFileTooLarge', { max: MAX_FILE_SIZE_MB }),
      });
      return;
    }
    teachingUploadSeqRef.current += 1;
    const seq = teachingUploadSeqRef.current;
    const previousPublicId = certificationMerged.teachingCertificate.file.publicId;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCertification((prev) => ({
        ...prev,
        teachingCertificate: {
          ...prev.teachingCertificate,
          file: {
            ...prev.teachingCertificate.file,
            dataUrl,
            uploadedUrl: null,
            fileName: teachingCertificateFile.name,
          },
        },
      }));
      setLastSavedAt(new Date().toISOString());

      try {
        setIsUploading(true);
        const uploadedFile = await cloudinaryService.uploadFileWithSignature(
          teachingCertificateFile,
          CLOUDINARY_FOLDER.TUTOR_CERTIFICATE,
          'auto'
        );

        if (teachingUploadSeqRef.current !== seq) return;

        setCertification((prev) => ({
          ...prev,
          teachingCertificate: {
            ...prev.teachingCertificate,
            file: {
              ...prev.teachingCertificate.file,
              uploadedUrl: uploadedFile.secureUrl,
              publicId: uploadedFile.publicId,
            },
          },
        }));
        if (previousPublicId && previousPublicId !== uploadedFile.publicId) {
          void cloudinaryService.deleteFile(previousPublicId).catch(() => null);
        }
        await form.trigger('teachingCertificateFile');
      } catch {
        if (teachingUploadSeqRef.current !== seq) return;
        form.setError('teachingCertificateFile', {
          type: 'manual',
          message: t('validation.certificateUploadFailed'),
        });
      } finally {
        if (teachingUploadSeqRef.current === seq) setIsUploading(false);
      }
    };
    reader.readAsDataURL(teachingCertificateFile);
  }, [teachingCertificateFile, t]);

  useEffect(() => {
    if (!educationFile) return;
    const bytesLimit = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (educationFile.size > bytesLimit) {
      form.setError('educationFile', {
        type: 'manual',
        message: t('validation.educationFileTooLarge', { max: MAX_FILE_SIZE_MB }),
      });
      return;
    }
    educationUploadSeqRef.current += 1;
    const seq = educationUploadSeqRef.current;
    const previousPublicId = certificationMerged.higherEducation.file.publicId;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCertification((prev) => ({
        ...prev,
        higherEducation: {
          ...prev.higherEducation,
          file: {
            ...prev.higherEducation.file,
            dataUrl,
            uploadedUrl: null,
            fileName: educationFile.name,
          },
        },
      }));
      setLastSavedAt(new Date().toISOString());

      try {
        setIsUploading(true);
        const uploadedFile = await cloudinaryService.uploadFileWithSignature(
          educationFile,
          CLOUDINARY_FOLDER.TUTOR_DIPLOMA,
          'auto'
        );

        if (educationUploadSeqRef.current !== seq) return;

        setCertification((prev) => ({
          ...prev,
          higherEducation: {
            ...prev.higherEducation,
            file: {
              ...prev.higherEducation.file,
              uploadedUrl: uploadedFile.secureUrl,
              publicId: uploadedFile.publicId,
            },
          },
        }));
        if (previousPublicId && previousPublicId !== uploadedFile.publicId) {
          void cloudinaryService.deleteFile(previousPublicId).catch(() => null);
        }
        await form.trigger('educationFile');
      } catch {
        if (educationUploadSeqRef.current !== seq) return;
        form.setError('educationFile', {
          type: 'manual',
          message: t('validation.educationUploadFailed'),
        });
      } finally {
        if (educationUploadSeqRef.current === seq) setIsUploading(false);
      }
    };
    reader.readAsDataURL(educationFile);
  }, [educationFile, t]);

  useEffect(() => {
    const currentTeachingFile = getValues('teachingCertificateFile');
    const currentEducationFile = getValues('educationFile');
    form.reset({
      teachingCertificateName: certificationMerged.teachingCertificate.name,
      teachingYear: certificationMerged.teachingCertificate.year,
      university: certificationMerged.higherEducation.university,
      degree: certificationMerged.higherEducation.degree,
      specialization: certificationMerged.higherEducation.specialization,
      teachingCertificateFile: currentTeachingFile,
      educationFile: currentEducationFile,
    });
  }, [
    certificationMerged.teachingCertificate.name,
    certificationMerged.teachingCertificate.year,
    certificationMerged.higherEducation.university,
    certificationMerged.higherEducation.degree,
    certificationMerged.higherEducation.specialization,
    getValues,
  ]);

  const onSubmit = async (values: CertificationFormValues) => {
    const { teachingCertificateFile: _tcf, educationFile: _ef, ...textFields } = values;
    if (isUploading) return;

    if (!certificationMerged.teachingCertificate.file.uploadedUrl) {
      form.setError('teachingCertificateFile', {
        type: 'manual',
        message: t('validation.certificateUploadFailed'),
      });
      return;
    }

    if (!certificationMerged.higherEducation.file.uploadedUrl) {
      form.setError('educationFile', {
        type: 'manual',
        message: t('validation.educationUploadFailed'),
      });
      return;
    }

    setCertification((prev) => ({
      ...prev,
      teachingCertificate: {
        ...prev.teachingCertificate,
        name: textFields.teachingCertificateName,
        year: textFields.teachingYear,
      },
      higherEducation: {
        ...prev.higherEducation,
        university: textFields.university,
        degree: textFields.degree,
        specialization: textFields.specialization,
      },
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
                        certificationMerged.teachingCertificate.file.dataUrl ||
                        certificationMerged.teachingCertificate.file.uploadedUrl
                          ? certificationMerged.teachingCertificate.file.fileName || undefined
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
                        certificationMerged.higherEducation.file.dataUrl ||
                        certificationMerged.higherEducation.file.uploadedUrl
                          ? certificationMerged.higherEducation.file.fileName || undefined
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
            disabled={isUploading}
            onPress={handleSubmit(onSubmit, onValidationError)}
          >
            {t('continue')}
          </Button>
        </TutorProfileStickyActions>
      </YStack>
    </Screen>
  );
}
