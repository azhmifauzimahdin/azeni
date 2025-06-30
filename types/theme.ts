import { Invitation } from "./invitation";

export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  colorTag: string;
  originalPrice: number;
  discount: number;
  isPercent: boolean;
  createdAt: string;
  updatedAt: string;
  invitation?: Invitation;
}
