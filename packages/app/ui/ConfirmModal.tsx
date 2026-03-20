import { AlertDialog, XStack, YStack } from 'tamagui';
import { AppButton } from './AppButton';
import { Paragraph } from 'tamagui';

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  /** When true, confirm button uses destructive style */
  destructive?: boolean;
  /** When true, confirm button is disabled and shows loading state */
  isLoading?: boolean;
}

/**
 * Reusable confirmation modal using Tamagui's AlertDialog.
 * Designed to be used for important or destructive actions across the app.
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = false,
  isLoading = false,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Confirmation action failed:', error);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="$backgroundMuted"
        />
        <AlertDialog.Content
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          elevate
          borderRadius="$4"
          padding="$5"
          width="95%"
          maxWidth={450}
          $gtSm={{ width: 450 }}
          backgroundColor="$background"
          elevation="$4"
        >
          <YStack gap="$4">
            <YStack gap="$2">
              <AlertDialog.Title
                fontSize={20}
                fontWeight="700"
                color="$color"
                $xs={{ fontSize: 18 }}
              >
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description asChild>
                <Paragraph
                  fontSize={15}
                  color="$color11"
                  lineHeight={22}
                  $xs={{ fontSize: 14, lineHeight: 20 }}
                >
                  {description}
                </Paragraph>
              </AlertDialog.Description>
            </YStack>

            <XStack
              gap="$3"
              justifyContent="flex-end"
              $xs={{ flexDirection: 'column-reverse', gap: '$2' }}
            >
              <AlertDialog.Cancel asChild>
                <AppButton
                  variant="outline"
                  onPress={() => onOpenChange(false)}
                  disabled={isLoading}
                  $xs={{ width: '100%' }}
                >
                  {cancelLabel}
                </AppButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <AppButton
                  variant={destructive ? 'reject' : 'primary'}
                  onPress={handleConfirm}
                  disabled={isLoading}
                  $xs={{ width: '100%' }}
                >
                  {isLoading ? '...' : confirmLabel}
                </AppButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
