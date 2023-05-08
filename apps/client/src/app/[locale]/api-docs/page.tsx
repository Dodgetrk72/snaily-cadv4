import { getAPIUrl } from "@snailycad/utils/api-url";
import { redirect } from "next/navigation";

export default function ApiDocsPage() {
  const apiURL = getAPIUrl();
  const destination = apiURL.replace("/v1", "/api-docs");

  redirect(destination);
}
