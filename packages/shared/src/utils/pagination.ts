import { PAGINATION_CONFIG } from '../constants/pagination'

export interface PageNumber {
  page: number
  isEllipsis?: boolean
}

export function generatePageNumbers(currentPage: number, totalPages: number): PageNumber[] {
  if (totalPages <= PAGINATION_CONFIG.MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => ({ page: i + 1 }))
  }

  const pages: PageNumber[] = []
  const { PAGES_AROUND_CURRENT, ELLIPSIS_THRESHOLD } = PAGINATION_CONFIG

  pages.push({ page: 1 })

  if (currentPage > ELLIPSIS_THRESHOLD) {
    pages.push({ page: -1, isEllipsis: true })
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages) continue
    if (Math.abs(i - currentPage) <= PAGES_AROUND_CURRENT) {
      pages.push({ page: i })
    }
  }

  if (currentPage < totalPages - (ELLIPSIS_THRESHOLD - 1)) {
    pages.push({ page: -2, isEllipsis: true })
  }

  pages.push({ page: totalPages })

  return pages
}
