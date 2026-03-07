import { Google } from "arctic";

export function getGoogleClient(
  env: { GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string },
  callbackUrl: string
) {
  return new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    callbackUrl
  );
}