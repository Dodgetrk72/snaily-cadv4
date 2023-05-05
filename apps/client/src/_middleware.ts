import createMiddleware from "next-intl/middleware";
import { i18n } from "../i18n.config.mjs";

export default createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: "always",
});

export const config = {
  // skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
