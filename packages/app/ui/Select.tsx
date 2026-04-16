'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import {
  YStack,
  Text,
  Select as TamaguiSelect,
  SelectProps as TamaguiSelectProps,
} from 'tamagui'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { LinearGradient } from 'tamagui/linear-gradient'
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { Controller } from 'react-hook-form'

type Option = {
  label: string
  value: string
}

type SelectOwnProps = {
  label?: string
  options?: Option[]
  placeholder?: string
  width?: number | string
  flex?: number
  gap?: number | string
  helperText?: string
  children?: ReactNode
}

type SelectStandaloneProps = Omit<TamaguiSelectProps, 'value' | 'defaultValue' | 'onValueChange'> &
  SelectOwnProps & {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
  }

type SelectFormProps<TFieldValues extends FieldValues> = Omit<
  TamaguiSelectProps,
  'value' | 'defaultValue' | 'onValueChange'
> &
  SelectOwnProps & {
    name: Path<TFieldValues>
    control: Control<TFieldValues>
    rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  }

export type SelectProps<TFieldValues extends FieldValues = FieldValues> =
  | SelectStandaloneProps
  | SelectFormProps<TFieldValues>

type SelectFieldProps = {
  label?: string
  options?: Option[]
  placeholder: string
  width?: number | string
  flex?: number
  gap: number | string
  helperText?: string
  errorMessage?: string
  selectedValue: string
  onSelectedValueChange: (val: string) => void
  onTriggerBlur?: () => void
  children?: ReactNode
  tamaguiSelectRest: Omit<TamaguiSelectProps, 'value' | 'defaultValue' | 'onValueChange'>
}

function SelectField({
  label,
  options,
  placeholder,
  width,
  flex,
  gap,
  helperText,
  errorMessage,
  selectedValue,
  onSelectedValueChange,
  onTriggerBlur,
  children,
  tamaguiSelectRest,
}: SelectFieldProps) {
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

  const borderColor = errorMessage ? '$red9' : '$borderSubtle'

  return (
    <YStack flex={flex} width={width} gap={gap}>
      {label ? (
        <Text fontSize="$3" fontWeight="500" color="$colorMuted">
          {label}
        </Text>
      ) : null}

      <TamaguiSelect
        value={selectedValue}
        onValueChange={onSelectedValueChange}
        {...tamaguiSelectRest}
      >
        <TamaguiSelect.Trigger
          width={width}
          iconAfter={ChevronDown}
          borderRadius="$4"
          backgroundColor="$fieldBackground"
          color="$appText"
          borderWidth={1}
          borderColor={borderColor}
          focusVisibleStyle={{ outlineWidth: 0, outlineStyle: 'none' }}
          focusStyle={{ borderColor }}
          {...(onTriggerBlur ? { onBlur: onTriggerBlur } : {})}
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

      {errorMessage ? (
        <Text fontSize="$3" fontWeight="500" color="$red10">
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text fontSize="$3" fontWeight="500" color="$colorMuted">
          {helperText}
        </Text>
      ) : null}
    </YStack>
  )
}

export function Select<TFieldValues extends FieldValues = FieldValues>(props: SelectProps<TFieldValues>) {
  const {
    label,
    options,
    placeholder = 'Select...',
    flex,
    width = 220,
    gap = '$2',
    helperText,
    children,
    control,
    name,
    rules,
    value,
    defaultValue,
    onValueChange,
    ...tamaguiSelectRest
  } = props as any

  const isForm = control != null && name != null

  const [internalValue, setInternalValue] = useState((defaultValue ?? '') as string)
  const isControlled = value !== undefined
  const selectedValueStandalone = isControlled ? String(value ?? '') : internalValue

  if (isForm) {
    return (
      <Controller
        control={control as any}
        name={name as any}
        rules={rules as any}
        render={({ field, fieldState }) => (
          <SelectField
            label={label}
            options={options}
            placeholder={placeholder}
            width={width}
            flex={flex}
            gap={gap}
            helperText={helperText}
            errorMessage={
              typeof fieldState.error?.message === 'string' ? fieldState.error?.message : undefined
            }
            selectedValue={field.value ? String(field.value) : ''}
            onSelectedValueChange={field.onChange}
            onTriggerBlur={field.onBlur}
            children={children}
            tamaguiSelectRest={tamaguiSelectRest as Omit<
              TamaguiSelectProps,
              'value' | 'defaultValue' | 'onValueChange'
            >}
          />
        )}
      />
    )
  }

  return (
    <SelectField
      label={label}
      options={options}
      placeholder={placeholder}
      width={width}
      flex={flex}
      gap={gap}
      helperText={helperText}
      selectedValue={selectedValueStandalone}
      onSelectedValueChange={(val) => {
        if (!isControlled) setInternalValue(val)
        onValueChange?.(val)
      }}
      children={children}
      tamaguiSelectRest={tamaguiSelectRest as Omit<
        TamaguiSelectProps,
        'value' | 'defaultValue' | 'onValueChange'
      >}
    />
  )
}
