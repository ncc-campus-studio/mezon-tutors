import { YStack, XStack, Select, Slider, Text } from '@mezon-tutors/app/ui'
import { ECountry, ESubject } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'

type TutorsFilterProps = {
  subject: ESubject
  country: ECountry
  pricePerLesson: string
  onSubjectChange: (value: ESubject) => void
  onCountryChange: (value: ECountry) => void
  onPricePerLessonChange: (value: string) => void
}

export function TutorsFilter({
  subject,
  country,
  pricePerLesson,
  onSubjectChange,
  onCountryChange,
  onPricePerLessonChange,
}: TutorsFilterProps) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t = useTranslations('Tutors.Filter')

  const parsedPriceRange = useMemo(() => {
    if (!pricePerLesson) return null
    const [minStr, maxStr] = String(pricePerLesson).split('_')
    const min = Number(minStr)
    const max = Number(maxStr)
    if (!Number.isFinite(min) || !Number.isFinite(max)) return null
    return [min, max] as number[]
  }, [pricePerLesson])

  const [pricePerLessonValue, setPricePerLessonValue] = useState<number[]>(
    () => parsedPriceRange ?? [5, 50]
  )

  useEffect(() => {
    if (!parsedPriceRange) return
    setPricePerLessonValue(parsedPriceRange)
  }, [parsedPriceRange])

  const pricePerLessonValueString = useMemo(
    () => `$${pricePerLessonValue[0]} - $${pricePerLessonValue[1]}`,
    [pricePerLessonValue]
  )

  const handlePricePerLessonChange = (value: number[]) => {
    setPricePerLessonValue(value)

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      onPricePerLessonChange(value.join('_'))
    }, 350)
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [])

  return (
      <XStack gap="$4" flexWrap="wrap">
        <Select
          label={t('subjectLabel')}
          value={subject}
          onValueChange={(value) => onSubjectChange(value as ESubject)}
          options={(Object.values(ESubject) as ESubject[]).map((value) => ({
            label: t(value),
            value: value as string,
          }))}
        />
        <Select label={t('priceLabel')} value={pricePerLessonValueString}>
          <YStack gap="$4">
            <Text fontSize="lg" fontWeight="700" textAlign="center">
              ${pricePerLessonValue[0]} - ${pricePerLessonValue[1]}
            </Text>
            <Slider
              value={pricePerLessonValue}
              min={5}
              max={50}
              step={1}
              onValueChange={handlePricePerLessonChange}
            />
          </YStack>
        </Select>

        <Select
          label={t('countryLabel')}
          value={country}
          onValueChange={(value) => onCountryChange(value as ECountry)}
          options={(Object.values(ECountry) as ECountry[]).map((value) => ({
            label: t(value),
            value: value as string,
          }))}
        />
      </XStack>
  )
}
