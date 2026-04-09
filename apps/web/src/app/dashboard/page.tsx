'use client'

import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { isLoadingAtom, userAtom } from '@mezon-tutors/app/store/auth.atom'
import { ROUTES } from '@mezon-tutors/shared/src/constants/routes'

export default function DashboardPage() {
  const router = useRouter()
  const user = useAtomValue(userAtom)
  const isAuthLoading = useAtomValue(isLoadingAtom)

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (user?.role === 'STUDENT') {
      router.replace(ROUTES.DASHBOARD.MY_LESSONS)
      return
    }

    router.replace(ROUTES.DASHBOARD.BOOKING_REQUESTS)
  }, [isAuthLoading, router, user?.role])

  return null
}
