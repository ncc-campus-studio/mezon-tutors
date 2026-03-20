import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { AppConfigService } from './app-config.service';
import { ContentReviewer, IdentityChecklist } from '../types';

type ApprovalTemplateContext = {
  tutorName: string;
  frontendUrl: string;
  year: number;
};

type RejectionTemplateContext = {
  tutorName: string;
  notesHtml: string;
  checklistHtml: string;
  frontendUrl: string;
  year: number;
};

const TEMPLATE_EMAIL = {
  approval: ({ tutorName, frontendUrl, year }: ApprovalTemplateContext): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Approved</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:40px 40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">🎉</div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                Application Approved!
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
                Hi <strong>${tutorName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
                We are thrilled to let you know that your tutor application has been
                <strong style="color:#4f46e5;">approved</strong>! 🎊
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.6;">
                You now have full tutor access on our platform. You can start setting up
                your profile, availability, and accepting students right away.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${frontendUrl}/dashboard"
                   style="display:inline-block;background:linear-gradient(135deg,#6d28d9,#4f46e5);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
                  Go to Dashboard
                </a>
              </div>
              <p style="margin:24px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
                If you have any questions, feel free to reach out to our support team.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                © ${year} Mezon Tutors. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  rejection: ({
    tutorName,
    notesHtml,
    checklistHtml,
    frontendUrl,
    year,
  }: RejectionTemplateContext): string => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Tutor Application Update</title>
</head>

<body style="margin:0;background:#f4f4f5;font-family:Segoe UI,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">

<!-- HEADER -->

<tr>
<td style="background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:40px;text-align:center;color:#ffffff;">
<h1 style="margin:0;font-size:26px;font-weight:700;">
Application Update
</h1>
</td>
</tr>

<!-- BODY -->

<tr>
<td style="padding:40px">

<p style="font-size:16px;color:#374151;margin:0 0 16px;">
Hi <strong>${tutorName}</strong>,
</p>

<p style="font-size:16px;color:#374151;margin:0 0 16px;">
Thank you for applying to become a tutor on our platform.
After reviewing your application, we found a few areas that need improvement.
</p>

<p style="font-size:16px;color:#374151;margin:0 0 24px;">
Please review the feedback below and update your application.
</p>

<!-- FEEDBACK CARD -->

<table width="100%" style="background:#f9fafb;border-radius:10px;padding:24px;">

<tr>
<td style="font-size:18px;font-weight:600;color:#111827;padding-bottom:8px;">
Reviewer Feedback
</td>
</tr>

${notesHtml}

${checklistHtml}

</table>

<!-- BUTTON -->

<div style="text-align:center;margin:32px 0;">
<a href="${frontendUrl}/tutor/application"
style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);
color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:8px;
font-size:16px;font-weight:600;">
Update My Application
</a>
</div>

<p style="text-align:center;font-size:13px;color:#6b7280;">
Updating your profile takes approximately 5–10 minutes.
</p>

</td>
</tr>

<!-- FOOTER -->

<tr>
<td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#9ca3af;">
© ${year} Mezon Tutors. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`,
} as const;

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: AppConfigService) {
    this.resend = new Resend(this.config.resendApiKey);
  }

  async sendApprovalEmail(to: string, tutorName: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.config.resendFromEmail,
      to,
      subject: 'Your Tutor Application Has Been Approved!',
      html: this.buildApprovalHtml(tutorName),
    });

    if (error) {
      this.logger.error(`Failed to send approval email to ${to}: ${error.message}`);
    } else {
      this.logger.log(`Approval email sent to ${to}`);
    }
  }

  async sendRejectionEmail(
    to: string,
    tutorName: string,
    reviewerNotes: ContentReviewer[],
    checklist: IdentityChecklist | null
  ): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.config.resendFromEmail,
      to,
      subject: 'Update on Your Tutor Application',
      html: this.buildRejectionHtml(tutorName, reviewerNotes, checklist),
    });

    if (error) {
      this.logger.error(`Failed to send rejection email to ${to}: ${error.message}`);
    } else {
      this.logger.log(`Rejection email sent to ${to}`);
    }
  }

  private buildApprovalHtml(tutorName: string): string {
    return TEMPLATE_EMAIL.approval({
      tutorName,
      frontendUrl: this.config.frontendUrl,
      year: new Date().getFullYear(),
    });
  }

  private buildChecklistHtml(checklist: IdentityChecklist | null): string {
    if (!checklist) return '';

    const issues: string[] = [];

    if (!checklist.nameMatch) {
      issues.push('The name on your identity document does not match your profile.');
    }

    if (!checklist.notExpired) {
      issues.push('Your identity document appears to be expired.');
    }

    if (!checklist.photoClarity) {
      issues.push('The photo on your identity document is unclear.');
    }

    if (issues.length === 0) return '';

    return issues
      .map(
        (issue) => `
<tr>
  <td style="padding:12px 0;">
    <table width="100%">
      <tr>
        <td width="28" valign="top" style="font-size:20px;">⚠️</td>
        <td style="font-size:15px;color:#374151;line-height:1.5;">
          ${issue}
        </td>
      </tr>
    </table>
  </td>
</tr>`
      )
      .join('');
  }

  private buildRejectionHtml(
    tutorName: string,
    reviewerNotes: { content: string }[],
    checklist: IdentityChecklist | null
  ): string {
    const notesHtml = reviewerNotes
      .map(
        (note) => `
<tr>
  <td style="padding:12px 0;">
    <table width="100%">
      <tr>
        <td width="28" valign="top" style="font-size:20px;">⚠️</td>
        <td style="font-size:15px;color:#374151;line-height:1.5;">
          ${note.content}
        </td>
      </tr>
    </table>
  </td>
</tr>`
      )
      .join('');

    const checklistHtml = this.buildChecklistHtml(checklist);

    return TEMPLATE_EMAIL.rejection({
      tutorName,
      notesHtml,
      checklistHtml,
      frontendUrl: this.config.frontendUrl,
      year: new Date().getFullYear(),
    });
  }
}
