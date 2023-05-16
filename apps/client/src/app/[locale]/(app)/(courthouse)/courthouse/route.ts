import { redirect } from "next/navigation";

interface PageProps {
  params: { locale: string };
}

export function GET(_request: Request, options: PageProps) {
  redirect(`/${options.params.locale}/courthouse/expungement-requests`);
}
