"use client";

import { DeleteBusinessByIdData, GetManageBusinessesData } from "@snailycad/types/api";
import { Button, Loader, TabsContent, buttonSizes, buttonVariants } from "@snailycad/ui";
import { useTranslations } from "use-intl";
import { Modal } from "~/components/modal/Modal";
import { Status } from "~/components/shared/Status";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { Link } from "~/components/shared/link";
import { useAuth } from "~/context/auth-context";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { Permissions, usePermission } from "~/hooks/usePermission";
import { classNames } from "~/lib/classNames";
import useFetch from "~/lib/useFetch";
import { yesOrNoText } from "~/lib/utils";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";

interface InnerManageBusinessesPageProps {
  defaultData: GetManageBusinessesData;
}

export function InnerManageBusinessesPage(props: InnerManageBusinessesPageProps) {
  const { cad } = useAuth();

  const { state, execute } = useFetch();
  const { isOpen, openModal, closeModal } = useModal();
  const { hasPermissions } = usePermission();
  const tableState = useTableState();

  const t = useTranslations("Management");
  const common = useTranslations("Common");
  const businessWhitelisted = cad?.businessWhitelisted ?? false;

  const asyncTable = useAsyncTable<GetManageBusinessesData["businesses"][number]>({
    totalCount: props.defaultData.totalCount,
    initialData: props.defaultData.businesses,
    fetchOptions: {
      path: "/admin/manage/businesses",
      onResponse: (json: GetManageBusinessesData) => ({
        data: json.businesses,
        totalCount: json.totalCount,
      }),
    },
  });
  const [tempValue, valueState] = useTemporaryItem(asyncTable.items);

  function handleDeleteClick(value: GetManageBusinessesData["businesses"][number]) {
    valueState.setTempId(value.id);
    openModal(ModalIds.AlertDeleteBusiness);
  }

  async function handleDelete() {
    if (!tempValue) return;

    const { json } = await execute<DeleteBusinessByIdData>({
      path: `/admin/manage/businesses/${tempValue.id}`,
      method: "DELETE",
    });

    if (json) {
      asyncTable.remove(tempValue.id);

      valueState.setTempId(null);
      closeModal(ModalIds.AlertDeleteBusiness);
    }
  }

  return (
    <TabsContent tabName={t("allBusinesses")} aria-label={t("allBusinesses")} value="allBusinesses">
      <h2 className="text-2xl font-semibold mb-2">{t("allBusinesses")}</h2>

      {asyncTable.noItemsAvailable ? (
        <p className="mt-5">{t("noBusinesses")}</p>
      ) : (
        <Table
          tableState={tableState}
          data={asyncTable.items.map((business) => {
            const owners = business.employees;

            return {
              id: business.id,
              name: business.name,
              owners: owners
                .map((owner) => `${owner.citizen.name} ${owner.citizen.surname}`)
                .join(", "),
              user: business.user.username,
              status: <Status fallback="—">{business.status}</Status>,
              whitelisted: common(yesOrNoText(business.whitelisted)),
              actions: (
                <>
                  <Button
                    className="ml-2"
                    onPress={() => handleDeleteClick(business)}
                    size="xs"
                    variant="danger"
                  >
                    {common("delete")}
                  </Button>

                  <Link
                    className={classNames(
                      buttonVariants.default,
                      buttonSizes.xs,
                      "border rounded-md ml-2",
                    )}
                    href={`/admin/manage/businesses/${business.id}`}
                  >
                    {common("manage")}
                  </Link>
                </>
              ),
            };
          })}
          columns={[
            { header: common("name"), accessorKey: "name" },
            { header: t("owners"), accessorKey: "owners" },
            { header: t("user"), accessorKey: "user" },
            businessWhitelisted ? { header: t("status"), accessorKey: "status" } : null,
            { header: t("whitelisted"), accessorKey: "whitelisted" },
            hasPermissions([Permissions.DeleteBusinesses])
              ? { header: common("actions"), accessorKey: "actions" }
              : null,
          ]}
        />
      )}

      <Modal
        title={t("deleteBusiness")}
        onClose={() => closeModal(ModalIds.AlertDeleteBusiness)}
        isOpen={isOpen(ModalIds.AlertDeleteBusiness)}
        className="max-w-2xl"
      >
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="cancel"
            disabled={state === "loading"}
            onPress={() => closeModal(ModalIds.AlertDeleteBusiness)}
          >
            {common("cancel")}
          </Button>
          <Button
            disabled={state === "loading"}
            className="flex items-center"
            variant="danger"
            onPress={handleDelete}
          >
            {state === "loading" ? <Loader className="mr-2 border-red-200" /> : null}{" "}
            {common("delete")}
          </Button>
        </div>
      </Modal>
    </TabsContent>
  );
}
