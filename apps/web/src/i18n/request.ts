import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { cookies } from 'next/headers';
import { routing } from './routing';

type MessageLoaderConfig = {
  messageKey:
    | 'Common'
    | 'Admin'
    | 'TutorProfile'
    | 'AdminTutorApplications'
    | 'Tutors'
    | 'MyLessons'
    | 'MySchedule'
    | 'BecomeTutorGuide'
    | 'Home'
    | 'Dashboard';
  file: string;
  pick?: (payload: Record<string, unknown>) => unknown;
};

const MESSAGE_LOADERS: MessageLoaderConfig[] = [
  { messageKey: 'Common', file: 'common' },
  { messageKey: 'Admin', file: 'admin', pick: (payload) => payload.Admin },
  { messageKey: 'TutorProfile', file: 'tutor-profile' },
  { messageKey: 'AdminTutorApplications', file: 'admin-tutor-applications' },
  { messageKey: 'Tutors', file: 'tutors' },
  { messageKey: 'MyLessons', file: 'my-lessons' },
  { messageKey: 'MySchedule', file: 'my-schedule' },
  { messageKey: 'BecomeTutorGuide', file: 'become-tutor-guide' },
  { messageKey: 'Home', file: 'home', pick: (payload) => payload.Home },
  { messageKey: 'Dashboard', file: 'dashboard', pick: (payload) => payload.Dashboard },
];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const preferredLocale = requested ?? cookieLocale;

  const locale = hasLocale(routing.locales, preferredLocale)
    ? preferredLocale
    : routing.defaultLocale;

  const messages = Object.fromEntries(
    await Promise.all(
      MESSAGE_LOADERS.map(async ({ messageKey, file, pick }) => {
        const payload = (
          await import(`@mezon-tutors/shared/locales/${locale}/${file}.json`)
        ).default as Record<string, unknown>;
        return [messageKey, pick ? pick(payload) : payload];
      })
    )
  );

  return {
    locale,
    messages,
  };
});
