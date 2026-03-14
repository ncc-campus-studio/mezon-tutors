import { useTheme } from 'tamagui';
import { XStack, YStack } from '@mezon-tutors/app/ui';
import { EyeIcon } from '@mezon-tutors/app/ui/icons/EyeIcon';
import { useRouter } from 'solito/navigation';
import type { GestureResponderEvent } from 'react-native';

export type ApplicationActionsCellProps = {
  applicationId: string;
  isSelected: boolean;
};

export function ApplicationActionsCell({ applicationId, isSelected }: ApplicationActionsCellProps) {
  const theme = useTheme();
  const { push } = useRouter();
  const primaryColor = theme.appPrimary?.val;
  const itemBackground = theme.itemBackground?.val;
  const mutedColor = theme.colorMuted?.val;

  const handleEyePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    push(`/admin/tutor-applications/${applicationId}`);
  };

  return (
    <XStack
      justifyContent="flex-end"
      gap={10}
    >
      <YStack
        width={32}
        height={32}
        borderRadius={999}
        alignItems="center"
        justifyContent="center"
        backgroundColor={isSelected ? primaryColor : itemBackground}
        onPress={handleEyePress}
      >
        <EyeIcon
          size={16}
          color={isSelected ? '#FFFFFF' : mutedColor}
        />
      </YStack>
    </XStack>
  );
}
