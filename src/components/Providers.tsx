import root from "react-shadow";
import { ThemeProvider as TailwindThemeProvider } from "@src/styles/ThemeProvider";

import css from "@src/index.css?inline";
import useStateRef from "@src/hooks/useStateRef";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();
export const Providers = ({ children }: ProviderProps) => {
  const [rootEl, rootRef] = useStateRef<HTMLElement>();
  return (
    <root.div ref={rootRef}>
      {rootEl && (
        <QueryClientProvider client={queryClient}>
          <TailwindThemeProvider parent={rootEl}>
            <style>{css}</style>
            {children}
          </TailwindThemeProvider>
        </QueryClientProvider>
      )}
    </root.div>
  );
};
