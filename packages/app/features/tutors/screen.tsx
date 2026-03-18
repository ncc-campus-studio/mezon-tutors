'use client'

import {
  Screen,
  Container,
  YStack,
  XStack,
  ScrollView,
  Text,
  Button,
  Pagination,
} from '@mezon-tutors/app/ui'
import { PreviewCard } from './components/PreviewCard'
import { TutorsFilter } from './components/TutorsFilter'
import { VerifiedTutorProfileDto } from '@mezon-tutors/shared'
import { useEffect, useState } from 'react'
import { TutorCard } from './components/TutorCard'
import { Select } from '@mezon-tutors/app/ui/Select'
import { TutorSortBy } from '@mezon-tutors/shared'
import { useGetVerifiedTutors } from '@mezon-tutors/app/services/tutor-profile/tutor-profile.api'

const LIMIT = 5

export function TutorsScreen() {
  const [page, setPage] = useState(1)
  const [totalTutors, setTotalTutors] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortByFilter, setSortByFilter] = useState<TutorSortBy>(TutorSortBy.POPULARITY)
  const {
    data: verifiedTutorsResponse,
    isLoading,
    isError,
  } = useGetVerifiedTutors(page, LIMIT, sortByFilter)
  const [hoverTutor, setHoverTutor] = useState<VerifiedTutorProfileDto | null>(null)

  const [languageFilter, setLanguageFilter] = useState<string>('English')

  useEffect(() => {
    if (!verifiedTutorsResponse) return

    setTotalTutors(verifiedTutorsResponse.meta.total)
    setTotalPages(verifiedTutorsResponse.meta.totalPages)
  }, [verifiedTutorsResponse])

  const handlePageChange = (page: number) => {
    setPage(page)
    setHoverTutor(null)
  }

  const handleSortChange = (value: string) => {
    setSortByFilter(value as TutorSortBy)
    setPage(1)
    setHoverTutor(null)
  }

  const handleTutorCardHover = (tutor: VerifiedTutorProfileDto) => {
    setHoverTutor(tutor)
  }

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={24}>
        <Text variant="default">Loading...</Text>
      </YStack>
    )
  }

  if (isError) {
    return (
      <YStack padding={16} backgroundColor="$red9" borderRadius={8}>
        <Text variant="default">Error loading verified tutors</Text>
      </YStack>
    )
  }

  if (!verifiedTutorsResponse) {
    return (
      <YStack padding={16} backgroundColor="$red9" borderRadius={8}>
        <Text variant="default">No verified tutors found</Text>
      </YStack>
    )
  }
  return (
    <Screen>
      <YStack flex={1}>
        <Container padded paddingTop="$4" paddingBottom="$6" gap="$4">
          <TutorsFilter />

          <XStack gap="$8" flexDirection="row" alignItems="flex-start">
            <YStack width="65%" height="100vh" gap="$3">
              <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$2">
                <Text variant="muted">
                  {totalTutors} {languageFilter} tutors available
                </Text>
                <XStack gap="$2" alignItems="center">
                  <Text variant="muted">Sort by:</Text>
                  <Select
                    value={sortByFilter}
                    onValueChange={handleSortChange}
                    options={Object.values(TutorSortBy).map((sort) => ({
                      label: sort,
                      value: sort,
                    }))}
                  />
                </XStack>
              </XStack>
              <ScrollView contentContainerStyle={{ gap: 16 }}>
                {(verifiedTutorsResponse?.items ?? []).map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} onHover={handleTutorCardHover} />
                ))}
              </ScrollView>
              <XStack justifyContent="center" alignItems="center" paddingTop="$4">
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
              </XStack>
            </YStack>

            <YStack flex={1} minWidth={280}>
              <PreviewCard tutor={hoverTutor} isPopularWeek={false} />
            </YStack>
          </XStack>
        </Container>
      </YStack>
    </Screen>
  )
}
