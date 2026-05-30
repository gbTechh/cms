// ContextoEstado.tsx
import { createContext, ReactElement, useContext, useState } from "react";

interface Context {
  
}

const StateContext = createContext({});

interface Props {
  children: ReactElement;
}

export function FileProvider({ children }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>([]);
  return (
    <StateContext.Provider value={{ selectedFiles, setSelectedFiles }}>
      {children}
    </StateContext.Provider>
  );
}

export function useFileContext() {
  return useContext(StateContext);
}