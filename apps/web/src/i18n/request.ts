import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const common = (await import(`@mezon-tutors/shared/locales/${locale}/common.json`)).default;
  const adminAll = (await import(`@mezon-tutors/shared/locales/${locale}/admin.json`)).default;
  const tutorProfile = (
    await import(`@mezon-tutors/shared/locales/${locale}/tutor-profile.json`)
  ).default;
  const adminTutorApplications = (
    await import(`@mezon-tutors/shared/locales/${locale}/admin-tutor-applications.json`)
  ).default;
  const tutors = (await import(`@mezon-tutors/shared/locales/${locale}/tutors.json`)).default;

  return {
    locale,
    messages: {
      Common: common,
      Admin: adminAll.Admin,
      TutorProfile: tutorProfile,
      AdminTutorApplications: adminTutorApplications,
      Tutors: tutors,
    },
  }
})
