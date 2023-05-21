"use client";

import * as React from "react";
import { BusinessPost } from "@snailycad/types";
import { DeleteBusinessPostsData, GetBusinessByIdData } from "@snailycad/types/api";
import dynamic from "next/dynamic";
import { useTranslations } from "use-intl";
import useFetch from "~/lib/useFetch";
import { useBusinessState } from "~/state/business-state";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";
import { shallow } from "zustand/shallow";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { WhitelistStatus } from ".prisma/client";
import { Link } from "~/components/shared/link";
import { BreadcrumbItem, Breadcrumbs, Button, buttonSizes, buttonVariants } from "@snailycad/ui";
import { Title } from "~/components/shared/Title";
import { classNames } from "~/lib/classNames";
import { Editor, dataToSlate } from "~/components/editor/editor";
import { Star } from "react-bootstrap-icons";

interface InnerBusinessByIdPageProps {
  business: GetBusinessByIdData;
}

const AlertModal = dynamic(async () => (await import("components/modal/AlertModal")).AlertModal);
const ManageBusinessPostModal = dynamic(
  async () => (await import("components/business/ManagePostModal")).ManageBusinessPostModal,
);

export function InnerBusinessByIdPage(props: InnerBusinessByIdPageProps) {
  const { state: fetchState, execute } = useFetch();
  const { openModal, closeModal } = useModal();

  const businessActions = useBusinessState((state) => ({
    setCurrentBusiness: state.setCurrentBusiness,
    setCurrentEmployee: state.setCurrentEmployee,
    setPosts: state.setPosts,
  }));

  const { currentBusiness, currentEmployee, posts } = useBusinessState(
    (state) => ({
      currentBusiness: state.currentBusiness,
      currentEmployee: state.currentEmployee,
      posts: state.posts,
    }),
    shallow,
  );

  const common = useTranslations("Common");
  const t = useTranslations("Business");
  const [tempPost, postState] = useTemporaryItem(posts);

  async function handlePostDeletion() {
    if (!tempPost) return;

    const { json } = await execute<DeleteBusinessPostsData>({
      path: `/businesses/posts/${currentBusiness?.id}/${tempPost.id}`,
      method: "DELETE",
      data: { employeeId: currentEmployee?.id },
    });

    if (json) {
      businessActions.setPosts(posts.filter((p) => p.id !== tempPost.id));
      postState.setTempId(null);
      closeModal(ModalIds.AlertDeleteBusinessPost);
    }
  }

  function handleEdit(post: BusinessPost) {
    openModal(ModalIds.ManageBusinessPost);
    postState.setTempId(post.id);
  }

  function handleDelete(post: BusinessPost) {
    openModal(ModalIds.AlertDeleteBusinessPost);
    postState.setTempId(post.id);
  }

  React.useEffect(() => {
    businessActions.setCurrentBusiness(props.business);
    businessActions.setCurrentEmployee(props.business.employee);
    businessActions.setPosts(props.business.businessPosts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const isCurrentEmployeeOwner = currentBusiness?.employees?.some(
    (v) => v.role?.as === "OWNER" && v.citizenId === currentEmployee?.citizenId,
  );
  const hasManagePermissions =
    isCurrentEmployeeOwner ||
    currentEmployee?.canManageEmployees ||
    currentEmployee?.canManageVehicles;

  if (!currentBusiness || !currentEmployee) {
    return null;
  }

  if (currentEmployee.whitelistStatus === WhitelistStatus.PENDING) {
    return <p>{t("businessIsWhitelisted")}</p>;
  }

  if (props.business.status === WhitelistStatus.PENDING) {
    return (
      <p>
        {t("businessWhitelistedCAD")}{" "}
        <Link href="/business" className="underline">
          Return
        </Link>
      </p>
    );
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/business">{t("business")}</BreadcrumbItem>
        <BreadcrumbItem>{currentBusiness.name}</BreadcrumbItem>
      </Breadcrumbs>

      <header className="flex items-center justify-between">
        <Title className="!mb-0">{currentBusiness.name}</Title>

        <div>
          {currentEmployee.canCreatePosts ? (
            <Button onPress={() => openModal(ModalIds.ManageBusinessPost)} className="mr-2">
              {t("createPost")}
            </Button>
          ) : null}
          {hasManagePermissions ? (
            <Link
              href={`/business/${currentBusiness.id}/${currentEmployee.id}/manage`}
              className={classNames(buttonVariants.default, buttonSizes.md, "rounded-md")}
            >
              {common("manage")}
            </Link>
          ) : null}
        </div>
      </header>

      <main className="flex flex-col mt-5 sm:flex-row">
        <section className="w-full mr-5">
          <ul className="space-y-3">
            {posts.map((post) => {
              const publishedBy = currentBusiness.employees.find((em) => em.id === post.employeeId);

              return (
                <li className="rounded-md card" key={post.id}>
                  <header className="flex items-center justify-between p-4">
                    <h3 className="text-2xl font-semibold">{post.title}</h3>

                    {post.employeeId === currentEmployee.id ? (
                      <div>
                        <Button onPress={() => handleEdit(post)} size="xs" variant="success">
                          {common("edit")}
                        </Button>
                        <Button
                          onPress={() => handleDelete(post)}
                          className="ml-2"
                          size="xs"
                          variant="danger"
                        >
                          {common("delete")}
                        </Button>
                      </div>
                    ) : null}
                  </header>

                  <main className="p-4 pt-0">
                    <Editor isReadonly value={dataToSlate(post)} />
                  </main>

                  {publishedBy ? (
                    <footer className="px-4 py-2 bg-gray-200/30 dark:border-t dark:border-secondary dark:bg-tertiary">
                      <span className="font-semibold">{t("publishedBy")}: </span>
                      <span>
                        {publishedBy?.citizen.name} {publishedBy?.citizen.surname}
                      </span>
                    </footer>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="w-[20rem]">
          <h3 className="text-xl font-semibold">{t("employees")}</h3>

          <ul className="flex flex-col space-y-2">
            {currentBusiness.employees
              .filter((v) => v.whitelistStatus !== WhitelistStatus.PENDING)
              .sort((a, b) => Number(b.employeeOfTheMonth) - Number(a.employeeOfTheMonth))
              .map((employee) => (
                <li className="flex items-center" key={employee.id}>
                  {employee.employeeOfTheMonth ? (
                    <span title={t("employeeOfTheMonth")} className="mr-2">
                      <Star className="text-yellow-500" />
                    </span>
                  ) : null}

                  <span className="capitalize">
                    {employee.citizen.name} {employee.citizen.surname}
                  </span>
                </li>
              ))}
          </ul>
        </aside>
      </main>

      {currentEmployee.canCreatePosts ? (
        <ManageBusinessPostModal
          post={tempPost}
          onUpdate={(oldPost, newPost) => {
            businessActions.setPosts(posts.map((p) => (p.id === oldPost.id ? newPost : p)));
          }}
          onCreate={(post) => businessActions.setPosts([post, ...posts])}
          onClose={() => setTimeout(() => postState.setTempId(null), 100)}
        />
      ) : null}

      <AlertModal
        title={t("deletePost")}
        description={t("alert_deletePost")}
        id={ModalIds.AlertDeleteBusinessPost}
        onDeleteClick={handlePostDeletion}
        state={fetchState}
        onClose={() => postState.setTempId(null)}
      />
    </>
  );
}