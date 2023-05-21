"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { FormField } from "components/form/FormField";
import { useAuth } from "~/context/auth-context";
import { Form, Formik } from "formik";
import useFetch from "lib/useFetch";
import { useTranslations } from "use-intl";
import { StatusViewMode, TableActionsAlignment } from "@snailycad/types";
import { Select } from "components/form/Select";
import { Button, Loader, SelectField, TabsContent, SwitchField } from "@snailycad/ui";
import type { Sounds } from "lib/server/getAvailableSounds.server";
import { soundCamelCaseToKebabCase } from "lib/utils";
import { CaretDownFill } from "react-bootstrap-icons";
import { useRouter } from "next/navigation";
import type { PatchUserData } from "@snailycad/types/api";
import { useAudio } from "react-use";
import { i18n } from "i18n.config.mjs";

interface Props {
  availableSounds: Record<Sounds, boolean>;
}

export function AppearanceTab({ availableSounds }: Props) {
  const { user, setUser } = useAuth();
  const t = useTranslations("Account");
  const { execute, state } = useFetch();
  const common = useTranslations("Common");
  const availableLanguages = i18n.locales;
  const router = useRouter();
  const [currentSrc, setCurrentSrc] = React.useState("");

  const [audio, , controls] = useAudio({
    src: currentSrc,
    autoPlay: false,
  });

  const STATUS_VIEW_MODE_LABELS = {
    [StatusViewMode.DOT_COLOR]: t("dotColor"),
    [StatusViewMode.FULL_ROW_COLOR]: t("fullRowColor"),
  };

  const TABLE_ALIGNMENT_LABELS = {
    [TableActionsAlignment.NONE]: common("none"),
    [TableActionsAlignment.LEFT]: common("left"),
    [TableActionsAlignment.RIGHT]: common("right"),
  };

  const voices = getSynthesisVoices();
  if (!user) {
    return null;
  }

  const INITIAL_VALUES = {
    isDarkTheme: user.isDarkTheme ?? true,
    statusViewMode: user.statusViewMode ?? StatusViewMode.DOT_COLOR,
    tableActionsAlignment: user.tableActionsAlignment,
    locale: user?.locale ?? i18n.defaultLocale,
    developerMode: user?.developerMode ?? false,
    soundSettings: {
      panicButton: user.soundSettings?.panicButton ?? true,
      signal100: user.soundSettings?.signal100 ?? true,
      addedToCall: user.soundSettings?.addedToCall ?? false,
      stopRoleplay: user.soundSettings?.stopRoleplay ?? false,
      statusUpdate: user.soundSettings?.statusUpdate ?? false,
      incomingCall: user.soundSettings?.incomingCall ?? false,
      speech: user.soundSettings?.speech ?? true,
      speechVoice: user.soundSettings?.speechVoice ?? null,
    },
  };
  const sounds = Object.keys(INITIAL_VALUES.soundSettings);

  async function onSubmit(data: typeof INITIAL_VALUES) {
    const { json } = await execute<PatchUserData, typeof INITIAL_VALUES>({
      path: "/user",
      method: "PATCH",
      data: { username: user?.username, ...data },
    });

    if (data.locale !== user?.locale) {
      return router.refresh();
    }

    if (json.id) {
      setUser({ ...user, ...json });
    }
  }

  const availableSoundsArr = sounds.filter(
    (v) => v !== "speech" && availableSounds[soundCamelCaseToKebabCase(v)],
  );
  const unAvailableSoundsArr = sounds.filter(
    (v) => !["speech", "speechVoice"].includes(v) && !availableSounds[soundCamelCaseToKebabCase(v)],
  );

  return (
    <>
      {audio}
      <TabsContent aria-label={t("appearanceSettings")} value="appearanceSettings">
        <h1 className="text-2xl font-semibold">{t("appearanceSettings")}</h1>
        <Formik onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
          {({ handleChange, setFieldValue, values, errors }) => (
            <Form className="mt-3">
              <section className="mb-7">
                <SwitchField
                  isSelected={values.developerMode}
                  onChange={(isSelected) => setFieldValue("developerMode", isSelected)}
                >
                  {t("developerMode")}
                </SwitchField>

                <SwitchField
                  isSelected={values.isDarkTheme}
                  onChange={(isSelected) => setFieldValue("isDarkTheme", isSelected)}
                >
                  {t("darkTheme")}
                </SwitchField>

                <SelectField
                  errorMessage={errors.locale}
                  selectedKey={values.locale}
                  onSelectionChange={(value) => setFieldValue("locale", value)}
                  label={t("locale")}
                  options={availableLanguages.map((v) => ({ value: v, label: v }))}
                />

                <SelectField
                  errorMessage={errors.statusViewMode}
                  label={t("statusView")}
                  options={Object.values(StatusViewMode).map((v) => ({
                    value: v,
                    label: STATUS_VIEW_MODE_LABELS[v],
                  }))}
                  selectedKey={values.statusViewMode}
                  onSelectionChange={(value) => setFieldValue("statusViewMode", value)}
                  name="statusViewMode"
                />

                <SelectField
                  errorMessage={errors.tableActionsAlignment}
                  label={t("tableAlignment")}
                  options={Object.values(TableActionsAlignment).map((v) => ({
                    value: v,
                    label: TABLE_ALIGNMENT_LABELS[v],
                  }))}
                  selectedKey={values.tableActionsAlignment}
                  onSelectionChange={(value) => setFieldValue("tableActionsAlignment", value)}
                  name="tableActionsAlignment"
                />
              </section>

              <section className="mb-7">
                <h2 className="text-2xl font-semibold mb-3">{t("sounds")}</h2>

                {voices ? (
                  <section id="speech" className="mb-5">
                    <h3 className="text-xl font-semibold mb-3">{t("speech")}</h3>

                    <SwitchField
                      isSelected={values.soundSettings.speech}
                      onChange={(isSelected) => setFieldValue("soundSettings.speech", isSelected)}
                    >
                      {t("speech")}
                    </SwitchField>

                    <FormField label={t("speechVoice")}>
                      <Select
                        disabled={!values.soundSettings.speech}
                        values={voices.map((voice) => ({
                          label: voice.name,
                          value: voice.voiceURI,
                        }))}
                        value={values.soundSettings.speechVoice}
                        onChange={handleChange}
                        name="soundSettings.speechVoice"
                      />
                    </FormField>
                  </section>
                ) : null}

                <section className="mb-7">
                  <h3 className="text-xl font-semibold mb-3">{t("otherSounds")}</h3>

                  {availableSoundsArr.map((_name) => {
                    const fieldName = _name as keyof typeof INITIAL_VALUES.soundSettings;
                    const kebabCase = soundCamelCaseToKebabCase(fieldName);
                    const soundAvailable = !!availableSounds[kebabCase];

                    if (!soundAvailable) return null;
                    if (["speech", "speechVoice"].includes(fieldName)) return null;

                    return (
                      <div className="mb-1.5 flex flex-row gap-5" key={fieldName}>
                        <SwitchField
                          isSelected={values.soundSettings[fieldName] as boolean}
                          onChange={(isSelected) =>
                            setFieldValue(`soundSettings.${fieldName}`, isSelected)
                          }
                          isDisabled={!soundAvailable}
                        >
                          {t(fieldName)}
                        </SwitchField>

                        <Button
                          size="xs"
                          type="button"
                          onPress={() => {
                            setCurrentSrc(`/sounds/${kebabCase}.mp3`);
                            controls.volume(0.1);
                            controls.play();
                          }}
                        >
                          Test sound (Double Click)
                        </Button>
                      </div>
                    );
                  })}
                </section>

                <section>
                  {unAvailableSoundsArr.length <= 0 ? null : (
                    <Accordion.Root className="mt-4" type="multiple">
                      <Accordion.Item value="unavailable-sounds">
                        <Accordion.Trigger
                          title="Click to expand"
                          className="accordion-state gap-2 flex items-center justify-between pt-1 text-lg font-semibold text-left"
                        >
                          <h3 className="text-xl font-semibold mb-3">{t("unavailableSounds")}</h3>

                          <CaretDownFill
                            width={16}
                            height={16}
                            className="transform w-4 h-4 transition-transform accordion-state-transform"
                          />
                        </Accordion.Trigger>

                        <Accordion.Content className="mt-3">
                          {unAvailableSoundsArr.map((sound) => (
                            <p key={sound}>{t(sound)}</p>
                          ))}

                          <a
                            className="mt-2 ml-1 underline"
                            rel="noreferrer"
                            target="_blank"
                            href="https://docs.snailycad.org/docs/guides/how-set-custom-sounds"
                          >
                            {t("unavailableSoundsMessage")}
                          </a>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion.Root>
                  )}
                </section>
              </section>

              <Button
                className="flex items-center gap-2"
                type="submit"
                disabled={state === "loading"}
              >
                {state === "loading" ? <Loader /> : null}
                {common("save")}
              </Button>
            </Form>
          )}
        </Formik>
      </TabsContent>
    </>
  );
}

export function getSynthesisVoices() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  if (typeof window.speechSynthesis.getVoices !== "function") return;
  return window.speechSynthesis.getVoices();
}