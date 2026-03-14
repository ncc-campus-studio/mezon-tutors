import { Injectable } from '@nestjs/common';
import { Prisma } from '@mezon-tutors/db';
import {
  ABOUT_COUNTRIES,
  FullTutorApplication,
  IdentityVerification,
  parseEnum,
  ProfessionalDocument,
  TutorAdminNote,
  TutorAvailability,
  TutorProfile,
  VALID_IDENTITY_VERIFICATION_STATUSES,
  VALID_PROFESSIONAL_DOCUMENT_STATUSES,
  VALID_PROFESSIONAL_DOCUMENT_TYPES,
  VALID_VERIFICATION_STATUSES,
  VerificationStatus,
} from '@mezon-tutors/shared';

export type TutorProfileWithUser = Prisma.TutorProfileGetPayload<{
  include: { user: true; languages: true };
}>;

@Injectable()
export class TutorApplicationMapper {
  mapTutorProfile(profile: TutorProfileWithUser): TutorProfile {
    return {
      id: profile.id,
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
      videoUrl: profile.videoUrl,
      country: parseEnum(profile.country, ABOUT_COUNTRIES, 'Other'),
      subject: profile.subject,
      introduce: profile.introduce,
      experience: profile.experience,
      motivate: profile.motivate,
      headline: profile.headline,
      pricePerHour: Number(profile.pricePerHour),
      isProfessional: profile.isProfessional,
      verificationStatus: parseEnum(
        profile.verificationStatus,
        VALID_VERIFICATION_STATUSES,
        'PENDING'
      ) as VerificationStatus,
      totalLessonsTaught: profile.totalLessonsTaught,
      totalStudents: profile.totalStudents,
      ratingCount: profile.ratingCount,
      ratingAverage: Number(profile.ratingAverage),
      timezone: profile.timezone ?? '',
      email: profile.email || profile.user?.email || '',
      phone: profile.phone ?? '',
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  mapAdminNote(note: Prisma.TutorAdminNoteGetPayload<{}>): TutorAdminNote {
    return {
      id: note.id,
      tutorId: note.tutorId,
      reviewerId: note.reviewerId,
      reviewerName: note.reviewerName,
      content: note.content,
      createdAt: note.createdAt,
    };
  }

  mapProfessionalDocument(doc: Prisma.ProfessionalDocumentGetPayload<{}>): ProfessionalDocument {
    return {
      id: doc.id,
      tutorId: doc.tutorId,
      name: doc.name,
      type: parseEnum(doc.type, VALID_PROFESSIONAL_DOCUMENT_TYPES, 'OTHER'),
      status: parseEnum(doc.status, VALID_PROFESSIONAL_DOCUMENT_STATUSES, 'PENDING'),
      uploadedAt: doc.uploadedAt,
      specialization: doc.specialization,
      yearOfComplete: doc.yearOfComplete,
      fileKey: doc.fileKey,
      institution: doc.institution,
      reviewedAt: doc.reviewedAt,
    };
  }

  mapIdentityVerification(
    verification: Prisma.IdentityVerificationGetPayload<{}>
  ): IdentityVerification {
    return {
      id: verification.id,
      tutorId: verification.tutorId,
      status: parseEnum(
        verification.status.toLowerCase(),
        VALID_IDENTITY_VERIFICATION_STATUSES,
        'PENDING'
      ),
      nameMatch: verification.nameMatch,
      notExpired: verification.notExpired,
      photoClarity: verification.photoClarity,
      uploadedAt: verification.uploadedAt,
      fileKey: verification.fileKey,
      reviewedAt: verification.reviewedAt,
    };
  }

  mapTutorAvailability(availability: Prisma.TutorAvailabilityGetPayload<{}>): TutorAvailability {
    return {
      id: availability.id,
      tutorId: availability.tutorId,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isActive: availability.isActive,
    };
  }

  mapFullTutorApplication(
    profile: TutorProfileWithUser,
    notes: Prisma.TutorAdminNoteGetPayload<{}>[],
    documents: Prisma.ProfessionalDocumentGetPayload<{}>[],
    verification: Prisma.IdentityVerificationGetPayload<{}> | null,
    availability: Prisma.TutorAvailabilityGetPayload<{}>[]
  ): FullTutorApplication {
    return {
      profile: this.mapTutorProfile(profile),
      adminNotes: notes.map((n) => this.mapAdminNote(n)),
      professionalDocuments: documents.map((d) => this.mapProfessionalDocument(d)),
      identityVerification: verification ? this.mapIdentityVerification(verification) : null,
      availability: availability.map((a) => this.mapTutorAvailability(a)),
    };
  }
}
