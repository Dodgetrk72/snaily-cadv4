import { useTranslations } from "next-intl";
import type { ModalButton, Args } from "./buttons";
import { Button } from "@snailycad/ui";
import { useFeatureEnabled } from "hooks/use-feature-enabled";
import { useActiveDispatchers } from "hooks/realtime/use-active-dispatchers";
import { useModal } from "state/modalState";
import { usePathname } from "next/navigation";
import type { EmsFdDeputy } from "@snailycad/types";
import type { ActiveOfficer } from "state/leo-state";
import { useAuth } from "~/context/auth-context";

type ButtonProps = Pick<JSX.IntrinsicElements["button"], "name" | "type" | "title" | "disabled">;
interface Props extends ButtonProps {
  button: ModalButton;
  unit?: ActiveOfficer | EmsFdDeputy | null;
}

export function ModalButton({ button: buttonFn, unit, ...buttonProps }: Props) {
  const t = useTranslations();
  const features = useFeatureEnabled();
  const { hasActiveDispatchers } = useActiveDispatchers();
  const { openModal } = useModal();
  const pathname = usePathname();
  const { user } = useAuth();

  const isDispatch = pathname === "/dispatch";
  const btnArgs = { ...features, hasActiveDispatchers, isDispatch, unit, user };
  const button = buttonFn(btnArgs as Args<any>);
  const isEnabled = button.isEnabled ?? true;

  if (!isEnabled) {
    return null;
  }

  return (
    <Button
      id={button.nameKey[1]}
      disabled={buttonProps.disabled}
      title={buttonProps.disabled ? "Go on-duty before continuing" : t(button.nameKey.join("."))}
      onPress={() => openModal(button.modalId)}
      type="button"
      {...buttonProps}
      className="text-base"
    >
      {t(button.nameKey.join("."))}
    </Button>
  );
}
