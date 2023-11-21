import { useState, useCallback } from "react";

function useStateRef<T>(): [T | null, (node: T) => void] {
  const [refState, setRefState] = useState<T | null>(null);

  const refCallback = useCallback((node: T) => {
    if (node !== null) {
      setRefState(node);
    }
  }, []);

  return [refState, refCallback];
}

export default useStateRef;
