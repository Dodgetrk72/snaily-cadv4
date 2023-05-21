"use client";

import * as React from "react";
import type { UrlObject } from "node:url";
import type { ComponentProps, PropsWithChildren } from "react";
import NextLink from "next/link";
import { useLocale } from "use-intl";
import { transformHrefWithLocale } from "~/lib/i18n/transform-href-with-locale";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: string | UrlObject;
};

export function Link({ href, locale, ...rest }: PropsWithChildren<LinkProps>) {
  const routerLocale = useLocale();
  const pathname = usePathname();
  const isExternalUrl = href.toString().startsWith("http");

  React.useEffect(() => {
    NProgress.done();
  }, [pathname]);

  const localizedHref = React.useMemo(
    () => transformHrefWithLocale(href, locale || routerLocale),
    [routerLocale, href, locale],
  );

  if (isExternalUrl) {
    return <a href={href.toString()} {...rest} />;
  }

  return (
    <NextLink
      href={localizedHref}
      locale={routerLocale}
      {...rest}
      onClick={(event) => {
        NProgress.start();
        rest.onClick?.(event);
      }}
    />
  );
}
