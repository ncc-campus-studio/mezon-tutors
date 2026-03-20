'use client';

import { Paragraph, Separator, Text, YStack, XStack, Card } from '@mezon-tutors/app/ui';
import {
  CalendarIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  PersonalIcon,
  VideoIcon,
} from '@mezon-tutors/app/ui/icons';
import { useTranslations } from 'next-intl';
import { useTheme } from 'tamagui';
import { useMemo, useState } from 'react';
import { DocumentIcon } from '@mezon-tutors/app/ui/icons/DocumentIcon';

import {
  type FullTutorApplication,
  getYoutubeEmbedUrl,
} from '@mezon-tutors/shared';
import { StatusBadge } from '@mezon-tutors/app/ui/StatusBadge';

const dayKeys = ['0', '1', '2', '3', '4', '5', '6'];

export function FullApplicationTab({ fullData }: { fullData: FullTutorApplication }) {
  const { profile, professionalDocuments, availability } = fullData;
  const t = useTranslations('AdminTutorApplications.Detail');
  const theme = useTheme();
  const priceCardBg = theme.priceCardBg?.val;
  const priceCardBorder = theme.priceCardBorder?.val;
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const weeklySchedule = useMemo(() => {
    return dayKeys
      .map((key, index) => {
        const slots = availability?.filter((s) => s.dayOfWeek === index && s.isActive);
        if (!slots || slots.length === 0) return null;
        return {
          label: t(`sections.availability.days.${key}`),
          times: slots.map((s) => `${s.startTime} - ${s.endTime}`),
        };
      })
      .filter((item): item is { label: string; times: string[] } => item !== null);
  }, [availability, t]);

  const youtubeEmbedUrl = useMemo(
    () => getYoutubeEmbedUrl(profile.videoUrl),
    [profile.videoUrl]
  );

  return (
    <>
      <Card
        padding="$5"
        borderRadius="$8"
        backgroundColor="$backgroundCard"
      >
        <YStack gap="$4">
          <XStack
            alignItems="center"
            gap="$2"
          >
            <PersonalIcon size={18} />
            <Paragraph
              fontSize={18}
              fontWeight="700"
            >
              {t('sections.personalInfo.title')}
            </Paragraph>
          </XStack>
          <Separator />
          <YStack gap="$3">
            <XStack
              gap="$6"
              flexWrap="wrap"
            >
              <YStack
                gap="$1"
                minWidth={180}
              >
                <Text variant="muted">{t('sections.personalInfo.fullName')}</Text>
                <Text>{profile.firstName} {profile.lastName}</Text>
              </YStack>
              <YStack
                gap="$1"
                minWidth={220}
              >
                <Text variant="muted">{t('sections.personalInfo.email')}</Text>
                <Text>{profile.email}</Text>
              </YStack>
            </XStack>
            <XStack
              gap="$6"
              flexWrap="wrap"
            >
              <YStack
                gap="$1"
                minWidth={180}
              >
                <Text variant="muted">{t('sections.personalInfo.phone')}</Text>
                <Text>{profile.phone}</Text>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </Card>

      <Card
        padding="$5"
        borderRadius="$8"
        backgroundColor="$backgroundCard"
      >
        <YStack gap="$4">
          <XStack
            gap={'$2'}
            alignItems="center"
          >
            <VideoIcon size={20} />
            <Paragraph
              fontSize={18}
              fontWeight="700"
            >
              {t('sections.videoBio.title')}
            </Paragraph>
          </XStack>

          <XStack
            gap="$4"
            $xs={{ flexDirection: 'column' }}
          >
            <YStack
              flex={1}
              flexBasis="50%"
              minHeight={260}
              borderRadius="$6"
              overflow="hidden"
              backgroundColor="$backgroundMuted"
              borderWidth={1}
              borderColor="$borderSubtle"
            >
              {profile.videoUrl && isVideoPlaying ? (
                <YStack flex={1}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={youtubeEmbedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </YStack>
              ) : (
                <YStack
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  gap="$3"
                  cursor={profile.videoUrl ? 'pointer' : 'default'}
                  onPress={profile.videoUrl ? () => setIsVideoPlaying(true) : undefined}
                >
                  <YStack
                    width={64}
                    height={64}
                    borderRadius={999}
                    backgroundColor="$appSecondary"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VideoIcon size={26} />
                  </YStack>
                  <Text fontWeight="600">{t('sections.videoBio.videoPlaceholder')}</Text>
                  <Text
                    size="sm"
                    variant="muted"
                  >
                    {t('sections.videoBio.clickToPlay')}
                  </Text>
                </YStack>
              )}
            </YStack>
            <YStack
              flex={1}
              flexBasis="50%"
              gap="$2"
            >
              <Text variant="muted">{t('sections.videoBio.aboutLabel')}</Text>
              <Paragraph>{profile.introduce}</Paragraph>
            </YStack>
          </XStack>
        </YStack>
      </Card>

      <Card
        padding="$5"
        borderRadius="$8"
        backgroundColor="$backgroundCard"
      >
        <YStack gap="$4">
          <XStack
            alignItems="center"
            gap="$2"
          >
            <GraduationCapIcon
              size={22}
              color="#1152D4"
            />
            <Paragraph
              fontSize={18}
              fontWeight="700"
            >
              {t('sections.education.title')}
            </Paragraph>
          </XStack>

          <YStack gap="$3">
            {professionalDocuments.map((item) => (
              <YStack
                key={item.id}
                backgroundColor="$backgroundMuted"
                borderRadius="$7"
                padding="$4"
                gap="$2"
              >
                <XStack
                  alignItems="center"
                  gap="$3"
                >
                  <DocumentIcon
                    size={24}
                    color="$appPrimary"
                  />
                  <YStack
                    gap="$1"
                    flex={1}
                  >
                    <XStack
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <YStack gap="$1">
                        <XStack
                          alignItems="center"
                          gap={'$2'}
                        >
                          <Text
                            fontWeight="600"
                            fontSize={16}
                          >
                            {item.name}
                          </Text>
                          <StatusBadge status={item.status} />
                        </XStack>

                        <Text
                          variant="muted"
                          fontSize={14}
                        >
                          {item.type}
                        </Text>
                      </YStack>
                    </XStack>
                    <XStack
                      alignItems="center"
                      gap="$2"
                      marginTop="$2"
                      alignSelf="flex-start"
                      onPress={() => {
                        if (item.fileKey) {
                          window.open(item.fileKey, '_blank');
                        }
                      }}
                      cursor="pointer"
                    >
                      <Text
                        fontWeight="600"
                        color="$appPrimary"
                        fontSize={14}
                      >
                        {t('sections.education.verifyCredential')}
                      </Text>
                      <ExternalLinkIcon size={14} />
                    </XStack>
                  </YStack>
                </XStack>
              </YStack>
            ))}
          </YStack>
        </YStack>
      </Card>

      <Card
        padding="$5"
        borderRadius="$8"
        backgroundColor="$backgroundCard"
      >
        <YStack gap="$4">
          <XStack
            alignItems="center"
            gap="$2"
          >
            <CalendarIcon size={22} />
            <Paragraph
              fontSize={18}
              fontWeight="700"
            >
              {t('sections.availability.title')}
            </Paragraph>
          </XStack>
          <XStack
            gap="$4"
            $xs={{ flexDirection: 'column' }}
          >
            <YStack
              flex={1}
              gap="$2"
            >
              <Text variant="muted">{t('sections.availability.weeklySchedule')}</Text>

              {weeklySchedule.map((slot) => (
                <XStack
                  key={slot.label}
                  justifyContent="space-between"
                  alignItems="flex-start"
                  paddingVertical="$1"
                >
                  <Text width={100}>{slot.label}</Text>
                  <YStack
                    flex={1}
                    alignItems="flex-end"
                    gap="$1"
                  >
                    {slot.times.map((time, i) => (
                      <Text
                        key={i}
                        variant="default"
                        fontWeight={'600'}
                        textAlign="right"
                      >
                        {time}
                      </Text>
                    ))}
                  </YStack>
                </XStack>
              ))}
            </YStack>
            <Separator vertical />
            <YStack
              flex={1}
              gap="$2"
            >
              <Card
                padding="$4"
                borderRadius="$7"
                backgroundColor={priceCardBg}
                borderWidth={1}
                borderColor={priceCardBorder}
              >
                <Text
                  color="$blue8"
                  fontWeight="600"
                  textTransform="uppercase"
                >
                  {t('sections.availability.requestedRate')}
                </Text>
                <Paragraph
                  fontSize={28}
                  fontWeight="700"
                  marginTop="$2"
                >
                  ${profile.pricePerHour} {t('sections.availability.perHour')}
                </Paragraph>
                <XStack
                  marginTop="$2"
                  flexWrap="wrap"
                  gap={'$1'}
                >
                  <Text
                    size="sm"
                    variant="muted"
                  >
                    {t('sections.availability.recommendationPrefix')}
                  </Text>
                  <Text
                    size="sm"
                    fontWeight="700"
                    color="$green6"
                  >
                    N/A
                  </Text>
                  <Text
                    size="sm"
                    variant="muted"
                  >
                    {t('sections.availability.recommendationSuffix')}
                  </Text>
                </XStack>
              </Card>
            </YStack>
          </XStack>
        </YStack>
      </Card>
    </>
  );
}
