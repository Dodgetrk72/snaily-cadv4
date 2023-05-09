"use client";

import * as React from "react";
import { useTranslations } from "use-intl";
import { Button } from "@snailycad/ui";
import { useAuth } from "~/context/auth-context";
import { Title } from "components/shared/Title";
import { VersionDisplay } from "components/shared/VersionDisplay";
import { canUseThirdPartyConnections } from "lib/utils";
import { useFeatureEnabled } from "hooks/useFeatureEnabled";
import { Discord, Steam } from "react-bootstrap-icons";
import { getAPIUrl } from "@snailycad/utils/api-url";
import { useRouter, useSearchParams } from "next/navigation";
import { doesUserHaveAllRequiredConnections } from "lib/validation/does-user-have-required-connections";

export function InnerRequiredConnectionsPage() {
  const { user, cad } = useAuth();

  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const { FORCE_DISCORD_AUTH, FORCE_STEAM_AUTH } = useFeatureEnabled();

  const _doesUserHaveAllRequiredConnections =
    user && doesUserHaveAllRequiredConnections({ user, features: cad?.features });

  React.useEffect(() => {
    const fromSearchParam = searchParams?.get("from");
    const from = typeof fromSearchParam === "string" ? fromSearchParam : "/citizen";

    if (_doesUserHaveAllRequiredConnections) {
      router.push(from);
    }
  }, [_doesUserHaveAllRequiredConnections]); // eslint-disable-line react-hooks/exhaustive-deps

  if (_doesUserHaveAllRequiredConnections) {
    return (
      <main className="flex justify-center pt-20">
        This account does not require more connections.
      </main>
    );
  }

  const rawSuccessMessage = searchParams?.get("success") as string | undefined;
  const successMessages = {
    discord: t("Auth.discordSyncSuccess"),
    steam: t("Auth.steamSyncSuccess"),
  } as Record<string, string>;
  const successMessage = rawSuccessMessage && successMessages[rawSuccessMessage];

  const useThirdPartyConnectionsAbility = canUseThirdPartyConnections();

  const showSteamOAuth =
    FORCE_STEAM_AUTH && useThirdPartyConnectionsAbility && !user?.steamId?.trim();
  const showDiscordOAuth =
    FORCE_DISCORD_AUTH && useThirdPartyConnectionsAbility && !user?.discordId?.trim();

  function handleDiscordLogin() {
    const url = getAPIUrl();

    const fullUrl = `${url}/auth/discord?syncOnly`;
    window.location.href = fullUrl;
  }

  function handleSteamLogin() {
    const url = getAPIUrl();

    const fullUrl = `${url}/auth/steam?syncOnly`;
    window.location.href = fullUrl;
  }

  return (
    <>
      <Title renderLayoutTitle={false}>{t("Auth.connections")}</Title>

      <main className="flex flex-col items-center justify-center pt-20">
        <div className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md dark:bg-primary dark:border dark:border-secondary">
          {successMessage ? (
            <div
              role="alert"
              className="bg-green-500/80 text-black w-full py-1.5 px-3 my-3 rounded-md"
            >
              {successMessage}
            </div>
          ) : null}

          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {t("Auth.connections")}
          </h1>

          <p className="my-3 text-base text-gray-800 dark:text-white">
            {t("Auth.connectionsText")}
          </p>

          <div className="my-5 flex items-center gap-2">
            <span className="h-[2px] bg-secondary w-full rounded-md" />
          </div>

          {showDiscordOAuth ? (
            <Button
              type="button"
              onPress={handleDiscordLogin}
              className="flex items-center justify-center gap-3 w-full"
            >
              <Discord />
              {t("Account.connectDiscord")}
            </Button>
          ) : null}

          {showSteamOAuth ? (
            <Button
              type="button"
              onPress={handleSteamLogin}
              className="flex items-center justify-center gap-3 w-full mt-2"
            >
              <Steam />
              {t("Account.connectSteam")}
            </Button>
          ) : null}
        </div>
        <VersionDisplay cad={cad} />

        <a
          rel="noreferrer"
          target="_blank"
          className="mt-3 md:mt-0 relative md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 underline text-lg transition-colors text-neutral-700 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white mx-2 block cursor-pointer z-50"
          href="https://snailycad.org"
        >
          SnailyCAD
        </a>
      </main>
    </>
  );
}
