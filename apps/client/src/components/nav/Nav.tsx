"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "context/AuthContext";
import { usePathname } from "next/navigation";
import { classNames } from "lib/classNames";
import { CitizenDropdown } from "./dropdowns/citizen-dropdown";
import { useFeatureEnabled } from "hooks/useFeatureEnabled";
import { useTranslations } from "next-intl";
import { useImageUrl } from "hooks/useImageUrl";
import { useViewport } from "@casper124578/useful/hooks/useViewport";
import { AccountDropdown } from "./dropdowns/account-dropdown";
import Head from "next/head";
import { usePermission } from "hooks/usePermission";
import { defaultPermissions, Permissions } from "@snailycad/permissions";
import { ImageWrapper } from "components/shared/image-wrapper";
import { AdminLink } from "./dropdowns/admin-link";
import dynamic from "next/dynamic";

const dropdowns = {
  Tow: dynamic(async () => (await import("./dropdowns/tow-dropdown")).TowDropdown),
  Officer: dynamic(async () => (await import("./dropdowns/officer-dropdown")).OfficerDropdown),
  EmsFd: dynamic(async () => (await import("./dropdowns/ems-fd-dropdown")).EmsFdDropdown),
  Dispatch: dynamic(async () => (await import("./dropdowns/dispatch-dropdown")).DispatchDropdown),
};

interface Props {
  maxWidth?: string;
}

export function Nav({ maxWidth }: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const { user, cad } = useAuth();
  const { TOW, COURTHOUSE } = useFeatureEnabled();
  const pathname = usePathname();

  const t = useTranslations("Nav");
  const isActive = (route: string) => pathname?.startsWith(route);
  const { hasPermissions } = usePermission();

  const { makeImageUrl } = useImageUrl();
  const url = cad && makeImageUrl("cad", cad.logoId);
  const viewport = useViewport();

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (viewport > 900) {
      setMenuOpen(false);
    }
  }, [viewport]);

  return (
    <nav className="bg-white dark:bg-tertiary shadow-sm sticky top-0 z-30">
      <div style={{ maxWidth: maxWidth ?? "100rem" }} className="mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col nav:hidden w-7"
            aria-label="Toggle menu"
          >
            <span className="my-0.5 rounded-md h-0.5 w-full bg-neutral-800 dark:bg-white " />
            <span className="my-0.5 rounded-md h-0.5 w-full bg-neutral-800 dark:bg-white " />
            <span className="my-0.5 rounded-md h-0.5 w-full bg-neutral-800 dark:bg-white " />
          </button>

          <div className="relative flex items-center nav:space-x-7">
            <h1 className="text-2xl hidden nav:block">
              <a
                href="/citizen"
                className="flex items-center gap-2 py-3 font-bold text-gray-800 dark:text-white"
              >
                {url ? (
                  <>
                    <Head>
                      <link rel="shortcut icon" href={url} />
                      <meta name="og:image" content={url} />
                    </Head>
                    <ImageWrapper
                      quality={80}
                      alt={cad?.name || "SnailyCAD"}
                      width={30}
                      height={30}
                      className="max-h-[30px] min-w-[30px]"
                      src={url}
                      loading="lazy"
                    />
                  </>
                ) : null}
                {cad?.name || "SnailyCAD"}
              </a>
            </h1>

            <div
              role="list"
              className={classNames(
                "nav:flex",
                menuOpen
                  ? "grid place-content-center fixed top-[3.6rem] left-0 bg-white dark:bg-tertiary w-screen space-y-2 py-3 animate-enter"
                  : "hidden nav:flex-row space-x-1 items-center",
              )}
            >
              <CitizenDropdown />

              {hasPermissions([Permissions.ViewTowCalls, Permissions.ManageTowCalls]) && TOW ? (
                <dropdowns.Tow />
              ) : null}

              {hasPermissions(defaultPermissions.defaultLeoPermissions) ? (
                <dropdowns.Officer />
              ) : null}

              {hasPermissions([Permissions.EmsFd]) ? <dropdowns.EmsFd /> : null}

              {hasPermissions([Permissions.LiveMap, Permissions.Dispatch]) ? (
                <dropdowns.Dispatch />
              ) : null}

              {user && COURTHOUSE ? (
                <Link
                  role="listitem"
                  href="/courthouse"
                  className={classNames(
                    "p-1 nav:px-2 text-gray-700 dark:text-gray-200 transition duration-300",
                    isActive("/courthouse") && "font-semibold",
                  )}
                >
                  {t("courthouse")}
                </Link>
              ) : null}

              {hasPermissions([
                ...defaultPermissions.allDefaultAdminPermissions,
                ...defaultPermissions.defaultCourthousePermissions,
                Permissions.ManageAwardsAndQualifications,
              ]) ? (
                <AdminLink />
              ) : null}
            </div>
          </div>

          <div>
            <AccountDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
