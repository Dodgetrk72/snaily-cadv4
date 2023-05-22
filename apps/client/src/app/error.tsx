"use client";

export default function ErrorPage({ error }: { error: Error }) {
  const { name, message, cause, ...rest } = error;
  return <pre>{JSON.stringify({ name, message, cause, rest }, null, 2)}</pre>;
}
