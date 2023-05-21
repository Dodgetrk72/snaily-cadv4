"use client";

import { DndProvider as ReactDndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface EmsFdProvidersProps {
  children: React.ReactNode;
}

export function EmsFdProviders(props: EmsFdProvidersProps) {
  return <ReactDndProvider backend={HTML5Backend}>{props.children}</ReactDndProvider>;
}
