import { YStack, XStack, Select, Slider, Text } from '@mezon-tutors/app/ui'
import { ECountry, ESubject } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMedia } from 'tamagui'

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
  const media = useMedia()
  const t = useTranslations('Tutors.Filter')
  const tSubject = useTranslations('Tutors.Filter.Subject')
  const tCountry = useTranslations('Tutors.Filter.Country')
  const isCompact = media.md || media.sm || media.xs

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

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onPricePerLessonChange(value.join('_'));
    }, 350)
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    }
  }, [])

  const subjectSelect = (
    <Select
      label={isCompact ? undefined : t('subjectLabel')}
      value={subject}
      width={isCompact ? 160 : 220}
      onValueChange={(value) => onSubjectChange(value as ESubject)}
      options={(Object.values(ESubject) as ESubject[]).map((value) => ({
        label: tSubject(value),
        value: value as string,
      }))}
    />
  );

  const priceSelect = (
    <Select
      label={isCompact ? undefined : t('priceLabel')}
      value={pricePerLessonValueString}
      width={isCompact ? 145 : 220}
    >
      <YStack gap="$4">
        <Text
          fontSize="lg"
          fontWeight="700"
          textAlign="center"
        >
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
  );

  const countrySelect = (
    <Select
      label={isCompact ? undefined : t('countryLabel')}
      value={country}
      width={isCompact ? 150 : 220}
      onValueChange={(value) => onCountryChange(value as ECountry)}
      options={(Object.values(ECountry) as ECountry[]).map((value) => ({
        label: tCountry(value),
        value: value as string,
      }))}
    />
  );

  if (isCompact) {
    return (
      <YStack gap="$2.5">
        <XStack gap="$2">
          <YStack
            flex={1}
            minWidth={0}
            backgroundColor="$tutorsFilterSelectBackground"
            borderRadius="$4"
          >
            <Select
              value={subject}
              width="100%"
              onValueChange={(value) => onSubjectChange(value as ESubject)}
              options={(Object.values(ESubject) as ESubject[]).map((value) => ({
                label: tSubject(value),
                value: value as string,
              }))}
            />
          </YStack>
          <YStack
            flex={1}
            minWidth={0}
            backgroundColor="$tutorsFilterSelectBackground"
            borderRadius="$4"
          >
            <Select
              value={pricePerLessonValueString}
              width="100%"
            >
              <YStack gap="$4">
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  textAlign="center"
                >
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
          </YStack>
        </XStack>
        <YStack
          backgroundColor="$tutorsFilterSelectBackground"
          borderRadius="$4"
        >
          <Select
            value={country}
            width="100%"
            onValueChange={(value) => onCountryChange(value as ECountry)}
            options={(Object.values(ECountry) as ECountry[]).map((value) => ({
              label: tCountry(value),
              value: value as string,
            }))}
          />
        </YStack>
      </YStack>
    );
  }

  return (
    <XStack
      gap="$4"
      flexWrap="wrap"
    >
      {subjectSelect}
      {priceSelect}
      {countrySelect}
    </XStack>
  );
}
