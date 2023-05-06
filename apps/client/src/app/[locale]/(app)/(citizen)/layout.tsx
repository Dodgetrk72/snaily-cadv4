import { getTranslations } from "lib/getTranslation";
import { NextIntlClientProvider } from "next-intl";
import { CitizenProvider } from "~/context/citizen-context";

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function CitizenLayout(props: LayoutProps) {
  const messages = await getTranslations(
    ["citizen", "leo", "ems-fd", "calls"],
    props.params.locale,
  );

  return (
    <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
      <NextIntlClientProvider locale={props.params.locale} messages={messages}>
        <CitizenProvider>{props.children}</CitizenProvider>
      </NextIntlClientProvider>
    </main>
  );
}
