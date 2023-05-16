import { getTranslations } from "lib/getTranslation";
import { NextIntlClientProvider } from "next-intl";
import { AccountTabList } from "./tab-list";

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function AccountLayout(props: LayoutProps) {
  const messages = await getTranslations(["courthouse", "leo", "citizen"], props.params.locale);

  return (
    <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
      <NextIntlClientProvider locale={props.params.locale} messages={messages}>
        <AccountTabList>{props.children}</AccountTabList>
      </NextIntlClientProvider>
    </main>
  );
}
