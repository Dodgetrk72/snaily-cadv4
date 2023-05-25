import * as React from "react";
import { MenuTriggerProps, useMenuTriggerState } from "@react-stately/menu";
import { AriaMenuProps, useMenuTrigger } from "@react-aria/menu";
import { Popover } from "./popover";
import { DropdownMenu } from "./dropdown";

interface DropdownMenuButtonProps<T extends object> extends AriaMenuProps<T>, MenuTriggerProps {
  triggerElement: React.ReactElement;
}

export function DropdownMenuButton<T extends object>(props: DropdownMenuButtonProps<T>) {
  const state = useMenuTriggerState(props);
  const ref = React.useRef<HTMLButtonElement>(null);
  const { menuProps, menuTriggerProps } = useMenuTrigger<T>({}, state, ref);

  const triggerElement = React.cloneElement(props.triggerElement, {
    ref,
    ...menuTriggerProps,
  });

  return (
    <div className="relative">
      {triggerElement}

      {state.isOpen ? (
        <Popover state={state} triggerRef={ref} placement="bottom start">
          <DropdownMenu
            {...menuProps}
            {...props}
            autoFocus={state.focusStrategy}
            onClose={() => state.close()}
          />
        </Popover>
      ) : null}
    </div>
  );
}
