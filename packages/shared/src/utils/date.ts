import dayjs from 'dayjs'

export function formatDateDMY(isoDateString: string): string {
  return dayjs(isoDateString).format('DD/MM/YYYY')
}

export function formatDate(isoDateString: string, format = 'DD/MM/YYYY'): string {
  return dayjs(isoDateString).format(format)
}
