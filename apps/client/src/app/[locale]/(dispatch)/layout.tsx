import { DndProvider } from "@snailycad/ui";
import { getTranslations } from "lib/getTranslation";
import { NextIntlClientProvider } from "next-intl";
import { DispatchProviders } from "./providers";

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function DispatchLayout(props: LayoutProps) {
  const messages = await getTranslations(
    ["citizen", "truck-logs", "ems-fd", "leo", "calls", "common"],
    props.params.locale,
  );

  return (
    <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
      <NextIntlClientProvider locale={props.params.locale} messages={messages}>
        <DndProvider>
          <DispatchProviders>{props.children}</DispatchProviders>
        </DndProvider>
      </NextIntlClientProvider>
    </main>
  );
}
