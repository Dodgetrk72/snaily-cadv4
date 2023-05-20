import * as React from "react";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { useLocation } from "react-use";

export function LocalhostDetector() {
  const location = useLocation();
  const [isLocalhost, setIsLocalhost] = React.useState<boolean | undefined>(false);

  React.useEffect(() => {
    const isDevelopmentMode = process.env.NODE_ENV === "development";
    const isHostLocalhost =
      location.hostname === "localhost" || location.host?.includes("localhost");
    const isUsingLocalhost = !isDevelopmentMode && isHostLocalhost;

    setIsLocalhost(isUsingLocalhost);
  }, [location]);

  if (!isLocalhost) {
    return null;
  }

  return (
    <div
      role="alert"
      className="max-w-md mb-5 flex flex-col p-2 px-4 text-black rounded-md shadow bg-orange-400 border border-orange-500/80"
    >
      <header className="flex items-center gap-2 mb-2">
        <ExclamationCircleFill />
        <h5 className="font-semibold text-lg">WARNING:</h5>
      </header>
      <p>
        the usage of localhost with SnailyCADv4 will not work.{" "}
        <a className="underline" href="https://docs.snailycad.org/docs/errors/localhost-usage">
          Please read more here
        </a>
      </p>
    </div>
  );
}
