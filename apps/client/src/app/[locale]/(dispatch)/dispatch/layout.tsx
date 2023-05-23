import { Permissions } from "@snailycad/permissions";
import { Suspense } from "react";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import BolosLoadingUI from "./@bolos/loading";

export default function Layout(props: {
  children: React.ReactNode;
  /** the "ActiveBolos" segment route. This will load the active bolos on the server */
  bolos: React.ReactNode;
  /** the "ActiveIncidents" segment route. This will load the active incidents on the server */
  incidents: React.ReactNode;
  /** the "ActiveCalls" segment route. This will load the active calls on the server */
  calls: React.ReactNode;
}) {
  return (
    <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
      <RequiredPermissions
        permissions={{
          permissions: [Permissions.Dispatch],
        }}
      >
        {props.children}

        {/* todo: remove this Suspense once Next.js fixed the `loading.tsx` file for a segment (@route) */}
        <div className="mt-3">
          <Suspense fallback={<BolosLoadingUI />}>{props.calls}</Suspense>
          <Suspense fallback={<BolosLoadingUI />}>{props.incidents}</Suspense>
          <Suspense fallback={<BolosLoadingUI />}>{props.bolos}</Suspense>
        </div>
      </RequiredPermissions>
    </main>
  );
}
