'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { Button, Card, Dialog, Paragraph, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import { InfoIcon, MessageDotsIcon } from '@mezon-tutors/app/ui/icons'
import { userAtom } from '@mezon-tutors/app/store/auth.atom'
import { useTranslations } from 'next-intl'
import { useMezonLight } from '@mezon-tutors/app/provider/MezonLightProvider'
import {
  persistMezonLightSession,
  refreshMezonLightSession,
  restoreMezonLightClientFromStorage,
  sendMezonLightDMWithRefreshFallback,
  useGetMyDmChannels,
} from '@mezon-tutors/app/services'
import { buildFakeMessages, getRandomFakeSetIndex } from './global-chat.fake'
import { MEZON_CHAT_URL, MEZON_DIRECT_MESSAGE_URL, MEZON_URL } from '@mezon-tutors/shared'

type RuntimeMessage = {
  id: string
  sender: 'me'
  content: string
}

const MIN_ROWS = 1
const MAX_ROWS = 5

export default function GlobalChatBubble() {
  const t = useTranslations('GlobalChat')
  const currentUser = useAtomValue(userAtom)
  const { lightClient, setLightClient } = useMezonLight()
  const [open, setOpen] = useState(false)
  const [fakeSetIndex, setFakeSetIndex] = useState(0)
  const [selectedChannelId, setSelectedChannelId] = useState<string>('')
  const [messageContent, setMessageContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [runtimeMessagesByChannel, setRuntimeMessagesByChannel] = useState<
    Record<string, RuntimeMessage[]>
  >({})

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: channels = [] } = useGetMyDmChannels(Boolean(currentUser?.id))

  const selectedChannel = useMemo(() => {
    if (!channels.length) {
      return null
    }
    const fallback = channels[0]
    return channels.find((item) => item.channelId === selectedChannelId) ?? fallback
  }, [channels, selectedChannelId])

  const runtimeMessages = selectedChannel ? runtimeMessagesByChannel[selectedChannel.channelId] ?? [] : []
  const mySenderRole = useMemo<'student' | 'tutor' | null>(() => {
    if (!selectedChannel || !currentUser?.id) {
      return null
    }
    return selectedChannel.studentId === currentUser.id ? 'student' : 'tutor'
  }, [selectedChannel, currentUser?.id])

  const fakeMessages = useMemo(
    () => (selectedChannel ? buildFakeMessages(t, selectedChannel.peerName, fakeSetIndex) : []),
    [selectedChannel, fakeSetIndex, t],
  )

  useEffect(() => {
    if (!open) {
      return
    }
    setFakeSetIndex(getRandomFakeSetIndex())
  }, [open])

  const handleSend = async () => {
    const content = messageContent.trim()
    if (!content || !selectedChannel || !currentUser) {
      return
    }

    setIsSending(true)
    try {
      let client = lightClient
      if (!client) {
        client = await restoreMezonLightClientFromStorage()
        if (!client) {
          throw new Error(t('restoreError'))
        }
        setLightClient(client)
      }

      const isSessionExpired = await client.isSessionExpired()
      if (isSessionExpired) {
        await refreshMezonLightSession(client)
        await persistMezonLightSession(client)
      }

      await sendMezonLightDMWithRefreshFallback(client, selectedChannel.channelId, content)

      setRuntimeMessagesByChannel((prev) => ({
        ...prev,
        [selectedChannel.channelId]: [
          ...(prev[selectedChannel.channelId] ?? []),
          {
            id: `runtime-${Date.now()}`,
            sender: 'me',
            content,
          },
        ],
      }))
      setMessageContent('')
    } catch (error) {
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current
    if (!el) return

    setMessageContent(e.target.value)

    el.style.height = 'auto'

    const lineHeight = 20
    const maxHeight = lineHeight * MAX_ROWS

    if (el.scrollHeight > maxHeight) {
      el.style.height = `${maxHeight}px`
      el.style.overflowY = 'auto'
    } else {
      el.style.height = `${el.scrollHeight}px`
      el.style.overflowY = 'hidden'
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <>
      <YStack style={{ position: 'fixed', right: 30, bottom: 30, zIndex: 2000 }}>
        <Button
          variant="primary"
          borderRadius={999}
          width={52}
          height={52}
          padding={0}
          onPress={() => setOpen(true)}
          aria-label={t('chatButton')}
        >
          <MessageDotsIcon size={25} color="white" />
        </Button>
      </YStack>

      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" backgroundColor="rgba(0, 0, 0, 0.35)" />
          <Dialog.Content key="content" width={980} maxWidth="95vw" height={600} borderRadius={16} elevate gap="$4">
            <XStack alignItems="center" justifyContent="space-between">
              <Dialog.Title>{t('title')}</Dialog.Title>
              <Button
                size="sm"
                variant="outline"
                onPress={() => window.open(MEZON_CHAT_URL, '_blank', 'noopener,noreferrer')}
              >
                {t('openMezon')}
              </Button>
            </XStack>
            <XStack gap="$4" flex={1} minHeight={0}>
              <Card width={300} padding="$3" borderWidth={1} borderColor="$borderSubtle">
                <YStack gap="$2">
                  <Text fontWeight="700">{t('listTitle')}</Text>
                  {channels.length === 0 && (
                    <Paragraph color="$colorMuted">{t('emptyList')}</Paragraph>
                  )}
                  {channels.map((item) => (
                    <Button
                      key={item.channelId}
                      variant={selectedChannel?.channelId === item.channelId ? 'primary' : 'outline'}
                      justifyContent="flex-start"
                      onPress={() => setSelectedChannelId(item.channelId)}
                    >
                      {item.peerName}
                    </Button>
                  ))}
                </YStack>
              </Card>

              <Card flex={1} padding="$3" borderWidth={1} borderColor="$borderSubtle">
                {!selectedChannel ? (
                  <YStack flex={1} justifyContent="center" alignItems="center">
                    <Text color="$colorMuted">{t('emptyConversation')}</Text>
                  </YStack>
                ) : (
                  <YStack flex={1} gap="$3" minHeight={0}>
                    <Text fontWeight="700">{selectedChannel.peerName}</Text>
                    <YStack flex={1} gap="$2" style={{ overflowY: 'auto' }}>
                      {fakeMessages.map((message) => (
                        <Card
                          key={message.id}
                          alignSelf={message.sender === mySenderRole ? 'flex-end' : 'flex-start'}
                          maxWidth="75%"
                          padding="$2"
                          borderRadius={18}
                          backgroundColor={message.sender === mySenderRole ? '$appPrimary' : '$backgroundStrong'}
                          style={{ filter: 'blur(2px)', opacity: 0.65 }}
                        >
                          <Text color={message.sender === mySenderRole ? 'white' : undefined}>
                            {message.content}
                          </Text>
                        </Card>
                      ))}

                      {runtimeMessages.map((message) => (
                        <Card
                          key={message.id}
                          alignSelf="flex-end"
                          maxWidth="75%"
                          paddingVertical="$2"
                          paddingHorizontal="$3"
                          borderRadius={18}
                          borderWidth={1}
                          borderColor="rgba(255, 255, 255, 0.5)"
                          backgroundColor="$appPrimary"
                        >
                          <Text color="white">{message.content}</Text>
                        </Card>
                      ))}
                    </YStack>

                    <XStack
                      gap="$2"
                      alignItems="center"
                      padding="$3"
                      borderWidth={1}
                      borderColor="rgba(96, 165, 250, 0.28)"
                      backgroundColor="$backgroundMuted"
                      borderRadius={14}
                      style={{ backdropFilter: 'blur(10px)' }}
                    >
                      <YStack flex={1} gap={4}>
                        <XStack alignItems="center" gap="$2">
                          <InfoIcon size={16} color="#F59E0B" />
                          <Text color="#F59E0B" fontWeight="700" fontSize="$3">
                            {t('noticeTitle')}
                          </Text>
                        </XStack>
                        <Paragraph color="$colorMuted" fontSize="$3">
                          {t('noticePrefix')}
                          <a 
                            href={MEZON_URL}
                            target="_blank"
                            style={{ color:'#1253D5', fontWeight: '700', textDecoration: 'none' }}>
                            {t('noticeLink')}
                          </a>
                          <br />
                          {t('noticeOpenChatPrefix')}
                          <a
                            href={MEZON_DIRECT_MESSAGE_URL(selectedChannel.channelId)}
                            target="_blank"
                            style={{ color: '#1253D5', fontWeight: '700' }}
                          >
                            {t('noticeOpenChatLink')}
                          </a>
                          {t('noticeOpenChatSuffix')}
                        </Paragraph>
                      </YStack>
                    </XStack>

                    <XStack gap="$2" alignItems="center">
                      <textarea
                        ref={textareaRef}
                        rows={MIN_ROWS}
                        value={messageContent}
                        onChange={handleChange}
                        placeholder={t('inputPlaceholder')}
                        style={{
                          resize: 'none',
                          overflowY: 'hidden',
                          overflowX: 'hidden',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          lineHeight: '20px',
                          padding: '10px 12px',
                          borderRadius: '20px',
                          border: '1px solid #ccc',
                          width: '100%',
                          fontSize: '14px',
                        }}
                      />
                      <Button variant="primary" onPress={handleSend} disabled={isSending || !messageContent.trim()}>
                        {isSending ? t('sending') : t('send')}
                      </Button>
                    </XStack>
                  </YStack>
                )}
              </Card>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
