"use client";

import * as React from "react";
import { Title } from "~/components/shared/Title";
import { useTranslations } from "next-intl";
import { Nav } from "~/components/nav/Nav";

export default function NotFound() {
  const t = useTranslations("Errors");

  return (
    <>
      <Nav />

      <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
        <Title>{t("pageNotFound")}</Title>
      </main>
    </>
  );
}
