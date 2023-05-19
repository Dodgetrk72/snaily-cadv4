import { DndProvider } from "@snailycad/ui";
import { getTranslations } from "lib/getTranslation";
import { NextIntlClientProvider } from "next-intl";
import { DispatchProviders } from "./providers";
import { Nav } from "~/components/nav/Nav";

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
    <>
      <Nav maxWidth="none" />

      <NextIntlClientProvider locale={props.params.locale} messages={messages}>
        <DndProvider>
          <DispatchProviders>{props.children}</DispatchProviders>
        </DndProvider>
      </NextIntlClientProvider>
    </>
  );
}
