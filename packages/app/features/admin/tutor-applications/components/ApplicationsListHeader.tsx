import { AppButton, Text, XStack, YStack } from '@mezon-tutors/app/ui'

export type ApplicationsListHeaderProps = {
  title: string
  filterLabel: string
  exportLabel: string
  onFilterClick?: () => void
  onExportCsvClick?: () => void
}

export function ApplicationsListHeader({
  title,
  filterLabel,
  exportLabel,
  onFilterClick,
  onExportCsvClick,
}: ApplicationsListHeaderProps) {
  return (
    <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={12}>
      <YStack gap={4}>
        <Text size="lg" fontWeight="700" fontSize={20} variant="default" marginLeft={10}>
          {title}
        </Text>
      </YStack>

      <XStack gap={9} flexShrink={0}>
        <AppButton variant="tertiary" height={40} fontWeight="600" onPress={onFilterClick}>
          {filterLabel}
        </AppButton>
        <AppButton variant="tertiary" height={40} fontWeight="600" onPress={onExportCsvClick}>
          {exportLabel}
        </AppButton>
      </XStack>
    </XStack>
  )
}
