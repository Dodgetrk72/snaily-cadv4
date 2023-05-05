"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "context/AuthContext";
import { NextIntlClientProvider } from "next-intl";
import { ErrorBoundary } from "@sentry/nextjs";
import { ValuesProvider } from "context/ValuesContext";

// only load in client
import { Toaster } from "react-hot-toast";

export function Providers({ messages, children, user }: any) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ValuesProvider initialData={{ values: [] }}>
      <ErrorBoundary fallback={<p>An error occurred.</p>}>
        <QueryClientProvider client={queryClient}>
          <NextIntlClientProvider
            now={new Date()}
            onError={console.warn}
            messages={messages}
            locale={user.locale ?? "en"}
          >
            <Toaster position="top-right" />

            <AuthProvider initialData={{ session: user }}>{children}</AuthProvider>
          </NextIntlClientProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ValuesProvider>
  );
}
