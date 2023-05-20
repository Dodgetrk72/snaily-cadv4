import { redirect } from "next/navigation";

export async function GET() {
  return redirect("/admin/manage/courthouse/expungement-requests");
}
