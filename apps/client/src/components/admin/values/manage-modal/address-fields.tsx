import { TextField } from "@snailycad/ui";
import { useFormikContext } from "formik";
import { ManageValueValues } from "../manage-value-modal";

export function AddressFields() {
  const { values, errors, setFieldValue } = useFormikContext<ManageValueValues>();

  return (
    <>
      <TextField
        label="Postal"
        isOptional
        name="postal"
        onChange={(value) => setFieldValue("postal", value)}
        value={values.postal}
        errorMessage={errors.postal as string}
      />

      <TextField
        label="County"
        isOptional
        name="county"
        onChange={(value) => setFieldValue("county", value)}
        value={values.county}
        errorMessage={errors.county as string}
      />
    </>
  );
}
