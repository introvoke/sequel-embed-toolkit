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

// Map to track roots per container element - fixes multiple widget rendering bug
const appRoots = new Map<HTMLElement, Root>();

export const renderApp = (app: React.ReactNode, container?: HTMLElement) => {
  // If a container is provided, use per-container root management
  if (container) {
    const existingRoot = appRoots.get(container);
    if (existingRoot) {
      // Reuse existing root for this container
      existingRoot.render(<Providers>{app}</Providers>);
      return;
    }
    // Create new root for this container
    const newRoot = createRoot(container);
    appRoots.set(container, newRoot);
    newRoot.render(<Providers>{app}</Providers>);
    return;
  }

  // Default behavior for backward compatibility (no container specified)
  // Use singleton pattern for sequel_root
  const targetElement = document.getElementById("sequel_root")!;
  const existingRoot = appRoots.get(targetElement);
  if (existingRoot) {
    existingRoot.render(<Providers>{app}</Providers>);
  } else {
    const newRoot = createRoot(targetElement);
    appRoots.set(targetElement, newRoot);
    newRoot.render(<Providers>{app}</Providers>);
  }
};

export const renderAppInsideDocument = (
  app: React.ReactNode,
  document: any
) => {
  const existingRoot = appRoots.get(document);
  if (existingRoot) {
    existingRoot.render(<Providers>{app}</Providers>);
  } else {
    const newRoot = createRoot(document!);
    appRoots.set(document, newRoot);
    newRoot.render(<Providers>{app}</Providers>);
  }
};

export function forceLinksToNewTab() {
  const links = document.getElementsByTagName("a");
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (!link.hasAttribute("target")) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  }
}
