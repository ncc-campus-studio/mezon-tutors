export type MetricStatus = 'good' | 'warning' | 'bad';

export enum AdminMetric {
  TotalPending = 'total-pending',
  ApprovedToday = 'approved-today',
  AvgReviewTime = 'avg-review-time',
}

export type MetricCard = {
  id: AdminMetric;
  value: string;
  changePercent: number;
  betterWhen: 'higher' | 'lower';
  titleKey: string;
  helperKey: string;
};

// Re-export shared tutor application types for feature use
export type {
  TutorCertificate,
  TutorApplication,
  TutorApplicationApproveBody,
  TutorApplicationRejectBody,
} from '@mezon-tutors/shared';
