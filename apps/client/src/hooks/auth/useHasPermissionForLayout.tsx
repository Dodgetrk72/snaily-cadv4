"use client";

import * as React from "react";
import { Permissions, usePermission } from "hooks/usePermission";
import { useRouter } from "next/navigation";
import { Loader } from "@snailycad/ui";

interface UseHasPermissionForLayoutOptions {
  permissions: Permissions[];
}

export function useHasPermissionForLayout(options: UseHasPermissionForLayoutOptions) {
  const [forbidden, setForbidden] = React.useState(false);

  const { hasPermissions } = usePermission();
  const router = useRouter();

  React.useEffect(() => {
    if (!options) return;

    if (!hasPermissions(options.permissions)) {
      router.push("/403");
      setForbidden(true);
    }
  }, [hasPermissions, router, options]);

  return { forbidden, Loader: _Loader };
}

function _Loader() {
  return (
    <div id="unauthorized" className="fixed inset-0 grid bg-transparent place-items-center">
      <span aria-label="loading...">
        <Loader className="w-14 h-14 border-[3px]" />
      </span>
    </div>
  );
}
