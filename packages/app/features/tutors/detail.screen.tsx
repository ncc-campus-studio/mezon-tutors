'use client'

import { ComponentType, useMemo, useState } from 'react'
import { useParams } from 'solito/navigation'
import { useTranslations } from 'next-intl'
import { Container, Empty, Screen, ScrollView, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import {
  useGetVerifiedTutorAbout,
  useGetVerifiedTutorSchedule,
  useGetVerifiedTutorReviews,
  useGetVerifiedTutorResources,
} from '@mezon-tutors/app/services/tutor-profile/tutor-profile.api'
import { TUTOR_DETAIL_DEFAULT_TAB } from '@mezon-tutors/shared'
import { useMedia } from 'tamagui'
import { TutorAboutTab } from './components/detail/TutorAboutTab'
import { TutorDetailHeader } from './components/detail/TutorDetailHeader'
import { TutorDetailSidebar } from './components/detail/TutorDetailSidebar'
import { TutorResourcesTab } from './components/detail/TutorResourcesTab'
import { TutorReviewsTab } from './components/detail/TutorReviewsTab'
import { TutorScheduleTab } from './components/detail/TutorScheduleTab'
import { TutorDetailTab } from './components/detail/types'

const PAGE_MAX_WIDTH = 1320
const SIDEBAR_WIDTH = 320
const PAGE_BOTTOM_PADDING = 24

export function TutorDetailScreen() {
  const t = useTranslations('Tutors.Detail')
  const { id } = useParams<{ id: string }>()
  const media = useMedia()
  const tutorId = useMemo(() => (typeof id === 'string' ? id.trim() : ''), [id])
  const [activeTab, setActiveTab] = useState<TutorDetailTab>(TUTOR_DETAIL_DEFAULT_TAB)
  const isInvalidTutorId = !tutorId

  const { data: aboutData, isLoading: isLoadingAbout, isError: isErrorAbout } = useGetVerifiedTutorAbout(tutorId)
  const { data: scheduleData, isLoading: isLoadingSchedule } = useGetVerifiedTutorSchedule(tutorId, activeTab === 'schedule')
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetVerifiedTutorReviews(tutorId, activeTab === 'reviews')
  const { data: resourcesData, isLoading: isLoadingResources } = useGetVerifiedTutorResources(tutorId, activeTab === 'resources')

  const shouldShowEmpty = isInvalidTutorId || isErrorAbout || (!isLoadingAbout && !aboutData)
  const isLoading = isLoadingAbout

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return aboutData ? <TutorAboutTab tutor={aboutData} /> : null
      case 'schedule':
        if (isLoadingSchedule) {
          return <Text color="$tutorsDetailSecondaryText">{t('loading')}</Text>
        }
        return aboutData && scheduleData ? (
          <TutorScheduleTab tutor={{ ...aboutData, availability: scheduleData.availability }} />
        ) : null
      case 'reviews':
        if (isLoadingReviews) {
          return <Text color="$tutorsDetailSecondaryText">{t('loading')}</Text>
        }
        return aboutData && reviewsData ? (
          <TutorReviewsTab
            tutor={{
              ...aboutData,
              reviews: reviewsData.reviews,
              ratingCount: reviewsData.ratingCount,
              ratingAverage: reviewsData.ratingAverage,
            }}
          />
        ) : null
      case 'resources':
        if (isLoadingResources) {
          return <Text color="$tutorsDetailSecondaryText">{t('loading')}</Text>
        }
        return aboutData && resourcesData ? (
          <TutorResourcesTab tutor={{ ...aboutData, resources: resourcesData.resources }} />
        ) : null
      default:
        return null
    }
  }

  return (
    <Screen backgroundColor="$tutorsPageBackground">
      <ScrollView flex={1} contentContainerStyle={{ paddingBottom: PAGE_BOTTOM_PADDING }}>
        <Container padded flex={0} width="100%" maxWidth={PAGE_MAX_WIDTH} marginHorizontal="auto" paddingVertical="$4">
          {isLoading ? (
            <YStack
              width="100%"
              minHeight={260}
              backgroundColor="$tutorsDetailCardBackground"
              borderRadius={16}
              borderWidth={1}
              borderColor="$tutorsDetailCardBorder"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="$tutorsDetailSecondaryText">{t('loading')}</Text>
            </YStack>
          ) : null}

          {shouldShowEmpty ? (
            <YStack paddingTop="$4">
              <Empty title={t('notFound')} />
            </YStack>
          ) : null}

          {aboutData ? (
            <XStack
              width="100%"
              gap="$4"
              flexDirection={media.md ? 'column' : 'row'}
              alignItems="flex-start"
            >
              <YStack flex={1} gap="$4" width="100%">
                <TutorDetailHeader tutor={aboutData} activeTab={activeTab} onTabChange={setActiveTab} />

                <YStack
                  backgroundColor="$tutorsDetailCardBackground"
                  borderWidth={1}
                  borderColor="$tutorsDetailCardBorder"
                  borderRadius={18}
                  padding="$4"
                >
                  {renderTabContent()}
                </YStack>
              </YStack>

              <YStack width={media.md ? '100%' : SIDEBAR_WIDTH}>
                <TutorDetailSidebar tutor={aboutData} />
              </YStack>
            </XStack>
          ) : null}
        </Container>
      </ScrollView>
    </Screen>
  )
}
