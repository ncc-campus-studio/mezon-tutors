'use client';

import { useTranslations } from 'next-intl';
import {
  Button,
  Container,
  Paragraph,
  Screen,
  Text,
  XStack,
  YStack,
  ScrollView,
  InfoCard,
} from '@mezon-tutors/app/ui';
import { CircleCheckIcon, ClockCircleIcon, InfoIcon, MailIcon } from '@mezon-tutors/app/ui/icons';

export function TutorProfileCompletionScreen() {
  const t = useTranslations('TutorProfile.Completion');
  const footerLinks = t.raw('footer.links') as string[];

  return (
    <Screen backgroundColor="$background">
      <ScrollView
        flex={1}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <YStack
          flex={1}
          paddingVertical="$6"
          paddingHorizontal="$0"
          $xs={{ paddingVertical: '$4', paddingHorizontal: '$3' }}
          backgroundColor="$background"
          justifyContent="center"
        >
          <Container padded maxWidth={960} width="100%" gap="$6" $xs={{ gap: '$4' }}>
            <YStack alignItems="center" gap="$4">
              <YStack
                width={112}
                height={112}
                borderRadius={999}
                backgroundColor="$appPrimary"
                alignItems="center"
                justifyContent="center"
                shadowColor="rgba(56, 189, 248, 0.6)"
                shadowRadius={40}
                shadowOffset={{ width: 0, height: 18 }}
              >
                <CircleCheckIcon color="#ffffff" size={56} />
              </YStack>

              <YStack
                gap="$2"
                alignItems="center"
                padding={10}
              >
                <Paragraph
                  fontSize={28}
                  fontWeight="700"
                  textAlign="center"
                >
                  {t('title')}
                </Paragraph>
                <Text
                  variant="muted"
                  textAlign="center"
                  maxWidth={560}
                  fontSize={16}
                  padding={10}
                >
                  {t('subtitle')}
                </Text>
              </YStack>

              <XStack
                gap="$3"
                flexWrap="wrap"
                justifyContent="center"
              >
                <InfoCard
                  title={t('reviewPeriodTitle')}
                  value={t('reviewPeriodValue')}
                  icon={
                    <ClockCircleIcon
                      size={28}
                      color="#7DD3FC"
                    />
                  }
                />
                <InfoCard
                  title={t('notificationTitle')}
                  value={t('notificationValue')}
                  icon={
                    <MailIcon
                      size={28}
                      color="#A855F7"
                    />
                  }
                />
              </XStack>

              <XStack
                gap="$3"
                flexWrap="wrap"
                justifyContent="center"
                $xs={{ flexDirection: 'column', alignItems: 'stretch' }}
              >
                <Button
                  variant="primary"
                  size="$5"
                >
                  {t('primaryCta')}
                </Button>
                <Button
                  variant="ghost"
                  size="$5"
                >
                  {t('secondaryCta')}
                </Button>
              </XStack>

              <XStack
                alignItems="center"
                justifyContent="center"
                gap="$2"
              >
                <InfoIcon
                  size={16}
                  color="#9CA3AF"
                />
                <Text
                  size="sm"
                  variant="muted"
                  textAlign="center"
                >
                  {t('helpText')}
                </Text>
              </XStack>
            </YStack>
          </Container>
        </YStack>
      </ScrollView>
    </Screen>
  );
}
