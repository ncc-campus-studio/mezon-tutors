import { useEffect, useState } from 'react'
import { Button, Text, YStack } from '@mezon-tutors/app/ui'
import { TrianglePlayOutlineIcon } from '@mezon-tutors/app/ui/icons'
import { useTranslations } from 'next-intl'
import { createPortal } from 'react-dom'
import { getYoutubeEmbedUrl } from '@mezon-tutors/shared'
import { useTheme } from 'tamagui'

type VideoPreviewProps = {
  videoUrl?: string | null
  height?: number
  maxWidth?: number
  title?: string
}

export function VideoPreview({ videoUrl, height = 500, title = '' }: VideoPreviewProps) {
  const t = useTranslations('Tutors.VideoPreview')
  const theme = useTheme()

  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const embedUrl = getYoutubeEmbedUrl(videoUrl)
  const youtubeId = embedUrl ? (embedUrl.split('/').filter(Boolean).pop() ?? null) : null
  const isYoutubeVideo = Boolean(embedUrl && youtubeId)
  const hasVideoUrl = Boolean(videoUrl)
  const canOpenVideo = isYoutubeVideo
  const playIconColor = theme.tutorsVideoPlayIcon?.get() ?? '#FFFFFF'
  const overlayBg = theme.tutorsVideoOverlayBg?.get() ?? 'rgba(7, 15, 31, 0.72)'
  const frameBg = theme.tutorsVideoFrameBg?.get() ?? '#0B1220'

  useEffect(() => {
    if (!isVideoOpen) return
    if (typeof window === 'undefined') return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVideoOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isVideoOpen])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!isVideoOpen) return

    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [isVideoOpen])

  useEffect(() => {
    if (!videoUrl || !isYoutubeVideo) {
      setThumbnailUrl(null)
      return
    }
    if (typeof window === 'undefined') return

    setThumbnailUrl(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`)
  }, [videoUrl, youtubeId, isYoutubeVideo])

  return (
    <>
      <YStack
        backgroundColor="$color2"
        borderRadius="$4"
        overflow="hidden"
        position="relative"
        height={height}
        justifyContent="center"
        alignItems="center"
        cursor={canOpenVideo ? 'pointer' : 'default'}
        onPress={() => {
          if (!canOpenVideo) return
          setIsVideoOpen(true)
        }}
        style={
          thumbnailUrl
            ? ({
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } as const)
            : undefined
        }
      >
        {!!thumbnailUrl ? (
          <YStack
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            justifyContent="center"
            alignItems="center"
          >
            <YStack
              width={64}
              height={64}
              borderRadius={999}
              backgroundColor="$appPrimary"
              justifyContent="center"
              alignItems="center"
              paddingLeft="$2"
            >
              <TrianglePlayOutlineIcon width={22} height={26} color={playIconColor} />
            </YStack>
          </YStack>
        ) : (
          <>
            <Text size="$4" fontWeight="700">
              {title}
            </Text>
            <Text variant="muted" size="sm" marginTop="$1">
              {!hasVideoUrl ? t('noVideo') : !isYoutubeVideo ? t('invalidVideo') : t('pressToPlay')}
            </Text>
          </>
        )}
      </YStack>

      {canOpenVideo && isVideoOpen && typeof document !== 'undefined'
        ? createPortal(
            <YStack
              top={0}
              right={0}
              bottom={0}
              left={0}
              zIndex={1000}
              justifyContent="center"
              alignItems="center"
              padding="$4"
              onPress={() => setIsVideoOpen(false)}
              style={{ position: 'fixed', backgroundColor: overlayBg }}
            >
              <YStack
                width="85vw"
                height="90vh"
                backgroundColor="$background"
                borderRadius="$6"
                overflow="hidden"
                position="relative"
                onPress={(e) => {
                  ;(e as unknown as { stopPropagation?: () => void })?.stopPropagation?.()
                }}
              >
                <YStack
                  width="100%"
                  style={{
                    aspectRatio: '16 / 9',
                    background: frameBg,
                    maxHeight: '90vh',
                  }}
                >
                  {embedUrl ? (
                    <iframe
                      src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                      title="YouTube video"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 0,
                        display: 'block',
                      }}
                    />
                  ) : null}
                </YStack>
              </YStack>
            </YStack>,
            document.body
          )
        : null}
    </>
  )
}
