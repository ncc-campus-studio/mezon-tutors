'use client'

import {
  Screen,
  Container,
  YStack,
  XStack,
  Text,
  Pagination,
  Empty,
  OverlayLoading,
} from '@mezon-tutors/app/ui'
import { PreviewCard } from './components/PreviewCard'
import { TutorsFilter } from './components/TutorsFilter'
import { ECountry, ESubject, VerifiedTutorProfileDto } from '@mezon-tutors/shared'
import { useRef, useState } from 'react'
import { TutorCard } from './components/TutorCard'
import { Select } from '@mezon-tutors/app/ui'
import { ETutorSortBy } from '@mezon-tutors/shared'
import { useGetVerifiedTutors } from '@mezon-tutors/app/services/tutor-profile/tutor-profile.api'
import { useTranslations } from 'next-intl'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMedia, useTheme } from 'tamagui'

const DEFAULT_LIMIT = 10
const PREVIEW_WIDTH = 420
const PREVIEW_ANIM_MS = 400

export function TutorsScreen() {
  const t = useTranslations('Tutors.Screen')
  const tSubject = useTranslations('Tutors.Filter.Subject')

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const media = useMedia()
  const theme = useTheme()
  const showHoverPreview = !media.md

  const [page, setPage] = useState(() => {
    const initialPage = Number(searchParams.get('page') ?? '1')
    if (Number.isNaN(initialPage) || initialPage < 1) return 1
    return initialPage
  })
  const [limit] = useState(() => Number(searchParams.get('limit') ?? String(DEFAULT_LIMIT)))

  const [sortByFilter, setSortByFilter] = useState<ETutorSortBy>(ETutorSortBy.POPULARITY)
  const [subjectFilter, setSubjectFilter] = useState<ESubject>(ESubject.ANY_SUBJECT)
  const [countryFilter, setCountryFilter] = useState<ECountry>(ECountry.ANY_COUNTRY)
  const [priceFilter, setPriceFilter] = useState<string>('')
  const {
    data: verifiedTutorsResponse,
    isLoading,
    isFetching,
  } = useGetVerifiedTutors(page, limit, {
    sortBy: sortByFilter,
    subject: subjectFilter,
    country: countryFilter,
    pricePerLesson: priceFilter,
  })
  const [hoverTutor, setHoverTutor] = useState<VerifiedTutorProfileDto | null>(null)
  const [previewOffsetY, setPreviewOffsetY] = useState(0)
  const listColumnRef = useRef<HTMLElement | null>(null)

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)

    const params = new URLSearchParams(window.location.search)
    params.set('page', String(nextPage))
    params.set('limit', String(limit))

    window.history.replaceState({}, '', `${pathname}?${params.toString()}`)

    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handleSortChange = (value: string) => {
    setSortByFilter(value as ETutorSortBy)
    setPage(1)
    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handleSubjectChange = (value: ESubject) => {
    setSubjectFilter(value)
    setPage(1)
    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handleCountryChange = (value: ECountry) => {
    setCountryFilter(value)
    setPage(1)
    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handlePriceChange = (value: string) => {
    setPriceFilter(value)
    setPage(1)
    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handleTutorCardHover = (tutor: VerifiedTutorProfileDto, el: HTMLElement) => {
    setHoverTutor(tutor)
    const anchor = listColumnRef.current
    if (!anchor) return
    const y = el.getBoundingClientRect().top - anchor.getBoundingClientRect().top
    setPreviewOffsetY(Number.isFinite(y) ? Math.max(0, y) : 0)
  }

  const totalTutors = verifiedTutorsResponse?.meta.total ?? 0
  const totalPages = verifiedTutorsResponse?.meta.totalPages ?? 1
  const items = verifiedTutorsResponse?.items ?? []
  const showInitialLoading = isLoading && !verifiedTutorsResponse

  return (
    <Screen
      paddingHorizontal="$8"
      backgroundColor={theme.tutorsPageBackground?.get() ?? '$background'}
    >
      <YStack flex={1}>
        <Container padded paddingTop="$4" paddingBottom="$6" gap="$4">
          <TutorsFilter
            subject={subjectFilter}
            country={countryFilter}
            pricePerLesson={priceFilter}
            onSubjectChange={handleSubjectChange}
            onCountryChange={handleCountryChange}
            onPricePerLessonChange={handlePriceChange}
          />
          <XStack gap="$8" flexDirection="row" alignItems="flex-start" width="100%">
            <YStack width="100%" minHeight="60vh" height="auto" gap="$3" position="relative">
              <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$2">
                <Text variant="muted">
                  {subjectFilter === ESubject.ANY_SUBJECT
                    ? t('totalLabelNoSubject', { count: totalTutors })
                    : t('totalLabel', {
                        count: totalTutors,
                        subject: tSubject(subjectFilter),
                      })}
                </Text>
                <XStack gap="$2" alignItems="center">
                  <Text variant="muted">{t('sortBy')}</Text>
                  <Select
                    value={sortByFilter}
                    onValueChange={handleSortChange}
                    options={(Object.values(ETutorSortBy) as ETutorSortBy[]).map((value) => ({
                      label: t(value),
                      value: value as string,
                    }))}
                  />
                </XStack>
              </XStack>

              <XStack position="relative" width="100%" gap="$5" alignItems="flex-start">
                <YStack
                  ref={(node) => {
                    listColumnRef.current = node as unknown as HTMLElement | null
                  }}
                  flex={1}
                  minWidth={0}
                  gap="$3"
                  $gtMd={{
                    width: showHoverPreview && !hoverTutor ? '70%' : '100%',
                    flex: 0,
                  }}
                >
                  {showInitialLoading ? (
                    <YStack
                      flex={1}
                      justifyContent="center"
                      alignItems="center"
                      padding={24}
                      gap="$2"
                    >
                      <Text variant="default">{t('loading')}</Text>
                    </YStack>
                  ) : items.length === 0 ? (
                    <Empty title={t('empty')} />
                  ) : (
                    items.map((tutor) => (
                      <YStack key={tutor.id}>
                        <TutorCard
                          tutor={tutor}
                          onHover={showHoverPreview ? handleTutorCardHover : undefined}
                          isActive={hoverTutor?.id === tutor.id}
                        />
                      </YStack>
                    ))
                  )}
                </YStack>

                {showHoverPreview && !showInitialLoading && items.length > 0 && (
                  <YStack width={PREVIEW_WIDTH} flexShrink={0}>
                    {hoverTutor ? (
                      <YStack
                        style={{
                          transform: `translate3d(0, ${previewOffsetY}px, 0)`,
                          transition: `transform ${PREVIEW_ANIM_MS}ms ease`,
                          willChange: 'transform',
                        }}
                      >
                        <PreviewCard tutor={hoverTutor} isPopularWeek={false} />
                      </YStack>
                    ) : null}
                  </YStack>
                )}
              </XStack>

              <OverlayLoading isOpen={isFetching && items.length === 0 && !showInitialLoading} />

              <XStack justifyContent="center" alignItems="center" paddingTop="$4">
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </XStack>
            </YStack>
          </XStack>
        </Container>
      </YStack>
    </Screen>
  )
}
