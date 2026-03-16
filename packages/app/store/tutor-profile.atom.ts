'use client';

import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import {
  ABOUT_COUNTRIES,
  DAY_KEYS,
  parseEnum,
  type SubmitTutorProfileDto,
} from '@mezon-tutors/shared';
import { submitTutorProfile } from '@mezon-tutors/app/services/tutor-profile.service';

export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export const selectedDayIndexAtom = atomWithStorage<number>('tutorProfile.selectedDayIndex', 0);

export const hourlyRateAtom = atomWithStorage<string>('tutorProfile.hourlyRate', '');

export const slotsByDayAtom = atomWithStorage<Record<string, TimeSlot[]>>(
  'tutorProfile.slotsByDay',
  Object.fromEntries(DAY_KEYS.map((d) => [d, []]))
);

export const defaultSlot: TimeSlot = {
  startTime: '09:00',
  endTime: '17:00',
};

export type TutorProfileAboutState = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  subject: string;
  languages: string;
  proficiencies: string;
};

export const defaultAboutState: TutorProfileAboutState = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  phone: '',
  subject: '',
  languages: '',
  proficiencies: '',
};

export const tutorProfileAboutAtom = atomWithStorage<TutorProfileAboutState>(
  'tutorProfile.about',
  defaultAboutState
);

export type TutorProfilePhotoState = {
  dataUrl: string | null;
  headline: string;
  motivate: string;
  introduce: string;
};

export const defaultPhotoState: TutorProfilePhotoState = {
  dataUrl: null,
  headline: '',
  motivate: '',
  introduce: '',
};

export const tutorProfilePhotoAtom = atomWithStorage<TutorProfilePhotoState>(
  'tutorProfile.photo',
  defaultPhotoState
);

export type TutorProfileIdentityState = {
  dataUrl: string;
};

export const defaultIdentityState: TutorProfileIdentityState = {
  dataUrl: '',
};

export const tutorProfileIdentityAtom = atomWithStorage<TutorProfileIdentityState>(
  'tutorProfile.identity',
  defaultIdentityState
);

export type TutorProfileCertificationState = {
  teachingCertificateName: string;
  teachingYear: string;
  university: string;
  degree: string;
  specialization: string;
};

export const defaultCertificationState: TutorProfileCertificationState = {
  teachingCertificateName: '',
  teachingYear: '',
  university: '',
  degree: '',
  specialization: '',
};

export const tutorProfileCertificationAtom = atomWithStorage<TutorProfileCertificationState>(
  'tutorProfile.certification',
  defaultCertificationState
);

export type TutorProfileVideoId = {
  type: 'youtube' | 'vimeo';
  id: string;
};

export type TutorProfileVideoState = {
  videoLink: string;
  videoId: TutorProfileVideoId | null;
};

export const defaultVideoState: TutorProfileVideoState = {
  videoLink: '',
  videoId: null,
};

export const tutorProfileVideoAtom = atomWithStorage<TutorProfileVideoState>(
  'tutorProfile.video',
  defaultVideoState
);

export const tutorProfileLastSavedAtAtom = atomWithStorage<string | null>(
  'tutorProfile.lastSavedAt',
  null
);

export type TutorProfileStepId = 1 | 2 | 3 | 4 | 5;

export type TutorProfileStepStatus = 'idle' | 'in_progress' | 'completed';

export const tutorProfileCurrentStepAtom = atomWithStorage<TutorProfileStepId>(
  'tutorProfile.currentStep',
  1
);

export const tutorProfileStepStatusesAtom = atomWithStorage<
  Record<TutorProfileStepId, TutorProfileStepStatus>
>('tutorProfile.stepStatuses', {
  1: 'in_progress',
  2: 'idle',
  3: 'idle',
  4: 'idle',
  5: 'idle',
} as Record<TutorProfileStepId, TutorProfileStepStatus>);

export const markStepCompletedAtom = atom(null, (get, set, stepId: TutorProfileStepId) => {
  const statuses = get(tutorProfileStepStatusesAtom);
  const next: Record<TutorProfileStepId, TutorProfileStepStatus> = {
    ...statuses,
    [stepId]: 'completed',
  };
  const nextStep = (stepId + 1) as TutorProfileStepId;

  if (nextStep <= 5) {
    next[nextStep] = 'in_progress';
    set(tutorProfileCurrentStepAtom, nextStep);
  }

  set(tutorProfileStepStatusesAtom, next);
});

export type TutorProfileAvailabilityState = {
  selectedDayIndex: number;
  hourlyRate: string;
  slotsByDay: Record<string, TimeSlot[]>;
};

export type TutorProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  subject: string;
  languages: string;
  proficiencies: string;

  avatar?: string | null;
  headline: string;
  motivate: string;
  introduce: string;

  teachingCertificateName: string;
  teachingYear: string;
  university: string;
  degree: string;
  specialization: string;

  videoUrl: string;

  hourlyRate: string;
  slotsByDay: Record<string, TimeSlot[]>;
};

export function buildSubmitTutorProfilePayload(
  values: TutorProfileFormValues
): SubmitTutorProfileDto {
  const languages = (() => {
    const langList = values.languages
      ? values.languages
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const profList = values.proficiencies
      ? values.proficiencies
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    return langList.map((languageCode, i) => ({
      languageCode,
      proficiency: profList[i] ?? '',
    }));
  })();

  const availability: SubmitTutorProfileDto['availability'] = [];

  DAY_KEYS.forEach((_, dayIndex) => {
    const slots = values.slotsByDay?.[DAY_KEYS[dayIndex]] ?? [];

    for (const slot of slots) {
      availability.push({
        dayOfWeek: dayIndex,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }
  });

  const pricePerHour = Number.parseFloat(values.hourlyRate) || 0;

  return {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    country: parseEnum(values.country, ABOUT_COUNTRIES, 'Other'),
    phone: values.phone,
    subject: values.subject,

    languages,

    avatar: values.avatar ?? undefined,
    headline: values.headline,
    motivate: values.motivate,
    introduce: values.introduce,

    teachingCertificateName: values.teachingCertificateName,
    teachingYear: values.teachingYear,
    university: values.university,
    degree: values.degree,
    specialization: values.specialization,

    videoUrl: values.videoUrl,

    pricePerHour,
    availability,
  };
}

export const submitTutorProfileAtom = atom(null, async (_, set, payload: SubmitTutorProfileDto) => {
  await submitTutorProfile(payload);

  set(tutorProfileAboutAtom, defaultAboutState);
  set(tutorProfilePhotoAtom, defaultPhotoState);
  set(tutorProfileCertificationAtom, defaultCertificationState);
  set(tutorProfileVideoAtom, defaultVideoState);
  set(tutorProfileLastSavedAtAtom, null);

  set(selectedDayIndexAtom, 0);
  set(hourlyRateAtom, '');
  set(slotsByDayAtom, Object.fromEntries(DAY_KEYS.map((d) => [d, [] as TimeSlot[]])));

  set(tutorProfileCurrentStepAtom, 1);
  set(tutorProfileStepStatusesAtom, {
    1: 'in_progress',
    2: 'idle',
    3: 'idle',
    4: 'idle',
    5: 'idle',
  });
});
