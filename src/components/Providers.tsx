import root from "react-shadow";
import { ThemeProvider as TailwindThemeProvider } from "@src/styles/ThemeProvider";

import css from "@src/index.css?inline";
import useStateRef from "@src/hooks/useStateRef";

interface ProviderProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProviderProps) => {
  const [rootEl, rootRef] = useStateRef<HTMLElement>();
  return (
    <root.div ref={rootRef}>
      {rootEl && (
        <TailwindThemeProvider parent={rootEl}>
          <style>{css}</style>
          {children}
        </TailwindThemeProvider>
      )}
    </root.div>
  );
};
