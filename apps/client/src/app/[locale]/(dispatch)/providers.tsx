"use client";

import { DndProvider as ReactDndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DispatchProvidersProps {
  children: React.ReactNode;
}

export function DispatchProviders(props: DispatchProvidersProps) {
  return <ReactDndProvider backend={HTML5Backend}>{props.children}</ReactDndProvider>;
}
