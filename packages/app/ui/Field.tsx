'use client';

import { useTheme, Input, Label, YStack, isWeb } from 'tamagui';
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
  /** Gợi ý hiển thị khi nhập (dùng native input + datalist trên web). */
  suggestions?: readonly string[];
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

  return (
    <YStack gap="$2" flex={flex}>
      <Label htmlFor={inputId} color="$colorMuted" fontSize={13}>
        {label}
      </Label>
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
          backgroundColor="$fieldBackground"
          borderColor={error ? '$red9' : '$borderSubtle'}
          color="$color"
          paddingHorizontal="$4"
          height={48}
          borderRadius="$5"
          value={value}
          onChangeText={onChangeText}
        />
      )}
      {error ? (
        <Text size="sm" color="$red10" fontWeight="500">
          {error}
        </Text>
      ) : helperText ? (
        <Text size="sm" variant="muted">
          {helperText}
        </Text>
      ) : null}
    </YStack>
  );
}
