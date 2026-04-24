import { YStack, XStack, Select, Slider, Text } from '@mezon-tutors/app/ui'
import { ECountry, ESubject, PRICE_FILTER_RANGE, formatCurrency } from '@mezon-tutors/shared'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMedia } from 'tamagui'
import { useCurrency } from '@mezon-tutors/app/hooks/useCurrency'

type TutorsFilterProps = {
  subject: ESubject
  country: ECountry
  onSubjectChange: (value: ESubject) => void
  onCountryChange: (value: ECountry) => void
  onPricePerLessonChange: (min: number, max: number) => void
}

export function TutorsFilter({
  subject,
  country,
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
  const { currency, convert } = useCurrency()

  const [convertedMin, setConvertedMin] = useState<number>(PRICE_FILTER_RANGE.min)
  const [convertedMax, setConvertedMax] = useState<number>(PRICE_FILTER_RANGE.max)
  const [sliderStep, setSliderStep] = useState<number>(1)
  const [pricePerLessonValue, setPricePerLessonValue] = useState<number[]>([PRICE_FILTER_RANGE.min, PRICE_FILTER_RANGE.max])

  useEffect(() => {
    const convertPrices = async () => {
      const minResult = await convert(PRICE_FILTER_RANGE.min, PRICE_FILTER_RANGE.currency)
      const maxResult = await convert(PRICE_FILTER_RANGE.max, PRICE_FILTER_RANGE.currency)
      const min = Math.floor(minResult.convertedAmount)
      const max = Math.ceil(maxResult.convertedAmount)
      setConvertedMin(min)
      setConvertedMax(max)
      setPricePerLessonValue([min, max])
      
      const range = max - min
      const step = range > 1000 ? 1000 : range > 100 ? 100 : range > 10 ? 1 : 0.1
      setSliderStep(step)
    }
    convertPrices()
  }, [currency, convert])

  const pricePerLessonValueString = useMemo(
    () => `${formatCurrency(pricePerLessonValue[0], currency)} - ${formatCurrency(pricePerLessonValue[1], currency)}`,
    [pricePerLessonValue, currency]
  )

  const handlePricePerLessonChange = (value: number[]) => {
    setPricePerLessonValue(value)

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onPricePerLessonChange(value[0], value[1]);
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
          {formatCurrency(pricePerLessonValue[0], currency)} - {formatCurrency(pricePerLessonValue[1], currency)}
        </Text>
        <Slider
          value={pricePerLessonValue}
          min={convertedMin}
          max={convertedMax}
          step={sliderStep}
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
                  {formatCurrency(pricePerLessonValue[0], currency)} - {formatCurrency(pricePerLessonValue[1], currency)}
                </Text>
                <Slider
                  value={pricePerLessonValue}
                  min={convertedMin}
                  max={convertedMax}
                  step={sliderStep}
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
