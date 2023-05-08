import { getSessionUser } from "lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface IndexPageProps {
  params: { locale: string };
}

export default async function IndexPage(props: IndexPageProps) {
  const _headers = headers();
  const user = await getSessionUser({ headers: Object.fromEntries(_headers.entries()) } as any);

  if (!user) {
    return redirect(`/${props.params.locale}/auth/login`);
  }

  const userLocale = user?.locale || "en";
  return redirect(`/${userLocale}/citizen`);
}
