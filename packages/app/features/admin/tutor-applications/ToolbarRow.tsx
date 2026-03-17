import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'tamagui'
import { useForm } from 'react-hook-form'
import { XStack, YStack, InputField } from '@mezon-tutors/app/ui'
import { SearchIcon } from '@mezon-tutors/app/ui/icons'
import { BellIcon } from '@mezon-tutors/app/ui/icons/BellIcon'
import { SettingsIcon } from '@mezon-tutors/app/ui/icons/SettingIcon'

export type TutorApplicationsToolbarRowProps = {
  search: string
  onSearchChange: (value: string) => void
  onNotificationsPress?: () => void
  onSettingsPress?: () => void
}

type SearchFormValues = { search: string }

export function TutorApplicationsToolbarRow({
  search,
  onSearchChange,
  onNotificationsPress,
  onSettingsPress,
}: TutorApplicationsToolbarRowProps) {
  const t = useTranslations('Admin.TutorApplications')
  const theme = useTheme()
  const colorMuted = theme.colorMuted?.val

  const { control, setValue, watch } = useForm<SearchFormValues>({
    defaultValues: { search },
  })

  const searchValue = watch('search')

  useEffect(() => {
    setValue('search', search)
  }, [search, setValue])

  useEffect(() => {
    onSearchChange(searchValue ?? '')
  }, [searchValue, onSearchChange])

  return (
    <XStack alignItems="center" gap={16} margin={10}>
      <XStack
        flex={1}
        alignItems="center"
        paddingHorizontal={16}
        borderRadius={999}
        backgroundColor="$headerBackground"
        borderWidth={1}
        borderColor="$borderSubtle"
        gap={8}
        minHeight={44}
      >
        <SearchIcon size={18} color={colorMuted} />
        <InputField
          control={control}
          name="search"
          label=""
          placeholder={t('searchPlaceholder')}
          flex={1}
        />
      </XStack>

      <XStack gap={10}>
        <YStack
          width={36}
          height={36}
          borderRadius={999}
          backgroundColor="$backgroundMuted"
          borderWidth={1}
          borderColor="$borderSubtle"
          alignItems="center"
          justifyContent="center"
          onPress={onNotificationsPress}
        >
          <BellIcon size={18} color={colorMuted} />
        </YStack>
        <YStack
          width={36}
          height={36}
          borderRadius={999}
          backgroundColor="$backgroundMuted"
          borderWidth={1}
          borderColor="$borderSubtle"
          alignItems="center"
          justifyContent="center"
          onPress={onSettingsPress}
        >
          <SettingsIcon size={18} color={colorMuted} />
        </YStack>
      </XStack>
    </XStack>
  )
}
