import { create } from "zustand";

interface FileManagerProps {
  selectedFiles: (File | string)[];
  setSelectedFiles: (nuevoValor: (File | string)[]) => void;
}

export const useStore = create<FileManagerProps>((set) => ({
  selectedFiles: [],
  setSelectedFiles: (nuevoValor) => set({ selectedFiles: nuevoValor }),
}));
