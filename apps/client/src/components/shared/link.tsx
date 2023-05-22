"use client";

import * as React from "react";
import type { UrlObject } from "node:url";
import type { ComponentProps, PropsWithChildren } from "react";
import NextLink from "next-intl/link";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: string | UrlObject;
};

export function Link({ href, ...rest }: PropsWithChildren<LinkProps>) {
  const pathname = usePathname();
  const isExternalUrl = href.toString().startsWith("http");

  React.useEffect(() => {
    NProgress.done();
  }, [pathname]);

  if (isExternalUrl) {
    return <a href={href.toString()} {...rest} />;
  }

  return (
    <NextLink
      href={href}
      {...rest}
      onClick={(event) => {
        NProgress.start();
        rest.onClick?.(event);
      }}
    />
  );
}
