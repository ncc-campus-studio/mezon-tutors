'use client';

import { MyScheduleScreen } from '@mezon-tutors/app';
import { Screen } from '@mezon-tutors/app/ui';

export default function DashboardMySchedulePage() {
  return (
    <Screen backgroundColor="$dashboardTutorPageBackground">
      <MyScheduleScreen />
    </Screen>
  );
}
