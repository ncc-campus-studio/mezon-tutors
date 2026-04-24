'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { WorldIcon, ChevronDownIcon } from '@mezon-tutors/app/ui/icons'
import { ECurrency } from '@mezon-tutors/shared'

type HeaderCurrencyToggleProps = {
  currency: string
  locale: string
  onCurrencyChange: (currency: string) => void
  onLocaleChange: (locale: string) => void
  iconColor: string
}

export function HeaderCurrencyToggle({
  currency,
  locale,
  onCurrencyChange,
  onLocaleChange,
  iconColor,
}: HeaderCurrencyToggleProps) {
  const t = useTranslations('Home.CurrencyToggle')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const displayText = `${locale === 'en' ? t('english') : t('vietnamese')}, ${currency}`

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleCurrencySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCurrencyChange(e.target.value)
  }

  const handleLocaleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLocaleChange(e.target.value)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Button
        onPress={() => setIsOpen(!isOpen)}
        borderWidth={1}
        borderColor="$myLessonsTopNavBorder"
        borderRadius={999}
        backgroundColor="$myLessonsCardBackground"
        paddingVertical={7}
        paddingHorizontal={12}
        style={{ cursor: 'pointer', transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)' }}
        hoverStyle={{
          y: -1,
          borderColor: '$myLessonsPrimaryButton',
          backgroundColor: '$myLessonsSwitcherBackground',
        }}
      >
        <XStack alignItems="center" gap={8}>
          <WorldIcon size={14} color={iconColor} />
          <Text fontSize={13} fontWeight="700" color="$myLessonsHeaderTitle" lineHeight={18}>
            {displayText}
          </Text>
          <ChevronDownIcon size={12} color={iconColor} />
        </XStack>
      </Button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 1000,
            minWidth: 280,
          }}
        >
          <YStack
            borderWidth={1}
            borderColor="$myLessonsTopNavBorder"
            backgroundColor="$myLessonsCardBackground"
            padding={16}
            borderRadius={12}
            gap={16}
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600" color="$myLessonsHeaderTitle">
                {t('language')}
              </Text>
              <select
                value={locale}
                onChange={handleLocaleSelect}
                className="currency-select"
              >
                <option value="en">{t('english')}</option>
                <option value="vi">{t('vietnamese')}</option>
              </select>
            </YStack>

            <YStack gap={8}>
              <Text fontSize={14} fontWeight="600" color="$myLessonsHeaderTitle">
                {t('currency')}
              </Text>
              <select
                value={currency}
                onChange={handleCurrencySelect}
                className="currency-select"
              >
                {Object.values(ECurrency).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </YStack>
          </YStack>
        </div>
      )}
    </div>
  )
}
