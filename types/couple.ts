export interface CoupleRequest {
  groomName: string;
  groomFather: string;
  groomMother: string;
  brideName: string;
  brideFather: string;
  brideMother: string;
}

export interface Couple {
  id: string;
  invitationId: string;
  groomName: string;
  groomFather: string;
  groomMother: string;
  groomImage: string;
  brideName: string;
  brideFather: string;
  brideMother: string;
  brideImage: string;
  createdAt: string;
  updatedAt: string;
}
