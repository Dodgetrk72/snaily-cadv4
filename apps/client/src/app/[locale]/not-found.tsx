"use client";

import * as React from "react";
import { Title } from "~/components/shared/Title";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("Errors");

  return <Title>{t("pageNotFound")}</Title>;
}
