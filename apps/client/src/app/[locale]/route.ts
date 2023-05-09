import { getSessionUser } from "lib/auth";
import { redirect } from "next/navigation";

interface IndexPageProps {
  params: { locale: string };
}

/**
 * this file checks if a user is authenticated, if not it will redirect the user to the login page
 *
 * 1. get the user from the session
 * 2. if the user is not found, redirect the user to the login page
 * 3. if the user is found, redirect the user to the citizen page
 */

export async function GET(request: Request, options: IndexPageProps) {
  const _headers = request.headers;
  const user = await getSessionUser({ headers: Object.fromEntries(_headers.entries()) } as any);

  if (!user) {
    return redirect(`/${options.params.locale}/auth/login`);
  }

  const userLocale = user?.locale || "en";
  return redirect(`/${userLocale}/citizen`);
}
