import { Button, Dialog, Text, Textarea, XStack } from '@mezon-tutors/app/ui'
import { useMezonLight } from '@mezon-tutors/app/provider/MezonLightProvider'
import {
  createMezonLightDM,
  persistMezonLightSession,
  refreshMezonLightSession,
  restoreMezonLightClientFromStorage,
  sendMezonLightDMWithRefreshFallback,
  useGetDmChannel,
  useUpsertDmChannelMutation,
} from '@mezon-tutors/app/services'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useTheme } from 'tamagui'

type TutorMessageModalProps = {
  open: boolean
  tutorFirstName: string
  studentId: string
  studentMezonUserId?: string
  tutorId: string
  tutorMezonUserId?: string
  onOpenChange: (open: boolean) => void
}

export function TutorMessageModal({
  open,
  tutorFirstName,
  studentId,
  studentMezonUserId,
  tutorId,
  tutorMezonUserId,
  onOpenChange,
}: TutorMessageModalProps) {
  const t = useTranslations('Tutors.TutorCard')
  const theme = useTheme()
  const [messageContent, setMessageContent] = useState('')
  const [messageError, setMessageError] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const { lightClient, setLightClient } = useMezonLight()
  const { refetch: refetchDmChannel } = useGetDmChannel(studentId, tutorId, false)
  const upsertDmChannelMutation = useUpsertDmChannelMutation()

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setMessageError('')
    }
    onOpenChange(nextOpen)
  }

  const handleSend = async () => {
    const content = messageContent.trim()

    if (!studentId) {
      setMessageError(t('messageModal.errors.missingStudentId'))
      return
    }
    if (!studentMezonUserId) {
      setMessageError(t('messageModal.errors.missingStudentMezonUserId'))
      return
    }
    if (!tutorMezonUserId) {
      setMessageError(t('messageModal.errors.missingTutorMezonUserId'))
      return
    }
    if (!tutorId) {
      setMessageError(t('messageModal.errors.missingTutorId'))
      return
    }
    if (!content) {
      setMessageError(t('messageModal.errors.emptyContent'))
      return
    }

    setMessageError('')
    setIsSendingMessage(true)

    try {
      let client = lightClient

      if (!client) {
        client = await restoreMezonLightClientFromStorage()
        if (!client) {
          throw new Error('Cannot restore Mezon client from storage. Please login again.')
        }
        setLightClient(client)
      }

      const isSessionExpired = await client.isSessionExpired()
      if (isSessionExpired) {
        await refreshMezonLightSession(client)
        await persistMezonLightSession(client)
      }

      let channelId = (await refetchDmChannel()).data?.channelId

      if (!channelId) {
        const dmChannel = await createMezonLightDM(client, tutorMezonUserId)
        channelId = dmChannel?.channel_id
        if (!channelId) {
          throw new Error(t('messageModal.errors.missingChannelId'))
        }
        await upsertDmChannelMutation.mutateAsync({
          studentId,
          tutorId,
          channelId,
        })
      }
      await sendMezonLightDMWithRefreshFallback(client, channelId, content)

      setMessageContent('')
      setMessageError('')
      onOpenChange(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : t('messageModal.errors.sendFailed')
      setMessageError(message)
      console.error(error)
    } finally {
      setIsSendingMessage(false)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          backgroundColor={theme.background?.get() ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.35)'}
        />
        <Dialog.Content
          key="content"
          width={500}
          maxWidth="95vw"
          borderRadius={16}
          backgroundColor="$background"
          elevate
          gap="$4"
        >
          <Dialog.Title>{t('messageModal.title', { tutorName: tutorFirstName })}</Dialog.Title>

          <Textarea
            value={messageContent}
            onChangeText={(text) => {
              setMessageContent(text)
              if (messageError) {
                setMessageError('')
              }
            }}
            placeholder={t('messageModal.placeholder')}
            placeholderTextColor={theme.colorMuted?.get() ?? '#9CA3AF'}
            backgroundColor="$fieldBackground"
            borderColor="$borderSubtle"
          />
          {!!messageError && (
            <Text color="$red10" size="$3">
              {messageError}
            </Text>
          )}

          <XStack justifyContent="flex-end" gap="$3">
            <Button variant="outline" onPress={() => onOpenChange(false)} disabled={isSendingMessage}>
              {t('messageModal.cancel')}
            </Button>
            <Button variant="primary" onPress={handleSend} disabled={isSendingMessage}>
              {isSendingMessage ? t('messageModal.sending') : t('messageModal.send')}
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
