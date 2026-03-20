import {
  type TutorApplication,
  type TutorApplicationApproveBody,
  type TutorApplicationRejectBody,
  type TutorApplicationMetrics,
  VerificationStatus,
  TutorProfile,
} from '@mezon-tutors/shared';
import { apiClient } from '@mezon-tutors/app/services/api-client';

const BASE = 'admin/tutor-applications';

const mapItem = (item: TutorProfile): TutorApplication => ({
  id: item.id,
  name: `${item.firstName} ${item.lastName}`.trim(),
  subject: item.subject,
  subjectColor: '#4299E1',
  date: item.createdAt,
  status:
    item.verificationStatus === VerificationStatus.PENDING ||
    item.verificationStatus === VerificationStatus.APPROVED ||
    item.verificationStatus === VerificationStatus.REJECTED
      ? (item.verificationStatus as VerificationStatus)
      : VerificationStatus.PENDING,
  videoUrl: item.videoUrl,
  introVideoTitle: 'Intro Video',
  introPreview: item.introduce || item.motivate || item.experience,
  headline: item.headline,
  motivate: item.motivate,
  introduce: item.introduce,
  experience: item.experience,
  certificates: [],
});

export const tutorApplicationService = {
  async getList(): Promise<TutorApplication[]> {
    const data = await apiClient.get<TutorProfile[]>(BASE);
    return data.map(mapItem);
  },

  async approve(id: string, body?: TutorApplicationApproveBody): Promise<void> {
    await apiClient.post(`${BASE}/${id}/approve`, body ?? {});
  },

  async reject(id: string, body?: TutorApplicationRejectBody): Promise<void> {
    await apiClient.post(`${BASE}/${id}/reject`, body ?? {});
  },

  async getMetrics(): Promise<TutorApplicationMetrics> {
    return apiClient.get<TutorApplicationMetrics>(`${BASE}/metrics`);
  },
};
