'use client';

import { TutorProfileAboutScreen } from '@mezon-tutors/app';
import { isAuthenticatedAtom, isLoadingAtom } from '@mezon-tutors/app/store/auth.atom';
import { useAtomValue } from 'jotai';
import { BecomeTutorGuide } from './components/BecomeTutorGuide';

export default function BecomeTutorPage() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <BecomeTutorGuide />;
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <main className="pt-16">
        <TutorProfileAboutScreen />
      </main>
    </div>
  );
}
