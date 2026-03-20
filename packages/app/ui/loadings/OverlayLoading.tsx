'use client'

import { useEffect, useState } from 'react'
import { Spinner, YStack } from 'tamagui'

export type OverlayLoadingProps = {
  isOpen?: boolean
  iconSize?: number
  iconColor?: string
  overlayColor?: string
}

export function OverlayLoading({
  isOpen = true,
  iconSize = 44,
  iconColor = '$appPrimary',
  overlayColor = 'rgba(16, 22, 34, 0.35)',
}: OverlayLoadingProps) {
  const [rotationDeg, setRotationDeg] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    const id = setInterval(() => {
      setRotationDeg((d) => (d + 30) % 360)
    }, 120)

    return () => clearInterval(id)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <YStack
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlayColor,
        zIndex: 9999,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="status"
      aria-live="polite"
    >
      <YStack
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          willChange: 'transform',
        }}
      >
        <Spinner size="large" color={iconColor} />
      </YStack>
    </YStack>
  )
}