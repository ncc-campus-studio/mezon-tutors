/**
 * Mirrors Prisma schema enum VerificationStatus (packages/db/prisma/schema.prisma).
 * Used for tutor application/profile verification state.
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
