import { Nav } from "~/components/nav/Nav";
import { NextIntlClientProvider } from "next-intl";
import { AdminSidebar } from "~/components/admin/sidebar/sidebar";
import { getTranslations } from "~/lib/getTranslation";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout(props: AdminLayoutProps) {
  const messages = await getTranslations(
    ["account", "business", "values", "leo", "ems-fd", "citizen", "cad-settings", "admin"],
    props.params.locale,
  );

  return (
    <NextIntlClientProvider locale={props.params.locale} messages={messages}>
      <Nav maxWidth="none" />

      <main className="flex">
        <AdminSidebar />

        <div className="ml-6 px-4 py-5 admin-dashboard-responsive">
          {/* <Component enabled={roleplayStopped} audio={audio} />
          {showError ? <SocketErrorComponent /> : null}
          {cad?.version?.latestReleaseVersion &&
          cad.version.latestReleaseVersion !== cad.version.currentVersion ? (
            <a
              href={`https://github.com/SnailyCAD/snaily-cadv4/releases/tag/${cad.version.latestReleaseVersion}`}
              role="alert"
              className="block p-2 px-4 my-2 mb-5 text-black rounded-md shadow bg-amber-500"
            >
              <h1 className="text-xl font-bold">{t("updateAvailable")}</h1>
              <p className="mt-1 text-lg">{t("updateAvailableInfo")}</p>
            </a>
          ) : null} */}

          {props.children}
        </div>
      </main>
    </NextIntlClientProvider>
  );
}
