import * as React from "react";
import { useMenuItem } from "@react-aria/menu";
import { Node } from "@react-types/shared";
import { TreeState } from "@react-stately/tree";
import { classNames } from "../../utils/classNames";
import { buttonSizes, buttonVariants } from "../button";

interface DropdownMenuItemProps<T extends object> {
  state: TreeState<T>;
  item: Node<T>;
}

export function DropdownMenuItem<T extends object>(props: DropdownMenuItemProps<T>) {
  const ref = React.useRef<HTMLLIElement>(null);
  const { menuItemProps } = useMenuItem({ key: props.item.key }, props.state, ref);

  return (
    <li
      {...menuItemProps}
      className={classNames(
        "outline-none block rounded-md transition-colors w-full text-left bg-transparent",
        "dark:hover:bg-secondary hover:bg-gray-400 focus:bg-gray-400 dark:focus:bg-secondary",
        buttonSizes.md,
        buttonVariants.transparent,
      )}
      ref={ref}
    >
      {props.item.rendered}
    </li>
  );
}
