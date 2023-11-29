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
export const renderApp = (app: React.ReactNode) => {
  appRoot?.unmount();
  appRoot = createRoot(document.getElementById("sequel_root")!);
  appRoot.render(
    <React.StrictMode>
      <Providers>{app}</Providers>
    </React.StrictMode>
  );
};

export const renderAppInsideDocument = (app: React.ReactNode, document: any) => {
  appRoot?.unmount();
  appRoot = createRoot(document!);
  appRoot.render(
    <React.StrictMode>
      <Providers>{app}</Providers>
    </React.StrictMode>
  );
};