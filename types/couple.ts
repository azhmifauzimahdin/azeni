export interface CoupleRequest {
  groomName: string;
  groomFather: string;
  groomMother: string;
  groomAddress?: string;
  groomInstagram?: string;
  brideName: string;
  brideFather: string;
  brideMother: string;
  brideAddress?: string;
  brideInstagram?: string;
}

export interface Couple {
  id: string;
  invitationId: string;
  groomName: string;
  groomFather: string;
  groomMother: string;
  groomAddress: string;
  groomImage: string;
  groomInstagram: string;
  brideName: string;
  brideFather: string;
  brideMother: string;
  brideImage: string;
  brideAddress: string;
  brideInstagram: string;
  createdAt: string;
  updatedAt: string;
}
