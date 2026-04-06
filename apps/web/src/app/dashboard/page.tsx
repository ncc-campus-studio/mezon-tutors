'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@mezon-tutors/shared'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(ROUTES.DASHBOARD.MY_LESSONS)
  }, [router])

  return null
}
