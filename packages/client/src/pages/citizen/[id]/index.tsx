import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslations } from "use-intl";
import Head from "next/head";
import { PersonFill } from "react-bootstrap-icons";
import { Citizen } from "types/prisma";
import { GetServerSideProps } from "next";
import { getSessionUser } from "lib/auth";
import { handleRequest } from "lib/fetch";
import { Layout } from "components/Layout";
import { useModal } from "context/ModalContext";
import { Modal } from "components/modal/Modal";
import { Button } from "components/Button";
import useFetch from "lib/useFetch";
import { Loader } from "components/Loader";
import { getTranslations } from "lib/getTranslation";
import { VehiclesCard } from "components/citizen/VehiclesCard";
import { WeaponsCard } from "components/citizen/WeaponsCard";
import { LicensesCard } from "components/citizen/LicensesCard";
import { MedicalRecords } from "components/citizen/MedicalRecords";
import { makeImageUrl } from "lib/utils";
import { useCitizen } from "context/CitizenContext";

export default function CitizenId() {
  const { execute, state } = useFetch();
  const { isOpen, openModal, closeModal } = useModal();
  const t = useTranslations("Citizen");
  const common = useTranslations("Common");
  const router = useRouter();
  const { citizen } = useCitizen();

  async function handleDelete() {
    if (!citizen) return;
    const data = await execute(`/citizen/${citizen.id}`, {
      method: "DELETE",
    });

    if (data.json) {
      closeModal("deleteCitizen");
      router.push("/citizen");
    }
  }

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!citizen?.id) {
        router.push("/404");
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [router, citizen]);

  if (!citizen) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>
          {citizen.name} {citizen.surname} - SnailyCAD
        </title>
      </Head>

      <div className="card bg-gray-200/60 p-4 rounded-md flex items-start justify-between">
        <div className="flex flex-col sm:flex-row items-start">
          {citizen.imageId ? (
            <button onClick={() => openModal("citizenImage")} className="cursor-pointer">
              <img
                className="rounded-full w-[100px] h-[100px]"
                draggable={false}
                src={makeImageUrl("citizens", citizen.imageId)}
              />
            </button>
          ) : (
            <PersonFill className="text-gray-500/60 w-[100px] h-[100px]" />
          )}

          <div className="sm:ml-3 mt-2 sm:mt-0 flex flex-col">
            <p>
              <span className="font-semibold">{t("fullName")}: </span>
              {citizen.name} {citizen.surname}
            </p>
            <p>
              <span className="font-semibold">{t("gender")}: </span>
              {citizen.gender}
            </p>
            <p>
              <span className="font-semibold">{t("ethnicity")}: </span>
              {citizen.ethnicity}
            </p>
            <p>
              <span className="font-semibold">{t("hairColor")}: </span>
              {citizen.hairColor}
            </p>
            <p>
              <span className="font-semibold">{t("eyeColor")}: </span>
              {citizen.eyeColor}
            </p>
          </div>

          <div className="sm:ml-5 flex flex-col">
            <p>
              <span className="font-semibold">{t("weight")}: </span>
              {citizen.weight}
            </p>
            <p>
              <span className="font-semibold">{t("height")}: </span>
              {citizen.height}
            </p>
            <p>
              <span className="font-semibold">{t("address")}: </span>
              {citizen.address}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => router.push(`/citizen/${citizen.id}/edit`)} variant="success">
            <Link href={`/citizen/${citizen.id}/edit`}>
              <a>{t("editCitizen")}</a>
            </Link>
          </Button>
          <Button onClick={() => openModal("deleteCitizen")} variant="danger">
            {t("deleteCitizen")}
          </Button>
        </div>
      </div>

      <div className="mt-3 gap-2 gap-y-3 grid grid-cols-1 md:grid-cols-2">
        <LicensesCard />
        <MedicalRecords medicalRecords={[]} />
        <VehiclesCard vehicles={citizen.vehicles} />
        <WeaponsCard weapons={citizen.weapons} />
      </div>

      <Modal
        title={`${citizen.name} ${citizen.surname}`}
        onClose={() => closeModal("citizenImage")}
        isOpen={isOpen("citizenImage")}
      >
        <div className="mt-10 flex items-center justify-center">
          <img
            className="rounded-full w-[30em] h-[30em]"
            src={`http://localhost:8080/citizens/${citizen.imageId}`}
          />
        </div>
        {/* todo: add ability to edit image from here */}
      </Modal>

      <Modal
        title="Delete Citizen"
        onClose={() => closeModal("deleteCitizen")}
        isOpen={isOpen("deleteCitizen")}
      >
        <p className="my-3">
          {t.rich("alert_deleteCitizen", {
            citizen: `${citizen.name} ${citizen.surname}`,
            span: (children) => {
              return <span className="font-semibold">{children}</span>;
            },
          })}
        </p>
        <div className="mt-2 flex gap-2 items-center justify-end">
          <Button
            variant="cancel"
            disabled={state === "loading"}
            onClick={() => closeModal("deleteCitizen")}
          >
            {common("cancel")}
          </Button>
          <Button
            disabled={state === "loading"}
            variant="danger"
            className="flex items-center"
            onClick={handleDelete}
          >
            {state === "loading" ? <Loader className="border-red-200 mr-2" /> : null}{" "}
            {common("delete")}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale, query, req }) => {
  const { data } = await handleRequest<Citizen>(`/citizen/${query.id}`, {
    headers: req.headers,
  }).catch(() => ({ data: null }));

  const { data: values = [] } = await handleRequest(
    "/admin/values/weapon?paths=license,vehicle",
  ).catch(() => ({ data: null }));

  return {
    props: {
      session: await getSessionUser(req.headers),
      citizen: data,
      values,
      messages: {
        ...(await getTranslations(["citizen", "common"], locale)),
      },
    },
  };
};
