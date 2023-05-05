"use client";

import { useTranslations } from "use-intl";
import { Button, TabsContent } from "@snailycad/ui";
import { useAuth } from "context/AuthContext";
import { getAPIUrl } from "@snailycad/utils/api-url";
import useFetch from "lib/useFetch";
import { useFeatureEnabled } from "hooks/useFeatureEnabled";
import { ExclamationCircleFill } from "react-bootstrap-icons";

enum ConnectionKeys {
  Discord = "discord",
  Steam = "steam",
}

interface ConnectionsTabProps {
  searchParams?: { success?: "true" | "false"; error?: string };
}

export function ConnectionsTab(props: ConnectionsTabProps) {
  const { user, setUser } = useAuth();
  const t = useTranslations("Account");
  const errorT = useTranslations("Errors");
  const { state, execute } = useFetch();
  const { ALLOW_REGULAR_LOGIN, FORCE_DISCORD_AUTH, FORCE_STEAM_AUTH, STEAM_OAUTH, DISCORD_AUTH } =
    useFeatureEnabled();

  const CONNECTIONS = [
    {
      key: ConnectionKeys.Discord,
      enabled: DISCORD_AUTH,
      value: user?.discordId,
      connect: t("connectDiscord"),
      disconnect: t("disconnectDiscord"),
      disconnectText: t("disconnectText"),
      connectText: t("connectText"),
    },
    {
      key: ConnectionKeys.Steam,
      enabled: STEAM_OAUTH,
      value: user?.steamId,
      connect: t("connectSteam"),
      disconnect: t("disconnectSteam"),
      disconnectText: t("disconnectSteamText"),
      connectText: t("connectSteamText"),
    },
  ];

  const errors = {
    discordAccountAlreadyLinked: errorT("discordAccountAlreadyLinked"),
    steamAccountAlreadyLinked: errorT("steamAccountAlreadyLinked"),
  };
  const error = errors[props.searchParams?.error as keyof typeof errors];

  function handleConnectClick(type: ConnectionKeys) {
    const url = getAPIUrl();

    // append date so browsers don't cache this URL.
    const fullUrl = `${url}/auth/${type}?v=${new Date().toISOString()}`;
    window.location.href = fullUrl;
  }

  async function handleUnlink(type: ConnectionKeys) {
    const { json } = await execute({ path: `/auth/${type}`, method: "DELETE" });

    if (json && user) {
      const key = type === ConnectionKeys.Discord ? "discordId" : "steamId";
      setUser({ ...user, [key]: null });
    }
  }

  const isDisabled =
    !ALLOW_REGULAR_LOGIN || FORCE_DISCORD_AUTH || FORCE_STEAM_AUTH || state === "loading";

  return (
    <TabsContent aria-label={t("connections")} value="connections">
      <h1 className="text-2xl font-semibold">{t("connections")}</h1>

      {error ? (
        <div
          role="alert"
          className="w-full my-3 mb-5 flex items-center gap-3 p-2 px-4 text-black rounded-md shadow bg-red-400 border border-red-500/80"
        >
          <ExclamationCircleFill />
          <h5 className="font-semibold text-lg">{error}</h5>
        </div>
      ) : null}

      <ul className="flex flex-col mt-3 gap-y-4">
        {CONNECTIONS.map((connection) => {
          if (!connection.enabled) return null;

          const disconnectText = ALLOW_REGULAR_LOGIN
            ? connection.disconnectText
            : t("disabledDisconnectText");

          return (
            <li
              className="flex items-center justify-between card px-4 py-3 gap-x-3"
              key={connection.key}
            >
              <div>
                <h4 className="text-xl font-semibold mb-2">{t(connection.key)}</h4>
                <p className="text-lg">
                  {connection.value ? disconnectText : connection.connectText}
                </p>
              </div>

              <div className="min-w-fit">
                {connection.value ? (
                  <Button
                    onPress={() => handleUnlink(connection.key)}
                    disabled={isDisabled}
                    variant="danger"
                    className="text-base"
                  >
                    {state === "loading" ? t("disconnecting") : connection.disconnect}
                  </Button>
                ) : (
                  <Button className="text-base" onPress={() => handleConnectClick(connection.key)}>
                    {connection.connect}
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </TabsContent>
  );
}
