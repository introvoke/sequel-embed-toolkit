import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

declare global {
  interface Window {
    IS_STORYBOOK: boolean;
  }
}

window.IS_STORYBOOK = true;

export default preview;
