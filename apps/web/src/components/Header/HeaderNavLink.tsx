import Link from 'next/link'
import { Text } from '@mezon-tutors/app/ui'

type HeaderNavLinkProps = {
  href: string
  label: string
  active: boolean
}

export function HeaderNavLink({ href, label, active }: HeaderNavLinkProps) {
  return (
    <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Text
        color={active ? '$myLessonsNavActive' : '$myLessonsNavInactive'}
        hoverStyle={{ color: '$myLessonsNavHover', y: -1 }}
        fontSize={15}
        lineHeight={22}
        fontWeight={active ? '700' : '500'}
        style={{ transition: 'color 240ms ease, transform 240ms ease' }}
      >
        {label}
      </Text>
    </Link>
  )
}
