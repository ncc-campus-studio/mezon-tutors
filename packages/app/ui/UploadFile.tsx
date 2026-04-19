'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller, useFormState } from 'react-hook-form';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Text, YStack } from '@mezon-tutors/app/ui';

type UploadFileProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  accept: string;
  icon?: ReactNode;
  prompt: string;
  hint?: string;
  persistedFileName?: string | null;
};

export function UploadFile<TFormValues extends FieldValues>({
  control,
  name,
  accept,
  icon,
  prompt,
  hint,
  persistedFileName,
}: UploadFileProps<TFormValues>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { submitCount } = useFormState({ control });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error, isTouched, isDirty } }) => {
        const maybeFile = value as unknown;
        const file = maybeFile instanceof File ? maybeFile : null;
        const shouldShowError =
          !!error?.message && (submitCount > 0 || isTouched || isDirty);

        return (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              style={{ display: 'none' }}
              onChange={(e) => {
                const nextFile = e.target.files?.[0] ?? null;
                onChange(nextFile);
                e.target.value = '';
              }}
            />

            <button
              type="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const nextFile = e.dataTransfer.files?.[0] ?? null;
                onChange(nextFile);
              }}
            >
              <YStack
                borderRadius="$4"
                borderWidth={1}
                borderColor="$borderSubtle"
                borderStyle="dashed"
                padding="$6"
                alignItems="center"
                justifyContent="center"
                backgroundColor="$fieldBackground"
                gap="$2"
              >
                {icon ? icon : null}
                <Text size="sm" variant="muted" textAlign="center">
                  {prompt}
                </Text>
                {hint ? (
                  <Text size="sm" variant="muted">
                    {hint}
                  </Text>
                ) : null}

                {file ? (
                  <Text
                    size="sm"
                    color="$appPrimary"
                    fontWeight="500"
                  >
                    {file.name}
                  </Text>
                ) : persistedFileName ? (
                  <Text
                    size="sm"
                    color="$appPrimary"
                    fontWeight="500"
                  >
                    {persistedFileName}
                  </Text>
                ) : null}

                {shouldShowError && error ? (
                  <Text
                    size="md"
                    color="$red10"
                    fontWeight="500"
                    textAlign="center"
                  >
                    {error.message}
                  </Text>
                ) : null}
              </YStack>
            </button>
          </>
        );
      }}
    />
  );
}

