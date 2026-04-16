'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Container,
  Paragraph,
  Screen,
  Text,
  XStack,
  YStack,
  ScrollView,
  Card,
  InputField,
  SkeletonCard,
  UploadImage,
} from '@mezon-tutors/app/ui';
import {
  UserIcon,
  CameraIcon,
  UploadIcon,
  FocusIcon,
  SunIcon,
  SmileIcon,
  ImageIcon,
  GraduationCapIcon,
} from '@mezon-tutors/app/ui/icons';
import { TutorProfileProgress } from './components/tutor-profile-progress';
import { TutorProfileStickyActions } from './components/tutor-profile-sticky-actions';
import {
  tutorProfileLastSavedAtAtom,
  tutorProfilePhotoAtom,
  tutorProfileIdentityAtom,
} from '@mezon-tutors/app/store/tutor-profile.atom';
import { formatLastSavedTime } from '@mezon-tutors/shared';

const CURRENT_STEP = 2;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;
const MAX_SIZE_MB = 5;
const ACCEPT_PROFILE_IMAGE = 'image/jpeg,image/png,image/jpg';

export function TutorProfilePhotoScreen() {
  const t = useTranslations('TutorProfile.Photo');
  const locale = useLocale();
  const router = useRouter();
  const photoCardRef = useRef<HTMLDivElement | null>(null);
  const identityCardRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [photo, setPhoto] = useAtom(tutorProfilePhotoAtom);
  const [identity, setIdentity] = useAtom(tutorProfileIdentityAtom);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(photo.dataUrl);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);

  const allowedImageExt = useMemo(() => new Set(['jpg', 'jpeg', 'png']), []);

  const photoFormSchema = useMemo(
    () =>
      z.object({
          introduce: z.string().min(1, t('validation.introduceRequired')),
          headline: z.string().min(1, t('validation.headlineRequired')),
          motivate: z.string().min(1, t('validation.motivateRequired')),
          profilePhotoFile: z.instanceof(File).nullable(),
          identityPhotoFile: z.instanceof(File).nullable(),
        })
        .superRefine((data, ctx) => {
          const bytesLimit = MAX_SIZE_MB * 1024 * 1024;

          const checkImageFile = (
            file: File | null,
            path: 'profilePhotoFile' | 'identityPhotoFile',
            msgType: 'photo' | 'identity'
          ) => {
            if (!file) return;
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            const mimeOk = file.type.startsWith('image/');
            if (!allowedImageExt.has(ext) || !mimeOk) {
              ctx.addIssue({
                path: [path],
                code: z.ZodIssueCode.custom,
                message:
                  msgType === 'photo'
                    ? t('validation.photoInvalidType')
                    : t('validation.identityInvalidType'),
              });
              return;
            }
            if (file.size > bytesLimit) {
              ctx.addIssue({
                path: [path],
                code: z.ZodIssueCode.custom,
                message:
                  msgType === 'photo'
                    ? t('validation.photoInvalidSize', { max: MAX_SIZE_MB })
                    : t('validation.identityInvalidSize', { max: MAX_SIZE_MB }),
              });
            }
          };

          if (!photo.dataUrl && !data.profilePhotoFile) {
            ctx.addIssue({
              path: ['profilePhotoFile'],
              code: z.ZodIssueCode.custom,
              message: t('validation.photoRequired'),
            });
          }
          if (data.profilePhotoFile) {
            checkImageFile(data.profilePhotoFile, 'profilePhotoFile', 'photo');
          }

          if (!identity.dataUrl && !data.identityPhotoFile) {
            ctx.addIssue({
              path: ['identityPhotoFile'],
              code: z.ZodIssueCode.custom,
              message: t('validation.identityRequired'),
            });
          }
          if (data.identityPhotoFile) {
            checkImageFile(data.identityPhotoFile, 'identityPhotoFile', 'identity');
          }
        }),
    [t, locale, photo.dataUrl, identity.dataUrl, allowedImageExt]
  );

  type PhotoFormValues = z.infer<typeof photoFormSchema>;

  const form = useForm<PhotoFormValues>({
    defaultValues: {
      introduce: photo.introduce,
      headline: photo.headline,
      motivate: photo.motivate,
      profilePhotoFile: null,
      identityPhotoFile: null,
    },
    resolver: zodResolver(photoFormSchema),
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
      void form.trigger(names as (keyof PhotoFormValues)[]);
    }
  }, [locale, form, touchedFields, submitCount]);

  const profilePhotoFile = useWatch({ control, name: 'profilePhotoFile' });
  const identityPhotoFile = useWatch({ control, name: 'identityPhotoFile' });

  useEffect(() => {
    setPreviewPhotoUrl(photo.dataUrl);
  }, [photo.dataUrl]);

  useEffect(() => {
    const currentProfile = getValues('profilePhotoFile');
    const currentIdentity = getValues('identityPhotoFile');
    form.reset({
      introduce: photo.introduce,
      headline: photo.headline,
      motivate: photo.motivate,
      profilePhotoFile: currentProfile,
      identityPhotoFile: currentIdentity,
    });
  }, [photo.introduce, photo.headline, photo.motivate, getValues, form]);

  useEffect(() => {
    if (!profilePhotoFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhoto((prev) => ({ ...prev, dataUrl }));
      setPreviewPhotoUrl(dataUrl);
      setLastSavedAt(new Date().toISOString());
    };
    reader.readAsDataURL(profilePhotoFile);
  }, [profilePhotoFile, setPhoto, setLastSavedAt]);

  useEffect(() => {
    if (!identityPhotoFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setIdentity({ dataUrl });
      setLastSavedAt(new Date().toISOString());
    };
    reader.readAsDataURL(identityPhotoFile);
  }, [identityPhotoFile, setIdentity, setLastSavedAt]);

  const onSaveContinue = (values: PhotoFormValues) => {
    const { profilePhotoFile: _pp, identityPhotoFile: _ip, ...textValues } = values;
    setPhoto((prev) => ({ ...prev, ...textValues }));
    setLastSavedAt(new Date().toISOString());
    router.push('/become-tutor/certification');
  };

  const textFields = new Set<keyof PhotoFormValues>(['headline', 'motivate', 'introduce']);

  const onValidationError = (errors: Partial<Record<keyof PhotoFormValues, { message?: string }>>) => {
    const firstError = Object.keys(errors)[0] as keyof PhotoFormValues | undefined;
    if (!firstError) return;

    if (firstError === 'profilePhotoFile') {
      photoCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (firstError === 'identityPhotoFile') {
      identityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (textFields.has(firstError)) setFocus(firstError);
  };

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

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
              {/* Top bar */}
              <XStack
                alignItems="center"
                justifyContent="space-between"
                gap="$4"
                $xs={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <XStack>
                  <GraduationCapIcon
                    size={30}
                    color="#1253D5"
                  />
                  <Paragraph
                    paddingLeft={10}
                    fontWeight="700"
                    fontSize={18}
                    letterSpacing={-0.3}
                  >
                    {t('headerTitle')}
                  </Paragraph>
                </XStack>

                <XStack
                  alignItems="center"
                  gap="$3"
                  $xs={{
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    size="sm"
                    variant="muted"
                  >
                    {draftSavedLabel}
                  </Text>
                  <Button
                    variant="secondary"
                    backgroundColor="$backgroundMuted"
                  >
                    {t('saveExit')}
                  </Button>
                </XStack>
              </XStack>

              <TutorProfileProgress
                currentStepIndex={CURRENT_STEP}
                stepLabel={t('stepLabel')}
                rightLabel={t('progressPercentLabel', { percent: PROGRESS_PERCENT })}
                caption={t('nextLabel')}
              />

              {/* Title & description - outside frame */}
              <YStack
                gap="$2"
                $xs={{ gap: '$1.5' }}
              >
                <Paragraph
                  fontSize={35}
                  fontWeight="1000"
                  paddingVertical={10}
                  paddingHorizontal={0}
                  $xs={{
                    fontSize: 26,
                    paddingVertical: 6,
                  }}
                >
                  {t('title')}
                </Paragraph>
                <Text
                  variant="muted"
                  fontWeight="500"
                  fontSize={15}
                  $xs={{ fontSize: 14 }}
                >
                  {t('subtitle')}
                </Text>
              </YStack>

              {/* Upload photo frame */}
              <YStack
                ref={photoCardRef}
                backgroundColor="$backgroundCard"
                borderRadius="$4"
                padding="$6"
                gap="$5"
                borderWidth={1}
                borderColor="$borderSubtle"
                $xs={{
                  padding: '$4',
                  gap: '$4',
                }}
              >
                <YStack
                  gap="$4"
                  alignItems="center"
                >
                  {/* Avatar + camera badge wrapper */}
                  <YStack
                    position="relative"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                  >
                    {/* Avatar circle - one border outside, same size as preview */}
                    <YStack
                      width="40%"
                      aspectRatio={1}
                      alignItems="center"
                      justifyContent="center"
                      $xs={{ width: '60%' }}
                    >
                      {/* Outer Border */}
                      <YStack
                        width="100%"
                        height="100%"
                        borderRadius={999}
                        borderWidth={2}
                        borderColor="#94A3B8"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {/* Inner Circle */}
                        <YStack
                          width="100%"
                          height="100%"
                          borderRadius={999}
                          overflow="hidden"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {previewPhotoUrl ? (
                            <img
                              src={previewPhotoUrl}
                              alt=""
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <YStack
                              width="100%"
                              height="100%"
                              padding="35%"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <UserIcon
                                width="100%"
                                height="100%"
                                color="#64748B"
                              />
                            </YStack>
                          )}
                        </YStack>
                      </YStack>
                    </YStack>
                    {/* Camera badge overlay - only show when no preview */}
                    {!previewPhotoUrl ? (
                      <YStack
                        position="absolute"
                        bottom="0"
                        right="32%"
                        $xs={{ right: '22%' }}
                      >
                        <CameraIcon
                          size={70}
                          color="#FFFFFF"
                          primary="#1253D5"
                        />
                      </YStack>
                    ) : null}
                  </YStack>

                  <UploadImage
                    control={control}
                    name="profilePhotoFile"
                    accept={ACCEPT_PROFILE_IMAGE}
                    uploadLabel={t('uploadButton')}
                    hint={t('uploadHint')}
                    icon={
                      <UploadIcon
                        size={20}
                        color="white"
                      />
                    }
                  />
                </YStack>
              </YStack>

              {/* Tips section */}
              <YStack gap="$3">
                <Paragraph
                  fontWeight="600"
                  fontSize={18}
                >
                  {t('tipsTitle')}
                </Paragraph>

                <XStack
                  flexWrap="wrap"
                  gap="$3"
                >
                  {[
                    { key: 'centered', Icon: FocusIcon },
                    { key: 'lighting', Icon: SunIcon },
                    { key: 'expression', Icon: SmileIcon },
                    { key: 'background', Icon: ImageIcon },
                  ].map(({ key, Icon }) => (
                    <Card
                      key={key}
                      flexBasis="48%"
                      minWidth={160}
                      backgroundColor="$backgroundCard"
                      borderRadius="$6"
                      padding="$4"
                      gap="$1.5"
                      borderWidth={1}
                      borderColor="$borderSubtle"
                      $xs={{
                        flexBasis: '100%',
                      }}
                    >
                      <XStack
                        alignItems="center"
                        gap="$2"
                      >
                        <YStack
                          width={32}
                          height={32}
                          borderRadius="$2"
                          backgroundColor="$backgroundMuted"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon
                            size={18}
                            color="#1152D4"
                          />
                        </YStack>
                        <Paragraph
                          fontWeight="600"
                          fontSize={14}
                        >
                          {t(`tips.${key}.title`)}
                        </Paragraph>
                      </XStack>
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        {t(`tips.${key}.description`)}
                      </Text>
                    </Card>
                  ))}
                </XStack>
              </YStack>

              <YStack
                gap="$3"
                paddingTop={20}
              >
                <Paragraph
                  fontSize={35}
                  fontWeight="1000"
                  $xs={{ fontSize: 26 }}
                >
                  {t('identity.title')}
                </Paragraph>
                <Text
                  variant="muted"
                  fontWeight="500"
                  fontSize={15}
                  $xs={{ fontSize: 14 }}
                >
                  {t('identity.subtitle')}
                </Text>
              </YStack>

              {/* Update identity frame */}
              <YStack
                ref={identityCardRef}
                backgroundColor="$backgroundCard"
                borderRadius="$4"
                padding="$6"
                gap="$5"
                borderWidth={1}
                borderColor="$borderSubtle"
                justifyContent="center"
                alignItems="center"
                $xs={{
                  padding: '$4',
                  gap: '$4',
                }}
              >
                {!identity.dataUrl ? (
                  <YStack
                    width="55%"
                    height={250}
                    $xs={{
                      width: '100%',
                      height: 220,
                    }}
                  >
                    <Card
                      padding="$5"
                      borderRadius="$8"
                      borderColor="$borderSubtle"
                      backgroundColor="$backgroundCard"
                    >
                      <SkeletonCard />
                    </Card>
                  </YStack>
                ) : (
                  <YStack
                    width="55%"
                    height={250}
                    borderRadius="$appCard"
                    borderWidth={1}
                    borderColor="$borderSubtle"
                    overflow="hidden"
                    alignItems="center"
                    justifyContent="center"
                    $xs={{
                      width: '100%',
                      height: 220,
                    }}
                  >
                    <img
                      src={identity.dataUrl}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </YStack>
                )}

                <UploadImage
                  control={control}
                  name="identityPhotoFile"
                  accept={ACCEPT_PROFILE_IMAGE}
                  uploadLabel={t('identity.uploadButton')}
                  hint={t('uploadHint')}
                  icon={
                    <UploadIcon
                      size={20}
                      color="white"
                    />
                  }
                />
              </YStack>

              {/* Identity tips section */}
              <YStack gap="$3">
                <Paragraph
                  fontWeight="600"
                  fontSize={18}
                >
                  {t('identity.tipsTitle')}
                </Paragraph>

                <XStack
                  flexWrap="wrap"
                  gap="$3"
                >
                  {[
                    { key: 'clear', Icon: FocusIcon },
                    { key: 'noReflection', Icon: SunIcon },
                    { key: 'fullDocument', Icon: ImageIcon },
                    { key: 'validDocument', Icon: GraduationCapIcon },
                  ].map(({ key, Icon }) => (
                    <Card
                      key={key}
                      flexBasis="48%"
                      minWidth={160}
                      backgroundColor="$backgroundCard"
                      borderRadius="$6"
                      padding="$4"
                      gap="$1.5"
                      borderWidth={1}
                      borderColor="$borderSubtle"
                      $xs={{
                        flexBasis: '100%',
                      }}
                    >
                      <XStack
                        alignItems="center"
                        gap="$2"
                      >
                        <YStack
                          width={32}
                          height={32}
                          borderRadius="$2"
                          backgroundColor="$backgroundMuted"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon
                            size={18}
                            color="#1152D4"
                          />
                        </YStack>
                        <Paragraph
                          fontWeight="600"
                          fontSize={14}
                        >
                          {t(`identity.tips.${key}.title`)}
                        </Paragraph>
                      </XStack>
                      <Text
                        size="sm"
                        variant="muted"
                      >
                        {t(`identity.tips.${key}.description`)}
                      </Text>
                    </Card>
                  ))}
                </XStack>
              </YStack>

              <YStack
                gap="$2"
                paddingTop={20}
              >
                <Paragraph
                  fontSize={34}
                  fontWeight="700"
                >
                  {t('cardTitle')}
                </Paragraph>
                <Text
                  variant="muted"
                  fontSize={15}
                >
                  {t('cardSubtitle')}
                </Text>
              </YStack>

              <YStack
                ref={formCardRef}
                backgroundColor="$backgroundCard"
                borderRadius="$10"
                padding="$6"
                gap="$5"
                borderWidth={1}
                borderColor="$borderSubtle"
              >
                <YStack gap="$4">
                  <XStack
                    gap="$4"
                    $xs={{
                      flexDirection: 'column',
                    }}
                  >
                    <InputField
                      control={control}
                      name="headline"
                      label={t('fields.headlineLabel')}
                      placeholder={t('fields.headlinePlaceholder')}
                      flex={1}
                    />
                    <InputField
                      control={control}
                      name="motivate"
                      label={t('fields.motivateLabel')}
                      placeholder={t('fields.motivatePlaceholder')}
                      flex={1}
                    />
                  </XStack>

                  <InputField
                    control={control}
                    name="introduce"
                    label={t('fields.introduceLabel')}
                    placeholder={t('fields.introducePlaceholder')}
                  />
                </YStack>
              </YStack>
            </Container>
          </YStack>
        </ScrollView>
        <TutorProfileStickyActions>
          <Button
            variant="outline"
            onPress={() => router.push('/become-tutor')}
          >
            {t('back')}
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit(onSaveContinue, onValidationError)}
          >
            {t('saveContinue')}
          </Button>
        </TutorProfileStickyActions>
      </YStack>
    </Screen>
  );
}
