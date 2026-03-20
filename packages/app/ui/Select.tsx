import { useMemo, useState } from 'react'
import { YStack, Text, Select as TamaguiSelect, SelectProps as TamaguiSelectProps } from 'tamagui'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { LinearGradient } from 'tamagui/linear-gradient'

type Option = {
  label: string
  value: string
}

type BaseSelectProps = TamaguiSelectProps & {
  label?: string
  options?: Option[]
  value?: string
  defaultValue?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  fullWidth?: boolean
  flex?: number
  triggerWidth?: number
  gap?: number | string
}

export function Select({
  label,
  options,
  value,
  defaultValue,
  placeholder = 'Select...',
  onValueChange,
  fullWidth = false,
  flex,
  triggerWidth = 220,
  gap = '$2',
  children,
  ...rest
}: BaseSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue
  const selectedLabel = useMemo(() => {
    if (!options || !selectedValue) return null
    return options.find((o) => o.value === selectedValue)?.label ?? null
  }, [options, selectedValue])

  const renderedOptions = useMemo(
    () =>
      options?.map((option, i) => (
        <TamaguiSelect.Item index={i} key={option.value} value={option.value}>
          <TamaguiSelect.ItemText>{option.label}</TamaguiSelect.ItemText>
          <TamaguiSelect.ItemIndicator marginLeft="auto">
            <Check size={16} />
          </TamaguiSelect.ItemIndicator>
        </TamaguiSelect.Item>
      )),
    [options]
  )

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val)
    onValueChange?.(val)
  }

  return (
    <YStack flex={flex} width={fullWidth ? '100%' : undefined} gap={gap}>
      {label && (
        <Text fontSize="$3" fontWeight="500">
          {label}
        </Text>
      )}

      <TamaguiSelect value={selectedValue} onValueChange={handleChange} {...rest}>
        <TamaguiSelect.Trigger
          width={triggerWidth}
          minWidth={fullWidth ? '100%' : undefined}
          iconAfter={ChevronDown}
          borderRadius="$4"
          backgroundColor="$background"
          color="$appText"
        >
          {selectedLabel ? (
            <TamaguiSelect.Value>{selectedLabel}</TamaguiSelect.Value>
          ) : selectedValue ? (
            <TamaguiSelect.Value>{selectedValue}</TamaguiSelect.Value>
          ) : (
            <TamaguiSelect.Value placeholder={placeholder} />
          )}
        </TamaguiSelect.Trigger>

        <TamaguiSelect.Content>
          <TamaguiSelect.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} color="$appText" />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius="$4"
            />
          </TamaguiSelect.ScrollUpButton>

          <TamaguiSelect.Viewport
            minWidth={200}
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <TamaguiSelect.Group>
              {renderedOptions ? renderedOptions : <YStack padding="$4">{children}</YStack>}
            </TamaguiSelect.Group>
          </TamaguiSelect.Viewport>

          <TamaguiSelect.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius="$4"
            />
          </TamaguiSelect.ScrollDownButton>
        </TamaguiSelect.Content>
      </TamaguiSelect>
    </YStack>
  )
}
