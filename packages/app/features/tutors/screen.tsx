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
import { useRef, useState, useMemo, useEffect } from 'react'
import { TutorCard } from './components/TutorCard'
import { Select } from '@mezon-tutors/app/ui'
import { ETutorSortBy } from '@mezon-tutors/shared'
import { useGetVerifiedTutors } from '@mezon-tutors/app/services/tutor-profile/tutor-profile.api'
import { useTranslations } from 'next-intl'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMedia, useTheme } from 'tamagui'
import { useCurrency } from '@mezon-tutors/app/hooks/useCurrency'

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
  const isCompact = media.md || media.sm || media.xs

  const [page, setPage] = useState(() => {
    const initialPage = Number(searchParams.get('page') ?? '1')
    if (Number.isNaN(initialPage) || initialPage < 1) return 1
    return initialPage
  })
  const [limit] = useState(() => Number(searchParams.get('limit') ?? String(DEFAULT_LIMIT)))

  const [sortByFilter, setSortByFilter] = useState<ETutorSortBy>(ETutorSortBy.POPULARITY)
  const [subjectFilter, setSubjectFilter] = useState<ESubject>(ESubject.ANY_SUBJECT)
  const [countryFilter, setCountryFilter] = useState<ECountry>(ECountry.ANY_COUNTRY)
  const [priceFilter, setPriceFilter] = useState<[number, number] | null>(null)
  const {
    data: verifiedTutorsResponse,
    isLoading,
    isFetching,
  } = useGetVerifiedTutors(page, limit, {
    sortBy: sortByFilter,
    subject: subjectFilter,
    country: countryFilter,
  })
  const [hoverTutor, setHoverTutor] = useState<VerifiedTutorProfileDto | null>(null)
  const [previewOffsetY, setPreviewOffsetY] = useState(0)
  const [disableCardNavigationUntil, setDisableCardNavigationUntil] = useState(0)
  const listColumnRef = useRef<HTMLElement | null>(null)

  const suppressCardNavigation = () => {
    setDisableCardNavigationUntil(Date.now() + 450)
  }

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
    suppressCardNavigation()
    setSortByFilter(value as ETutorSortBy)
    setPage(1)
    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handleSubjectChange = (value: ESubject) => {
    suppressCardNavigation()
    setSubjectFilter(value)
    setPage(1)
    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handleCountryChange = (value: ECountry) => {
    suppressCardNavigation()
    setCountryFilter(value)
    setPage(1)
    setHoverTutor(null)
    setPreviewOffsetY(0)
  }

  const handlePriceChange = (min: number, max: number) => {
    suppressCardNavigation()
    setPriceFilter([min, max])
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
  const allItems = verifiedTutorsResponse?.items ?? []
  const showInitialLoading = isLoading && !verifiedTutorsResponse
  const { currency, convert } = useCurrency()

  const [convertedPrices, setConvertedPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    const convertAllPrices = async () => {
      const prices: Record<string, number> = {}
      for (const tutor of allItems) {
        const result = await convert(tutor.pricePerHour, tutor.currency)
        prices[tutor.id] = result.convertedAmount
      }
      setConvertedPrices(prices)
    }
    if (allItems.length > 0) {
      convertAllPrices()
    }
  }, [allItems, currency, convert])

  const items = useMemo(() => {
    let filtered = allItems
    
    if (priceFilter) {
      filtered = allItems.filter((tutor) => {
        const convertedPrice = convertedPrices[tutor.id]
        if (convertedPrice === undefined) return true
        return convertedPrice >= priceFilter[0] && convertedPrice <= priceFilter[1]
      })
    }

    if (sortByFilter === ETutorSortBy.HIGHEST_PRICE || sortByFilter === ETutorSortBy.LOWEST_PRICE) {
      filtered = [...filtered].sort((a, b) => {
        const priceA = convertedPrices[a.id] ?? 0
        const priceB = convertedPrices[b.id] ?? 0
        return sortByFilter === ETutorSortBy.HIGHEST_PRICE ? priceB - priceA : priceA - priceB
      })
    }

    return filtered
  }, [allItems, priceFilter, convertedPrices, sortByFilter])

  return (
    <Screen
      paddingHorizontal={isCompact ? '$1' : '$8'}
      backgroundColor={theme.tutorsPageBackground?.get() ?? '$background'}
    >
      <YStack flex={1}>
        <Container
          padded
          paddingTop={isCompact ? '$3' : '$4'}
          paddingBottom={isCompact ? '$4' : '$6'}
          gap={isCompact ? '$3' : '$4'}
        >
          <TutorsFilter
            subject={subjectFilter}
            country={countryFilter}
            onSubjectChange={handleSubjectChange}
            onCountryChange={handleCountryChange}
            onPricePerLessonChange={handlePriceChange}
          />
          <XStack
            gap="$8"
            flexDirection="row"
            alignItems="flex-start"
            width="100%"
          >
            <YStack
              width="100%"
              minHeight="60vh"
              height="auto"
              gap="$3"
              position="relative"
            >
              <XStack
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap="$2"
              >
                <Text variant="muted">
                  {subjectFilter === ESubject.ANY_SUBJECT
                    ? t('totalLabelNoSubject', { count: totalTutors })
                    : t('totalLabel', {
                        count: totalTutors,
                        subject: tSubject(subjectFilter),
                      })}
                </Text>
                <XStack
                  gap="$2"
                  alignItems="center"
                  width={isCompact ? '100%' : undefined}
                >
                  <Text variant="muted" flexShrink={0}>{t('sortBy')}</Text>
                  <Select
                    value={sortByFilter}
                    width={isCompact ? '100%' : 140}
                    flex={isCompact ? 1 : undefined}
                    onValueChange={handleSortChange}
                    options={(Object.values(ETutorSortBy) as ETutorSortBy[]).map((value) => ({
                      label: t(value),
                      value: value as string,
                    }))}
                  />
                </XStack>
              </XStack>

              <XStack
                position="relative"
                width="100%"
                gap="$5"
                alignItems="flex-start"
              >
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
                          disableNavigationUntil={disableCardNavigationUntil}
                        />
                      </YStack>
                    ))
                  )}
                </YStack>

                {showHoverPreview && !showInitialLoading && items.length > 0 && (
                  <YStack
                    width={PREVIEW_WIDTH}
                    flexShrink={0}
                  >
                    {hoverTutor ? (
                      <YStack
                        style={{
                          transform: `translate3d(0, ${previewOffsetY}px, 0)`,
                          transition: `transform ${PREVIEW_ANIM_MS}ms ease`,
                          willChange: 'transform',
                        }}
                      >
                        <PreviewCard
                          tutor={hoverTutor}
                          isPopularWeek={false}
                        />
                      </YStack>
                    ) : null}
                  </YStack>
                )}
              </XStack>

              <OverlayLoading isOpen={isFetching && items.length === 0 && !showInitialLoading} />

              <XStack
                justifyContent="center"
                alignItems="center"
                paddingTop="$4"
              >
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </XStack>
            </YStack>
          </XStack>
        </Container>
      </YStack>
    </Screen>
  )
}
