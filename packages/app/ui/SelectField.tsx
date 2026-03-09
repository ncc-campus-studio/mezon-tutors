'use client';

import type { Control, FieldValues, RegisterOptions } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTheme, Label, YStack } from 'tamagui';
import { Text } from './Text';

export type SelectFieldProps = {
  label: string;
  placeholder?: string;
  helperText?: string;
  flex?: number;
  id?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  options: readonly string[];
};

export function SelectField({
  label,
  placeholder = 'Select...',
  helperText,
  flex,
  id,
  value,
  onValueChange,
  error,
  options = [],
}: SelectFieldProps) {
  const theme = useTheme();
  const selectId = id ?? label;
  const contentColor = theme.appText?.get() ?? theme.color?.get() ?? '#111827';
  const mutedColor = theme.colorMuted?.get() ?? '#6B7280';

  const currentValue = value != null && value !== '' ? String(value) : '';
  const optionList = Array.isArray(options) ? [...options] : [];
  const valueInOptions = currentValue && optionList.includes(currentValue);
  const displayText = currentValue ? currentValue : placeholder;

  const containerStyle: Record<string, unknown> = {
    position: 'relative',
    width: '100%',
    height: 48,
  };

  const selectStyle: Record<string, unknown> = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    opacity: 0,
    cursor: 'pointer',
    zIndex: 1,
  };

  const displayStyle: Record<string, unknown> = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: error
      ? (theme.red9?.get() ?? '#991b1b')
      : (theme.borderSubtle?.get() ?? '#E5E7EB'),
    backgroundColor: theme.fieldBackground?.get() ?? '#F1F5F9',
    color: currentValue ? contentColor : mutedColor,
    fontSize: 16,
    lineHeight: 20,
    pointerEvents: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(mutedColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
  };

  return (
    <YStack
      gap="$2"
      flex={flex}
    >
      <Label
        htmlFor={selectId}
        color="$colorMuted"
        fontSize={13}
      >
        {label}
      </Label>
      <div style={containerStyle}>
        <div style={displayStyle} aria-hidden>
          {displayText}
        </div>
        <select
          id={selectId}
          value={currentValue}
          onChange={(e) => onValueChange?.(e.target.value)}
          style={selectStyle}
          aria-invalid={!!error}
          aria-label={label}
        >
          <option value="">{placeholder}</option>
          {currentValue && !valueInOptions && <option value={currentValue}>{currentValue}</option>}
          {optionList.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <Text
          size="sm"
          color="$red10"
          fontWeight="500"
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          size="sm"
          variant="muted"
        >
          {helperText}
        </Text>
      ) : null}
    </YStack>
  );
}

// --- SelectField for react-hook-form ---

export type SelectInputFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  rules?: RegisterOptions<TFieldValues>;
  flex?: number;
  id?: string;
  options: readonly string[];
};

export function SelectInputField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  helperText,
  rules,
  flex,
  id,
  options,
}: SelectInputFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <SelectField
          id={id}
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          flex={flex}
          value={value === undefined || value === null ? '' : String(value)}
          onValueChange={onChange}
          error={error?.message}
          options={options}
        />
      )}
    />
  );
}
