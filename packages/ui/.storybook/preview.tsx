import * as React from "react";
import "../src/tailwind.css";
import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-styling";
import { NextIntlProvider } from "next-intl";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

const MESSAGES_REQUIRED_IN_COMPONENTS = {
  Common: {
    optionalField: "Optional",
    select: "Select...",
    startTyping: "Start typing...",
    noOptions: "No options",
    searching: "Searching...",
  },
  Statuses: {
    ACCEPTED: "Accepted",
    PASSED: "Passed",
    PAID: "Paid",
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    DECLINED: "Declined",
    DENIED: "Denied",
    UNPAID: "Unpaid",
    FAILED: "Failed",
    CANCELED: "Canceled",
  },
};

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "dark",
    attributeName: "data-theme",
  }),
  (Story) => (
    <NextIntlProvider messages={MESSAGES_REQUIRED_IN_COMPONENTS} locale="en">
      <Story />
    </NextIntlProvider>
  ),
];

export default preview;
