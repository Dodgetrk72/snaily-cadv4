import { GetBleeterByIdData } from "@snailycad/types/api";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerBleetPage } from "./component";
import { notFound } from "next/navigation";

interface BleetPageProps {
  params: { id: string };
}

export default async function BleetPage(props: BleetPageProps) {
  const { data } = await handleServerRequest<GetBleeterByIdData>({
    path: `/bleeter/${props.params.id}`,
  });

  if (!data) {
    return notFound();
  }

  return <InnerBleetPage post={data} />;
}
