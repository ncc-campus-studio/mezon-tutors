'use client';

import { useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
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
  Select,
} from '@mezon-tutors/app/ui';
import { ShieldCheckIcon } from '@mezon-tutors/app/ui/icons/ShieldCheckIcon';
import { TutorProfileProgress } from './components/tutor-profile-progress';
import {
  ECountry,
  ELanguage,
  ESubject,
  EProficiencyLevel,
  joinLanguagesArray,
  parseLanguagesString,
  formatLastSavedTime,
  
  VIETNAM_PHONE_REGEX,
} from '@mezon-tutors/shared';
import {
  tutorProfileAboutAtom,
  markStepCompletedAtom,
} from '@mezon-tutors/app/store/tutor-profile.atom';
import { tutorProfileLastSavedAtAtom } from '@mezon-tutors/app/store/tutor-profile.atom';
import { ArrowRightIcon } from '@mezon-tutors/app/ui/icons';
import { TutorProfileHeader } from './components/tutor-profile-header';
import { TutorProfileStickyActions } from './components/tutor-profile-sticky-actions';
import { z } from 'zod';

const CURRENT_STEP = 1;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;

function parseProficienciesString(value: string): string[] {
  if (!value || !value.trim()) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinProficienciesArray(proficiencies: string[]): string {
  return proficiencies.filter(Boolean).join(', ');
}

export function TutorProfileAboutScreen() {
  const t = useTranslations('TutorProfile.About');
  const tCountry = useTranslations('Tutors.Filter.Country');
  const tSubject = useTranslations('Tutors.Filter.Subject');
  const tLanguage = useTranslations('Tutors.Filter.Language');
  const tProficiency = useTranslations('Tutors.Filter.Proficiency');

  const router = useRouter();
  const [about, setAbout] = useAtom(tutorProfileAboutAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);

  const aboutSchema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(1, t('validation.firstNameRequired')),
        lastName: z.string().min(1, t('validation.lastNameRequired')),
        email: z.string().email(t('validation.emailInvalid')),
        country: z
          .string()
          .min(1, t('validation.countryRequired'))
          .refine((v) => (Object.values(ECountry) as readonly string[]).includes(v), {
            message: t('validation.countryFromList'),
          }),
        phone: z
          .string()
          .min(1, t('validation.phoneRequired'))
          .transform((value) => value.replace(/[\s-]/g, ''))
          .refine(
            (value) => VIETNAM_PHONE_REGEX.test(value),
            { message: t('validation.phoneInvalid') },
          ),
        subject: z
          .string()
          .min(1, t('validation.subjectRequired'))
          .refine((v) => (Object.values(ESubject) as readonly string[]).includes(v), {
            message: t('validation.subjectFromList'),
          }),
        languageEntries: z
          .array(
            z.object({
              language: z
                .string()
                .refine((v) => !v || (Object.values(ELanguage) as readonly string[]).includes(v), {
                  message: t('validation.languagesFromList'),
                }),
              proficiency: z
                .string()
                .refine((v) => !v || (Object.values(EProficiencyLevel) as readonly string[]).includes(v), {
                  message: t('validation.proficiencyFromList'),
                }),
            })
          )
          .superRefine((arr, ctx) => {
            const hasAnyCompletePair = arr.some((e) => e.language && e.proficiency);

            if (!hasAnyCompletePair) {
              const idx = arr.findIndex((e) => !e.language || !e.proficiency) ?? 0;
              const entry = arr[idx] ?? { language: '', proficiency: '' };

              if (!entry.language) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [idx, 'language'],
                  message: t('validation.languagesRequired'),
                });
              }

              if (!entry.proficiency) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [idx, 'proficiency'],
                  message: t('validation.proficiencyRequired'),
                });
              }

              return;
            }

            arr.forEach((entry, idx) => {
              const hasAnyValue = entry.language || entry.proficiency;
              if (!hasAnyValue) return;

              if (!entry.language) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [idx, 'language'],
                  message: t('validation.languagesRequired'),
                });
              }

              if (!entry.proficiency) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [idx, 'proficiency'],
                  message: t('validation.proficiencyRequired'),
                });
              }
            });
          }),
      }),
    [t]
  );

  type AboutFormValues = z.infer<typeof aboutSchema>;

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

  const parsedLangs = about.languages?.trim() ? parseLanguagesString(about.languages) : [];
  const parsedProfs = about.proficiencies?.trim()
    ? parseProficienciesString(about.proficiencies)
    : [];

  const initialEntries: { language: string; proficiency: string }[] =
    parsedLangs.length > 0
      ? parsedLangs.map((lang, i) => ({
          language: lang,
          proficiency: parsedProfs[i] ?? '',
        }))
      : [{ language: '', proficiency: '' }];

  const form = useForm<AboutFormValues>({
    defaultValues: {
      firstName: about.firstName,
      lastName: about.lastName,
      email: about.email,
      country: about.country,
      phone: about.phone,
      subject: about.subject,
      languageEntries: initialEntries,
    },
    resolver: zodResolver(aboutSchema),
    mode: 'onChange',
  });

  const { control, handleSubmit, setFocus } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'languageEntries' });
  const formCardRef = useRef<HTMLDivElement | null>(null);

  // Sync form when atom updates (e.g. rehydration from storage or navigate back)
  useEffect(() => {
    const parsedLangs = about.languages?.trim() ? parseLanguagesString(about.languages) : [];
    const parsedProfs = about.proficiencies?.trim()
      ? parseProficienciesString(about.proficiencies)
      : [];
    const entries =
      parsedLangs.length > 0
        ? parsedLangs.map((lang, i) => ({
            language: lang,
            proficiency: parsedProfs[i] ?? '',
          }))
        : [{ language: '', proficiency: '' }];
    form.reset({
      firstName: about.firstName,
      lastName: about.lastName,
      email: about.email,
      country: about.country,
      phone: about.phone,
      subject: about.subject,
      languageEntries: entries,
    });
  }, [
    about.firstName,
    about.lastName,
    about.email,
    about.country,
    about.phone,
    about.subject,
    about.languages,
    about.proficiencies,
  ]);

  const onSubmit = (values: AboutFormValues) => {
    const entries = values.languageEntries.filter((e) => e.language && e.proficiency);
    const { languageEntries: _e, ...rest } = values;
    setAbout({
      ...rest,
      languages: joinLanguagesArray(entries.map((e) => e.language)),
      proficiencies: joinProficienciesArray(entries.map((e) => e.proficiency)),
    });
    setLastSavedAt(new Date().toISOString());
    markStepCompleted(CURRENT_STEP);
    router.push('/become-tutor/photo');
  };

  const onValidationError = (errors: Record<string, unknown>) => {
    formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const firstError = Object.keys(errors)[0] as keyof AboutFormValues | undefined;
    if (firstError) setFocus(firstError);
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
                caption={t('nextLabel')}
              />

              <YStack
                ref={formCardRef}
                backgroundColor="$backgroundCard"
                borderRadius="$10"
                padding="$6"
                gap="$5"
                borderWidth={1}
                borderColor="$borderSubtle"
                $xs={{ padding: '$4', gap: '$4' }}
              >
                <YStack gap="$2">
                  <Paragraph
                    fontSize={24}
                    fontWeight="700"
                  >
                    {t('title')}
                  </Paragraph>
                  <Text variant="muted">{t('subtitle')}</Text>
                </YStack>

                <YStack gap="$4">
                  <XStack
                    gap="$4"
                    $xs={{
                      flexDirection: 'column',
                    }}
                  >
                    <InputField
                      control={control}
                      name="firstName"
                      label={t('fields.firstNameLabel')}
                      placeholder={t('fields.firstNamePlaceholder')}
                      flex={1}
                    />
                    <InputField
                      control={control}
                      name="lastName"
                      label={t('fields.lastNameLabel')}
                      placeholder={t('fields.lastNamePlaceholder')}
                      flex={1}
                    />
                  </XStack>

                  <InputField
                    control={control}
                    name="email"
                    label={t('fields.emailLabel')}
                    placeholder={t('fields.emailPlaceholder')}
                  />

                  <XStack
                    gap="$4"
                    flexDirection="row"
                  >
                    <Select
                      control={control}
                      name="country"
                      label={t('fields.countryLabel')}
                      options={Object.values(ECountry).slice(1).map((country) => ({
                        label: tCountry(country),
                        value: country as string,
                      }))}
                      flex={1}
                      width="100%"
                    />
                    <YStack flex={1} width="100%">
                      <InputField
                        control={control}
                        name="phone"
                        label={t('fields.phoneLabel')}
                        placeholder={t('fields.phonePlaceholder')}
                      />
                    </YStack>
                  </XStack>

                  <Select
                    control={control}
                    name="subject"
                    label={t('fields.subjectLabel')}
                    placeholder={t('fields.subjectPlaceholder')}
                    helperText={t('fields.subjectHelper')}
                    width="100%"
                    options={Object.values(ESubject).slice(1).map((value) => ({
                      label: tSubject(value),
                      value: value,
                    }))}
                  />

                  <YStack gap="$3">
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                      gap="$2"
                    >
                      <Text
                        color="$colorMuted"
                        fontSize={13}
                      >
                        {t('fields.languagesLabel')}
                      </Text>
                      <XStack
                        cursor="pointer"
                        onPress={() => append({ language: '', proficiency: '' })}
                        alignItems="center"
                        gap="$1"
                        hoverStyle={{ opacity: 0.8 }}
                      >
                        <Text
                          fontSize={14}
                          color="$appPrimary"
                        >
                          + {t('addAnotherLanguage')}
                        </Text>
                      </XStack>
                    </XStack>
                    {fields.map((field, index) => (
                      <XStack
                        key={field.id}
                        gap="$3"
                        alignItems="flex-start"
                        $xs={{
                          flexDirection: 'column',
                          alignItems: 'stretch',
                        }}
                      >
                        <Select
                          control={control}
                          name={`languageEntries.${index}.language`}
                          label={t('fields.languageLabel')}
                          placeholder={t('fields.languagesPlaceholder')}
                          width="100%"
                          options={Object.values(ELanguage).slice(1).map((language) => ({
                            label: tLanguage(language),
                            value: language,
                          }))}
                          flex={1}
                        />
                        <Select
                          control={control}
                          name={`languageEntries.${index}.proficiency`}
                          label={t('fields.proficiencyLabel')}
                          placeholder={t('fields.proficiencyPlaceholder')}
                          width="100%"
                          options={Object.values(EProficiencyLevel).map((proficiency) => ({
                            label: tProficiency(proficiency),
                            value: proficiency,
                          }))}
                          flex={1}
                        />
                        {fields.length > 1 ? (
                          <YStack
                            gap="$1"
                            flexShrink={0}
                            alignSelf="flex-start"
                            $xs={{ alignSelf: 'stretch' }}
                          >
                            <Text
                              fontSize="$3"
                              fontWeight="500"
                              color="$colorMuted"
                              opacity={0}
                              pointerEvents="none"
                              userSelect="none"
                              aria-hidden
                              numberOfLines={1}
                              $xs={{ display: 'none' }}
                            >
                              {t('fields.languageLabel')}
                            </Text>
                            <Button
                              variant="outline"
                              onPress={() => remove(index)}
                              $xs={{ alignSelf: 'center' }}
                            >
                              {t('removeLanguage')}
                            </Button>
                          </YStack>
                        ) : null}
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              </YStack>

              <YStack
                backgroundColor="$backgroundCard"
                borderRadius="$10"
                padding="$4"
                borderWidth={1}
                borderColor="$borderSubtle"
                $xs={{ padding: '$3' }}
              >
                <XStack
                  alignItems="center"
                  gap="$3"
                  $xs={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <ShieldCheckIcon
                    size={60}
                    primary="rgba(17,82,212,0.2)"
                    color="rgba(17,82,212,1)"
                  />
                  <YStack
                    gap="$1"
                    flex={1}
                  >
                    <Paragraph
                      fontWeight="600"
                      fontSize={16}
                    >
                      {t('privacyTitle')}
                    </Paragraph>
                    <Text variant="muted">{t('privacyDescription')}</Text>
                  </YStack>
                </XStack>
              </YStack>
            </Container>
          </YStack>
        </ScrollView>
        <TutorProfileStickyActions>
          <XStack flex={1} />
          <Button
            variant="primary"
            onPress={handleSubmit(onSubmit, onValidationError)}
          >
            {t('continue')}
            <ArrowRightIcon
              size={15}
              primary="rgba(17,82,212,0.2)"
              color="#ffffff"
            />
          </Button>
        </TutorProfileStickyActions>
      </YStack>
    </Screen>
  );
}
