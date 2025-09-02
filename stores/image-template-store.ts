import { ImageTemplate } from "@/types";
import { create } from "zustand";

interface ImageTemplateState {
  imageTemplates: ImageTemplate[];
  setImageTemplates: (imageTemplates: ImageTemplate[]) => void;
  addImageTemplateAtFirst: (newImageTemplate: ImageTemplate) => void;
}

const useImageTemplateStore = create<ImageTemplateState>((set) => ({
  imageTemplates: [],
  setImageTemplates: (imageTemplates) => set({ imageTemplates }),
  addImageTemplateAtFirst: (newImageTemplate) =>
    set((state) => ({
      imageTemplates: [newImageTemplate, ...state.imageTemplates],
    })),
}));

export default useImageTemplateStore;
