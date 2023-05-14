"use client";

import { Button } from "@snailycad/ui";

interface ErrorFallbackProps {
  error: Error;
  componentStack: string;
  eventId: string;
  resetError(): void;
}

export function ErrorFallback(props: ErrorFallbackProps) {
  console.error(JSON.stringify(props.error, null, 4));
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <main className="px-4 h-screen grid place-items-center  dark:text-white">
      <div className="flex flex-col justify-center max-w-2xl mt-5">
        <p>
          {
            "Application error: a client-side exception has occurred (see the browser console for more information)."
          }
        </p>

        {isDevelopment ? (
          <details className="mt-5 overflow-auto">
            <summary>Details</summary>
            <pre className="mt-2">
              <code>{props.error.stack}</code>
            </pre>
          </details>
        ) : null}

        <Button className="mt-5 max-w-fit" onPress={props.resetError}>
          Reload page
        </Button>
      </div>
    </main>
  );
}
