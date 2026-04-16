'use client';

import { useState, useRef, useEffect } from 'react';
import { YStack, XStack, Text, Input } from '@mezon-tutors/app/ui';
import { ChevronDown } from '@tamagui/lucide-icons';
import { useTranslations } from 'next-intl';

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TimePicker({ value, onChange, placeholder = '09:00' }: TimePickerProps) {
  const t = useTranslations('TutorProfile.Availability.availability');
  const [isOpen, setIsOpen] = useState(false);
  const [hours, minutes] = value.split(':');
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<any>(null);
  const hourScrollRef = useRef<any>(null);
  const minuteScrollRef = useRef<any>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      scrollToSelected();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, hours, minutes]);

  const scrollToSelected = () => {
    setTimeout(() => {
      if (hourScrollRef.current && hours) {
        const selectedHour = hourScrollRef.current.querySelector(`[data-hour="${hours}"]`);
        if (selectedHour) {
          selectedHour.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
      if (minuteScrollRef.current && minutes) {
        const selectedMinute = minuteScrollRef.current.querySelector(`[data-minute="${minutes}"]`);
        if (selectedMinute) {
          selectedMinute.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    }, 50);
  };

  const handleHourSelect = (hour: string) => {
    const newValue = `${hour}:${minutes || '00'}`;
    onChange(newValue);
    setInputValue(newValue);
  };

  const handleMinuteSelect = (minute: string) => {
    const newValue = `${hours || '09'}:${minute}`;
    onChange(newValue);
    setInputValue(newValue);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    if (text === '') {
      return;
    }

    const cleanText = text.replace(/[^\d:]/g, '');
    
    if (cleanText.match(/^\d{2}:\d{2}$/)) {
      const [h, m] = cleanText.split(':');
      const hourNum = parseInt(h);
      const minuteNum = parseInt(m);
      
      if (hourNum >= 0 && hourNum <= 23 && minuteNum >= 0 && minuteNum <= 59) {
        onChange(cleanText);
      }
    }
  };

  const handleInputBlur = () => {
    if (!inputValue.match(/^\d{2}:\d{2}$/)) {
      setInputValue(value);
    }
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = ['00', '15', '30', '45'];

  return (
    <YStack position="relative" ref={dropdownRef}>
      <XStack
        alignItems="center"
        height={44}
        borderRadius="$3"
        borderWidth={1}
        borderColor="$borderSubtle"
        backgroundColor="$fieldBackground"
        paddingHorizontal="$3"
        cursor="pointer"
      >
        <Input
          flex={1}
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          backgroundColor="transparent"
          borderWidth={0}
          color="$color"
          paddingHorizontal={0}
          height={44}
          cursor="text"
        />
        <YStack cursor="pointer" onPress={() => setIsOpen(!isOpen)}>
          <ChevronDown size={18} color="$colorMuted" />
        </YStack>
      </XStack>

      {isOpen && (
        <YStack
          position="absolute"
          top="100%"
          left={0}
          right={0}
          marginTop="$1"
          backgroundColor="$backgroundCard"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderSubtle"
          zIndex={1000}
          maxHeight={240}
          overflow="hidden"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.1}
          shadowRadius={12}
        >
          <XStack height="100%">
            <YStack
              ref={hourScrollRef}
              flex={1}
              borderRightWidth={1}
              borderRightColor="$borderSubtle"
              overflow="scroll"
              maxHeight={240}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              } as any}
              className="hide-scrollbar"
            >
              <Text
                fontSize={11}
                fontWeight="600"
                color="$colorMuted"
                padding="$2"
                paddingBottom="$1"
                textAlign="center"
                backgroundColor="$backgroundCard"
                zIndex={1}
                style={{ position: 'sticky', top: 0 } as any}
              >
                {t('hour')}
              </Text>
              {hourOptions.map((hour) => (
                <XStack
                  key={hour}
                  data-hour={hour}
                  padding="$2"
                  paddingVertical="$2.5"
                  cursor="pointer"
                  backgroundColor={hours === hour ? '$blue4' : 'transparent'}
                  hoverStyle={{ backgroundColor: '$backgroundHover' }}
                  onPress={() => handleHourSelect(hour)}
                  justifyContent="center"
                >
                  <Text
                    fontSize={14}
                    color={hours === hour ? '$blue11' : '$color'}
                    fontWeight={hours === hour ? '600' : '400'}
                  >
                    {hour}
                  </Text>
                </XStack>
              ))}
            </YStack>

            <YStack
              ref={minuteScrollRef}
              flex={1}
              overflow="scroll"
              maxHeight={240}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              } as any}
              className="hide-scrollbar"
            >
              <Text
                fontSize={11}
                fontWeight="600"
                color="$colorMuted"
                padding="$2"
                paddingBottom="$1"
                textAlign="center"
                backgroundColor="$backgroundCard"
                zIndex={1}
                style={{ position: 'sticky', top: 0 } as any}
              >
                {t('minute')}
              </Text>
              {minuteOptions.map((minute) => (
                <XStack
                  key={minute}
                  data-minute={minute}
                  padding="$2"
                  paddingVertical="$2.5"
                  cursor="pointer"
                  backgroundColor={minutes === minute ? '$blue4' : 'transparent'}
                  hoverStyle={{ backgroundColor: '$backgroundHover' }}
                  onPress={() => handleMinuteSelect(minute)}
                  justifyContent="center"
                >
                  <Text
                    fontSize={14}
                    color={minutes === minute ? '$blue11' : '$color'}
                    fontWeight={minutes === minute ? '600' : '400'}
                  >
                    {minute}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </XStack>
        </YStack>
      )}
    </YStack>
  );
}
