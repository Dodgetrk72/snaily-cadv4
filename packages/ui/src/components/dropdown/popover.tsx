import * as React from "react";
import { AriaPopoverProps, DismissButton, Overlay, usePopover } from "@react-aria/overlays";
import { OverlayTriggerState } from "@react-stately/overlays";

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

export function Popover(props: PopoverProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { state, children } = props;

  const { popoverProps, underlayProps } = usePopover({ ...props, popoverRef: ref }, state);

  return (
    <Overlay>
      <div {...underlayProps} className="fixed inset-0" />
      <div {...popoverProps} ref={ref}>
        <DismissButton onDismiss={state.close} />
        {children}
      </div>
    </Overlay>
  );
}
