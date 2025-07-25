export interface Music {
  id: string;
  name: string;
  src: string;
  origin: string;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MusicRequest {
  name: string;
  src: string;
  origin: string;
  visibility: boolean;
}
