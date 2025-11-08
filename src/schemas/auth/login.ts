import { formOptions } from "@tanstack/react-form";

export interface LoginSubmission {
  username: string;
  password: string;
  cf_turnstile: string;
}

export interface RegisterSubmission {
  username: string;
  email?: string;
  password: string;
  cf_turnstile: string;
}

const defaultLoginSubmission: LoginSubmission = {
  username: "",
  password: "",
  cf_turnstile: "",
};

const defaultRegisterSubmission: RegisterSubmission = {
  username: "",
  email: "",
  password: "",
  cf_turnstile: "",
};

export const loginFormOpts = formOptions({
  defaultValues: defaultLoginSubmission,
});

export const registerFormOpts = formOptions({
  defaultValues: defaultRegisterSubmission,
});
