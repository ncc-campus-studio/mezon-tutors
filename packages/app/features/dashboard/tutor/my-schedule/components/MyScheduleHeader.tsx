import { Button, Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { PlusIcon } from '@mezon-tutors/app/ui/icons';
import { RefreshCw } from '@tamagui/lucide-icons';
import { useTranslations } from 'next-intl';
import { useTheme } from 'tamagui';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { availabilityService } from '@mezon-tutors/app/services/availability.service';
import { AvailabilityModal } from './AvailabilityModal';
import type { AvailabilityData } from '@mezon-tutors/app/features/availability';

export function MyScheduleHeader() {
  const t = useTranslations('MySchedule.header');
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<AvailabilityData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen && !initialData) {
      loadAvailability();
    }
  }, [isModalOpen]);

  const loadAvailability = async () => {
    setIsLoading(true);
    try {
      const data = await availabilityService.getAvailability();
      setInitialData(data);
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAvailability = async (data: AvailabilityData) => {
    setIsSaving(true);
    try {
      await availabilityService.updateAvailability(data);
      await queryClient.invalidateQueries({ queryKey: ['my-schedule'] });
      setInitialData(data);
    } catch (error) {
      console.error('Failed to save availability:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap="$3">
        <YStack gap="$2" maxWidth={620}>
          <Text fontSize={56} lineHeight={60} fontWeight="800" color="$dashboardTutorTextPrimary">
            {t('title')}
          </Text>
          <Text fontSize={14} lineHeight={22} color="$dashboardTutorTextSecondary" opacity={0.92}>
            {t('subtitle')}
          </Text>
        </YStack>

        <XStack gap="$3" marginTop="$1.5">
          <Button
            size="$4"
            variant="outlined"
            icon={RefreshCw}
            borderColor="$dashboardTutorActionGhostBorder"
            color="$dashboardTutorActionGhostText"
            backgroundColor="$dashboardTutorActionGhostBg"
          >
            {t('syncCalendar')}
          </Button>
          <Button 
            size="$4" 
            backgroundColor="$myScheduleAddButtonBg"
            color="$myScheduleAddButtonText"
            icon={<PlusIcon size={18} color={theme.myScheduleAddButtonIcon?.val || '#FFFFFF'} />}
            onPress={() => setIsModalOpen(true)}
            hoverStyle={{
              backgroundColor: '$blue11',
            }}
          >
            {t('addAvailability')}
          </Button>
        </XStack>
      </XStack>

      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAvailability}
        initialData={initialData}
        isSaving={isSaving}
        isLoading={isLoading}
      />
    </>
  );
}
