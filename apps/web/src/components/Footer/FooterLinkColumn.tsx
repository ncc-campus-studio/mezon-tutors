import Link from 'next/link';
import { Text, YStack } from '@mezon-tutors/app/ui';
import { useTranslations } from 'next-intl';
import type { FooterColumnConfig } from '@mezon-tutors/shared';

type FooterLinkColumnProps = {
  column: FooterColumnConfig;
  isCompact: boolean;
};

export default function FooterLinkColumn({ column, isCompact }: FooterLinkColumnProps) {
  const t = useTranslations('Common.Footer');

  return (
    <YStack minWidth={isCompact ? '100%' : 170} gap="$3">
      <Text color="$myLessonsHeaderTitle" fontSize={14} fontWeight="700" lineHeight={20}>
        {t(column.titleKey as never)}
      </Text>
      <YStack gap="$2.5">
        {column.links.map((link) => (
          <Link key={link.labelKey} href={link.href} style={{ color: 'inherit', textDecoration: 'none' }}>
            <Text
              color="$myLessonsPromoDescription"
              fontSize={15}
              lineHeight={22}
              style={{ transition: 'all 260ms cubic-bezier(0.22,1,0.36,1)' }}
              hoverStyle={{ color: '$myLessonsPrimaryButton', x: 2 }}
            >
              {t(link.labelKey as never)}
            </Text>
          </Link>
        ))}
      </YStack>
    </YStack>
  );
}
