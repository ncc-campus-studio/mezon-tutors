import { useEffect, useState } from 'react'
import { Button, Text, YStack } from '@mezon-tutors/app/ui'
import { TrianglePlayOutlineIcon } from '@mezon-tutors/app/ui/icons'

type VideoPreviewProps = {
  videoUrl?: string | null
  height?: number
  maxWidth?: number
  title?: string
}

export function VideoPreview({
  videoUrl,
  height = 300,
  maxWidth = 900,
  title = '',
}: VideoPreviewProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

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
    if (!videoUrl) {
      setThumbnailUrl(null)
      return
    }
    if (typeof window === 'undefined') return

    let cancelled = false

    const capture = async () => {
      try {
        const video = document.createElement('video')
        video.crossOrigin = 'anonymous'
        video.preload = 'metadata'
        video.muted = true
        video.playsInline = true
        video.src = videoUrl

        await new Promise<void>((resolve, reject) => {
          const onLoadedData = () => resolve()
          const onError = () => reject(new Error('VIDEO_LOAD_ERROR'))
          video.addEventListener('loadeddata', onLoadedData, { once: true })
          video.addEventListener('error', onError, { once: true })
        })

        const targetTime = Math.min(0.2, Math.max(0, (video.duration || 0) - 0.01))
        if (Number.isFinite(targetTime) && targetTime > 0) {
          video.currentTime = targetTime
          await new Promise<void>((resolve) => {
            video.addEventListener('seeked', () => resolve(), { once: true })
          })
        }

        const canvas = document.createElement('canvas')
        const w = video.videoWidth || 1280
        const h = video.videoHeight || 720
        canvas.width = w
        canvas.height = h

        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(video, 0, 0, w, h)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
        if (!cancelled) setThumbnailUrl(dataUrl)
      } catch {
        if (!cancelled) setThumbnailUrl(null)
      }
    }

    capture()
    return () => {
      cancelled = true
    }
  }, [videoUrl])

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
        cursor="pointer"
        onPress={() => setIsVideoOpen(true)}
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
              <TrianglePlayOutlineIcon width={22} height={26} color="white" />
            </YStack>
          </YStack>
        ) : (
          <>
            <Text size="$4" fontWeight="700">
              {title}
            </Text>
            <Text variant="muted" size="sm" marginTop="$1">
              Press to play
            </Text>
          </>
        )}
      </YStack>

      {isVideoOpen ? (
        <YStack
          top={0}
          right={0}
          bottom={0}
          left={0}
          zIndex={1000}
          backgroundColor="rgba(0,0,0,0.72)"
          justifyContent="center"
          alignItems="center"
          padding="$4"
          onPress={() => setIsVideoOpen(false)}
          style={{ position: 'fixed' }}
        >
          <YStack
            width="100%"
            maxWidth={maxWidth}
            backgroundColor="$background"
            borderRadius="$6"
            overflow="hidden"
            position="relative"
            onPress={(e) => {
              ;(e as unknown as { stopPropagation?: () => void })?.stopPropagation?.()
            }}
          >
            <Button
              variant="ghost"
              position="absolute"
              top="$2"
              right="$2"
              zIndex={1}
              onPress={() => setIsVideoOpen(false)}
            >
              Close
            </Button>

            <YStack
              width="100%"
              style={{
                aspectRatio: '16 / 9',
                background: 'black',
              }}
            >
              <video
                src={videoUrl ?? undefined}
                controls
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </YStack>
          </YStack>
        </YStack>
      ) : null}
    </>
  )
}
