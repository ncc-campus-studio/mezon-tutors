export interface TimeSlotDto {
  startTime: string;
  endTime: string;
}

export interface TutorAvailabilitySlotDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface TutorLanguageDto {
  languageCode: string;
  proficiency: string;
}

export interface SubmitTutorProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  subject: string;
  languages: TutorLanguageDto[];

  avatar?: string;
  headline: string;
  motivate: string;
  introduce: string;

  teachingCertificateName: string;
  teachingYear: string;
  university: string;
  degree: string;
  specialization: string;

  videoUrl: string;

  pricePerHour: number;
  availability: TutorAvailabilitySlotDto[];
}
