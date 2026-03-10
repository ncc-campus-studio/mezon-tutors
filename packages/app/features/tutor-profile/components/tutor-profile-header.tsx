'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Paragraph, Text, XStack } from '@mezon-tutors/app/ui';
import { GraduationCapIcon } from '@mezon-tutors/app/ui/icons/GraduationCapIcon';

type TutorProfileHeaderProps = {
  draftSavedLabel: string;
  saveExitLabel: string;
  onSaveExit?: () => void;
  leftTitle?: ReactNode;
};

export function TutorProfileHeader({
  draftSavedLabel,
  saveExitLabel,
  onSaveExit,
  leftTitle,
}: TutorProfileHeaderProps) {
  const t = useTranslations('Common.Header');

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      gap="$4"
      $xs={{
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <XStack
        alignItems="center"
        gap="$3"
      >
        <GraduationCapIcon
          size={40}
          color="#1253D5"
        />
        {leftTitle ? (
          leftTitle
        ) : (
          <Paragraph
            fontWeight="700"
            fontSize={18}
            letterSpacing={-0.3}
          >
            {t('title')}
          </Paragraph>
        )}
      </XStack>

      <XStack
        alignItems="center"
        gap="$3"
        $xs={{
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        {draftSavedLabel ? (
          <Text
            size="sm"
            variant="muted"
          >
            {draftSavedLabel}
          </Text>
        ) : null}
        <Button
          variant="ghost"
          borderColor="$borderColor"
          backgroundColor="$backgroundMuted"
          onPress={onSaveExit}
        >
          {saveExitLabel}
        </Button>
      </XStack>
    </XStack>
  );
}
