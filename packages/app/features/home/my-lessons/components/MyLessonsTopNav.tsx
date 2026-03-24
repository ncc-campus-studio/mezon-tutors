import { Text, XStack, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import { Image, useMedia } from 'tamagui';

const TOP_NAV_ITEMS = [
  { id: 'home', labelKey: 'topNav.home', href: '/', active: false },
  { id: 'messages', labelKey: 'topNav.messages', href: '#', active: false },
  { id: 'my-lessons', labelKey: 'topNav.myLessons', href: '/my-lessons', active: true },
  { id: 'learn', labelKey: 'topNav.learn', href: '#', active: false },
  { id: 'settings', labelKey: 'topNav.settings', href: '#', active: false },
] as const;

type MyLessonsTopNavUser = {
  username?: string | null;
  avatar?: string | null;
};

type MyLessonsTopNavProps = {
  user?: MyLessonsTopNavUser | null;
};

function getInitials(username?: string | null): string {
  if (!username) return 'NA';

  const words = username
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return 'NA';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

export function MyLessonsTopNav({ user }: MyLessonsTopNavProps) {
  const t = useTranslations('MyLessons');
  const media = useMedia();
  const isCompact = media.md || media.sm || media.xs;

  const visibleItems = isCompact
    ? TOP_NAV_ITEMS.filter(
        (item) => item.id === 'home' || item.id === 'messages' || item.id === 'my-lessons'
      )
    : TOP_NAV_ITEMS;

  const avatarUri = user?.avatar?.trim() || null;
  const initials = getInitials(user?.username);

  return (
    <XStack
      width="100%"
      minHeight={74}
      paddingHorizontal={isCompact ? '$3' : '$6'}
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor="$myLessonsTopNavBorder"
      backgroundColor="$myLessonsTopNavBackground"
      gap="$3"
      flexWrap={isCompact ? 'wrap' : 'nowrap'}
    >
      <XStack alignItems="center" gap="$2.5">
        <YStack
          width={20}
          height={20}
          borderRadius={4}
          backgroundColor="$myLessonsBrandPrimary"
          borderWidth={1}
          borderColor="$myLessonsBrandBorder"
        />
        <Text color="$myLessonsBrandText" fontWeight="700" fontSize={isCompact ? 18 : 20}>
          {t('topNav.brandName')}
        </Text>
      </XStack>

      <XStack
        marginLeft="auto"
        width={isCompact ? '100%' : 'auto'}
        alignItems="center"
        justifyContent={isCompact ? 'space-between' : 'flex-end'}
        gap={isCompact ? '$2.5' : '$5'}
      >
        <XStack alignItems="center" gap={isCompact ? '$2.5' : '$6'}>
          {visibleItems.map((item) => (
            <YStack key={item.id} paddingVertical={4}>
              <a
                href={item.href}
                style={{ textDecoration: 'none' }}
                onClick={(event) => {
                  if (item.href === '#') {
                    event.preventDefault();
                  }
                }}
              >
                <Text
                  fontSize={isCompact ? 13 : 14}
                  fontWeight={item.active ? '600' : '500'}
                  color={item.active ? '$myLessonsNavActive' : '$myLessonsNavInactive'}
                  hoverStyle={{ color: item.active ? '$myLessonsNavActive' : '$myLessonsNavHover' }}
                >
                  {t(item.labelKey)}
                </Text>
              </a>
            </YStack>
          ))}
        </XStack>

        <YStack
          width={36}
          height={36}
          borderRadius={999}
          backgroundColor="$myLessonsAvatarBackground"
          borderWidth={1}
          borderColor="$myLessonsAvatarBorder"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          overflow="hidden"
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              width={36}
              height={36}
              borderRadius={999}
              accessibilityLabel={t('topNav.avatarAlt')}
            />
          ) : (
            <Text fontSize={12} fontWeight="700" color="$myLessonsAvatarText">
              {initials}
            </Text>
          )}
        </YStack>
      </XStack>
    </XStack>
  );
}
