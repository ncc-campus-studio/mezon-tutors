'use client';

import type { Control, FieldValues, RegisterOptions } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Field } from './Field';

export type InputFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  rules?: RegisterOptions;
  flex?: number;
  id?: string;
  suggestions?: readonly string[];
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
        />
      )}
    />
  );
}
