"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "~/context/auth-context";
import { NextIntlClientProvider } from "next-intl";
import { ErrorBoundary } from "@sentry/nextjs";
import { ValuesProvider } from "~/context/values-context";
import { SSRProvider } from "@react-aria/ssr";

import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@casper124578/use-socket.io";
import { ErrorFallback } from "~/components/error-fallback";
import { getAPIUrl } from "@snailycad/utils/api-url";
import { GetUserData } from "@snailycad/types/api";
import { cad } from "@snailycad/types";

interface ProvidersProps {
  messages: Record<string, string>;
  children: React.ReactNode;
  user: (Omit<GetUserData, "cad"> & { cad: cad | null }) | null;
}

export function Providers({ messages, children, user }: ProvidersProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  const { protocol, host } = new URL(getAPIUrl());
  const url = `${protocol}//${host}`;

  return (
    <SSRProvider>
      <ValuesProvider initialData={{ values: [] }}>
        <ErrorBoundary fallback={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
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
