"use client";

import { AuthScreenImages } from "components/auth/AuthScreenImages";
import { LocalhostDetector } from "components/auth/LocalhostDetector";
import { VersionDisplay } from "components/shared/VersionDisplay";
import { useAuth } from "~/context/auth-context";
import { LoginForm } from "components/auth/login/login-form";
import { useRouter } from "next/navigation";
import { ApiVerification } from "components/auth/api-verification";

export function InnerLoginPage() {
  const { cad } = useAuth();
  const router = useRouter();

  async function handleSubmit({ from }: { from: string }) {
    router.push(from);
  }

  return (
    <main className="flex flex-col items-center justify-center pt-20">
      <AuthScreenImages />
      <LocalhostDetector />
      <ApiVerification />

      <LoginForm onFormSubmitted={handleSubmit} />

      <VersionDisplay cad={cad} />

      <a
        rel="noreferrer"
        target="_blank"
        className="mt-3 md:mt-0 relative md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 underline text-lg transition-colors text-neutral-700 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white mx-2 block cursor-pointer z-50"
        href="https://snailycad.org"
      >
        SnailyCAD
      </a>
    </main>
  );
}
