import { getAPIUrl } from "@snailycad/utils/api-url";
import { redirect } from "next/navigation";

/**
 * this file redirects the user to the Swagger UI API docs. This includes
 * the API documentation for SnailyCAD's Public API
 */

export function GET() {
  const apiURL = getAPIUrl();
  const destination = apiURL.replace("/v1", "/api-docs");

  redirect(destination);
}
