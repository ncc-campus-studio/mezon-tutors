import { useTranslations } from 'next-intl';
import { useTheme } from 'tamagui';
import { useMemo, useState } from 'react';
import { Card, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { DocumentIcon } from '@mezon-tutors/app/ui/icons/DocumentIcon';
import { VerifiedIcon } from '@mezon-tutors/app/ui/icons';
import { getYoutubeEmbedUrl } from '@mezon-tutors/shared';
import type { TutorApplication } from './types';

export type TutorApplicationDetailProps = {
  application: TutorApplication | null;
};

export function TutorApplicationDetail({ application }: TutorApplicationDetailProps) {
  const t = useTranslations('Admin.TutorApplications');
  const theme = useTheme();
  const primaryColor = theme.appPrimary?.val;
  const borderColor = theme.borderColor?.val;

  const youtubeEmbedUrl = useMemo(
    () => getYoutubeEmbedUrl(application?.videoUrl),
    [application?.videoUrl]
  );

  const openInNewTab = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!application) {
    return (
      <Card
        flexBasis={378}
        flexGrow={1}
        backgroundColor="$backgroundCard"
        borderColor={borderColor}
        padding={20}
      >
        <Text style={{ textDecoration: 'none' }}>{t('detail.noSelection')}</Text>
      </Card>
    );
  }

  return (
    <Card
      flexBasis={378}
      flexGrow={1}
      backgroundColor="$backgroundCard"
      borderColor={borderColor}
      padding={0}
      gap={0}
      shadowRadius={0}
      borderRadius={0}
    >
      <YStack
        backgroundColor={primaryColor}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        paddingHorizontal={20}
        paddingTop={16}
        paddingBottom={12}
        gap={4}
      >
        <Text
          fontSize={20}
          fontWeight="700"
          style={{ textDecoration: 'none' }}
          color={'#fff'}
        >
          {t('detail.title')}
        </Text>
        <Text
          size="sm"
          color={'#fff'}
          style={{ textDecoration: 'none' }}
        >
          {t('detail.applicationId')}: {application.id}
        </Text>
      </YStack>

      <YStack
        padding={20}
        gap={16}
        flex={1}
      >
        <XStack
          flexDirection="row"
          alignItems="center"
          gap={12}
        >
          <YStack
            width={40}
            height={40}
            borderRadius={999}
            backgroundColor="$appPrimary"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              size="md"
              fontWeight="700"
            >
              {application.name.charAt(0)}
            </Text>
          </YStack>

          <YStack gap={2}>
            <Text
              fontWeight="600"
              variant="default"
              fontSize={20}
            >
              {application.name}
            </Text>
            <Text
              size="sm"
              variant="muted"
              style={{ textDecoration: 'none' }}
            >
              <VerifiedIcon size={12} />
              {t('detail.verifiedBadge')}
            </Text>
          </YStack>
        </XStack>

        <YStack gap={8}>
          <Text
            size="sm"
            fontWeight="600"
            variant="muted"
            fontSize={16}
          >
            {t('detail.introVideoTitle')}
          </Text>
          {youtubeEmbedUrl ? (
            <YStack
              borderRadius={16}
              backgroundColor="$backgroundMuted"
              borderWidth={1}
              borderColor="$borderColor"
              height={300}
              overflow="hidden"
            >
              <iframe
                src={youtubeEmbedUrl}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </YStack>
          ) : application.videoUrl ? (
            <YStack
              borderRadius={16}
              backgroundColor="$backgroundMuted"
              borderWidth={1}
              borderColor="$borderColor"
              height={300}
              overflow="hidden"
            >
              <video
                style={{ width: '100%', height: '100%', display: 'block' }}
                controls
                autoPlay
                src={application.videoUrl}
              />
            </YStack>
          ) : (
            <Text
              size="sm"
              variant="muted"
            >
              {application.introPreview}
            </Text>
          )}
        </YStack>

        <YStack gap={10}>
          <Text
            size="sm"
            fontWeight="600"
            variant="muted"
            fontSize={16}
          >
            {t('detail.certificatesTitle')}
          </Text>

          <XStack
            gap={8}
            flexWrap="wrap"
          >
            {application.certificates.map((cert) => (
              <XStack
                key={cert.id}
                alignItems="center"
                justifyContent="space-between"
                paddingVertical={8}
                paddingHorizontal={10}
                borderRadius={12}
                backgroundColor="$backgroundMuted"
                borderWidth={3}
                borderColor={borderColor}
                gap={10}
                flexBasis="48%"
              >
                <XStack
                  alignItems="center"
                  gap={10}
                >
                  <DocumentIcon
                    size={22}
                    color={primaryColor}
                  />
                  <YStack gap={2}>
                    <Text
                      size="sm"
                      fontWeight="500"
                      variant="default"
                    >
                      {cert.name}
                    </Text>
                    <Text
                      size="sm"
                      variant="muted"
                    >
                      {cert.size}
                    </Text>
                  </YStack>
                </XStack>
                <Text
                  size="sm"
                  variant="primary"
                  style={{ textDecoration: 'none' }}
                  onPress={() =>
                    openInNewTab(
                      cert.url ??
                        'https://file-examples.com/storage/feff9b7d9e8c2b4a4682b2a/2017/10/file-sample_150kB.pdf'
                    )
                  }
                >
                  {t('detail.viewDocument')}
                </Text>
              </XStack>
            ))}
          </XStack>
        </YStack>
      </YStack>
    </Card>
  );
}
