import { useState, useRef } from 'react';
import { YStack, Text, XStack, Button } from '@mezon-tutors/app/ui';
import { X } from '@tamagui/lucide-icons';
import { useTranslations } from 'next-intl';
import { AvailabilityEditor } from '@mezon-tutors/app/features/availability';
import type { AvailabilityData } from '@mezon-tutors/app/features/availability';

type AvailabilityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AvailabilityData) => Promise<void>;
  initialData?: AvailabilityData;
  isSaving?: boolean;
  isLoading?: boolean;
};

export function AvailabilityModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
  isLoading = false,
}: AvailabilityModalProps) {
  const t = useTranslations('MySchedule');
  const tProfile = useTranslations('TutorProfile.Availability');
  const submitFnRef = useRef<(() => void) | null>(null);

  if (!isOpen) return null;

  const handleSave = async (data: AvailabilityData) => {
    await onSave(data);
    onClose();
  };

  const handleSaveClick = () => {
    if (submitFnRef.current) {
      submitFnRef.current();
    }
  };

  const handleSubmitReady = (fn: () => void) => {
    submitFnRef.current = fn;
  };

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={9999}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$myScheduleModalOverlay"
      onPress={onClose}
      style={{ position: 'fixed' } as any}
    >
      <YStack
        width="90%"
        maxWidth={800}
        maxHeight="90vh"
        backgroundColor="$myScheduleModalBackground"
        borderRadius={20}
        borderWidth={1}
        borderColor="$myScheduleModalBorder"
        overflow="hidden"
        onPress={(e) => e.stopPropagation()}
      >
        <YStack
          padding="$5"
          borderBottomWidth={1}
          borderBottomColor="$myScheduleModalBorder"
        >
          <YStack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text
              color="$myScheduleModalTitle"
              fontSize={24}
              lineHeight={32}
              fontWeight="700"
            >
              {t('availability.title')}
            </Text>
            <YStack
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$myScheduleModalBorder"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              hoverStyle={{ backgroundColor: '$myScheduleModalCloseHover', opacity: 0.8 }}
              onPress={onClose}
            >
              <X size={20} color="$myScheduleModalCloseIcon" />
            </YStack>
          </YStack>
        </YStack>

        <YStack 
          flex={1}
          padding="$5" 
          overflow="scroll" 
          maxHeight="calc(90vh - 200px)"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          } as any}
          className="hide-scrollbar"
        >
          {isLoading ? (
            <YStack alignItems="center" justifyContent="center" padding="$10">
              <Text color="$myScheduleModalTitle">{t('availability.loading')}</Text>
            </YStack>
          ) : (
            <AvailabilityEditor
              mode="edit"
              initialData={initialData}
              onSave={handleSave}
              showActions={false}
              isSaving={isSaving}
              onSubmitReady={handleSubmitReady}
            />
          )}
        </YStack>

        <YStack
          padding="$5"
          borderTopWidth={1}
          borderTopColor="$myScheduleModalBorder"
          backgroundColor="$myScheduleModalBackground"
        >
          <XStack gap="$3" justifyContent="flex-end">
            <Button variant="outline" onPress={onClose} disabled={isSaving}>
              {tProfile('cancel')}
            </Button>
            <Button 
              variant="primary" 
              onPress={handleSaveClick} 
              disabled={isSaving}
            >
              {isSaving ? tProfile('saving') : tProfile('save')}
            </Button>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
