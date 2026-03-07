import { Google } from "arctic";

export function getGoogleClient(
  env: { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string },
  callbackUrl: string = "https://grasswhoopin.com/auth/callback"
) {
  return new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    callbackUrl
  );
}
