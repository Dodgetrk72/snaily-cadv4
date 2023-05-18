"use client";

import * as React from "react";
import {
  GetCustomRolesData,
  GetManageUserByIdData,
  PostManageUserAcceptDeclineData,
  PutManageUserByIdData,
} from "@snailycad/types/api";
import useFetch from "~/lib/useFetch";
import { useTranslations } from "use-intl";
import { Permissions, usePermission } from "~/hooks/usePermission";
import { useFeatureEnabled } from "~/hooks/use-feature-enabled";
import { useAuth } from "~/context/auth-context";
import { Rank, WhitelistStatus } from "@snailycad/types";
import { handleValidate } from "~/lib/handleValidate";
import { UPDATE_USER_SCHEMA } from "@snailycad/schemas";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Loader,
  TextField,
  buttonVariants,
} from "@snailycad/ui";
import { Title } from "~/components/shared/Title";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { Form, Formik } from "formik";
import { SettingsFormField } from "~/components/form/SettingsFormField";
import { ModalIds } from "~/types/ModalIds";
import { FormRow } from "~/components/form/FormRow";
import { useModal } from "~/state/modalState";
import { Link } from "~/components/shared/link";
import { classNames } from "~/lib/classNames";
import { ApiTokenArea } from "~/components/admin/manage/users/api-token-area";
import dynamic from "next/dynamic";

interface InnerManageUserByIdPageProps {
  user: GetManageUserByIdData;
  customRoles: GetCustomRolesData;
}

const DangerZone = dynamic(
  async () => (await import("components/admin/manage/users/danger-zone")).DangerZone,
);

const BanArea = dynamic(
  async () => (await import("components/admin/manage/users/ban-area")).BanArea,
);

const ManageRolesModal = dynamic(
  async () =>
    (await import("components/admin/manage/users/modals/manage-roles-modal")).ManageRolesModal,
  { ssr: false },
);

const ManagePermissionsModal = dynamic(
  async () =>
    (await import("components/admin/manage/users/modals/manage-permissions-modal"))
      .ManagePermissionsModal,
  { ssr: false },
);

