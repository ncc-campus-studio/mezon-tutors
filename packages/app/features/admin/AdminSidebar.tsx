'use client'

import type { ReactNode } from 'react'
import { useMedia } from 'tamagui'
import { Card, Text, XStack, YStack } from '@mezon-tutors/app/ui'
import {
  ChartIcon,
  GraduationCapIcon,
  UsersIcon,
  WalletIcon,
  GridIcon,
} from '@mezon-tutors/app/ui/icons'

export type AdminSidebarItemIcon =
  | 'dashboard'
  | 'tutor-applications'
  | 'students'
  | 'payments'
  | 'reports'

export type AdminSidebarItem = {
  id: string
  href: string
  label: string
  icon: AdminSidebarItemIcon
  active?: boolean
}

export type AdminSidebarProps = {
  items: AdminSidebarItem[]
  brandName: string
  brandSubtitle: string
  loggedInAsLabel: string
  adminUserLabel: string
  renderItemLink: (item: AdminSidebarItem, content: ReactNode) => ReactNode
}

const ICON_MAP: Record<
  AdminSidebarItemIcon,
  (props: { size?: number | string; color?: string }) => JSX.Element
> = {
  dashboard: GridIcon,
  'tutor-applications': UsersIcon,
  students: GraduationCapIcon,
  payments: WalletIcon,
  reports: ChartIcon,
}

export function AdminSidebar({
  items,
  brandName,
  adminUserLabel,
  renderItemLink,
}: AdminSidebarProps) {
  const media = useMedia()

  // Icon-only on small screens (xs, sm); full sidebar from md up
  const isNarrow = media.sm || media.xs

  return (
    <Card
      width={isNarrow ? 72 : 260}
      minWidth={isNarrow ? 72 : 260}
      padding={isNarrow ? 12 : 20}
      paddingTop={isNarrow ? 16 : 24}
      gap={isNarrow ? 16 : 24}
      borderRadius={0}
      backgroundColor="$backgroundMuted"
      borderRightWidth={1}
      borderRightColor="$borderColor"
      shadowRadius={0}
      shadowOffset={{ width: 0, height: 0 }}
      flexShrink={0}
    >
      <XStack alignItems="center" gap={isNarrow ? 0 : 10} style={{ textDecoration: 'none' }}>
        <YStack
          width={36}
          height={36}
          borderRadius={999}
          backgroundColor="#1253D5"
          alignItems="center"
          justifyContent="center"
        >
          <GraduationCapIcon size={18} color="#ffffff" />
        </YStack>

        {!isNarrow && (
          <YStack gap={2}>
            <Text
              size="lg"
              fontWeight="800"
              fontSize={20}
              color="primary"
              style={{ textDecoration: 'none' }}
            >
              {brandName}
            </Text>
          </YStack>
        )}
      </XStack>

      <YStack gap={8}>
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon]
          const content = (
            <XStack
              key={item.id}
              paddingVertical={10}
              paddingHorizontal={isNarrow ? 0 : 14}
              borderRadius={999}
              alignItems="center"
              justifyContent={isNarrow ? 'center' : 'flex-start'}
              gap={isNarrow ? 0 : 12}
              backgroundColor={item.active ? '$backgroundCard' : 'transparent'}
              borderWidth={1}
              borderColor={item.active ? '$primary' : 'transparent'}
              hoverStyle={{
                backgroundColor: '$surface',
              }}
              style={{ textDecoration: 'none' }}
            >
              <YStack
                width={32}
                height={32}
                borderRadius={999}
                backgroundColor={item.active ? '#1253D5' : '$backgroundMuted'}
                alignItems="center"
                justifyContent="center"
              >
                <Icon size={16} color={item.active ? '#ffffff' : '#A0AEC0'} />
              </YStack>

              {!isNarrow && (
                <Text
                  size="md"
                  fontWeight={item.active ? '600' : '500'}
                  variant={item.active ? 'primary' : 'muted'}
                  style={{ textDecoration: 'none' }}
                >
                  {item.label}
                </Text>
              )}
            </XStack>
          )

          return renderItemLink(item, content)
        })}
      </YStack>

      <XStack marginTop="auto" justifyContent={isNarrow ? 'center' : 'flex-start'}>
        <XStack
          paddingVertical={10}
          paddingHorizontal={isNarrow ? 0 : 14}
          borderRadius={20}
          backgroundColor="$backgroundCard"
          borderWidth={1}
          borderColor="#020617"
          alignItems="center"
          justifyContent={isNarrow ? 'center' : 'flex-start'}
          gap={isNarrow ? 0 : 10}
          style={{ textDecoration: 'none' }}
        >
          <YStack
            width={32}
            height={32}
            borderRadius={999}
            backgroundColor="#152a56"
            alignItems="center"
            justifyContent="center"
          >
            <Text size="sm" fontWeight="700" style={{ textDecoration: 'none' }} variant="primary">
              AD
            </Text>
          </YStack>

          {!isNarrow && (
            <YStack gap={2} style={{ textDecoration: 'none' }}>
              <Text size="md" fontWeight="600" style={{ textDecoration: 'none' }} variant="default">
                {adminUserLabel}
              </Text>
              <Text size="sm" variant="muted" style={{ textDecoration: 'none' }}>
                admin@tutormatch.com
              </Text>
            </YStack>
          )}
        </XStack>
      </XStack>
    </Card>
  )
}
