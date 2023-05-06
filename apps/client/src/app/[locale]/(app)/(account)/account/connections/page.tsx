import { ConnectionsTab } from "components/account/tabs/connections-tab";

interface ConnectionsTabPage {
  searchParams: { success?: "true" | "false"; error?: string };
}

export default function ConnectionsTabPage(props: ConnectionsTabPage) {
  return <ConnectionsTab {...props} />;
}
