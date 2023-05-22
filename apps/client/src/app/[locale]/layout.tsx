import "styles/fonts.scss";
import "styles/globals.scss";
import "styles/nprogress.scss";

import { classNames } from "lib/classNames";
import { getTranslations } from "lib/getTranslation";
import { cookies } from "next/headers";
import { Providers } from "./providers";
import { getAuthenticatedUserServer } from "~/lib/auth/get-authenticated-user-server";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetCADSettingsData } from "@snailycad/types/api";
import { cad } from "@snailycad/types";
import { Metadata } from "next";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

async function getCADSettings() {
  const { data: cadSettings } = await handleServerRequest<GetCADSettingsData | null>({
    path: "/admin/manage/cad-settings",
  });

  return cadSettings;
}

export async function generateMetadata(): Promise<Metadata> {
  const cadSettings = await getCADSettings();

  const description =
    cadSettings?.miscCadSettings?.cadOGDescription ?? "Get started with SnailyCAD";

  return {
    title: {
      default: `${cadSettings?.name ?? "SnailyCAD"} - SnailyCAD`,
      template: `%s - ${cadSettings?.name ?? "SnailyCAD"}`,
    },
    description,
    openGraph: {
      description,
      title: {
        default: `${cadSettings?.name ?? "SnailyCAD"} - SnailyCAD`,
        template: `%s - ${cadSettings?.name ?? "SnailyCAD"}`,
      },
    },
  };
}

export default async function RootLayout(props: RootLayoutProps) {
  const _cookies = cookies();

  const user = await getAuthenticatedUserServer();
  const { data: cadSettings } = await handleServerRequest<GetCADSettingsData | null>({
    path: "/admin/manage/cad-settings",
  });

  const cad = (user?.cad ?? cadSettings ?? null) as cad | null;

  const userSavedLocale = _cookies.get("sn_locale")?.value || "en";
  const userSavedIsDarkTheme = parseIsDarkTheme(_cookies.get("sna_isDarkTheme")?.value);

  const darkMode = user?.isDarkTheme ?? userSavedIsDarkTheme ?? true;
  const lang = user?.locale || userSavedLocale || "en";
  const defaultMessages = await getTranslations([], lang);

  return (
    <html lang={lang}>
      <body
        className={classNames("antialiased", darkMode && "min-h-screen bg-primary text-white dark")}
      >
        <Providers messages={defaultMessages} cad={cad} user={user}>
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
