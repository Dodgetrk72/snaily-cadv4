"use client";

import { DeleteBleeterByIdData, GetBleeterByIdData } from "@snailycad/types/api";
import { BreadcrumbItem, Breadcrumbs, Button } from "@snailycad/ui";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { Editor, dataToSlate } from "~/components/editor/editor";
import { Title } from "~/components/shared/Title";
import { ImageWrapper } from "~/components/shared/image-wrapper";
import { useAuth } from "~/context/auth-context";
import { useImageUrl } from "~/hooks/useImageUrl";
import useFetch from "~/lib/useFetch";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";

interface InnerBleeterPageProps {
  post: GetBleeterByIdData;
}

const ManageBleetModal = dynamic(
  async () => (await import("~/components/bleeter/manage-bleet-modal")).ManageBleetModal,
  { ssr: false },
);

const AlertModal = dynamic(async () => (await import("~/components/modal/AlertModal")).AlertModal, {
  ssr: false,
});

export function InnerBleetPage(props: InnerBleeterPageProps) {
  const { state, execute } = useFetch();
  const { user } = useAuth();
  const { openModal } = useModal();
  const common = useTranslations("Common");
  const t = useTranslations("Bleeter");
  const router = useRouter();
  const { makeImageUrl } = useImageUrl();

  async function handleDelete() {
    const { json } = await execute<DeleteBleeterByIdData>({
      path: `/bleeter/${props.post.id}`,
      method: "DELETE",
    });

    if (json) {
      router.push("/bleeter");
    }
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/bleeter">{t("bleeter")}</BreadcrumbItem>
        <BreadcrumbItem href={`/bleeter/${props.post.id}`}>{props.post.title}</BreadcrumbItem>
      </Breadcrumbs>

      <header className="flex items-center justify-between pb-2 border-b-2">
        <Title className="!mb-0">{props.post.title}</Title>

        <div>
          {user?.id === props.post.userId ? (
            <>
              <Button onPress={() => openModal(ModalIds.ManageBleetModal)} variant="success">
                {common("edit")}
              </Button>
              <Button
                onPress={() => openModal(ModalIds.AlertDeleteBleet)}
                className="ml-2"
                variant="danger"
              >
                {common("delete")}
              </Button>
            </>
          ) : null}
        </div>
      </header>

      <main className="mt-2 bleet-reset">
        {props.post.imageId ? (
          <ImageWrapper
            quality={100}
            width={1600}
            height={320}
            alt={props.post.title}
            placeholder={props.post.imageBlurData ? "blur" : "empty"}
            blurDataURL={props.post.imageBlurData ?? undefined}
            draggable={false}
            className="max-h-[20rem] mb-5 w-full object-cover"
            src={makeImageUrl("bleeter", props.post.imageId)!}
            loading="lazy"
          />
        ) : null}
        <Editor hideBorder isReadonly value={dataToSlate(props.post)} />
      </main>

      <ManageBleetModal post={props.post} />
      <AlertModal
        description={t.rich("alert_deleteBleet", {
          title: props.post.title,
          span: (chi) => <span className="font-semibold">{chi}</span>,
        })}
        id={ModalIds.AlertDeleteBleet}
        onDeleteClick={handleDelete}
        title={t("deleteBleet")}
        state={state}
      />
    </>
  );
}
