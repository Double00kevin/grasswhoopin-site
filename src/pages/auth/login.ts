import type { APIContext } from "astro";
import { getGoogleClient } from "../../lib/auth";
import { generateState, generateCodeVerifier } from "arctic";

export const prerender = false;

export async function GET(context: APIContext): Promise<Response> {
  const callbackUrl = new URL("/auth/callback", context.url.origin).toString();
  const google = getGoogleClient(context.locals.runtime.env, callbackUrl);
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "email"]);

  context.cookies.set("google_state", state, { httpOnly: true, secure: true, maxAge: 600, path: "/" });
  context.cookies.set("google_code_verifier", codeVerifier, { httpOnly: true, secure: true, maxAge: 600, path: "/" });

  return context.redirect(url.toString());
}
