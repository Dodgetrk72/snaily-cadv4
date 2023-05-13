"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "~/context/auth-context";
import { NextIntlClientProvider } from "next-intl";
import { ErrorBoundary } from "@sentry/nextjs";
import { ValuesProvider } from "~/context/values-context";
import { SSRProvider } from "@react-aria/ssr";

// todo: only load in client
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@casper124578/use-socket.io";
import { ErrorFallback } from "~/components/error-fallback";
import { getAPIUrl } from "@snailycad/utils/api-url";

export function Providers({ messages, children, user }: any) {
  const [queryClient] = React.useState(() => new QueryClient());

  const { protocol, host } = new URL(getAPIUrl());
  const url = `${protocol}//${host}`;

  return (
    <SSRProvider>
      <ValuesProvider initialData={{ values: [] }}>
        <ErrorBoundary fallback={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {/* todo: API url */}
            <SocketProvider uri={url}>
              <NextIntlClientProvider
                now={new Date()}
                onError={console.warn}
                messages={messages}
                locale={user?.locale ?? "en"}
              >
                <Toaster position="top-right" />

                <AuthProvider initialData={{ session: user }}>{children}</AuthProvider>
              </NextIntlClientProvider>
            </SocketProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ValuesProvider>
    </SSRProvider>
  );
}
