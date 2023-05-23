import { i18n } from "i18n.config.mjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();

export async function getTranslations(types: string[], locale = "en") {
  try {
    const typesWithCommon = [...new Set(["common", "auth", "error-messages", ...types])];
    const paths = typesWithCommon.map((type) => path.join(cwd, `locales/${locale}/${type}.json`));

    if (!i18n.locales.includes(locale)) {
      locale = i18n.defaultLocale;
    }

    let data: Record<string, string> = {};

    await Promise.all(
      paths.map(async (path) => {
        const json = await loadTranslationPath(path);
        data = { ...data, ...json };
      }),
    );

    return data;
  } catch (error) {
    return {} as Record<string, string>;
  }
}

async function loadTranslationPath(path: string) {
  try {
    const json = JSON.parse(await readFile(path, "utf8"));
    return json;
  } catch {
    return {};
  }
}
