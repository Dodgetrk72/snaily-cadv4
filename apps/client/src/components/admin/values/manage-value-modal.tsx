import * as React from "react";
import {
  DEPARTMENT_SCHEMA,
  DIVISION_SCHEMA,
  HASH_SCHEMA,
  CODES_10_SCHEMA,
  BUSINESS_ROLE_SCHEMA,
  BASE_VALUE_SCHEMA,
  CALL_TYPE_SCHEMA,
} from "@snailycad/schemas";
import { FormField } from "~/components/form/FormField";
import { Loader, Button, SelectField, TextField, SwitchField } from "@snailycad/ui";
import { Modal } from "~/components/modal/Modal";
import { Form, Formik, FormikHelpers } from "formik";
import { handleValidate } from "~/lib/handleValidate";
import useFetch from "~/lib/useFetch";
import { useModal } from "state/modalState";
import { useValues } from "~/context/values-context";
import {
  AnyValue,
  DriversLicenseCategoryType,
  EmployeeAsEnum,
  Feature,
  QualificationValueType,
  ValueType,
} from "@snailycad/types";
import { useTranslations } from "use-intl";
import { Select } from "~/components/form/Select";
import hexColor from "hex-color-regex";
import { ModalIds } from "~/types/ModalIds";
import { LicenseFields } from "./manage-modal/license-fields";
import {
  isEmployeeValue,
  isBaseValue,
  isDepartmentValue,
  isDivisionValue,
  isStatusValue,
  isVehicleValue,
  isWeaponValue,
  isUnitQualification,
  isDLCategoryValue,
  isCallTypeValue,
  isOfficerRankValue,
  isAddressValue,
  isEmergencyVehicleValue,
} from "@snailycad/utils/typeguards";
import { ImageSelectInput, validateFile } from "~/components/form/inputs/ImageSelectInput";
import type { PatchValueByIdData, PostValuesData } from "@snailycad/types/api";
import {
  getDisabledFromValue,
  getValueStrFromValue,
  makeDefaultWhatPages,
} from "~/lib/admin/values/utils";
import { useFeatureEnabled } from "hooks/use-feature-enabled";

import { DivisionFields } from "./manage-modal/division-fields";
import {
  EmergencyVehicleFields,
  useDefaultDivisions,
} from "./manage-modal/emergency-vehicle-fields";
import { AddressFields } from "./manage-modal/address-fields";
import { QualificationFields } from "./manage-modal/qualification-fields";
import { DepartmentFields } from "./manage-modal/department-fields";
import { StatusValueFields, useDefaultDepartments } from "./manage-modal/status-value-fields";

interface Props {
  type: ValueType;
  value: AnyValue | null;
  onCreate(newValue: AnyValue): void;
  onUpdate(oldValue: AnyValue, newValue: AnyValue): void;
}

const BUSINESS_VALUES = [
  {
    value: EmployeeAsEnum.OWNER,
    label: "Owner",
  },
  {
    value: EmployeeAsEnum.MANAGER,
    label: "Manager",
  },
  {
    value: EmployeeAsEnum.EMPLOYEE,
    label: "Employee",
  },
];

const driversLicenseCategoryTypeValues = Object.values(DriversLicenseCategoryType).map((v) => ({
  label: v.toLowerCase(),
  value: v,
}));

const EXTRA_SCHEMAS: Partial<Record<ValueType, Zod.ZodObject<Zod.ZodRawShape>>> = {
  CODES_10: CODES_10_SCHEMA,
  DEPARTMENT: DEPARTMENT_SCHEMA,
  DIVISION: DIVISION_SCHEMA,
  VEHICLE: HASH_SCHEMA,
  WEAPON: HASH_SCHEMA,
  BUSINESS_ROLE: BUSINESS_ROLE_SCHEMA,
  CALL_TYPE: CALL_TYPE_SCHEMA,
};

interface GetManageValueInitialValuesOptions {
  value: AnyValue | null;
  features: Partial<Record<Feature, boolean>>;
  defaultDivisions: ReturnType<typeof useDefaultDivisions>;
  defaultDepartments: ReturnType<typeof useDefaultDepartments>;
  type: ValueType;
}

function getInitialTypeValue(value: AnyValue | null, pathType: ValueType) {
  if (pathType === ValueType.DRIVERSLICENSE_CATEGORY) {
    if (!value) {
      return null;
    }

    return isDLCategoryValue(value) && value.type;
  }

  if (value && (isStatusValue(value) || isDepartmentValue(value))) {
    return value.type;
  }

  return "STATUS_CODE";
}

