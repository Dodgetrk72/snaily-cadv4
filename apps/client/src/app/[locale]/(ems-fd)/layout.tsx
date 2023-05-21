import { DndProvider } from "@snailycad/ui";
import { getTranslations } from "lib/getTranslation";
import { NextIntlClientProvider } from "next-intl";
import { EmsFdProviders } from "./providers";
import { Nav } from "~/components/nav/Nav";

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function EmsFdLayout(props: LayoutProps) {
  const messages = await getTranslations(
    ["ems-fd", "leo", "calls", "citizen", "common"],
    props.params.locale,
  );

  return (
    <>
      <Nav />

      <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
        <NextIntlClientProvider locale={props.params.locale} messages={messages}>
          <DndProvider>
            <EmsFdProviders>{props.children}</EmsFdProviders>
          </DndProvider>
        </NextIntlClientProvider>
      </main>
    </>
  );
}
