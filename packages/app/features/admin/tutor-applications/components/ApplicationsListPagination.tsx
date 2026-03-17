import { AppButton, Text, XStack } from '@mezon-tutors/app/ui'

export type ApplicationsListPaginationProps = {
  subtitle: string
  safePage: number
  totalPages: number
  prevLabel: string
  nextLabel: string
  onPrev: () => void
  onNext: () => void
  onPage: (page: number) => void
}

export function ApplicationsListPagination({
  subtitle,
  safePage,
  totalPages,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  onPage,
}: ApplicationsListPaginationProps) {
  return (
    <XStack
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={12}
    >
      <Text size="sm" variant="muted">
        {subtitle}
      </Text>

      <XStack gap={8} alignItems="center" flexShrink={0}>
        <AppButton variant="secondary" height={32} disabled={safePage === 1} onPress={onPrev}>
          {prevLabel}
        </AppButton>

        {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
          const pageNumber = index + 1
          const isActive = pageNumber === safePage
          return (
            <AppButton
              key={pageNumber}
              variant={isActive ? 'primary' : 'tertiary'}
              borderRadius={10}
              height={32}
              width={40}
              onPress={() => onPage(pageNumber)}
            >
              {pageNumber}
            </AppButton>
          )
        })}

        <AppButton
          variant="secondary"
          height={32}
          disabled={safePage === totalPages}
          onPress={onNext}
        >
          {nextLabel}
        </AppButton>
      </XStack>
    </XStack>
  )
}
