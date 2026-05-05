'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ROUTES, VerificationStatus } from '@mezon-tutors/shared';
import { useGetMyTutorProfileStatus } from '@mezon-tutors/app/services';
import { CheckCircle2, Clock3, RefreshCw, type LucideIcon } from 'lucide-react';

type StatusMeta = {
  icon: LucideIcon;
  badge: string;
  shell: string;
  ring: string;
};

type StatusLayoutProps = {
  statusMeta: StatusMeta;
  statusLabel: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

function StatusLayout({ statusMeta, statusLabel, title, description, children }: StatusLayoutProps) {
  const StatusIcon = statusMeta.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-[70vh] flex items-center px-4 md:px-6">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="py-8 md:py-10 flex flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center gap-2.5">
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${statusMeta.badge}`}>
                <StatusIcon className="h-4 w-4" />
              </span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${statusMeta.badge}`}>
                {statusLabel}
              </span>
            </div>
            <h1 className="text-[34px] md:text-[40px] font-bold tracking-tight text-slate-900 md:whitespace-nowrap">
              {title}
            </h1>
            <p className="mt-2.5 max-w-[1050px] text-lg md:text-2xl leading-8 md:leading-[1.35] text-slate-600">
              {description}
            </p>
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PendingStatus({ statusMeta, t }: { statusMeta: StatusMeta; t: (key: string) => string }) {
  return (
    <StatusLayout
      statusMeta={statusMeta}
      statusLabel={t('pending.status')}
      title={t('pending.title')}
      description={t('pending.description')}
    />
  );
}

function ApprovedStatus({ statusMeta, t, router }: { statusMeta: StatusMeta; t: (key: string) => string; router: ReturnType<typeof useRouter> }) {
  return (
    <StatusLayout
      statusMeta={statusMeta}
      statusLabel={t('approved.status')}
      title={t('approved.title')}
      description={t('approved.description')}
    >
      <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center sm:flex-wrap">
        <Button
          size="lg"
          className="h-10 rounded-xl bg-indigo-600 px-6 text-sm text-white hover:bg-indigo-700"
          onClick={() => router.push(ROUTES.DASHBOARD.BOOKING_REQUESTS)}
        >
          {t('approved.bookingRequests')}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-10 rounded-xl border-slate-300 bg-white/70 px-6 text-sm text-slate-800 hover:bg-white"
          onClick={() => router.push(ROUTES.DASHBOARD.MY_SCHEDULE)}
        >
          {t('approved.mySchedule')}
        </Button>
      </div>
    </StatusLayout>
  );
}

function RejectedStatus({ statusMeta, t, router }: { statusMeta: StatusMeta; t: (key: string) => string; router: ReturnType<typeof useRouter> }) {
  return (
    <StatusLayout
      statusMeta={statusMeta}
      statusLabel={t('rejected.status')}
      title={t('rejected.title')}
      description={t('rejected.description')}
    >
      <Button
        size="lg"
        className="h-10 rounded-xl bg-indigo-600 px-6 text-sm text-white hover:bg-indigo-700"
        onClick={() => router.push('/become-tutor/about')}
      >
        {t('rejected.restart')}
      </Button>
    </StatusLayout>
  );
}

export default function BecomeTutorPage() {
  const t = useTranslations('TutorProfile.EntryStatus');
  const router = useRouter();
  const { data, isLoading } = useGetMyTutorProfileStatus();

  useEffect(() => {
    if (!isLoading && data?.hasProfile === false) {
      router.replace(ROUTES.BECOME_TUTOR.INDEX + '/about');
    }
  }, [data?.hasProfile, isLoading, router]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="min-h-[70vh] flex items-center px-4 md:px-6">
          <div className="max-w-[960px] w-full mx-auto">
            <div className="bg-card rounded-xl p-8 border shadow-sm">
              <p className="text-sm text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data.hasProfile) return null;

  const status = data.verificationStatus;
  const statusMeta =
    status === VerificationStatus.PENDING
      ? {
          icon: Clock3,
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          shell: 'from-amber-50/90 via-white to-amber-50/40',
          ring: 'ring-amber-100/80',
        }
      : status === VerificationStatus.APPROVED
        ? {
            icon: CheckCircle2,
            badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            shell: 'from-emerald-50/90 via-white to-sky-50/60',
            ring: 'ring-emerald-100/80',
          }
        : {
            icon: RefreshCw,
            badge: 'bg-rose-100 text-rose-700 border-rose-200',
            shell: 'from-rose-50/90 via-white to-orange-50/40',
            ring: 'ring-rose-100/80',
          };

  const StatusIcon = statusMeta.icon;

  if (status === VerificationStatus.PENDING) {
    return <PendingStatus statusMeta={statusMeta} t={t} />;
  }

  if (status === VerificationStatus.APPROVED) {
    return <ApprovedStatus statusMeta={statusMeta} t={t} router={router} />;
  }

  if (status === VerificationStatus.REJECTED) {
    return <RejectedStatus statusMeta={statusMeta} t={t} router={router} />;
  }

  return null;
}
