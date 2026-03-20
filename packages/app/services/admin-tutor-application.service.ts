import {
  type FullTutorApplication,
  type IdentityVerification,
  type IdentityVerificationStatus,
  type ProfessionalDocument,
  type ProfessionalDocumentStatus,
  type TutorAdminNote,
} from '@mezon-tutors/shared';
import { apiClient } from './api-client';

export const adminTutorApplicationService = {
  async getTutorProfile(tutorId: string): Promise<FullTutorApplication> {
    const data = await apiClient.get<FullTutorApplication>(`/admin/tutor-profiles/${tutorId}`);
    return data;
  },

  async createAdminNote(
    payload: Omit<TutorAdminNote, 'id' | 'createdAt'>
  ): Promise<TutorAdminNote> {
    const data = await apiClient.post<TutorAdminNote>(`/admin/tutor-admin-notes`, {
      tutorId: payload.tutorId,
      reviewerId: payload.reviewerId,
      reviewerName: payload.reviewerName,
      content: payload.content,
    });
    return data;
  },

  async updateProfessionalDocumentStatus(
    documentId: string,
    status: ProfessionalDocumentStatus
  ): Promise<ProfessionalDocument> {
    const data = await apiClient.patch<ProfessionalDocument>(
      `/admin/professional-documents/${documentId}`,
      { status }
    );
    return data;
  },

  async updateIdentityVerificationStatus(
    verificationId: string,
    payload: {
      status: IdentityVerificationStatus;
      nameMatch: boolean;
      notExpired: boolean;
      photoClarity: boolean;
    }
  ): Promise<IdentityVerification> {
    const data = await apiClient.patch<IdentityVerification>(
      `/admin/identity-verification/${verificationId}`,
      payload
    );
    return data;
  },

  async approveTutorApplication(tutorId: string): Promise<{ success: boolean }> {
    const data = await apiClient.post<{ success: boolean }>(
      `/admin/tutor-applications/${tutorId}/approve`
    );
    return data;
  },

  async rejectTutorApplication(tutorId: string): Promise<{ success: boolean }> {
    const data = await apiClient.post<{ success: boolean }>(
      `/admin/tutor-applications/${tutorId}/reject`
    );
    return data;
  },
  async waitlistTutorApplication(tutorId: string): Promise<{ success: boolean }> {
    const data = await apiClient.post<{ success: boolean }>(
      `/admin/tutor-applications/${tutorId}/waitlist`
    );
    return data;
  },
};
