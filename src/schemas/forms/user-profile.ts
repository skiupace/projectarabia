import { formOptions } from "@tanstack/react-form";

export interface UserProfileSubmission {
  about: string;
  email: string;
  cf_turnstile: string;
}

const defaultUserProfileSubmission: UserProfileSubmission = {
  about: "",
  email: "",
  cf_turnstile: "",
};

export const userProfileFormOpts = formOptions({
  defaultValues: defaultUserProfileSubmission,
});
