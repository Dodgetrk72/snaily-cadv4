"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "context/AuthContext";
import { NextIntlClientProvider } from "next-intl";

export function Providers({ messages, children, user }: any) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider messages={messages} locale={user.locale ?? "en"}>
        <AuthProvider initialData={{ session: user }}>{children}</AuthProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
