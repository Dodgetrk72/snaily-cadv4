import { FormField } from "components/form/FormField";
import { TextField } from "@snailycad/ui";
import { Select } from "components/form/Select";
import { useValues } from "~/context/values-context";
import { useFormikContext } from "formik";
import { ManageValueValues } from "../manage-value-modal";

export function DivisionFields() {
  const { values, errors, setFieldValue, handleChange } = useFormikContext<ManageValueValues>();
  const { department } = useValues();

  return (
    <>
      <FormField label="Department">
        <Select
          autoFocus
          values={department.values.map((v) => ({
            value: v.id,
            label: v.value.value,
          }))}
          name="departmentId"
          onChange={handleChange}
          value={values.departmentId}
        />
      </FormField>

      <TextField
        errorMessage={errors.value}
        label="Value"
        name="value"
        onChange={(value) => setFieldValue("value", value)}
        value={values.value}
      />

      <TextField
        isOptional
        errorMessage={errors.callsign}
        label="Callsign Symbol"
        name="callsign"
        onChange={(value) => setFieldValue("callsign", value)}
        value={values.callsign}
      />

      <TextField
        isOptional
        errorMessage={errors.pairedUnitTemplate}
        label="Paired Unit Template"
        name="pairedUnitTemplate"
        onChange={(value) => setFieldValue("pairedUnitTemplate", value)}
        value={values.pairedUnitTemplate}
      />

      <TextField
        description="Allows you to set a JSON value to be used for extra fields. This can be useful when using the Public API for doing custom things."
        isTextarea
        isOptional
        errorMessage={errors.extraFields}
        label="Extra Fields - JSON"
        name="extraFields"
        onChange={(value) => setFieldValue("extraFields", value)}
        value={values.extraFields}
        placeholder="JSON"
      />
    </>
  );
}
