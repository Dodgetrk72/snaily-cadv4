"use client";

import { GetAdminDashboardData } from "@snailycad/types/api";
import prettyBytes from "pretty-bytes";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";

interface InnerAdminDashboardPageProps {
  data: GetAdminDashboardData | null;
}

export function InnerAdminDashboardPage(props: InnerAdminDashboardPageProps) {
  const counts = props.data;
  const t = useTranslations("Management");

  if (!counts) {
    return (
      <div
        role="alert"
        className="mb-5 flex flex-col p-2 px-4 text-black rounded-md shadow bg-red-400 border border-red-500/80"
      >
        <header className="flex items-center gap-2 mb-2">
          <ExclamationCircleFill />
          <h5 className="font-semibold text-lg">Unable to show stats</h5>
        </header>
        <p>
          We were unable to show the statistics. Please try again later. If this issue persists,
          please contact the developer.
        </p>
      </div>
    );
  }

  return (
    <>
      <Title>{t("adminDashboard")}</Title>

      <Group name={t("users")}>
        <Item count={counts.activeUsers} name={t("active")} />
        <Item count={counts.pendingUsers} name={t("pending")} />
        <Item count={counts.bannedUsers} name={t("banned")} />
      </Group>

      <Group name={t("citizens")}>
        <Item count={counts.createdCitizens} name={t("created")} />
        <Item
          count={counts.citizensInBolo}
          name={t("inBolo")}
          percentage={(100 / counts.createdCitizens) * counts.citizensInBolo}
        />
        <Item
          count={counts.arrestCitizens}
          name={t("arrested")}
          percentage={(100 / counts.createdCitizens) * counts.arrestCitizens}
        />
        <Item
          count={counts.deadCitizens}
          name={t("dead")}
          percentage={(100 / counts.createdCitizens) * counts.deadCitizens}
        />
      </Group>

      <Group name={t("vehicles")}>
        <Item count={counts.vehicles} name={t("registered")} />
        <Item
          count={counts.vehiclesInBOLO}
          name={t("inBolo")}
          percentage={(100 / counts.vehicles) * counts.vehiclesInBOLO}
        />
        <Item
          count={counts.impoundedVehicles}
          name="impounded"
          percentage={(100 / counts.vehicles) * counts.impoundedVehicles}
        />
      </Group>

      <Group name={t("leo")}>
        <Item count={counts.officerCount} name="total" />
        <Item
          count={counts.onDutyOfficers}
          name={t("onDuty")}
          percentage={(100 / counts.officerCount) * counts.onDutyOfficers}
        />
        <Item
          count={counts.suspendedOfficers}
          name={t("suspended")}
          percentage={(100 / counts.officerCount) * counts.suspendedOfficers}
        />
      </Group>

      <Group name={t("emsFd")}>
        <Item count={counts.emsDeputiesCount} name="total" />
        <Item
          count={counts.onDutyEmsDeputies}
          name={t("onDuty")}
          percentage={(100 / counts.emsDeputiesCount) * counts.onDutyEmsDeputies}
        />
        <Item
          count={counts.suspendedEmsFDDeputies}
          name={t("suspended")}
          percentage={(100 / counts.emsDeputiesCount) * counts.suspendedEmsFDDeputies}
        />
      </Group>

      <Group name={t("images")}>
        <Item count={counts.imageData.count} name="total" />
        <Item count={prettyBytes(counts.imageData.totalSize, { binary: true })} name="" />
      </Group>
    </>
  );
}

function Group({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section className="max-w-2xl my-2 mb-7 select-none">
      <h4 className="text-lg">{name}</h4>

      <div className="flex justify-between">{children}</div>
    </section>
  );
}

function Item({
  count,
  name,
  percentage,
}: {
  count: number | string;
  name: string;
  percentage?: number;
}) {
  return (
    <div className="relative flex items-end select-none">
      <div>
        <span className="font-sans text-5xl font-semibold">{count}</span>
      </div>

      <div className="flex flex-col items-end">
        {percentage ? (
          <span className="text-lg text-gray-500 dark:text-gray-300">{percentage.toFixed()}%</span>
        ) : null}
        <span className="ml-3 text-xl capitalize">{name}</span>
      </div>
    </div>
  );
}
