import { AppearanceTab } from "components/account/appearance-tab";
import { getAvailableSounds } from "lib/server/getAvailableSounds.server";

export default async function AccountSettingsTabPage() {
  const availableSounds = await getAvailableSounds();

  return <AppearanceTab availableSounds={availableSounds} />;
}
