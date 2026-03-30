'use client';

import { isAuthenticatedAtom, isLoadingAtom } from '@mezon-tutors/app/store/auth.atom';
import { ROUTES } from '@mezon-tutors/shared/src/constants/routes';
import { useAtomValue } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const isBecomeTutorRoot = pathname === ROUTES.BECOME_TUTOR.INDEX;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isBecomeTutorRoot) {
      router.replace(ROUTES.BECOME_TUTOR.INDEX);
    }
  }, [isAuthenticated, isLoading, isBecomeTutorRoot, router]);

  if (isLoading || (!isAuthenticated && !isBecomeTutorRoot)) {
    return null;
  }

  return <>{children}</>;
}
