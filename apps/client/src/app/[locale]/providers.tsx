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
import { GetCADSettingsData, GetUserData } from "@snailycad/types/api";

interface ProvidersProps {
  messages: Record<string, string>;
  children: React.ReactNode;
  user: GetUserData | null;
  cad: GetCADSettingsData | null;
}

export function Providers(props: ProvidersProps) {
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
                messages={props.messages}
                locale={props.user?.locale ?? "en"}
              >
                <Toaster position="top-right" />

                <AuthProvider initialData={{ cad: props.cad, session: props.user }}>
                  {props.children}
                </AuthProvider>
              </NextIntlClientProvider>
            </SocketProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ValuesProvider>
    </SSRProvider>
  );
}
