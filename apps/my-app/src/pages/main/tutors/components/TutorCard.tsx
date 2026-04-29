"use client";

import Link from "next/link";
import { Button, Card, CardContent, Kbd, KbdGroup, Separator } from "@/components/ui";
import { VerifiedTutorProfileDto, formatToCurrency} from "@mezon-tutors/shared";
import Image from "next/image";
import {
  BadgeCheckIcon,
  EarthIcon,
  GraduationCapIcon,
  LanguagesIcon,
  StarIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { userAtom } from "@/store/auth.atom";
import { TutorMessageModal } from "./TutorMessageModal";
import { useCurrency } from "@/hooks";

type TutorCardProps = {
  tutor: VerifiedTutorProfileDto;
  isActive?: boolean;
  onHoverAction?: (tutor: VerifiedTutorProfileDto) => void;
  onSelectAction?: (tutor: VerifiedTutorProfileDto) => void;
};

export default function TutorCard({
  tutor,
  isActive = false,
  onHoverAction,
  onSelectAction,
}: TutorCardProps) {
  const t = useTranslations("Tutors.TutorCard");
  const tLanguage = useTranslations("Tutors.Filter.Language");
  const { currency } = useCurrency();
  const currentUser = useAtomValue(userAtom);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const name = `${tutor.firstName} ${tutor.lastName}`.trim();
  const studentId = currentUser?.id ?? "";
  const studentMezonUserId = currentUser?.mezonUserId;
  const tutorId = tutor.userId;

  return (
    <>
      <Card
      className={`py-0 cursor-pointer transition-colors border-2 ${isActive ? "border-primary shadow-sm" : "border-violet-100"}`}
      onMouseEnter={() => onHoverAction?.(tutor)}
      onClick={() => onSelectAction?.(tutor)}
    >
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-stretch">
        <div className="flex items-start gap-3 md:basis-3/4 md:pr-4">
          <Image
            src={tutor.avatar}
            alt={name}
            width={150}
            height={150}
            className="rounded-md shrink-0 aspect-square object-cover object-center"
            objectFit="cover"
            objectPosition="center"
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900">{name}</span>
              {tutor.isProfessional && (
                <BadgeCheckIcon
                  className="size-7 text-violet-500"
                  strokeWidth={3}
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="size-5 text-slate-500" />
                <span className="text-sm text-slate-500">
                  {t("teaches", { subject: tutor.subject })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <EarthIcon className="size-5 text-slate-500" />
                <span className="text-sm text-slate-500">
                  {t("country", { country: tutor.country })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguagesIcon className="size-5 text-slate-500" />
              <span className="text-sm text-slate-500">
                {t("speaks", {
                  languages: tutor.languages
                    .map((language) => tLanguage(language.languageCode as unknown as string))
                    .join(", "),
                })}
              </span>
            </div>
            <p className="line-clamp-3 text-sm leading-6 text-slate-700">{tutor.introduce}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                <KbdGroup className="flex flex-wrap gap-1">
                  {tutor.languages.map((language) => (
                    <Kbd
                      key={language.proficiency}
                      className="text-sm text-violet-700"
                    >
                      {t(`proficiency.${language.proficiency}`)}
                    </Kbd>
                  ))}
                </KbdGroup>
              </span>
            </div>
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="hidden md:block"
        />

        <div className="flex flex-col items-start gap-2 md:basis-1/4 md:pl-4">
          <div className="flex items-center gap-1">
            <StarIcon
              className="size-7 text-yellow-500"
              strokeWidth={3}
            />
            <span className="text-2xl font-bold text-foreground">
              {tutor.ratingAverage.toFixed(1)}
            </span>
          </div>
          <div className="text-sm font-medium text-violet-700">
            <span className="text-2xl font-bold text-primary">{formatToCurrency(currency, tutor.pricePerHour)}</span>
            <span className="text-sm text-slate-500">{t("perLesson")}</span>
          </div>
          <Link
            href={`/tutors/${tutor.id}`}
            className="w-full"
          >
            <Button
              size="lg"
              className="w-full text-lg"
            >
              {t("bookTrial")}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full text-lg"
            onClick={(event) => {
              event.stopPropagation();
              setIsMessageModalOpen(true);
            }}
          >
            {t("sendMessage")}
          </Button>
        </div>
      </CardContent>
      </Card>

      <TutorMessageModal
        open={isMessageModalOpen}
        tutorFirstName={tutor.firstName}
        studentId={studentId}
        studentMezonUserId={studentMezonUserId}
        tutorId={tutorId}
        tutorMezonUserId={tutor.mezonUserId}
        onOpenChangeAction={setIsMessageModalOpen}
      />
    </>
  );
}
