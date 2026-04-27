'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller, useFormState } from 'react-hook-form';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';

type UploadImageProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  accept?: string;
  uploadLabel: string;
  hint?: string;
  icon?: ReactNode;
};

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/jpg';

export function UploadImage<TFormValues extends FieldValues>({
  control,
  name,
  accept = DEFAULT_ACCEPT,
  uploadLabel,
  hint,
  icon,
}: UploadImageProps<TFormValues>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { submitCount } = useFormState({ control });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange }, fieldState: { error, isDirty, isTouched } }) => {
        const shouldShowError =
          !!error?.message && (submitCount > 0 || isDirty || isTouched);

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

            <YStack
              width="100%"
              maxWidth={420}
              gap="$2"
              $xs={{ maxWidth: '100%' }}
            >
              <Button
                variant="primary"
                onPress={() => inputRef.current?.click()}
              >
                <XStack
                  alignItems="center"
                  gap="$2"
                >
                  {icon}
                  <Text color="white">{uploadLabel}</Text>
                </XStack>
              </Button>
              {hint ? (
                <Text
                  size="sm"
                  variant="muted"
                  textAlign="center"
                >
                  {hint}
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
          </>
        );
      }}
    />
  );
}
