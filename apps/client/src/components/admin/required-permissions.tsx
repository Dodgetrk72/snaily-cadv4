"use client";

import { Permissions } from "@snailycad/permissions";
import { useHasPermissionForLayout } from "~/hooks/auth/useHasPermissionForLayout";

interface RequiredPermissionsProps {
  children: React.ReactNode;
  permissions: { permissions: Permissions[] };
}

export function RequiredPermissions(props: RequiredPermissionsProps) {
  const { forbidden, Loader } = useHasPermissionForLayout(props.permissions);

  if (forbidden) {
    return <Loader />;
  }

  return <>{props.children}</>;
}
