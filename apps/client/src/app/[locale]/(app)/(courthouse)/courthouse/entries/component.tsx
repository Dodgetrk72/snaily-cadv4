"use client";

import { GetCourtEntriesData } from "@snailycad/types/api";
import { CourtEntriesTab } from "~/components/courthouse/court-entries/court-entries-tab";

interface InnerCourtEntriesPageProps {
  entries: GetCourtEntriesData;
}

export function InnerCourtEntriesPage(props: InnerCourtEntriesPageProps) {
  return <CourtEntriesTab entries={props.entries} />;
}
