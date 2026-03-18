import { TutorLanguage, TutorProfile } from "@mezon-tutors/db";
import { VerifiedTutorProfileDto } from "@mezon-tutors/shared";

export function toVerifiedTutorProfileDto(tutor: TutorProfile & { languages: TutorLanguage[] }): VerifiedTutorProfileDto {
  return {
    id: tutor.id,
    userId: tutor.userId,
    firstName: tutor.firstName,
    lastName: tutor.lastName,
    avatar: tutor.avatar,
    videoUrl: tutor.videoUrl,
    country: tutor.country,
    subject: tutor.subject,
    introduce: tutor.introduce,
    experience: tutor.experience,
    motivate: tutor.motivate,
    headline: tutor.headline,
    pricePerHour: Number(tutor.pricePerHour),
    isProfessional: tutor.isProfessional,
    totalLessonsTaught: tutor.totalLessonsTaught,
    totalStudents: tutor.totalStudents,
    ratingCount: tutor.ratingCount,
    ratingAverage: Number(tutor.ratingAverage),
    timezone: tutor.timezone,
    languages: tutor.languages.map((language) => ({ languageCode: language.languageCode, proficiency: language.proficiency })),
  };
}