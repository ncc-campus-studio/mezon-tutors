import { apiClient } from './api-client';
import type { SubmitTutorProfileDto } from '@mezon-tutors/shared';

export const tutorProfileService = {
  async submit(payload: SubmitTutorProfileDto): Promise<void> {
    await apiClient.post('/tutor-profiles', payload);
  },
};

export async function submitTutorProfile(payload: SubmitTutorProfileDto): Promise<void> {
  return tutorProfileService.submit(payload);
}
