import { createContext, useContext } from "react";
import root from "react-shadow";
import { ThemeProvider as TailwindThemeProvider } from "@src/styles/ThemeProvider";

import css from "@src/index.css?inline";
import useStateRef from "@src/hooks/useStateRef";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProviderProps {
  children: React.ReactNode;
}

// Shadow Root Context - provides the actual ShadowRoot, not the host element
const ShadowRootContext = createContext<ShadowRoot | null>(null);

export const useShadowRoot = () => useContext(ShadowRootContext);

const queryClient = new QueryClient();
export const Providers = ({ children }: ProviderProps) => {
  const [rootEl, rootRef] = useStateRef<HTMLElement>();
  // Get the actual shadow root from the host element
  const shadowRoot = rootEl?.shadowRoot ?? null;

  return (
    <root.div ref={rootRef}>
      {rootEl && shadowRoot && (
        <ShadowRootContext.Provider value={shadowRoot}>
          <QueryClientProvider client={queryClient}>
            <TailwindThemeProvider parent={rootEl}>
              <style>{css}</style>
              {children}
            </TailwindThemeProvider>
          </QueryClientProvider>
        </ShadowRootContext.Provider>
      )}
    </root.div>
  );
};
