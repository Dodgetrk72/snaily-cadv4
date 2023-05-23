import { getRequestConfig } from "next-intl/server";
import { getTranslations } from "./lib/getTranslation";

export default getRequestConfig(async ({ locale }) => ({
  messages: await getTranslations(
    [
      "account",
      "courthouse",
      "business",
      "values",
      "leo",
      "ems-fd",
      "citizen",
      "cad-settings",
      "admin",
    ],
    locale,
  ),
}));
