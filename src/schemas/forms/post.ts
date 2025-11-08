import { formOptions } from "@tanstack/react-form";
import type { Post } from "../db";

export type PostSubmition = {
  post: Pick<Post, "title" | "url" | "text">;
  cf_turnstile: string;
};

const defaultPostSubmition: PostSubmition = {
  post: {
    title: "",
    url: "",
    text: "",
  },
  cf_turnstile: "",
};

export const postFormOpts = formOptions({
  defaultValues: defaultPostSubmition,
});
