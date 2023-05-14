import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  dts: true,
  bundle: false,
  platform: "node",
  target: "node16",
  silent: true,
  format: ["esm"],
  banner: {
    js: "'use client'",
  },
  external: [
    "react",
    "react-dnd",
    "react-bootstrap-icons",
    "next-intl",
    "next/link",
    "@react-aria/button",
    "@react-aria/breadcrumbs",
    "@react-aria/dialog",
    "@react-aria/focus",
    "@react-aria/interactions",
    "@react-aria/label",
    "@react-aria/listbox",
    "@react-aria/menu",
    "@react-aria/overlays",
    "@react-aria/progress",
    "@react-aria/radio",
    "@react-aria/textfield",
    "@react-aria/utils",
    "@react-stately/collections",
    "@react-stately/list",
    "@react-stately/menu",
    "@react-stately/radio",
    "@react-stately/select",
    "tailwind-merge",
    "@react-aria/calendar",
    "@react-stately/calendar",
    "@react-aria/i18n",
    "@react-stately/datepicker",
    "@react-aria/datepicker",
    "@internationalized/date",
    "@react-aria/*",
  ],
});