export type ManageValueValues = ReturnType<typeof getManageValueInitialValues>;
export function getManageValueInitialValues(options: GetManageValueInitialValuesOptions) {
  const { value, type, defaultDepartments, defaultDivisions, features } = options;

  return {
    isDisabled: value ? getDisabledFromValue(value) : false,
    value: value ? getValueStrFromValue(value) : "",

    description:
      value && (isUnitQualification(value) || isDLCategoryValue(value))
        ? value.description ?? ""
        : "",
    qualificationType:
      value && isUnitQualification(value)
        ? value.qualificationType
        : QualificationValueType.QUALIFICATION,

    shouldDo: value && isStatusValue(value) ? value.shouldDo : "",
    color: value && isStatusValue(value) ? value.color ?? "" : "",
    type: getInitialTypeValue(value, type),
    departments:
      value &&
      (isStatusValue(value) || isUnitQualification(value) || isEmergencyVehicleValue(value))
        ? defaultDepartments(value)
        : [],
    whatPages: value && isStatusValue(value) ? makeDefaultWhatPages(value) : [],

    pairedUnitTemplate: value && isDivisionValue(value) ? value.pairedUnitTemplate ?? "" : "",
    departmentId: value && isDivisionValue(value) ? value.departmentId : "",
    isConfidential: value && isDepartmentValue(value) ? value.isConfidential : false,
    whitelisted: value && isDepartmentValue(value) ? value.whitelisted : false,
    defaultOfficerRankId: value && isDepartmentValue(value) ? value.defaultOfficerRankId : null,
    isDefaultDepartment: value && isDepartmentValue(value) ? value.isDefaultDepartment : false,
    callsign:
      value && (isDepartmentValue(value) || isDivisionValue(value)) ? value.callsign ?? "" : "",

    as: value && isEmployeeValue(value) ? value.as : "",
    hash: value && (isVehicleValue(value) || isWeaponValue(value)) ? value.hash ?? "" : undefined,
    trimLevels:
      value && isVehicleValue(value)
        ? value.trimLevels?.map((value) => ({
            value: value.id,
            label: value.value,
          })) ?? []
        : [],

    licenseType: value && isBaseValue(value) ? value.licenseType : null,
    isDefault: value && isBaseValue(value) ? value.isDefault : undefined,
    priority: value && isCallTypeValue(value) ? value.priority ?? undefined : undefined,

    officerRankImageId: "",
    officerRankDepartments:
      value && isOfficerRankValue(value) ? defaultDepartments(value) : undefined,

    postal: value && isAddressValue(value) ? value.postal ?? "" : "",
    county: value && isAddressValue(value) ? value.county ?? "" : "",

    divisions:
      value && isEmergencyVehicleValue(value) && features.DIVISIONS ? defaultDivisions(value) : [],

    showPicker: false,
    image: "",

    extraFields:
      value && (isDivisionValue(value) || isDepartmentValue(value))
        ? JSON.stringify(value.extraFields)
        : "null",
  };
}

