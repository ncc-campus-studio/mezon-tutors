'use client';

import { useTheme, Input, YStack, isWeb, ColorTokens } from 'tamagui';
import { Text } from './Text';

export type FieldProps = {
  label: string;
  placeholder?: string;
  helperText?: string;
  flex?: number;
  id?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  error?: string;
  suggestions?: readonly string[];
  backgroundColor?: ColorTokens | string;
  borderWidth?: number;
  height?: number | string;
  width?: number | string;
};

export function Field({
  label,
  placeholder,
  helperText,
  flex,
  id,
  value,
  onChangeText,
  error,
  suggestions,
  backgroundColor,
  borderWidth,
  height,
  width,
}: FieldProps) {
  const theme = useTheme();
  const inputId = id ?? label;
  const listId = suggestions?.length ? `${inputId}-list` : undefined;
  const useNativeInputForSuggestions = isWeb && listId && suggestions && suggestions.length > 0;

  const inputStyle = useNativeInputForSuggestions
    ? {
        width: '100%' as const,
        height: 48,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid' as const,
        backgroundColor: theme.fieldBackground?.get() ?? '#f8f6f6',
        borderColor: error ? (theme.red9?.get() ?? '#991b1b') : (theme.borderSubtle?.get() ?? '#E5E7EB'),
        color: theme.appText?.get() ?? theme.color?.get() ?? '#111827',
        WebkitTextFillColor: theme.appText?.get() ?? theme.color?.get() ?? '#111827',
        fontSize: 16,
        outlineWidth: 0,
        outline: 'none',
      }
    : undefined;

  const normalizedLabel = typeof label === 'string' ? label.trim() : '';
  const normalizedError = typeof error === 'string' ? error.trim() : '';
  const normalizedHelperText = typeof helperText === 'string' ? helperText.trim() : '';

  return (
    <YStack gap="$2" flex={flex}>
      {normalizedLabel ? (
        <Text size="sm" color="$colorMuted">
          {normalizedLabel}
        </Text>
      ) : null}
      {useNativeInputForSuggestions ? (
        <>
          <input
            id={inputId}
            list={listId}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={(e) => onChangeText?.(e.target.value)}
            style={inputStyle}
            aria-invalid={!!error}
          />
          <datalist id={listId}>
            {suggestions!.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </>
      ) : (
        <Input
          id={inputId}
          placeholder={placeholder}
          placeholderTextColor="$colorMuted"
          backgroundColor={backgroundColor ?? '$fieldBackground'}
          borderColor={error ? '$red9' : '$borderSubtle'}
          borderWidth={borderWidth}
          color="$color"
          paddingHorizontal="$4"
          height={height ?? 48}
          width={width}
          borderRadius="$5"
          value={value}
          onChangeText={onChangeText}
          focusVisibleStyle={{
            outlineColor: error ? '$red9' : '',
          }}
        />
      )}
      {normalizedError ? (
        <Text size="sm" color="$red10" fontWeight="500">
          {normalizedError}
        </Text>
      ) : normalizedHelperText ? (
        <Text size="sm" variant="muted">
          {normalizedHelperText}
        </Text>
      ) : null}
    </YStack>
  );
}
