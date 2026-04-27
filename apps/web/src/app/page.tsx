'use client';

import { YStack } from '@mezon-tutors/app/ui';
import HomeHeroSection from './components/HomeHeroSection/HomeHeroSection';
import HomeFeaturesSection from './components/HomeFeaturesSection/HomeFeaturesSection';
import HomeBecomeTutorSection from './components/HomeBecomeTutorSection/HomeBecomeTutorSection';
import HomeSeamlessSection from './components/HomeSeamlessSection/HomeSeamlessSection';

export default function Home() {
  return (
    <YStack minHeight="100vh" backgroundColor="$homePageBackground">
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeBecomeTutorSection />
      <HomeSeamlessSection />
    </YStack>
  );
}