export function InnerManageUserByIdPage(props: InnerManageUserByIdPageProps) {
  const [user, setUser] = React.useState(props.user);
  const { state, execute } = useFetch();
  const common = useTranslations("Common");
  const t = useTranslations("Management");
  const { openModal } = useModal();
  const { hasPermissions } = usePermission();
  const { USER_API_TOKENS } = useFeatureEnabled();
  const { cad } = useAuth();

  async function handleAcceptUser() {
    const { json } = await execute<PostManageUserAcceptDeclineData>({
      path: `/admin/manage/users/pending/${user.id}/accept`,
      method: "POST",
    });

    if (json) {
      setUser({ ...user, whitelistStatus: WhitelistStatus.ACCEPTED });
    }
  }

  async function onSubmit(values: typeof INITIAL_VALUES) {
    const { json } = await execute<PutManageUserByIdData>({
      path: `/admin/manage/users/${user.id}`,
      method: "PUT",
      data: values,
    });

    if (json.id) {
      setUser({ ...user, ...json });
    }
  }

  const INITIAL_VALUES = {
    username: user.username,
    steamId: user.steamId ?? "",
    discordId: user.discordId ?? "",
  };

  const isUserPendingApproval =
    cad?.whitelisted && user.whitelistStatus === WhitelistStatus.PENDING;
  const isUserDenied = cad?.whitelisted && user.whitelistStatus === WhitelistStatus.DECLINED;
  const validate = handleValidate(UPDATE_USER_SCHEMA);

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/manage/users">{t("MANAGE_USERS")}</BreadcrumbItem>
        <BreadcrumbItem>{t("editUser")}</BreadcrumbItem>
        <BreadcrumbItem>{user.username}</BreadcrumbItem>
      </Breadcrumbs>

      <Title renderLayoutTitle={false} className="mb-2">
        {t("editUser")}
      </Title>

      {isUserPendingApproval ? (
        <div
          role="alert"
          className="mb-5 flex flex-col p-2 px-4 text-black rounded-md shadow bg-orange-400 border border-orange-500/80"
        >
          <header className="flex items-center gap-2 mb-2">
            <ExclamationCircleFill />
            <h5 className="font-semibold text-lg">User is pending approval</h5>
          </header>
          <p>
            This user is still pending approval. It must first be approved by an administrator
            before any changes can be done.{" "}
            <Link className="font-medium underline" href="/admin/manage/users">
              Go back
            </Link>
          </p>
        </div>
      ) : null}

      {isUserDenied ? (
        <div
          role="alert"
          className="mb-5 flex flex-col p-2 px-4 text-black rounded-md shadow bg-orange-400 border border-orange-500/80"
        >
          <header className="flex items-center gap-2 mb-2">
            <ExclamationCircleFill />
            <h5 className="font-semibold text-lg">User was denied access</h5>
          </header>
          <p>
            This user was denied access. This user may first be approved by an administrator before
            any changes can be done.
          </p>

          <Button onClick={handleAcceptUser} variant="amber" className="mt-3 max-w-fit">
            Accept this user
          </Button>
        </div>
      ) : null}

      <div className="mt-5">
        <Formik validate={validate} onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
          {({ setFieldValue, isValid, values, errors }) => (
            <Form className="p-4 rounded-md dark:border card">
              <TextField
                isDisabled={isUserPendingApproval || isUserDenied}
                label="Username"
                name="username"
                onChange={(value) => setFieldValue("username", value)}
                value={values.username}
                errorMessage={errors.username}
              />

              <SettingsFormField
                description="A detailed permissions system where you can assign many actions to a user."
                label={t("detailedPermissions")}
              >
                <Button
                  disabled={isUserPendingApproval || isUserDenied || user.rank === Rank.OWNER}
                  type="button"
                  onPress={() => openModal(ModalIds.ManagePermissions)}
                >
                  {t("managePermissions")}
                </Button>

                <Button
                  variant="cancel"
                  className="ml-2 text-base"
                  disabled={isUserPendingApproval || isUserDenied || user.rank === Rank.OWNER}
                  type="button"
                  onPress={() => openModal(ModalIds.ManageRoles)}
                >
                  {t("manageRoles")}
                </Button>
              </SettingsFormField>

              <FormRow>
                <TextField
                  isDisabled={isUserPendingApproval || isUserDenied}
                  isOptional
                  label="Steam ID"
                  name="steamId"
                  onChange={(value) => setFieldValue("steamId", value)}
                  value={values.steamId}
                  errorMessage={errors.steamId}
                />

                <TextField
                  isDisabled={isUserPendingApproval || isUserDenied}
                  isOptional
                  label="Discord ID"
                  name="discordId"
                  onChange={(value) => setFieldValue("discordId", value)}
                  value={values.discordId}
                  errorMessage={errors.discordId}
                />
              </FormRow>

              <div className="flex justify-end mt-3">
                <Link
                  href="/admin/manage/users"
                  className={classNames(buttonVariants.cancel, "p-1 px-4 rounded-md")}
                >
                  {common("goBack")}
                </Link>
                <Button
                  className="flex items-center"
                  disabled={!isValid || state === "loading"}
                  type="submit"
                >
                  {state === "loading" ? <Loader className="mr-2" /> : null}
                  {common("save")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        {USER_API_TOKENS && (!isUserPendingApproval || !isUserDenied) ? (
          <ApiTokenArea user={user} />
        ) : null}

        {user.rank !== Rank.OWNER && (!isUserPendingApproval || !isUserDenied) ? (
          <>
            {hasPermissions([Permissions.BanUsers]) ? (
              <BanArea setUser={setUser} user={user} />
            ) : null}
            {hasPermissions([Permissions.DeleteUsers]) ? (
              <DangerZone setUser={setUser} user={user} />
            ) : null}
          </>
        ) : null}
      </div>

      {user.rank !== Rank.OWNER && (!isUserPendingApproval || !isUserDenied) ? (
        <>
          <ManagePermissionsModal onUpdate={(user) => setUser(user)} user={user} />
          <ManageRolesModal
            onUpdate={(user) => setUser(user)}
            roles={props.customRoles}
            user={user}
          />
        </>
      ) : null}
    </>
  );
}
