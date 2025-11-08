export enum BadgeId {
  EMAIL_VERIFIED = "email_verified",
  EARLY_ADOPTER = "early_adopter",
  TOP_CONTRIBUTOR = "top_contributor",
  MODERATOR = "moderator",
}

export const BADGE_METADATA = {
  [BadgeId.EMAIL_VERIFIED]: {
    name: "بريد موثق",
    description: "هذا المستخدم قام بتوثيق بريده الإلكتروني",
  },
  [BadgeId.EARLY_ADOPTER]: {
    name: "مستخدم مبكر",
    description: "هذا المستخدم من أوائل المنضمين للمنصة",
  },
  [BadgeId.TOP_CONTRIBUTOR]: {
    name: "مساهم نشط",
    description: "هذا المستخدم مساهم نشط في المجتمع",
  },
  [BadgeId.MODERATOR]: {
    name: "مشرف",
    description: "هذا المستخدم أحد مشرفي المنصة",
  },
} as const;
