import * as React from "react";
import { AriaMenuProps, useMenu } from "@react-aria/menu";
import { useTreeState } from "@react-stately/tree";
import { DropdownMenuItem } from "./menu-item";
import { classNames } from "../../utils/classNames";

interface DropdownMenuProps<T extends object> extends AriaMenuProps<T> {
  onClose(): void;
}

export function DropdownMenu<T extends object>(props: DropdownMenuProps<T>) {
  const state = useTreeState(props);

  const ref = React.useRef<HTMLUListElement>(null);
  const { menuProps } = useMenu(props, state, ref);

  return (
    <ul
      {...menuProps}
      ref={ref}
      className={classNames(
        "flex flex-col z-50 p-2 bg-gray-100 rounded-md shadow-md dark:shadow-primary dropdown-fade w-40 dark:bg-primary border border-secondary",
      )}
    >
      {[...state.collection].map((item) => (
        <DropdownMenuItem key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

export { DropdownMenuItem } from "./menu-item";
