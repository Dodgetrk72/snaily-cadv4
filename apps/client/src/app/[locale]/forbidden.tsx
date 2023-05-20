"use client";

import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";

export default function ForbiddenPage() {
  const t = useTranslations("Errors");

  return <Title>{t("forbidden")}</Title>;
}
