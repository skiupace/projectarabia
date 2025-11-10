import { env } from "cloudflare:workers";
import { Resend } from "resend";

// ---------------------------
// 1. Type Definitions
// ---------------------------

export type EmailType = "login" | "reset" | "verify" | "notification";

export interface BaseEmail {
  to: string;
}

export interface LoginEmail extends BaseEmail {
  ip: string;
  device: string;
  time: string;
}

export interface ResetEmail extends BaseEmail {
  link: string;
}

export interface VerifyEmail extends BaseEmail {
  link: string;
}

export interface NotificationEmail extends BaseEmail {
  notificationType: "post_comment" | "comment_reply";
  postTitle: string;
  postLink: string;
  commenters: string[]; // Array of usernames
  commentCount: number; // Total comments in batch
  highlights: string[]; // Random comment excerpts (2-3)
  contextText?: string; // For replies: "على تعليقك" or for posts: "على منشورك"
}

// Type-safe mapping between email type and data
export interface EmailPayloadMap {
  login: LoginEmail;
  reset: ResetEmail;
  verify: VerifyEmail;
  notification: NotificationEmail;
}

const FROM = {
  login: "BabalTechNewz <support@b11z.news>",
  reset: "BabalTechNewz <support@b11z.news>",
  verify: "BabalTechNewz <onboarding@b11z.news>",
  notification: "BabalTechNewz <notifications@b11z.news>",
} as const satisfies Record<EmailType, string>;

// ---------------------------
// 2. Email Templates
// ---------------------------

type EmailTemplate<T extends EmailType> = (data: EmailPayloadMap[T]) => {
  subject: string;
  text: string;
};

const templates: {
  [K in EmailType]: EmailTemplate<K>;
} = {
  login: (data: LoginEmail) => ({
    subject:
      env.CLOUDFLARE_ENV === "production"
        ? "بابل: تسجيل دخول جديد إلى حسابك"
        : "بابل: تسجيل دخول جديد إلى حسابك (تجربة)",
    text: `تم تسجيل دخول جديد إلى حسابك.

الموقع التقريبي: ${data.ip}
الجهاز: ${data.device}
الوقت: ${data.time}

إذا لم تكن أنت، يرجى تسجيل الخروج وتغيير كلمة المرور فورًا.`,
  }),

  reset: (data: ResetEmail) => ({
    subject:
      env.CLOUDFLARE_ENV === "production"
        ? "بابل: إعادة تعيين كلمة المرور"
        : "بابل: إعادة تعيين كلمة المرور (تجربة)",
    text: `لقد طلبت إعادة تعيين كلمة المرور.

اضغط على الرابط أدناه لإعادة تعيينها:
${data.link}

إذا لم تطلب ذلك، تجاهل هذه الرسالة.`,
  }),

  verify: (data: VerifyEmail) => ({
    subject:
      env.CLOUDFLARE_ENV === "production"
        ? "بابل: تأكيد حسابك"
        : "بابل: تأكيد حسابك (تجربة)",
    text: `مرحبًا

يرجى تأكيد حسابك عبر الرابط التالي:
${data.link}

شكراً لاستخدامك خدمتنا.`,
  }),

  notification: (data: NotificationEmail) => {
    const contextText =
      data.notificationType === "post_comment" ? "على منشورك" : "على تعليقك";

    // Format commenters list in Arabic
    let commentersText = "";
    if (data.commentCount === 1) {
      commentersText = `@${data.commenters[0]}`;
    } else if (data.commentCount === 2) {
      commentersText = `@${data.commenters[0]} و @${data.commenters[1]}`;
    } else {
      const others = data.commentCount - 2;
      commentersText = `@${data.commenters[0]} و @${data.commenters[1]} و ${others} ${others === 1 ? "آخر" : others === 2 ? "آخران" : "آخرون"}`;
    }

    // Build highlights section
    const highlightsText =
      data.highlights.length > 0
        ? `\n\n${data.highlights.map((highlight) => `"${highlight}"`).join("\n")}\n`
        : "";

    return {
      subject:
        env.CLOUDFLARE_ENV === "production"
          ? "بابل: إشعار جديد"
          : "بابل: إشعار جديد (تجربة)",
      text: `لديك إشعار جديد!

قام ${commentersText} بالتعليق ${contextText}: "${data.postTitle}"${highlightsText}

عرض التعليقات:
${data.postLink}`,
    };
  },
};

// ---------------------------
// 3. Main Send Function
// ---------------------------

export async function sendEmail<T extends EmailType>(
  type: T,
  data: EmailPayloadMap[T],
  apiKey: string,
) {
  // Create Resend instance inside the function (Cloudflare Workers requirement)
  const resend = new Resend(apiKey);

  const { subject, text } = templates[type](data as EmailPayloadMap[T]);

  const { data: result, error } = await resend.emails.send({
    from: FROM[type],
    to: [data.to],
    subject,
    text,
  });

  if (error) {
    console.error("Email send error:", error);
    throw error;
  }

  return result;
}

// ---------------------------
// 4. Batch Send Function
// ---------------------------

export interface BatchEmailInput<T extends EmailType> {
  type: T;
  data: EmailPayloadMap[T];
}

export async function sendBatchEmails(
  emails: BatchEmailInput<EmailType>[],
  apiKey: string,
) {
  if (emails.length === 0) {
    return { data: [], error: null };
  }

  // Create Resend instance
  const resend = new Resend(apiKey);

  // Transform emails into Resend batch format
  const batchPayload = emails.map((email) => {
    const template = templates[email.type] as EmailTemplate<typeof email.type>;
    const { subject, text } = template(email.data);

    return {
      from: FROM[email.type],
      to: [email.data.to],
      subject,
      text,
    };
  });

  // TODO: slice if more than 100 emails
  // Send batch (up to 100 emails per batch)
  const { data, error } = await resend.batch.send(batchPayload);

  if (error) {
    console.error("Batch email send error:", error);
    throw error;
  }

  return { data, error };
}
