'use client';

import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

// Availability (merged from availability.atom.ts)
export type TimeSlot = {
  startTime: string;
  startAmPm: 'AM' | 'PM';
  endTime: string;
  endAmPm: 'AM' | 'PM';
};

export const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

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
  startAmPm: 'AM',
  endTime: '12:00',
  endAmPm: 'PM',
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

export const submitTutorProfileAtom = atom(null, (get, set) => {
  const _profile = get(tutorProfileStateAtom);
  // TODO: call API with _profile when backend is ready

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

