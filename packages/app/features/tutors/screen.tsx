'use client'

import { Screen, Container, YStack, XStack, Text, Pagination, Empty, OverlayLoading } from '@mezon-tutors/app/ui'
import { PreviewCard } from './components/PreviewCard'
import { TutorsFilter } from './components/TutorsFilter'
import { ECountry, ESubject, VerifiedTutorProfileDto } from '@mezon-tutors/shared'
import { useMemo, useRef, useState } from 'react'
import { TutorCard } from './components/TutorCard'
import { Select } from '@mezon-tutors/app/ui'
import { ETutorSortBy } from '@mezon-tutors/shared'
import { useGetVerifiedTutors } from '@mezon-tutors/app/services/tutor-profile/tutor-profile.api'
import { useTranslations } from 'next-intl'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMedia, useTheme } from 'tamagui'

const DEFAULT_LIMIT = 10
const PREVIEW_GAP = 32
const PREVIEW_WIDTH = 420
const PREVIEW_ANIM_MS = 400

export function TutorsScreen() {
  const t = useTranslations('Tutors.Screen')
  const tFilter = useTranslations('Tutors.Filter')
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
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const listRef = useRef<HTMLElement | null>(null)

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(nextPage))
    params.set('limit', String(limit))
  
    window.history.replaceState({}, '', `${pathname}?${params.toString()}`)
  
    setHoverTutor(null)
    setHoverRect(null)
  }

  const handleSortChange = (value: string) => {
    setSortByFilter(value as ETutorSortBy)
    setPage(1)
    setHoverTutor(null)
    setHoverRect(null)
  }

  const handleSubjectChange = (value: ESubject) => {
    setSubjectFilter(value)
    setPage(1)
    setHoverTutor(null)
    setHoverRect(null)
  }

  const handleCountryChange = (value: ECountry) => {
    setCountryFilter(value)
    setPage(1)
    setHoverTutor(null)
    setHoverRect(null)
  }

  const handlePriceChange = (value: string) => {
    setPriceFilter(value)
    setPage(1)
    setHoverTutor(null)
    setHoverRect(null)
  }

  const handleTutorCardHover = (tutor: VerifiedTutorProfileDto, el: HTMLElement) => {
    setHoverTutor(tutor)
    setHoverRect(el.getBoundingClientRect())
    setAnchorRect(listRef.current?.getBoundingClientRect?.() ?? null)
  }
  const previewPosition = useMemo(() => {
    if (!hoverRect || !anchorRect) return null

    const vw = window.innerWidth

    const showOnRight = hoverRect.right + PREVIEW_GAP + PREVIEW_WIDTH <= vw

    const leftViewport = showOnRight
      ? hoverRect.right + PREVIEW_GAP
      : hoverRect.left - PREVIEW_GAP - PREVIEW_WIDTH

    const left = leftViewport - anchorRect.left
    const y = hoverRect.top - anchorRect.top

    return { left, y }
  }, [hoverRect, anchorRect])

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
            <YStack
              ref={(node) => {
                listRef.current = node as unknown as HTMLElement | null
              }}
              width="100%"
              height="auto"
              $gtMd={{ width: '65%' }}
              gap="$3"
              position="relative"
            >
              <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$2">
                <Text variant="muted">
                  {subjectFilter === ESubject.ANY_SUBJECT
                    ? t('totalLabelNoSubject', { count: totalTutors })
                    : t('totalLabel', {
                        count: totalTutors,
                        subject: tFilter(subjectFilter),
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

              <OverlayLoading isOpen={isFetching && items.length === 0 && !showInitialLoading} />

              <XStack justifyContent="center" alignItems="center" paddingTop="$4">
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </XStack>

              {showHoverPreview && hoverTutor && previewPosition && (
                <YStack
                  style={{
                    position: 'absolute',
                    left: previewPosition.left,
                    top: 0,
                    width: PREVIEW_WIDTH,
                    zIndex: 50,
                    pointerEvents: 'none',
                    transform: `translate3d(0, ${previewPosition.y}px, 0)`,
                    transition: `transform ${PREVIEW_ANIM_MS}ms ease`,
                    willChange: 'transform',
                  }}
                >
                  <YStack style={{ pointerEvents: 'auto' }}>
                    <PreviewCard tutor={hoverTutor} isPopularWeek={false} />
                  </YStack>
                </YStack>
              )}
            </YStack>
          </XStack>
        </Container>
      </YStack>
    </Screen>
  )
}
