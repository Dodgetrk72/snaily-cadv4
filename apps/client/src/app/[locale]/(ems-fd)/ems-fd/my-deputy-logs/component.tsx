"use client";

import { GetMyDeputiesLogsData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { FormField } from "~/components/form/FormField";
import { Select } from "~/components/form/Select";
import { OfficerLogsTable } from "~/components/leo/logs/OfficerLogsTable";
import { useAsyncTable } from "~/components/shared/Table";
import { Title } from "~/components/shared/Title";
import { useGetUserDeputies } from "~/hooks/ems-fd/use-get-user-deputies";
import { useGenerateCallsign } from "~/hooks/useGenerateCallsign";
import { makeUnitName } from "~/lib/utils";

interface InnerMyDeputyLogsPageProps {
  defaultData: GetMyDeputiesLogsData;
}

export function InnerMyDeputyLogsPage(props: InnerMyDeputyLogsPageProps) {
  const { userDeputies, isLoading } = useGetUserDeputies();

  const asyncTable = useAsyncTable({
    fetchOptions: {
      pageSize: 25,
      onResponse: (json: GetMyDeputiesLogsData) => ({
        data: json.logs,
        totalCount: json.totalCount,
      }),
      path: "/ems-fd/logs",
    },
    totalCount: props.defaultData.totalCount,
    initialData: props.defaultData.logs,
  });

  const t = useTranslations();
  const { generateCallsign } = useGenerateCallsign();

  const deputyNames = userDeputies.reduce(
    (ac, cv) => ({
      ...ac,
      [cv.id]: `${generateCallsign(cv)} ${makeUnitName(cv)}`,
    }),
    {} as Record<string, string>,
  );

  return (
    <>
      <header className="flex items-center justify-between">
        <Title className="!mb-0">{t("Ems.myDeputyLogs")}</Title>

        <div className="flex">
          <div className="ml-3 w-52">
            <FormField label="Group By Deputy">
              <Select
                isLoading={isLoading}
                isClearable
                onChange={(e) => {
                  asyncTable.setFilters((prev) => ({
                    ...prev,
                    deputyId: e.target.value,
                  }));
                }}
                value={asyncTable.filters?.deputyId ?? null}
                values={Object.entries(deputyNames).map(([id, name]) => ({
                  label: name as string,
                  value: id,
                }))}
              />
            </FormField>
          </div>
        </div>
      </header>

      {props.defaultData.totalCount <= 0 ? (
        <p className="mt-5">{t("Ems.noDeputies")}</p>
      ) : (
        <OfficerLogsTable unit={null} asyncTable={asyncTable} />
      )}
    </>
  );
}
