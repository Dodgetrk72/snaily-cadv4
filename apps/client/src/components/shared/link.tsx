"use client";

import type { UrlObject } from "node:url";
import type { ComponentProps, PropsWithChildren } from "react";
import NextLink from "next/link";
import { useMemo } from "react";
import { useLocale } from "use-intl";
import { transformHrefWithLocale } from "~/lib/i18n/transform-href-with-locale";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: string | UrlObject;
};

export function Link({ href, locale, ...rest }: PropsWithChildren<LinkProps>) {
  const routerLocale = useLocale();

  const localizedHref = useMemo(
    () => transformHrefWithLocale(href, locale || routerLocale),
    [routerLocale, href, locale],
  );
  return <NextLink href={localizedHref} locale={routerLocale} {...rest} />;
}
