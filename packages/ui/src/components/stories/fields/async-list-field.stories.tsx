import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AsyncListSearchField, Item } from "../../fields/async-list-search-field";

const meta = {
  title: "Inputs/AsyncListSearchField",
  component: AsyncListSearchField,
  tags: ["autodocs"],
} satisfies Meta<typeof AsyncListSearchField>;

export default meta;
type Story = StoryObj<typeof AsyncListSearchField>;

function DefaultRenderer() {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [localSearchValue, setLocalSearchValue] = React.useState("");

  return (
    <AsyncListSearchField<{ name: string; id: string }>
      label="Name"
      isClearable
      localValue={localSearchValue}
      selectedKey={selectedItem}
      fetchOptions={{
        apiPath: "/search/name",
        method: "POST",
        bodyKey: "name",
        filterTextRequired: true,
      }}
      setValues={({ localValue, node }) => {
        console.log({ localValue, node });

        if (typeof localValue !== "undefined") {
          setLocalSearchValue(localValue);
        }

        setSelectedItem(node?.value?.id ?? null);
      }}
    >
      {(item) => (
        <Item textValue={item.name} key={item.id}>
          {item.name}
        </Item>
      )}
    </AsyncListSearchField>
  );
}

export const Default: Story = {
  render: () => <DefaultRenderer />,
};
