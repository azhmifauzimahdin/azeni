import { Invitation } from "./invitation";

export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  colorTag: string;
  originalPrice: string;
  categoryId: string;
  discount: string;
  isPercent: boolean;
  createdAt: string;
  updatedAt: string;
  invitation?: Invitation;
  category: ThemeCategory;
}

export interface ThemeCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  themes?: Theme[];
}
