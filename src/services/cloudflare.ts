import { env } from "cloudflare:workers";

// Cloudflare Turnstile validation
export async function validateTurnstile(token: string): Promise<{
  success: boolean;
  "error-codes"?: string[];
}> {
  const verifyEndpoint =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const secret = env.SECRET_KEY;

  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);

  const response = await fetch(verifyEndpoint, {
    method: "POST",
    body: formData,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  const result = await response.json<{
    success: boolean;
    "error-codes"?: string[];
  }>();
  return result;
}
