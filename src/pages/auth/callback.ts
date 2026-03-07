import type { APIContext } from "astro";
import { getGoogleClient } from "../../lib/auth";
import { decodeIdToken } from "arctic";

export const prerender = false;

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("google_state")?.value;
  const codeVerifier = context.cookies.get("google_code_verifier")?.value;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response("Invalid OAuth state", { status: 400 });
  }

  const callbackUrl = new URL("/auth/callback", context.url.origin).toString();
  const google = getGoogleClient(context.locals.runtime.env, callbackUrl);
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const claims = decodeIdToken(tokens.idToken());
  const email = (claims as any).email as string;

  const allowedEmail = context.locals.runtime.env.ADMIN_EMAIL;
  if (email !== allowedEmail) {
    return new Response("Unauthorized", { status: 403 });
  }

  context.cookies.set("gw_admin", "authorized", {
    httpOnly: true,
    secure: context.url.protocol === "https:",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });

  return context.redirect("/admin");
}
