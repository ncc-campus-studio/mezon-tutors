import { VerificationStatus } from '@mezon-tutors/db';
import type { TutorApplicationApiItem } from '@mezon-tutors/shared';

type TutorProfileWithLanguages = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  videoUrl: string;
  country: string;
  subject: string;
  introduce: string;
  experience: string;
  motivate: string;
  headline: string;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  languages?: { languageCode: string }[];
};

export function toTutorApplicationApiItem(p: TutorProfileWithLanguages): TutorApplicationApiItem {
  return {
    id: p.id,
    user_id: p.userId,
    first_name: p.firstName,
    last_name: p.lastName,
    avatar: p.avatar,
    video_url: p.videoUrl,
    country: p.country,
    subject: p.subject,
    introduce: p.introduce,
    experience: p.experience,
    motivate: p.motivate,
    headline: p.headline,
    verification_status: p.verificationStatus,
    created_at: p.createdAt.toISOString(),
    languages: p.languages?.map((l) => ({ language_code: l.languageCode })) ?? [],
  };
}