export function ManageValueModal({ onCreate, onUpdate, type, value }: Props) {
  const [image, setImage] = React.useState<File | string | null>(null);

  const { state, execute } = useFetch();
  const { isOpen, closeModal } = useModal();
  const t = useTranslations(type);
  const common = useTranslations("Common");
  const defaultDepartments = useDefaultDepartments();
  const defaultDivisions = useDefaultDivisions();

  const title = !value ? t("ADD") : t("EDIT");
  const footerTitle = !value ? t("ADD") : common("save");
  const { vehicleTrimLevel, department } = useValues();
  const features = useFeatureEnabled();

  async function onSubmit(
    values: typeof INITIAL_VALUES,
    helpers: FormikHelpers<typeof INITIAL_VALUES>,
  ) {
    const data = {
      ...values,
      type: values.type,
      whatPages: values.whatPages,
      departments: values.departments?.map((v) => v.value),
      divisions: values.divisions?.map((v) => v.value),
      officerRankDepartments: values.officerRankDepartments?.map((v) => v.value),
      trimLevels: values.trimLevels.map((v) => v.value),
      extraFields: JSON.parse(values.extraFields),
    };

    if (value) {
      const { json } = await execute<PatchValueByIdData, typeof INITIAL_VALUES>({
        path: `/admin/values/${type.toLowerCase()}/${value.id}`,
        method: "PATCH",
        data,
        helpers,
      });

      if (json?.id) {
        closeModal(ModalIds.ManageValue);
        await handleValueImageUpload(type.toLowerCase(), value.id, helpers);
        onUpdate(value, json);
      }
    } else {
      const { json } = await execute<PostValuesData, typeof INITIAL_VALUES>({
        path: `/admin/values/${type.toLowerCase()}`,
        method: "POST",
        data,
        helpers,
      });

      if (json?.id) {
        await handleValueImageUpload(type.toLowerCase(), json.id, helpers);
        closeModal(ModalIds.ManageValue);
        onCreate(json);
      }
    }
  }

  async function handleValueImageUpload(
    type: string,
    id: string,
    helpers: FormikHelpers<typeof INITIAL_VALUES>,
  ) {
    const fd = new FormData();
    const validatedImage = validateFile(image, helpers);

    if (validatedImage) {
      if (typeof validatedImage !== "string") {
        fd.set("image", validatedImage, validatedImage.name);
      }
    }

    if (validatedImage && typeof validatedImage === "object") {
      await execute({
        path: `/admin/values/${type}/image/${id}`,
        method: "POST",
        data: fd,
        helpers,
        headers: {
          "content-type": "multipart/form-data",
        },
      });
    }
  }

  const INITIAL_VALUES = getManageValueInitialValues({
    defaultDepartments,
    defaultDivisions,
    features,
    value,
    type,
  });

  function validate(values: typeof INITIAL_VALUES) {
    if (type === ValueType.LICENSE) {
      // temporary fix, it seems to not update the schema :thinking:
      return {};
    }

    const schemaToUse = EXTRA_SCHEMAS[type] ?? BASE_VALUE_SCHEMA;
    const errors = handleValidate(schemaToUse)(values);

    if (values.color && !hexColor().test(values.color)) {
      return {
        ...errors,
        color: "Must be a valid HEX color",
      };
    }

    return errors;
  }

  return (
    <Modal
      className="w-[600px]"
      title={title}
      onClose={() => closeModal(ModalIds.ManageValue)}
      isOpen={isOpen(ModalIds.ManageValue)}
    >
      <Formik validate={validate} onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
        {({ handleChange, setFieldValue, values, errors }) => (
          <Form>
            {type === ValueType.DIVISION ? null : (
              <TextField
                errorMessage={errors.value}
                label="Value"
                autoFocus
                name="value"
                onChange={(value) => setFieldValue("value", value)}
                value={values.value}
              />
            )}

            {type === ValueType.DRIVERSLICENSE_CATEGORY ? (
              <SelectField
                errorMessage={errors.type}
                label="Type"
                options={driversLicenseCategoryTypeValues}
                name="type"
                onSelectionChange={(key) => setFieldValue("type", key)}
                selectedKey={values.type as DriversLicenseCategoryType | null}
              />
            ) : null}

            {type === ValueType.EMERGENCY_VEHICLE ? <EmergencyVehicleFields /> : null}
            {type === ValueType.LICENSE ? <LicenseFields /> : null}

            {type === ValueType.DIVISION ? <DivisionFields /> : null}
            {type === ValueType.DEPARTMENT ? <DepartmentFields /> : null}
            {type === ValueType.QUALIFICATION ? (
              <QualificationFields image={image} setImage={setImage} />
            ) : null}

            {type === ValueType.ADDRESS ? <AddressFields /> : null}

            {type === ValueType.BUSINESS_ROLE ? (
              <SelectField
                errorMessage={errors.as}
                label="As (this is so the database knows what to use.)"
                options={BUSINESS_VALUES}
                name="as"
                onSelectionChange={(key) => setFieldValue("as", key)}
                selectedKey={values.as}
              />
            ) : null}

            {["VEHICLE", "WEAPON"].includes(type) ? (
              <TextField
                isOptional
                errorMessage={errors.hash}
                label="Game Hash"
                name="hash"
                onChange={(value) => setFieldValue("hash", value)}
                value={values.hash}
              />
            ) : null}

            {ValueType.VEHICLE === type ? (
              <FormField label="Trim Levels">
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  name="trimLevels"
                  onChange={handleChange}
                  value={values.trimLevels}
                  values={vehicleTrimLevel.values.map((trimLevel) => ({
                    value: trimLevel.id,
                    label: trimLevel.value,
                  }))}
                />
              </FormField>
            ) : null}

            {type === ValueType.CALL_TYPE ? (
              <TextField
                type="number"
                isOptional
                errorMessage={errors.priority}
                label="Priority"
                name="priority"
                onChange={(value) => setFieldValue("priority", value)}
                value={values.priority}
              />
            ) : null}

            {type === ValueType.OFFICER_RANK ? (
              <>
                <ImageSelectInput valueKey="officerRankImageId" image={image} setImage={setImage} />
                <FormField optional label="Departments">
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    name="officerRankDepartments"
                    onChange={handleChange}
                    value={values.officerRankDepartments ?? []}
                    values={department.values.map((department) => ({
                      value: department.id,
                      label: department.value.value,
                    }))}
                  />
                </FormField>
              </>
            ) : null}

            {type === ValueType.DRIVERSLICENSE_CATEGORY ? (
              <TextField
                isTextarea
                isOptional
                errorMessage={errors.description}
                label="Description"
                name="description"
                onChange={(value) => setFieldValue("description", value)}
                value={values.description}
              />
            ) : null}

            {type === "CODES_10" ? <StatusValueFields /> : null}

            <SwitchField
              isSelected={values.isDisabled}
              onChange={(isSelected) => setFieldValue("isDisabled", isSelected)}
              description="When a value is disabled, it will not be able to be selected in the dropdown."
            >
              Is Disabled
            </SwitchField>

            <footer className="flex justify-end mt-5">
              <Button
                type="reset"
                onPress={() => closeModal(ModalIds.ManageValue)}
                variant="cancel"
              >
                Cancel
              </Button>
              <Button className="flex items-center" disabled={state === "loading"} type="submit">
                {state === "loading" ? <Loader className="mr-2" /> : null}
                {footerTitle}
              </Button>
            </footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}