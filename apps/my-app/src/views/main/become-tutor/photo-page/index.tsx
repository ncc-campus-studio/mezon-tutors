"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Label, Card } from "@/components/ui";
import { User, Camera, Upload, Focus, Sun, Smile, Image as ImageIcon, GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";
import { tutorProfilePhotoAtom, tutorProfileLastSavedAtAtom } from "@mezon-tutors/app/store/tutor-profile.atom";
import { CLOUDINARY_FOLDER, formatLastSavedTime, MAX_IMAGE_SIZE_MB } from "@mezon-tutors/shared";
import { cloudinaryService } from "@mezon-tutors/app/services";

const CURRENT_STEP = 2;
const PROGRESS_PERCENT = (CURRENT_STEP - 1) * 20;
const ACCEPT_PROFILE_IMAGE = "image/jpeg,image/png,image/jpg";

export default function PhotoPage() {
  const t = useTranslations("TutorProfile.Photo");
  const router = useRouter();
  const photoCardRef = useRef<HTMLDivElement | null>(null);
  const identityCardRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [tutorProfilePhoto, setTutorProfilePhoto] = useAtom(tutorProfilePhotoAtom);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(tutorProfilePhoto.photo?.dataUrl || tutorProfilePhoto.photo?.uploadedUrl || null);
  const [previewIdentityUrl, setPreviewIdentityUrl] = useState<string | null>(tutorProfilePhoto.identity?.dataUrl || tutorProfilePhoto.identity?.uploadedUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const lastSavedAt = useAtomValue(tutorProfileLastSavedAtAtom);
  const setLastSavedAt = useSetAtom(tutorProfileLastSavedAtAtom);

  const allowedImageExt = useMemo(() => new Set(["jpg", "jpeg", "png"]), []);

  const photoFormSchema = useMemo(
    () =>
      z.object({
        introduce: z.string().min(1, t("validation.introduceRequired")),
        headline: z.string().min(1, t("validation.headlineRequired")),
        motivate: z.string().min(1, t("validation.motivateRequired")),
        profilePhotoFile: z.instanceof(File).nullable(),
        identityPhotoFile: z.instanceof(File).nullable(),
      }).superRefine((data, ctx) => {
        const bytesLimit = MAX_IMAGE_SIZE_MB * 1024 * 1024;
        const checkImageFile = (file: File | null, path: "profilePhotoFile" | "identityPhotoFile", msgType: "photo" | "identity") => {
          if (!file) return;
          const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
          const mimeOk = file.type.startsWith("image/");
          if (!allowedImageExt.has(ext) || !mimeOk) {
            ctx.addIssue({ path: [path], code: "custom", message: msgType === "photo" ? t("validation.photoInvalidType") : t("validation.identityInvalidType") });
            return;
          }
          if (file.size > bytesLimit) {
            ctx.addIssue({ path: [path], code: "custom", message: msgType === "photo" ? t("validation.photoInvalidSize", { max: MAX_IMAGE_SIZE_MB }) : t("validation.identityInvalidSize", { max: MAX_IMAGE_SIZE_MB }) });
          }
        };

        const hasPhoto = data.profilePhotoFile !== null || !!tutorProfilePhoto.photo?.dataUrl || !!tutorProfilePhoto.photo?.uploadedUrl;
        if (!hasPhoto) {
          ctx.addIssue({ path: ["profilePhotoFile"], code: "custom", message: t("validation.photoRequired") });
        } else if (data.profilePhotoFile) {
          checkImageFile(data.profilePhotoFile, "profilePhotoFile", "photo");
        }

        const hasIdentity = data.identityPhotoFile !== null || !!tutorProfilePhoto.identity?.dataUrl || !!tutorProfilePhoto.identity?.uploadedUrl;
        if (!hasIdentity) {
          ctx.addIssue({ path: ["identityPhotoFile"], code: "custom", message: t("validation.identityRequired") });
        } else if (data.identityPhotoFile) {
          checkImageFile(data.identityPhotoFile, "identityPhotoFile", "identity");
        }
      }),
    [t, tutorProfilePhoto.photo?.dataUrl, tutorProfilePhoto.photo?.uploadedUrl, tutorProfilePhoto.identity?.dataUrl, tutorProfilePhoto.identity?.uploadedUrl, allowedImageExt]
  );

  type PhotoFormValues = z.infer<typeof photoFormSchema>;

  const form = useForm<PhotoFormValues>({
    defaultValues: {
      introduce: tutorProfilePhoto.introduce,
      headline: tutorProfilePhoto.headline,
      motivate: tutorProfilePhoto.motivate,
      profilePhotoFile: null,
      identityPhotoFile: null,
    },
    resolver: zodResolver(photoFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const { handleSubmit, setFocus, register, formState: { errors }, setValue } = form;

  useEffect(() => {
    setPreviewPhotoUrl(tutorProfilePhoto.photo?.dataUrl || tutorProfilePhoto.photo?.uploadedUrl || null);
  }, [tutorProfilePhoto.photo?.dataUrl, tutorProfilePhoto.photo?.uploadedUrl]);

  useEffect(() => {
    setPreviewIdentityUrl(tutorProfilePhoto.identity?.dataUrl || tutorProfilePhoto.identity?.uploadedUrl || null);
  }, [tutorProfilePhoto.identity?.dataUrl, tutorProfilePhoto.identity?.uploadedUrl]);

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bytesLimit = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    if (file.size > bytesLimit) {
      form.setError("profilePhotoFile", { type: "manual", message: t("validation.photoInvalidSize", { max: MAX_IMAGE_SIZE_MB }) });
      return;
    }

    setValue("profilePhotoFile", file);
    const previousPublicId = tutorProfilePhoto.photo?.publicId;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setTutorProfilePhoto((prev) => ({ ...prev, photo: { ...prev.photo, dataUrl } }));
      setPreviewPhotoUrl(dataUrl);
      setLastSavedAt(new Date().toISOString());

      try {
        setIsUploading(true);
        const uploadedFile = await cloudinaryService.uploadFileWithSignature(file, CLOUDINARY_FOLDER.TUTOR_AVATAR, "image");
        setTutorProfilePhoto((prev) => ({ ...prev, photo: { ...prev.photo, uploadedUrl: uploadedFile.secureUrl, publicId: uploadedFile.publicId } }));
        if (previousPublicId && previousPublicId !== uploadedFile.publicId) {
          void cloudinaryService.deleteFile(previousPublicId).catch(() => null);
        }
        await form.trigger("profilePhotoFile");
      } catch {
        form.setError("profilePhotoFile", { type: "manual", message: t("validation.photoUploadFailed") });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleIdentityPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bytesLimit = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    if (file.size > bytesLimit) {
      form.setError("identityPhotoFile", { type: "manual", message: t("validation.identityInvalidSize", { max: MAX_IMAGE_SIZE_MB }) });
      return;
    }

    setValue("identityPhotoFile", file);
    const previousPublicId = tutorProfilePhoto.identity?.publicId;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setTutorProfilePhoto((prev) => ({ ...prev, identity: { ...prev.identity, dataUrl } }));
      setPreviewIdentityUrl(dataUrl);
      setLastSavedAt(new Date().toISOString());

      try {
        setIsUploading(true);
        const uploadedFile = await cloudinaryService.uploadFileWithSignature(file, CLOUDINARY_FOLDER.TUTOR_IDENTITY, "image");
        setTutorProfilePhoto((prev) => ({ ...prev, identity: { ...prev.identity, uploadedUrl: uploadedFile.secureUrl, publicId: uploadedFile.publicId } }));
        if (previousPublicId && previousPublicId !== uploadedFile.publicId) {
          void cloudinaryService.deleteFile(previousPublicId).catch(() => null);
        }
        await form.trigger("identityPhotoFile");
      } catch {
        form.setError("identityPhotoFile", { type: "manual", message: t("validation.photoUploadFailed") });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSaveContinue = async (values: PhotoFormValues) => {
    const { profilePhotoFile: _profilePhotoFile, identityPhotoFile: _identityPhotoFile, ...textValues } = values;
    if (isUploading) return;

    if (!tutorProfilePhoto.photo?.uploadedUrl) {
      form.setError("profilePhotoFile", { type: "manual", message: t("validation.photoUploadFailed") });
      return;
    }

    if (!tutorProfilePhoto.identity?.uploadedUrl) {
      form.setError("identityPhotoFile", { type: "manual", message: t("validation.photoUploadFailed") });
      return;
    }

    setTutorProfilePhoto((prev) => ({ ...prev, ...textValues }));
    setLastSavedAt(new Date().toISOString());
    router.push("/become-tutor/certification");
  };

  const onValidationError = (errors: Partial<Record<keyof PhotoFormValues, { message?: string }>>) => {
    const firstError = Object.keys(errors)[0] as keyof PhotoFormValues | undefined;
    if (!firstError) return;

    if (firstError === "profilePhotoFile") {
      photoCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (firstError === "identityPhotoFile") {
      identityCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (["headline", "motivate", "introduce"].includes(firstError)) setFocus(firstError);
  };

  const draftSavedLabel = lastSavedAt && formatLastSavedTime(lastSavedAt) ? t("draftSaved", { time: formatLastSavedTime(lastSavedAt) }) : "";

  return (
    <div className="min-h-screen become-tutor-shell">
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto pb-20 md:pb-28">
          <div className="py-3 px-3 sm:py-4 sm:px-4 md:py-6 md:px-4 lg:py-5 lg:px-6">
            <div className="max-w-[960px] w-full mx-auto flex flex-col gap-3 sm:gap-4 md:gap-6">
              <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-2 md:gap-3">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
                  <h1 className="font-bold text-sm sm:text-base md:text-lg">{t("headerTitle")}</h1>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  {draftSavedLabel && <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">{draftSavedLabel}</p>}
                  <Button variant="ghost" size="sm" className="bg-muted hover:bg-muted/80 text-xs sm:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-3">{t("saveExit")}</Button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.1em] uppercase text-primary">{t("stepLabel")}</p>
                  <p className="text-[10px] sm:text-xs md:text-sm font-medium text-primary">{t("progressPercentLabel", { percent: PROGRESS_PERCENT })}</p>
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                  <div className="h-1 md:h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${PROGRESS_PERCENT}%` }} />
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{t("nextLabel")}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:gap-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black py-1 sm:py-2">{t("title")}</h2>
                <p className="text-muted-foreground font-medium text-xs sm:text-sm md:text-base">{t("subtitle")}</p>
              </div>

              <div ref={photoCardRef} className="become-tutor-card rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4 md:gap-6 border shadow-sm">
                <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
                  <div className="relative w-[50%] sm:w-[40%] md:w-[30%] aspect-square">
                    <div className="w-full h-full rounded-full border-2 border-muted-foreground/30 overflow-hidden flex items-center justify-center bg-muted">
                      {previewPhotoUrl ? (
                        <img src={previewPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-[35%] h-[35%] text-muted-foreground/50" />
                      )}
                    </div>
                    {!previewPhotoUrl && (
                      <div className="absolute bottom-0 right-0">
                        <Camera className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
                    <input type="file" id="profilePhoto" accept={ACCEPT_PROFILE_IMAGE} onChange={handleProfilePhotoChange} className="hidden" />
                    <Button type="button" onClick={() => document.getElementById("profilePhoto")?.click()} disabled={isUploading} className="gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm px-3 sm:px-4">
                      <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {t("uploadButton")}
                    </Button>
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">{t("uploadHint")}</p>
                    {errors.profilePhotoFile && <p className="text-xs sm:text-sm text-destructive text-center">{errors.profilePhotoFile.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">{t("tipsTitle")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                  {[
                    { key: "centered", Icon: Focus },
                    { key: "lighting", Icon: Sun },
                    { key: "expression", Icon: Smile },
                    { key: "background", Icon: ImageIcon },
                  ].map(({ key, Icon }) => (
                    <Card key={key} className="p-2.5 sm:p-3 md:p-4 flex flex-col gap-1.5 sm:gap-2 border shadow-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />
                        </div>
                        <h4 className="font-semibold text-xs sm:text-sm">{t(`tips.${key}.title`)}</h4>
                      </div>
                      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{t(`tips.${key}.description`)}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:gap-2 pt-2 sm:pt-3 md:pt-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black py-1 sm:py-2">{t("identity.title")}</h2>
                <p className="text-muted-foreground font-medium text-xs sm:text-sm md:text-base">{t("identity.subtitle")}</p>
              </div>

              <div ref={identityCardRef} className="become-tutor-card rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 flex flex-col items-center gap-3 sm:gap-4 md:gap-6 border shadow-sm">
                <div className="w-full md:w-[70%] lg:w-[55%] aspect-[16/10] rounded-lg border overflow-hidden flex items-center justify-center bg-muted">
                  {previewIdentityUrl ? (
                    <img src={previewIdentityUrl} alt="Identity" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-muted-foreground/50">
                      <ImageIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
                      <p className="text-xs sm:text-sm text-center px-2">{t("identity.emptyState")}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
                  <input type="file" id="identityPhoto" accept={ACCEPT_PROFILE_IMAGE} onChange={handleIdentityPhotoChange} className="hidden" />
                  <Button type="button" onClick={() => document.getElementById("identityPhoto")?.click()} disabled={isUploading} className="gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm px-3 sm:px-4">
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {t("identity.uploadButton")}
                  </Button>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">{t("uploadHint")}</p>
                  {errors.identityPhotoFile && <p className="text-xs sm:text-sm text-destructive text-center">{errors.identityPhotoFile.message}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">{t("identity.tipsTitle")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                  {[
                    { key: "clear", Icon: Focus },
                    { key: "noReflection", Icon: Sun },
                    { key: "fullDocument", Icon: ImageIcon },
                    { key: "validDocument", Icon: GraduationCap },
                  ].map(({ key, Icon }) => (
                    <Card key={key} className="p-2.5 sm:p-3 md:p-4 flex flex-col gap-1.5 sm:gap-2 border shadow-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />
                        </div>
                        <h4 className="font-semibold text-xs sm:text-sm">{t(`identity.tips.${key}.title`)}</h4>
                      </div>
                      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{t(`identity.tips.${key}.description`)}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 sm:gap-2 pt-2 sm:pt-3 md:pt-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{t("cardTitle")}</h2>
                <p className="text-muted-foreground text-xs sm:text-sm">{t("cardSubtitle")}</p>
              </div>

              <div ref={formCardRef} className="become-tutor-card rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 flex flex-col gap-2.5 sm:gap-3 md:gap-4 border shadow-sm">
                <form onSubmit={handleSubmit(onSaveContinue, onValidationError)} className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
                  <div className="flex gap-2.5 sm:gap-3 md:gap-4 flex-col md:flex-row">
                    <div className="flex-1 flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                      <Label htmlFor="headline" className="text-xs sm:text-sm">{t("fields.headlineLabel")}</Label>
                      <Input className="become-tutor-field h-9 sm:h-10 md:h-11 text-sm" id="headline" placeholder={t("fields.headlinePlaceholder")} {...register("headline")} />
                      {errors.headline && <p className="text-xs sm:text-sm text-destructive">{errors.headline.message}</p>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                      <Label htmlFor="motivate" className="text-xs sm:text-sm">{t("fields.motivateLabel")}</Label>
                      <Input className="become-tutor-field h-9 sm:h-10 md:h-11 text-sm" id="motivate" placeholder={t("fields.motivatePlaceholder")} {...register("motivate")} />
                      {errors.motivate && <p className="text-xs sm:text-sm text-destructive">{errors.motivate.message}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2">
                    <Label htmlFor="introduce" className="text-xs sm:text-sm">{t("fields.introduceLabel")}</Label>
                    <Input className="become-tutor-field h-9 sm:h-10 md:h-11 text-sm" id="introduce" placeholder={t("fields.introducePlaceholder")} {...register("introduce")} />
                    {errors.introduce && <p className="text-xs sm:text-sm text-destructive">{errors.introduce.message}</p>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-lg py-2.5 sm:py-3 md:py-4 z-10">
          <div className="max-w-[960px] w-full mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex justify-between items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/become-tutor")} className="gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm px-3 sm:px-4">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t("back")}
              </Button>
              <Button type="submit" size="lg" disabled={isUploading} onClick={handleSubmit(onSaveContinue, onValidationError)} className="gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm px-3 sm:px-4">
                {t("saveContinue")}
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

