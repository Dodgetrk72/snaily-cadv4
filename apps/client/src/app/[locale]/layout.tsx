import "styles/fonts.scss";
import "styles/globals.scss";
import "styles/nprogress.scss";

import { getSessionUser } from "lib/auth";
import { classNames } from "lib/classNames";
import { getTranslations } from "lib/getTranslation";
import { cookies, headers } from "next/headers";
import { Providers } from "./providers";

interface RootLayoutProps {
  children: React.ReactNode;
}

// fetch CAD configuration
export const metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function RootLayout(props: RootLayoutProps) {
  const _headers = headers();
  const _cookies = cookies();

  const user = await getSessionUser({ headers: Object.fromEntries(_headers.entries()) } as any);

  const userSavedLocale = user?.locale || _cookies.get("sn_locale")?.value || "en";
  const userSavedIsDarkTheme = parseIsDarkTheme(_cookies.get("sna_isDarkTheme")?.value);

  const darkMode = user?.isDarkTheme ?? userSavedIsDarkTheme ?? true;
  const lang = user?.locale || userSavedLocale || "en";
  const defaultMessages = await getTranslations([], lang);

  return (
    <html lang={lang}>
      <body
        className={classNames("antialiased", darkMode && "min-h-screen bg-primary text-white dark")}
      >
        <Providers messages={defaultMessages} user={user}>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}

function parseIsDarkTheme(value?: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}
