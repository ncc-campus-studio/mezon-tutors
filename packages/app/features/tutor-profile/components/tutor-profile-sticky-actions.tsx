'use client';

import { ReactNode } from 'react';
import { Container, XStack } from '@mezon-tutors/app/ui';

type TutorProfileStickyActionsProps = {
  children: ReactNode;
};

export function TutorProfileStickyActions({ children }: TutorProfileStickyActionsProps) {
  return (
    <XStack
      position="sticky"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="$background"
      borderTopWidth={1}
      borderColor="$borderSubtle"
      paddingVertical="$4"
      zIndex={10}
      $xs={{ paddingVertical: '$3' }}
    >
      <Container
        padded
        maxWidth={960}
        width="100%"
        $xs={{ paddingHorizontal: '$3' }}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          $xs={{
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '$3',
          }}
        >
          {children}
        </XStack>
      </Container>
    </XStack>
  );
}
