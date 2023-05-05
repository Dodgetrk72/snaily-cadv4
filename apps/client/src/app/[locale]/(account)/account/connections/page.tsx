import { ConnectionsTab } from "components/account/connections-tab";

interface ConnectionsTabPage {
  searchParams: { success?: "true" | "false"; error?: string };
}

export default function ConnectionsTabPage(props: ConnectionsTabPage) {
  return <ConnectionsTab {...props} />;
}
