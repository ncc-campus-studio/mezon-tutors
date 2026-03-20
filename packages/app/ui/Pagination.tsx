import { XStack } from 'tamagui'
import { Button } from './Button'
import { Text } from './Text'

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

function range(start: number, end: number) {
  if (start > end) return []
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function getPages(page: number, total: number) {
  page = Math.max(1, Math.min(page, total))

  if (total <= 5) return range(1, total)

  const pages: (number | '...')[] = []

  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)

  pages.push(1)

  if (start > 2) pages.push('...')

  pages.push(...range(start, end))

  if (end < total - 1) pages.push('...')

  pages.push(total)

  return pages
}

export function Pagination({ page, totalPages, onPageChange, disabled = false }: Props) {
  if (totalPages <= 1) return null

  const canPrev = page > 1 && !disabled
  const canNext = page < totalPages && !disabled

  const pages = getPages(page, totalPages)

  return (
    <XStack justifyContent="center" alignItems="center" gap="$1">
      <Button disabled={!canPrev} onPress={() => onPageChange(page - 1)}>
        Prev
      </Button>

      {pages.map((p, i) =>
        p === '...' ? (
          <Text key={`ellipsis-${i}`}>…</Text>
        ) : (
          <Button
            key={`page-${p}`}
            variant={p === page ? 'primary' : 'ghost'}
            disabled={disabled || p === page}
            onPress={() => onPageChange(p)}
            minWidth={36}
          >
            {p}
          </Button>
        )
      )}

      <Button disabled={!canNext} onPress={() => onPageChange(page + 1)}>
        Next
      </Button>
    </XStack>
  )
}
