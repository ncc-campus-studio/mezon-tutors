'use client';

import { useState, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Button, Container, Paragraph, Screen, StatusCard, Text, XStack, YStack, ScrollView, Input } from '@mezon-tutors/app/ui';
import { CircleCheckIcon, CheckIcon, CircleCloseIcon, CloseIcon } from '@mezon-tutors/app/ui/icons';
import { TutorProfileProgress } from './components/tutor-profile-progress';
import { TutorProfileHeader } from './components/tutor-profile-header';
import { TutorProfileStickyActions } from './components/tutor-profile-sticky-actions';
import {
  tutorProfileVideoAtom,
  markStepCompletedAtom,
} from '@mezon-tutors/app/store/tutor-profile.atom';
import { tutorProfileLastSavedAtAtom } from '@mezon-tutors/app/store/tutor-profile.atom';

const VIDEO_CARD_BORDER = '#7DD3FC';
const VIDEO_PREVIEW_WIDTH = 420;

const CURRENT_STEP = 4;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;

type VideoFormValues = {
  videoLink: string;
};

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

function parseYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  const match =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/.exec(
      trimmed
    );
  return match ? match[1] : null;
}

function parseVimeoId(url: string): string | null {
  const trimmed = url.trim();
  const match = /vimeo\.com\/(?:video\/)?(\d+)/.exec(trimmed);
  return match ? match[1] : null;
}

