import { Permissions, defaultPermissions } from "@snailycad/permissions";
import { GetExpungementRequestsData, GetNameChangeRequestsData } from "@snailycad/types/api";
import { TabList } from "@snailycad/ui";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import { useTranslations } from "use-intl";
import { CourtEntriesTab } from "~/components/courthouse/court-entries/court-entries-tab";
import { CourthousePostsTab } from "~/components/courthouse/courthouse-posts/CourthousePostsTab";
import { ExpungementRequestsTab } from "~/components/courthouse/expungement-requests/ExpungementRequestsTab";
import { NameChangeRequestTab } from "~/components/courthouse/name-change/NameChangeRequestTab";
import { Title } from "~/components/shared/Title";
import { Link } from "~/components/shared/link";
import { useFeatureEnabled } from "~/hooks/useFeatureEnabled";
import { usePermission } from "~/hooks/usePermission";

interface InnerCitizenCourthousePageProps {
  expungementRequests: GetExpungementRequestsData;
  nameChangeRequests: GetNameChangeRequestsData;
}

export function InnerCitizenCourthousePage(props: InnerCitizenCourthousePageProps) {
  const t = useTranslations("Courthouse");
  const { COURTHOUSE_POSTS } = useFeatureEnabled();

  const { hasPermissions } = usePermission();
  const hasEntriesPerms = hasPermissions([Permissions.Leo]);
  const hasCourthouseAdminPerms = hasPermissions(defaultPermissions.defaultCourthousePermissions);

  const TABS = [
    { enabled: true, name: t("expungementRequests"), value: "expungementRequestsTab" },
    { enabled: true, name: t("nameChangeRequests"), value: "nameChangeRequestsTab" },
    {
      enabled: true,
      name: t("courtEntries"),
      value: "courtEntriesTab",
    },
    {
      enabled: COURTHOUSE_POSTS,
      name: t("courthousePosts"),
      value: "courthousePosts",
    },
  ];

  return (
    <>
      <header className="flex items-center justify-between">
        <Title className="mb-3">{t("courthouse")}</Title>

        {hasCourthouseAdminPerms ? (
          <Link className="underline flex items-center gap-2" href="/admin/manage/courthouse">
            {t("courthouseManagement")}
            <BoxArrowUpRight />
          </Link>
        ) : null}
      </header>

      <TabList tabs={TABS}>
        <ExpungementRequestsTab requests={props.expungementRequests} />
        <NameChangeRequestTab requests={props.nameChangeRequests} />
        {hasEntriesPerms ? <CourtEntriesTab /> : null}
        {COURTHOUSE_POSTS ? <CourthousePostsTab /> : null}
      </TabList>
    </>
  );
}
