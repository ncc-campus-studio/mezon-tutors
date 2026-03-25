'use client';

import { TutorProfileAboutScreen } from '@mezon-tutors/app';
import { BecomeTutorGuideScreen } from '@mezon-tutors/app/features/become-tutor-guide/screen';
import { isAuthenticatedAtom, isLoadingAtom } from '@mezon-tutors/app/store/auth.atom';
import { useAtomValue } from 'jotai';

export default function BecomeTutorPage() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <BecomeTutorGuideScreen />;
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <main className="pt-16">
        <TutorProfileAboutScreen />
      </main>
    </div>
  );
}