export function TutorProfileVideoScreen() {
  const t = useTranslations('TutorProfile.Video');
  const router = useRouter();
  const [videoState, setVideoState] = useAtom(tutorProfileVideoAtom);
  const [, markStepCompleted] = useAtom(markStepCompletedAtom);
  const { videoLink, videoId } = videoState;
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);
  const videoInputSectionRef = useRef<HTMLDivElement>(null);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);

  const form = useForm<VideoFormValues>({
    defaultValues: {
      videoLink: videoLink ?? '',
    },
    mode: 'onChange',
  });

  const { control, handleSubmit } = form;

  const draftSavedLabel =
    lastSavedAt && formatLastSavedTime(lastSavedAt)
      ? t('draftSaved', { time: formatLastSavedTime(lastSavedAt) })
      : '';

  const successAccent = '#22c55e';
  const dangerAccent = '#f97373';

  const bestPractices = t.raw('bestPractices') as string[];
  const avoidItems = t.raw('avoidItems') as string[];

  const handleAddLink = async (values: VideoFormValues) => {
    setDurationError(null);
    setVideoDuration(null);

    const trimmed = (values.videoLink ?? '').trim();
    if (!trimmed) {
      setDurationError(t('errors.emptyLink'));
      return;
    }

    let nextId: { type: 'youtube' | 'vimeo'; id: string } | null = null;

    const ytId = parseYouTubeId(trimmed);
    if (ytId) {
      nextId = { type: 'youtube', id: ytId };
    } else {
      const vimeoId = parseVimeoId(trimmed);
      if (vimeoId) {
        nextId = { type: 'vimeo', id: vimeoId };
      }
    }

    if (!nextId) {
      setDurationError(t('errors.invalidLink'));
      setVideoState((prev) => ({ ...prev, videoLink: trimmed, videoId: null }));
      return;
    }

    try {
      const res = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`
      );
      if (res.ok) {
        const data = (await res.json()) as { duration?: number };
        const durationSeconds =
          typeof data.duration === 'number' ? data.duration : null;

        if (durationSeconds !== null) {
          setVideoDuration(durationSeconds);
          if (durationSeconds > 120) {
            setDurationError(t('errors.tooLong'));
            setVideoState((prev) => ({ ...prev, videoLink: trimmed, videoId: null }));
            return;
          }
        }
      }
    } catch {
    }

    setVideoState((prev) => ({ ...prev, videoLink: trimmed, videoId: nextId }));
    setLastSavedAt(new Date().toISOString());
  };

  const handleContinue = (values: VideoFormValues) => {
    if (!videoId) {
      setDurationError(t('errors.missingBeforeContinue'));
      videoInputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (videoDuration !== null && videoDuration > 120) {
      setDurationError(t('errors.tooLong'));
      return;
    }
    markStepCompleted(CURRENT_STEP);
    router.push('/become-tutor/availability');
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
          <Container padded maxWidth={960} width="100%" gap="$5" $xs={{ gap: '$4' }}>
            <TutorProfileHeader
              draftSavedLabel={draftSavedLabel}
              saveExitLabel={t('saveExit')}
            />

            <TutorProfileProgress
              currentStepIndex={CURRENT_STEP}
              stepLabel={t('stepLabel')}
              rightLabel={t('progressPercentLabel', { percent: PROGRESS_PERCENT })}
            />

            {/* Title + description */}
            <YStack gap="$2">
              <Paragraph
                fontSize={24}
                fontWeight="700"
              >
                {t('title')}
              </Paragraph>
              <Text variant="muted">{t('subtitle')}</Text>
            </YStack>

            {/* Video + tips */}
            <XStack
              gap="$4"
              flexWrap="wrap"
              $xs={{ flexDirection: 'column' }}
            >
              {/* Left column: video preview + link input (cùng width) */}
              <YStack
                ref={videoInputSectionRef as React.RefObject<unknown>}
                width={VIDEO_PREVIEW_WIDTH}
                gap="$4"
                $xs={{ width: '100%' }}
              >
                {/* Video preview card - border matches accent (light blue) */}
                <YStack
                  width="100%"
                  borderRadius={16}
                  borderWidth={2}
                  borderColor={VIDEO_CARD_BORDER}
                  backgroundColor="$backgroundMuted"
                  overflow="hidden"
                >
                  <YStack
                    aspectRatio={16 / 9}
                    minHeight={180}
                    backgroundColor="$backgroundCard"
                    position="relative"
                  >
                    {videoId ? (
                      <iframe
                        src={
                          videoId.type === 'youtube'
                            ? `https://www.youtube.com/embed/${videoId.id}?rel=0`
                            : `https://player.vimeo.com/video/${videoId.id}?autoplay=0`
                        }
                        title="Profile video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                        }}
                      />
                    ) : (
                      <YStack
                        alignItems="center"
                        justifyContent="center"
                        gap="$2"
                      >
                        {/* Empty placeholder when no video link yet */}
                      </YStack>
                    )}
                  </YStack>
                </YStack>

                <YStack
                  gap="$2"
                  width="100%"
                >
                  <Text
                    size="sm"
                    variant="muted"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    {t('link.label')}
                  </Text>
                  <XStack
                    gap="$2"
                    width="100%"
                    $xs={{
                      flexDirection: 'column',
                    }}
                  >
                    <Controller
                      control={control}
                      name="videoLink"
                      render={({ field: { value, onChange } }) => (
                        <Input
                          flex={1}
                          placeholder={t('link.placeholder')}
                          value={value}
                          onChangeText={onChange}
                          backgroundColor="$fieldBackground"
                          borderColor="$borderSubtle"
                          color="$color"
                          paddingHorizontal="$4"
                          height={48}
                          borderRadius="$5"
                        />
                      )}
                    />
                    <Button
                      variant="primary"
                      onPress={handleSubmit(handleAddLink)}
                    >
                      {t('link.addButton')}
                    </Button>
                  </XStack>
                  {durationError ? (
                    <Text
                      size="sm"
                      color="$red8"
                    >
                      {durationError}
                    </Text>
                  ) : null}
                </YStack>
              </YStack>

              {/* Best practices + avoid */}
              <YStack
                flex={1}
                minWidth={280}
                maxWidth={400}
                gap="$4"
              >
                <StatusCard variant="success">
                  <XStack
                    alignItems="center"
                    gap="$2"
                  >
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={999}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CircleCheckIcon
                        size={24}
                        color={successAccent}
                      />
                    </YStack>
                    <Paragraph
                      fontWeight="700"
                      fontSize={20}
                      color={successAccent}
                    >
                      {t('bestPracticesTitle')}
                    </Paragraph>
                  </XStack>
                  {bestPractices.map((item, index) => (
                    <XStack
                      key={index}
                      alignItems="center"
                      gap="$2"
                    >
                      <CheckIcon
                        size={16}
                        color={successAccent}
                      />
                      <Text
                        size="sm"
                        fontSize={15}
                      >
                        {item}
                      </Text>
                    </XStack>
                  ))}
                </StatusCard>

                <StatusCard variant="danger">
                  <XStack
                    alignItems="center"
                    gap="$2"
                  >
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={999}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CircleCloseIcon
                        size={22}
                        color={dangerAccent}
                      />
                    </YStack>
                    <Paragraph
                      fontWeight="700"
                      fontSize={20}
                      color={dangerAccent}
                    >
                      {t('avoidTitle')}
                    </Paragraph>
                  </XStack>
                  {avoidItems.map((item, index) => (
                    <XStack
                      key={index}
                      alignItems="center"
                      gap="$2"
                    >
                      <CloseIcon
                        size={14}
                        color={dangerAccent}
                      />
                      <Text
                        size="sm"
                        fontSize={16}
                      >
                        {item}
                      </Text>
                    </XStack>
                  ))}
                </StatusCard>
              </YStack>
            </XStack>

            {/* Navigation - moved to sticky bar */}
          </Container>
        </YStack>
      </ScrollView>
      <TutorProfileStickyActions>
        <Button
          variant="outline"
          onPress={() => router.push('/become-tutor/certification')}
        >
          {t('back')}
        </Button>
        <Button
          variant="primary"
          onPress={handleContinue}
        >
          {t('continue')}
        </Button>
      </TutorProfileStickyActions>
      </YStack>
    </Screen>
  );
}
