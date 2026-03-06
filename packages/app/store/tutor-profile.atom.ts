'use client';

import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import type { SubmitTutorProfileDto } from '@mezon-tutors/shared';
import { DAY_KEYS } from '@mezon-tutors/shared';

// Availability: 24h format "HH:mm", no AM/PM
export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export { DAY_KEYS };

export const selectedDayIndexAtom = atomWithStorage<number>('tutorProfile.selectedDayIndex', 0);

export const hourlyRateAtom = atomWithStorage<string>('tutorProfile.hourlyRate', '');

export const slotsByDayAtom = atomWithStorage<Record<string, TimeSlot[]>>(
  'tutorProfile.slotsByDay',
  Object.fromEntries(DAY_KEYS.map((d) => [d, []]))
);

export function getDayKey(index: number): string {
  return DAY_KEYS[index] ?? 'Mon';
}

export const defaultSlot: TimeSlot = {
  startTime: '09:00',
  endTime: '17:00',
};

// Profile steps
export type TutorProfileAboutState = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  subject: string;
  languages: string;
  /** Comma-separated proficiencies, one per language (same order as languages). */
  proficiencies: string;
  /** @deprecated Use proficiencies; kept for backward compat, synced from first entry. */
  proficiency: string;
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
  proficiency: '',
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
>(
  'tutorProfile.stepStatuses',
  {
    1: 'in_progress',
    2: 'idle',
    3: 'idle',
    4: 'idle',
    5: 'idle',
  } as Record<TutorProfileStepId, TutorProfileStepStatus>
);

export const markStepCompletedAtom = atom(
  null,
  (get, set, stepId: TutorProfileStepId) => {
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
  }
);

export type TutorProfileAvailabilityState = {
  selectedDayIndex: number;
  hourlyRate: string;
  slotsByDay: Record<string, TimeSlot[]>;
};

export type TutorProfileState = {
  introStep: TutorProfileAboutState;
  photoStep: TutorProfilePhotoState;
  certificationStep: TutorProfileCertificationState;
  videoStep: TutorProfileVideoState;
  availabilityStep: TutorProfileAvailabilityState;
};

export const tutorProfileStateAtom = atom<TutorProfileState>((get) => ({
  introStep: get(tutorProfileAboutAtom),
  photoStep: get(tutorProfilePhotoAtom),
  certificationStep: get(tutorProfileCertificationAtom),
  videoStep: get(tutorProfileVideoAtom),
  availabilityStep: {
    selectedDayIndex: get(selectedDayIndexAtom),
    hourlyRate: get(hourlyRateAtom),
    slotsByDay: get(slotsByDayAtom),
  },
}));

/** Build submit payload from current tutor profile state. */
export function buildSubmitTutorProfilePayload(state: TutorProfileState): SubmitTutorProfileDto {
  const { introStep, photoStep, certificationStep, videoStep, availabilityStep } = state;

  const languages = (() => {
    const langList = introStep.languages ? introStep.languages.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const profList = introStep.proficiencies ? introStep.proficiencies.split(',').map((s) => s.trim()).filter(Boolean) : [];
    return langList.map((languageCode, i) => ({
      languageCode,
      proficiency: profList[i] ?? '',
    }));
  })();

  const availability: SubmitTutorProfileDto['availability'] = [];
  DAY_KEYS.forEach((_, dayIndex) => {
    const slots = availabilityStep.slotsByDay[DAY_KEYS[dayIndex]] ?? [];
    for (const slot of slots) {
      availability.push({
        dayOfWeek: dayIndex,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }
  });

  const pricePerHour = parseFloat(availabilityStep.hourlyRate) || 0;

  return {
    firstName: introStep.firstName,
    lastName: introStep.lastName,
    email: introStep.email,
    country: introStep.country,
    phone: introStep.phone,
    subject: introStep.subject,
    languages,
    avatar: photoStep.dataUrl ?? undefined,
    headline: photoStep.headline,
    motivate: photoStep.motivate,
    introduce: photoStep.introduce,
    teachingCertificateName: certificationStep.teachingCertificateName,
    teachingYear: certificationStep.teachingYear,
    university: certificationStep.university,
    degree: certificationStep.degree,
    specialization: certificationStep.specialization,
    videoUrl: videoStep.videoLink,
    pricePerHour,
    availability,
  };
}

export const submitTutorProfileAtom = atom(null, async (get, set) => {
  const state = get(tutorProfileStateAtom);
  const payload = buildSubmitTutorProfilePayload(state);
  const { submitTutorProfile } = await import('@mezon-tutors/app/services/tutor-profile.service');
  await submitTutorProfile(payload);

  // Reset intro / photo / certification / video state
  set(tutorProfileAboutAtom, defaultAboutState);
  set(tutorProfilePhotoAtom, defaultPhotoState);
  set(tutorProfileCertificationAtom, defaultCertificationState);
  set(tutorProfileVideoAtom, defaultVideoState);
  set(tutorProfileLastSavedAtAtom, null);

  // Reset availability state
  set(selectedDayIndexAtom, 0);
  set(hourlyRateAtom, '');
  set(
    slotsByDayAtom,
    Object.fromEntries(DAY_KEYS.map((d) => [d, [] as TimeSlot[]]))
  );

  // Reset step tracking
  set(tutorProfileCurrentStepAtom, 1);
  set(tutorProfileStepStatusesAtom, {
    1: 'in_progress',
    2: 'idle',
    3: 'idle',
    4: 'idle',
    5: 'idle',
  });
});

