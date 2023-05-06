import type { UrlObject } from "node:url";
import { i18n } from "../../../i18n.config.mjs";

function rewriteHref(pathname: string, locale: string) {
  const startsWithSlash = pathname.startsWith("/");
  const path = pathname.split("/");
  const existingLocaleParam = startsWithSlash ? path[1] : path[0];
  const isAcceptedLanguage = existingLocaleParam && i18n.locales.includes(existingLocaleParam);

  if (isAcceptedLanguage) {
    if (startsWithSlash) path[1] = locale;
    else path[0] = locale;
  } else {
    if (startsWithSlash) path.splice(1, 0, locale);
    else path.splice(0, 0, locale);
  }
  return path.join("/");
}

type ExternalLink = `https://${string}`;
function isExternalLink(href: string | UrlObject): href is ExternalLink {
  return typeof href === "string" && href.startsWith("https://");
}

export function transformHrefWithLocale(
  href: string | UrlObject,
  locale: string,
): string | UrlObject {
  if (isExternalLink(href)) return href;
  let localizedHref: UrlObject = {};

  if (typeof href === "string") {
    localizedHref.pathname = rewriteHref(href, locale);
  } else {
    localizedHref = href;
    if (!localizedHref.pathname) {
      throw new Error("Invalid href");
    }
    localizedHref.pathname = rewriteHref(localizedHref.pathname, locale);
  }

  return localizedHref;
}

export function getRawHref(href: string | UrlObject): string {
  if (typeof href === "string") return href;
  return href.pathname ?? "";
}
