import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MAX_ABOUT_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/constants/limts";

export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: string;
}

/**
 * Validate username following Hacker News style rules:
 * - 2-15 characters
 * - Must start with a lowercase English letter
 * - Only lowercase English alphanumeric and underscores
 * - No uppercase, Arabic, or special characters
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim() === "") {
    return {
      valid: false,
      error: "اسم المستخدم مطلوب",
      errorCode: "USERNAME_REQUIRED",
    };
  }

  // Check for non-ASCII characters (Arabic, emoji, etc.)
  // Use Unicode escape for control chars to avoid regex lint errors
  if (/[^\u0020-\u007E]/.test(username)) {
    return {
      valid: false,
      error: "اسم المستخدم يجب أن يكون باللغة الإنجليزية فقط",
      errorCode: "USERNAME_ENGLISH_ONLY",
    };
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(username)) {
    return {
      valid: false,
      error: "اسم المستخدم يجب أن يحتوي على حروف صغيرة فقط",
      errorCode: "USERNAME_NO_UPPERCASE",
    };
  }

  // Length check
  if (username.length < MIN_USERNAME_LENGTH) {
    return {
      valid: false,
      error: "اسم المستخدم يجب أن يكون على الأقل حرفين",
      errorCode: "USERNAME_TOO_SHORT",
    };
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return {
      valid: false,
      error: "اسم المستخدم يجب أن لا يزيد عن 15 حرف",
      errorCode: "USERNAME_TOO_LONG",
    };
  }

  // Must start with a lowercase English letter
  if (!/^[a-z]/.test(username)) {
    return {
      valid: false,
      error: "اسم المستخدم يجب أن يبدأ بحرف إنجليزي صغير",
      errorCode: "USERNAME_INVALID_START",
    };
  }

  // Only lowercase English alphanumeric and underscores
  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      valid: false,
      error:
        "اسم المستخدم يمكن أن يحتوي فقط على حروف إنجليزية صغيرة وأرقام وشرطات سفلية",
      errorCode: "USERNAME_INVALID_CHARS",
    };
  }

  return { valid: true };
}

/**
 * Validate email address using standard email regex
 */
export function validateEmail(email: string | undefined): ValidationResult {
  // Email is optional, so empty is valid
  if (!email || email.trim() === "") {
    return { valid: true };
  }

  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "البريد الإلكتروني غير صالح",
      errorCode: "EMAIL_INVALID",
    };
  }

  // Check length
  if (email.length > MAX_EMAIL_LENGTH) {
    return {
      valid: false,
      error: `البريد الإلكتروني طويل جداً (الحد الأقصى ${MAX_EMAIL_LENGTH} حرف)`,
      errorCode: "EMAIL_TOO_LONG",
    };
  }

  return { valid: true };
}

/**
 * Validate about text:
 * - Optional field
 * - Maximum MAX_ABOUT_LENGTH characters
 */
export function validateAbout(about: string | undefined): ValidationResult {
  // About is optional, so empty is valid
  if (!about || about.trim() === "") {
    return { valid: true };
  }

  // Check length
  if (about.length > MAX_ABOUT_LENGTH) {
    return {
      valid: false,
      error: `النص يجب أن لا يزيد عن ${MAX_ABOUT_LENGTH} حرف`,
      errorCode: "ABOUT_TOO_LONG",
    };
  }

  return { valid: true };
}

/**
 * Validate password strength:
 * - Minimum MIN_PASSWORD_LENGTH characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === "") {
    return {
      valid: false,
      error: "كلمة المرور مطلوبة",
      errorCode: "PASSWORD_REQUIRED",
    };
  }

  // Minimum length
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `كلمة المرور يجب أن تكون على الأقل ${MIN_PASSWORD_LENGTH} أحرف`,
      errorCode: "PASSWORD_TOO_SHORT",
    };
  }

  // Maximum length for security (prevent DOS)
  if (password.length > MAX_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `كلمة المرور طويلة جداً (الحد الأقصى ${MAX_PASSWORD_LENGTH} حرف)`,
      errorCode: "PASSWORD_TOO_LONG",
    };
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
      errorCode: "PASSWORD_NO_UPPERCASE",
    };
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل",
      errorCode: "PASSWORD_NO_LOWERCASE",
    };
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
      errorCode: "PASSWORD_NO_NUMBER",
    };
  }

  return { valid: true };
}
