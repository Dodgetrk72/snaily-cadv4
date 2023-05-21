"use client";

export default function ErrorPage({ error }: { error: Error }) {
  const { name, message, cause, ...rest } = error;
  return (
    <>
      <pre>
        {` Check logs, the actual error on server side is much more complete. Seems like we're losing
        error information.`}
      </pre>
      <pre>{JSON.stringify({ name, message, cause, rest }, null, 2)}</pre>
    </>
  );
}
