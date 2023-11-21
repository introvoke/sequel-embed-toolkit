import React from "react";
import { Root, createRoot } from "react-dom/client";
import { Providers } from "@src/components/Providers";

export const onDocumentReady = (callback: () => void) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      callback();
    });
  } else {
    callback();
  }
};

let appRoot: Root;
export const renderApp = (App: React.ComponentType) => {
  appRoot?.unmount();
  appRoot = createRoot(document.getElementById("sequel_root")!);
  appRoot.render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  );
};
