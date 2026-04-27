'use client';

import type { Control, FieldValues, RegisterOptions, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { ColorTokens } from 'tamagui';
import { Field } from './Field';

export type InputFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  flex?: number;
  id?: string;
  suggestions?: readonly string[];
  backgroundColor?: ColorTokens | string;
  borderWidth?: number;
  height?: number | string;
  width?: number | string;
};

export function InputField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  helperText,
  rules,
  flex,
  id,
  suggestions,
  backgroundColor,
  borderWidth,
  height,
  width,
}: InputFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Field
          id={id}
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          flex={flex}
          value={value as string}
          onChangeText={onChange}
          error={error?.message}
          suggestions={suggestions}
          backgroundColor={backgroundColor}
          borderWidth={borderWidth}
          height={height}
          width={width}
        />
      )}
    />
  );
}
