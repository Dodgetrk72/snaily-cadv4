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

export function Providers({ messages, children, user }: any) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <SSRProvider>
      <ValuesProvider initialData={{ values: [] }}>
        <ErrorBoundary fallback={<p>An error occurred.</p>}>
          <QueryClientProvider client={queryClient}>
            {/* todo: API url */}
            <SocketProvider uri="http://localhost:8080">
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
