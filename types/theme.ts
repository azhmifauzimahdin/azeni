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

export interface ThemeRequest {
  name: string;
  thumbnail: string;
  colorTag: string;
  originalPrice: string;
  categoryId: string;
  discount?: string;
  isPercent: boolean;
  groom: string;
  bride: string;
  slug: string;
  image?: string;
  musicId: string;
  date: Date;
  expiresAt: Date;
}

export interface ThemeCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  themes?: Theme[];
}

export interface ThemeBackground {
  id: string;
  image: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
