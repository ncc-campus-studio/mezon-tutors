'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent } from '@/components/ui';
import { CheckCircle, Clock, Mail, Info } from 'lucide-react';

export default function FinalPage() {
  const t = useTranslations('TutorProfile.Completion');
  const router = useRouter();

  const footerLinks = t.raw('footer.links') as string[];

  return (
    <div className="min-h-screen become-tutor-shell">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 md:space-y-8">
          <div className="relative">
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#6c5ce7] flex items-center justify-center shadow-lg"
              style={{
                boxShadow: '0 18px 40px rgba(108, 92, 231, 0.6)'
              }}
            >
              <CheckCircle size={44} className="sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 md:space-y-4 max-w-2xl px-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-4">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex gap-3 sm:gap-4 md:gap-6 flex-wrap justify-center w-full">
            <Card className="w-full sm:w-56 md:w-64 become-tutor-card rounded-lg md:rounded-xl shadow-sm border">
              <CardContent className="p-4 sm:p-5 md:p-6 text-center">
                <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Clock size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  {t('reviewPeriodTitle')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {t('reviewPeriodValue')}
                </p>
              </CardContent>
            </Card>

            <Card className="w-full sm:w-56 md:w-64 become-tutor-card rounded-lg md:rounded-xl shadow-sm border">
              <CardContent className="p-4 sm:p-5 md:p-6 text-center">
                <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Mail size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  {t('notificationTitle')}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {t('notificationValue')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2.5 sm:gap-3 md:gap-4 flex-wrap justify-center">
            <Button
              size="lg"
              className="bg-[#6c5ce7] hover:bg-[#5a4fcf] px-6 sm:px-7 md:px-8 h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base"
              onClick={() => router.push('/')}
            >
              {t('primaryCta')}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="px-6 sm:px-7 md:px-8 h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base"
              onClick={() => router.push('/')}
            >
              {t('secondaryCta')}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-gray-500">
            <Info size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <p className="text-xs sm:text-sm">
              {t('helpText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
